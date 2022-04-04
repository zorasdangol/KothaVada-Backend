const Joi = require('@hapi/joi');

//Register validation
const registerValidation = (data) => {

    const schema = Joi.object({
        mobile: Joi.string()
                .min(10)
                .max(10)
                .required(),
        name: Joi.string()
                .min(6)
                .required(),
        //email: Joi.string()
                //.min(6)
                //.required()
                //.email(),
        userType: Joi.string()
                .min(5)
                .required(),
        password: Joi.string()
                .min(6)
                .required()
    });

    return schema.validate(data);
}

//Login validation
const loginValidation = (data) => {

    const schema = Joi.object({
        email: Joi.string()
                .min(6)
                .required()
                .email(),
        password: Joi.string()
                .min(6)
                .required()
    });

    return schema.validate(data);
}

//check if user exists
const checkUserExists = async (mobile) => {
    var userExists = false;
    
    // check email exists
    userExists = await User.findOne({mobile: mobile});

    return userExists;
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.checkUserExists = checkUserExists;

