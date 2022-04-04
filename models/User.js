const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 6 ,
        max: 255
    },
    // email: {
    //     type: String, 
    //     required: true,
    //     max: 255, 
    //     min: 6
    // },
    mobile: {
        type: Number, 
        required: true,
        max: 10, 
        min: 10
    },
    userType: {
        type: String, 
        required: true,
        enum: ['ADMIN','LANDLORD','TENANT'],
        default: 'LANDLORD'
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);