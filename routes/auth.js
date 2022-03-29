const router = require('express').Router();
const User = require('../models/User');
const { registerValidation, loginValidation, checkUserExists } = require('../services/userValidation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//post route register
router.post('/register', async (req, res) => {
    try{
        const {error} = registerValidation(req.body);
        if(error){
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }else{
            //Checking if user exists
            const emailExist = await checkUserExists(req.body.email);
            if(emailExist){
                return res.status(400).send('Email already exists');
            }

            //Hash passwords
            const salt = await bcrypt.genSalt(10);
            const hasPassword = await bcrypt.hash(req.body.password, salt);

            //Create a new user
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                userType: req.body.userType,
                password: hasPassword
            });
    
            await user.save();
            return res.send({
                name: req.body.name,
                email: req.body.email
            });
        }

    }catch(err){
        console.log(err);
        return res.status(400).send(err);
    }
})


//post route LOGIN
router.post('/login', async (req, res) => {
    try{
        const {error} = loginValidation(req.body);
        if(error){
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }else{
            //Checking if user exists
            const user = await checkUserExists(req.body.email);
            if(!user){
                return res.status(400).send(`Email doesn't exists`);
            }else{

                //Check password is correct
                const validPass = await bcrypt.compare(req.body.password, user.password);
                if(!validPass){
                    return res.status(400).send('Invalid password');
                }

                //create token 
                const token = jwt.sign({_id: user._id}, process.env.SECRET_TOKEN );
                res.header('auth-token', token).send(token);
            }
        }

    }catch(err){
        console.log(err);
        return res.status(400).send(err);
    }
})


module.exports = router;