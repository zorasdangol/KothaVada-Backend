const Joi = require("@hapi/joi");
const User = require("../models/User");

//Register validation
const registerValidation = (data) => {
  const schema = Joi.object({
    mobile: Joi.string()
      .regex(/^[0-9]{10}$/)
      .messages({ "string.pattern.base": `Phone number must have 10 digits.` })
      .required(),
    name: Joi.string()
      .min(6)
      .messages({ "string.pattern.base": `Full Name must have 6 letters.` })
      .required(),
    userType: Joi.string().min(5).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

//Login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    mobile: Joi.string().min(10).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

//check if user exists
const checkUserExists = async (mobile) => {
  let userExists = false;

  // check email exists
  userExists = await User.findOne({ mobile: mobile });

  return userExists;
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.checkUserExists = checkUserExists;
