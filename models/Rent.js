const mongoose = require('mongoose');

const RentSchema = mongoose.Schema({
    tenantPhone: {
        type: Number,
        max: 10,
        min: 10
    },
    tenantName: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
    roomRent: {
        type: Number,
        required: true
    },
    electricityUnit: {
        type: Number,
        required: true
    },
    garbageCharge: {
        type: Number
    },
    waterCharge: {
        type: Number
    },
    previousDue: {
        type: Number
    },
    totalRent: {
        type: Number
    },
    paidRent: {
        type: Number
    },
    pendingRent: {
        type: Number
    },
    dateStart: {
        type: Date,
        required: true  
    },
    dateEnd: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Unpaid','Partial','Paid'],
        default: 'Unpaid'
    },
    landlordId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Rents', RentSchema);