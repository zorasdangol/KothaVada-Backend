const router = require("express").Router();
const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
  checkUserExists,
} = require("../services/userValidation");
const { sendSMS, generateOTP } = require("../services/otpService");
const {
  smsValidation,
  otpValidation,
  mobileValidation,
} = require("../services/otpValidation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenVerifier = require("./verifyToken");
const otpVerifier = require("./otpVerifier");
const { response } = require("express");

const createToken = (res, user) => {
  //create token
  const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
  res.header("auth-token", token);
  return res.status(200).send({
    _id: user._id,
    name: user.name,
    mobile: user.mobile,
    userType: user.userType,
    otp: user.otp,
    otpVerified: user.otpVerified,
    otpCount: user.otpCount,
  });
};

//post route register
router.post("/register", async (req, res) => {
  try {
    const { error } = registerValidation(req.body);
    if (error) {
      console.log("registervalidation", error);
      return res.status(400).send({ message: error.details[0].message });
    } else {
      const mobileExist = await checkUserExists(req.body.mobile);
      if (mobileExist) {
        return res.status(400).send({ message: "Mobile already exists" });
      }

      //Hash passwords
      const salt = await bcrypt.genSalt(10);
      const hasPassword = await bcrypt.hash(req.body.password, salt);

      //Create a new user
      const user = new User({
        mobile: req.body.mobile,
        name: req.body.name,
        userType: req.body.userType,
        password: hasPassword,
        otp: generateOTP(),
        otpCount: 1,
      });

      let savedUser = await user.save();
      //create token
      return createToken(res, savedUser);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err });
  }
});

//post route LOGIN
router.post("/login", async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      console.log(error);
      return res.status(400).send({ message: error.details[0].message });
    } else {
      //Checking if user exists
      const user = await checkUserExists(req.body.mobile);
      if (!user) {
        return res.status(400).send({ message: `User doesn't exists` });
      } else {
        //Check password is correct
        const validPass = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!validPass) {
          return res.status(400).send({ message: "Invalid password" });
        }

        //create token
        return createToken(res, user);
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err });
  }
});

//get method to verify token
router.get("/verifyToken", tokenVerifier, (req, res) => {
  res.status(200).send({ message: "Token Verified Successfully" });
});

/**
 * sendRegisterSMS API verified by Gunn 2024-12-6
 */
router.post("/sendRegisterSMS", async (req, res) => {
  try {
    const { error } = smsValidation(req.body);
    if (error) {
      console.log(error);
      return res.status(400).send({ message: error.details[0].message });
    } else {
      let response = await sendSMS(req.body);
      if (response === 200) {
        return res.status(200).send({
          status: response.response_code,
        });
      } else {
        return res.status(400).send({ message: "Error sending OTP." });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message ? err.message : err });
  }
});
/**
 * sendOTP API verified by Gunn 2024-12-6
 * get method to verify OTP
 */
router.post("/verifyOTP", async (req, res) => {
  try {
    //validate otp request
    const { error } = otpValidation(req.body);
    if (error) {
      console.log(error);
      return res.status(400).send({ message: error.details[0].message });
    } else {
      //verify otp
      let isOtpVerified = await otpVerifier(req);
      if (isOtpVerified) {
        res.status(200).send({ message: "OTP Verified Successfully" });
      } else {
        res.status(400).send({ message: "Invalid OTP" });
      }
    }
  } catch (error) {
    res.status(400).send({ message: error.message ? error.message : error });
  }
});
/**
 * Verifies OTP and updates password
 */
router.post("/resetPassword", async (req, res) => {
  try {
    const { mobile, password, otp } = req.body;
    let isOtpVerified = await otpVerifier(req);
    if (isOtpVerified) {
      const user = await User.findOne({ mobile: mobile });
      if (!user || !user.otpVerified) {
        return res
          .status(400)
          .send({ message: "OTP not verified or user not found" });
      }
      //Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //Update the use's password and rest OTP verification status
      user.password = hashedPassword;
      user.otpVerified = false;
      await user.save();

      return res.status(200).send({ message: "Password updated successfully" });
    } else {
      res.status(400).send({ message: "Invalid OTP" });
    }
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

/**
 * sendPasswordResetOTP API verified by Gunn 2024-12-6
 */
router.post("/sendPasswordResetOTP", async (req, res) => {
  try {
    const { error } = mobileValidation(req.body); //Validate mobile input

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    const user = await User.findOne({ mobile: req.body.to });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }
    //Generate OTP and update the user record
    const otp = generateOTP();
    user.otp = otp;
    user.otpVerified = false;
    user.otpcount += 1;
    await user.save();
    req.body.text = "" + otp + "";

    //Send OTP via SMS
    const response = await sendSMS(req.body);
    if (response === 200) {
      return res.status(200).send({ mesage: "OTP send successfully" });
    } else {
      return res.status(400).send({ message: "Failed to send OTP" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message ? err.message : err });
  }
});

module.exports = router;
