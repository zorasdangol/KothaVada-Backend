const Joi = require("@hapi/joi");
const { USER_TYPE } = require("../constants/appContants");
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

/*
 * method to check if user is landlord
 */
const isLandlordUser = async (userId) => {
  try {
    let user = await User.findOne({ _id: userId });
    console.log(user);
    //add landlordId or tenantId filter
    if (user && user.userType === USER_TYPE.LANDLORD) {
      return true;
    } else if (user && user.userType === USER_TYPE.TENANT) {
      return false;
    }
    throw "User not found";
  } catch (error) {
    throw error.message ? error.message : JSON.stringify(error);
  }
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.checkUserExists = checkUserExists;
module.exports.isLandlordUser = isLandlordUser;
