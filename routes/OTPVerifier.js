const User = require("../models/User");

async function OTPVerifier(req, res) {
  try {
    // uncomment later during production
    // userExists = await User.findOne({ mobile: req.body.mobile });
    // if (userExists && req.body.OTP === userExists.OTP) {
    //   return true;
    // } else {
    //   return false;
    // }
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = OTPVerifier;
