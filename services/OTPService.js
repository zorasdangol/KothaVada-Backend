require("fetch-everywhere");
const KVConstants = require("../constants/appContants");
const { generateOTP } = require("./userValidation");

const sendOTP = async (smsData) => {
  let response;
  smsData.token = KVConstants.SMS.TOKEN;
  smsData.from = KVConstants.SMS.FROM;
  console.log("smsdata" + JSON.stringify(smsData));
  console.log("api url" + KVConstants.SMS.API_URL_SMS);
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
      }
    })
    .catch((err) => {
      console.log(err);
    });

  return response;
};
module.exports.sendOTP = sendOTP;
