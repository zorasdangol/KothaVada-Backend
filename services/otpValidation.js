const Joi = require("@hapi/joi");

/*
 * validate sms data
 */
const smsValidation = (data) => {
  console.log(data);
  const schema = Joi.object({
    to: Joi.string().min(10).required(),
    text: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

/*
 * validate otp data
 */
const otpValidation = (data) => {
  const schema = Joi.object({
    mobile: Joi.string().min(10).required(),
    otp: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

/**
 * validate mobile length
 */

const mobileValidation = (data) =>{
  const schema = Joi.object({
    to: Joi.string().min(10).required()
  });
  return schema.validate(data);
}

module.exports.smsValidation = smsValidation;
module.exports.otpValidation = otpValidation;
module.exports.mobileValidation = mobileValidation;
