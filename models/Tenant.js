const mongoose = require('mongoose');

const RentSchema = mongoose.Schema({
    roomId: {
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
    totalAdults: {
        type: Number,
    },
    totalChildren: {
        type: Number
    },
    address: {
        type: varchar
    },
    userId: {
        type: String
    }
})

module.exports = mongoose.model('Rooms', RentSchema);