const { STATUS_PAYMENT } = require("../constants/appContants");
const Rent = require("../models/Rent");

const calculateRent = (item) => {

    //calculate total electricity charge
    item.electricityCharge = parseInt(item.electricityUnit) * item.electricityPerUnit;

    //calculate total rent
    item.totalRent = parseInt(item.electricityCharge) + parseInt(item.roomRent) 
        + parseInt(item.garbageCharge) + parseInt(item.waterCharge) 
        + parseInt(item.garbageCharge) + parseInt(item.internetCharge) 
        + parseInt(item.previousDue);

    return item;

}

const getPreviousDueRent = async (item) => {
    let previousDueRent;
    await Rent.findOne({
        roomId: item.roomId ,
        tenantId: item.tenantId,
        landlordId : item.landlordId,
        status: {$ne : STATUS_PAYMENT.PAID}
    }).then( data => {
        console.log('previousDue' + data);
        previousDueRent =  data;
    }).catch(err => {
        console.log('error' + err);
        throw err;
    })
    return previousDueRent;
} 

const calculatePaidRent = (item) =>{
    item.paidRent = item.paidRent == ''? item.paidRent = '0': parseInt(item.paidRent).toLocaleString();
    item.pendingRent =  parseInt(item.totalRent) - parseInt(item.paidRent);
    if(parseInt(item.pendingRent) > 0 ){
        item.status = 'Partial'
    }else {
        item.status = 'Paid'
    }
    return item;
}

module.exports.calculatePaidRent = calculatePaidRent;
module.exports.calculateRent = calculateRent;
module.exports.getPreviousDueRent = getPreviousDueRent;