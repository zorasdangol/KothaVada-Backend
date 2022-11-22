const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  mobile: {
    type: Number,
    required: true,
    min: 10,
  },
  userType: {
    type: String,
    required: true,
    enum: ["ADMIN", "LANDLORD", "TENANT"],
    default: "LANDLORD",
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
    max: 100,
  },
  otp: {
    type: Number,
    min: 6,
  },
  otpVerified: {
    type: Boolean,
    default: false,
  },
  otpCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
