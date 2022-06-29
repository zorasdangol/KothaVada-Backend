const router = require('express').Router();
const User = require('../models/User');
const { registerValidation, loginValidation, checkUserExists } = require('../services/userValidation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenVerifier = require('./verifyToken');


const createToken = (res, user) => {
    //create token 
    const token = jwt.sign({_id: user._id}, process.env.SECRET_TOKEN );
    res.header('auth-token', token);
    console.log('test:' , user);
    return res.status(200).send({
        _id: user._id, 
        name: user.name,
        mobile: user.mobile,
        userType: user.userType
    })
}

//post route register
router.post('/register', async (req, res) => {
    try{
        const {error} = registerValidation(req.body);
        if(error){
            console.log('registervalidation' , error);
            return res.status(400).send({message: error.details[0].message});
        }else{
            const mobileExist = await checkUserExists(req.body.mobile);
            if(mobileExist){
                return res.status(400).send({message:'Mobile already exists'});
            }

            //Hash passwords
            const salt = await bcrypt.genSalt(10);
            const hasPassword = await bcrypt.hash(req.body.password, salt);

            //Create a new user
            const user = new User({
                mobile: req.body.mobile,
                name: req.body.name,
                userType: req.body.userType,
                password: hasPassword
            });
    
            let savedUser = await user.save();
            
            //create token 
            return createToken(res, savedUser);
        }

    }catch(err){
        console.log(err);
        return res.status(400).send({message:err});
    }
})


//post route LOGIN
router.post('/login', async (req, res) => {
    try{
        const {error} = loginValidation(req.body);
        if(error){
            console.log(error);
            return res.status(400).send({message: error.details[0].message});
        }else{
            //Checking if user exists
            const user = await checkUserExists(req.body.mobile);
            if(!user){
                return res.status(400).send({message: `User doesn't exists`});
            }else{

                //Check password is correct
                const validPass = await bcrypt.compare(req.body.password, user.password);
                if(!validPass){
                    return res.status(400).send({message:'Invalid password'});
                }

                //create token 
                return createToken(res, user);
            }
        }

    }catch(err){
        console.log(err);
        return res.status(400).send({message: err});
    }
})


//get method to verify token
router.get('/verifyToken', tokenVerifier,  (req, res) => {
    res.status(200).send('Token Verified Successfully');
    });


module.exports = router;