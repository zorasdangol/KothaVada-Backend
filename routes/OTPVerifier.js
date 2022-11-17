function OTPVerifier(req, res) {
  try {
    // proper condition left
    if (req.body.OTP == req.body.OTP) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

module.exports = OTPVerifier;
