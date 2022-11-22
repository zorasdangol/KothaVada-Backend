const User = require("../models/User");
const { checkUserExists } = require("../services/userValidation");

async function otpVerifier(req, res) {
  try {
    //Checking if user exists
    const user = await checkUserExists(req.body.mobile);
    if (user) {
      // uncomment later during production
      //if (user && req.body.otp == user.otp) {
      await User.updateOne({ _id: user._id }, { $set: { otpVerified: true } });
      return true;
      //}
    } else {
      throw "Mobile doesn't exist.";
    }
  } catch (err) {
    throw err;
  }
}

module.exports = otpVerifier;
