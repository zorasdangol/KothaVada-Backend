const express = require('express');
const router = express.Router();
const Rent = require('../models/Rent');
const tokenVerifier = require('./verifyToken');
const {calculateRent, calculatePaidRent, getPreviousDueRent }= require('../services/rentCalculation');
const { STATUS_PAYMENT } = require('../constants/appContants');
const mongoose = require('mongoose');
const conn = require("../services/connection"); 

//get back all the rents
router.get('/', tokenVerifier,  async (req, res) => {
    try{
        const items = await Rent.find({landlordId: req.user._id});
        res.json(items);
    }catch(err){
        req.status(400).json({message: err});
    }
});


//ADD A rent
router.post('/', tokenVerifier, async (req, res) => {
    const session = await conn.startSession();
    session.startTransaction();
    try{
        let rent = createDataFromReqBody(req.body);
        
        //update landlordId in rent 
        rent.landlordId = req.user._id;

        //calculate previous due
        let previousDueRent;
        await getPreviousDueRent(rent).then( data => {
        previousDueRent = data;
        });
        
        //updated previous due 
        if(previousDueRent){
            rent.previousDue = setNullToZero(previousDueRent.pendingRent);
        }

        //calculate rent
        const calculatedRent = calculateRent(rent);
        rent = calculatedRent;
        rent.pendingRent = rent.totalRent;

        //update previous due rent to paid
        if(previousDueRent){
            await Rent.updateOne(
                {_id: previousDueRent._id}, 
                { $set: {status: STATUS_PAYMENT.PAID }},
                {session}
            )
        }
        
        //save new rent data
        await rent.save({session})
            .then(async data => {
                await session.commitTransaction();
                session.endSession();
                res.json(data);
            })
            .catch( async err => {
                await session.abortTransaction();
                session.endSession();
                console.log('test', err);
                res.status(400).json({message: err});
            });       
    }catch(err){
        console.log('test:' + err);
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({message: err});
    }    
});

//router to delete specific rent
router.delete('/:rentId', async (req, res) => {
    try{
        const removedItem = await Rent.remove({_id: req.params.rentId});
        res.json(removedItem);
    }catch(err){
        res.status(400).json({message: err});
    }
});

//update a rent
router.patch('/:rentId', async (req, res) => {
    try{
        let rent = createDataFromReqBody(req.body);

        //calculate rent
        const calculatedRent = calculateRent(rent);
        rent = calculatedRent;

        console.log(rent);

        //update rent
        const updatedItem = await Rent.updateOne(
            {_id: req.params.rentId}, 
            { $set: rent}
            );

        res.json(rent);
    }catch(err){
        console.log(err);
        res.status(400).json({message: err});
    }
});


//update a rent
router.patch('pay/:rentId', async (req, res) => {
    try{
        let rent = createDataFromReqBody(req.body);

        //calculate rent
        const calculatedRent = calculateRent(rent);
        rent = calculatedRent;

        console.log(rent);

        //update rent
        const updatedItem = await Rent.updateOne(
            {_id: req.params.rentId}, 
            { $set: rent}
            );

        res.json(rent);
    }catch(err){
        console.log(err);
        res.status(400).json({message: err});
    }
});

/*
 * method to convert req body data to room data
 */
const createDataFromReqBody = (body) => {
    const item = new Rent({
        roomId: body.roomId,
        tenantId: body.tenantId,
        roomRent: body.roomRent,
        electricityUnit: setNullToZero(body.electricityUnit),
        electricityCharge: setNullToZero(body.electricityCharge),
        garbageCharge: setNullToZero(body.garbageCharge),
        waterCharge: setNullToZero(body.waterCharge),
        internetCharge: setNullToZero(body.internetCharge),
        previousDue: setNullToZero(body.previousDue),
        totalRent: setNullToZero(body.totalRent),
        paidRent: setNullToZero(body.paidRent),
        pendingRent: setNullToZero(body.pendingRent),
        dateStart: body.dateStart,
        dateEnd: body.dateEnd,
        status: body.status
    });
    if(body._id){
        item._id = body._id;
    }
    return item;
}

const setNullToZero = (value) => {
    return value? value: '0';
}

module.exports = router;