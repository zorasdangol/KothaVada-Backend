const Joi = require("@hapi/joi");
const User = require("../models/User");
const KVConstants = require("../constants/appContants");

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
  var userExists = false;

  // check email exists
  userExists = await User.findOne({ mobile: mobile });

  return userExists;
};
//Send OTP validation
const smsValidation = (data) => {
  console.log(data);
  const schema = Joi.object({
    to: Joi.string().min(10).required(),
    text: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
const otpValidation = (data) => {
  const schema = Joi.object({
    mobile: Joi.string().min(10).required(),
    otp: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const generateOTP = () => {
  var otpLength = KVConstants.SMS.OTP_LENGTH;
  let number = 1;
  for (let i = 0; i < otpLength; i++) {
    number = number * 10;
  }
  let otpNumber = Math.floor(Math.random() * number);
  console.log("OTPNumber" + number);
  return otpNumber;
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.checkUserExists = checkUserExists;
module.exports.generateOTP = generateOTP;
module.exports.smsValidation = smsValidation;
module.exports.otpValidation = otpValidation;
