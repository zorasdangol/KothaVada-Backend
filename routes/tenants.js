const express = require('express');
const router = express.Router();
const Room = require('../models/Tenant');
const Room = require('../models/User');
const tokenVerifier = require('./verifyToken');



//ADD A ROOM
router.post('/', tokenVerifier, async (req, res) => {
    console.log(req.body);
    const tenant = createDataFromReqBody(req.body);

    //update user id in tenant
    let user = User.find({mobile: tenant.tenantPhone});
    if(user){
        tenant.userId = user._id
    }
    await tenant.save()
        .then(data => {
            res.json(data);
        })
        .catch( err => {
            console.log('test', err);
            res.json({message: err});
        });
});

//post method to return tenant details from tenantId
router.get('/:tenantId',tokenVerifier,  async (req, res) => {
    console.log(req.params.tenantId);
    try{
        const tenant  = await Tenant.findById(req.params.tenantId);
        res.json(tenant);    
    }catch(err){
        res.json({message: err});
    }
});


//update a tenant 
router.patch('/:tenantId', async (req, res) => {
    try{
        const updatedData = await Room.updateOne(
            {_id: req.params.tenantId}, 
            { $set: createDataFromReqBody(req.body)}
        );
        //update user id in tenant
        let user = User.find({mobile: tenant.tenantPhone});
        if(user){
            updatedData.userId = user._id
        }

        res.json(updatedData);
    }catch(err){
        res.json({message: err});
    }
});

/*
 * method to convert req body data to room data
 */
const createDataFromReqBody = (body) => {
    const room = new Room({
        roomId: body.roomId,
        tenantName: body.tenantName,
        tenantPhone: body.tenantPhone,
        totalAdults: body.totalAdults,
        totalChildren: body.totalChildren,
        address: body.address,
    });
    return room;
}

module.exports = router;