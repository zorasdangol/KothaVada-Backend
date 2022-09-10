const mongoose = require('mongoose');

const RentSchema = mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    tenantId: {
        type: String,
        required: true
    },
    landlordId: {
        type: String,
        required: true
    },
    roomRent: {
        type: Number,
        required: true
    },
    electricityPerUnit: {
        type: Number,
        default: 15
    },
    electricityUnit: {
        type: Number,
        required: true
    },
    electricityCharge: {
        type: Number,
        required: true
    },
    garbageCharge: {
        type: Number,
        default: 0
    },
    waterCharge: {
        type: Number,
        default: 0
    },
    internetCharge: {
        type: Number,
        default: 0
    },
    previousDue: {
        type: Number,
        default: 0
    },
    totalRent: {
        type: Number,
        default: 0
    },
    paidRent: {
        type: Number,
        default: 0
    },
    pendingRent: {
        type: Number,
        default: 0
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
    }
})

module.exports = mongoose.model('Rents', RentSchema);