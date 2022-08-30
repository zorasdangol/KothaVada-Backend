const mongoose = require('mongoose');

const RentSchema = mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    landlordId: {
        type: String,
        required: true
    },
    tenantPhone: {
        type: Number,
        max: 10,
        min: 10
    },
    tenantName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Flat','Room'],
        default: 'Flat'
    },
    price: {
        type: Number,
        required: true
    },
    garbageCharge: {
        type: Number
    },
    waterCharge: {
        type: Number
    },
    electricityPerUnit: {
        type: Number,
        required: true,
        default: 15
    }
})

module.exports = mongoose.model('Rooms', RentSchema);