require("fetch-everywhere");
const KVConstants = require("../constants/appContants");

const sendOTP = async (smsData) => {
  let response;
  smsData.token = KVConstants.SMS.TOKEN;
  smsData.from = KVConstants.SMS.FROM;

  //send sms to mobile api call
  await fetch(KVConstants.SMS.API_URL_SMS, {
    // mode: 'no-cors',
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(smsData),
  })
    .then(async (res) => {
      try {
        const jsonRes = await res.json();
        console.log(res.status);
        console.log(jsonRes);
        response = res.status;
      } catch (err) {
        console.log(err);
        throw err;
      }
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });

  return response;
};

/*
 * method to generate otp
 */
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

module.exports.sendOTP = sendOTP;
module.exports.generateOTP = generateOTP;
