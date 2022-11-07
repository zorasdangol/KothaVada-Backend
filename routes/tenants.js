const express = require("express");
const router = express.Router();
const Tenant = require("../models/Tenant");
const User = require("../models/User");
const Room = require("../models/Room");
const tokenVerifier = require("./verifyToken");

const conn = require("../services/connection");
const { default: mongoose } = require("mongoose");
const { STATUS_TENANT } = require("../constants/appContants");

//ADD A Tenent
router.post("/", tokenVerifier, async (req, res) => {
  console.log(req.body);
  const session = await conn.startSession();
  session.startTransaction();
  const tenant = createDataFromReqBody(req.body);

  //update user id in tenant
  if (tenant.tenantPhone) {
    await session.commitTransaction();
    let user = await User.findOne({ mobile: tenant.tenantPhone });
    if (user) {
      tenant.userId = user._id;
    }
  }

  //deactivate tenants for room
  const filter = { roomId: tenant.roomId, status: STATUS_TENANT.ACTIVE };
  const updateTenant = {
    $set: {
      status: STATUS_TENANT.INACTIVE,
    },
  };
  await session.commitTransaction();
  const result = await Tenant.updateMany(filter, updateTenant);

  await tenant
    .save()
    .then(async (data) => {
      await session.commitTransaction();
      //Update room for tenant
      let room = await Room.findById(data.roomId);
      room.tenantId = data._id;

      await session.commitTransaction();
      await Room.updateOne({ _id: room._id }, { $set: room });

      res.json(data);
    })
    .catch(async (err) => {
      await session.abortTransaction();
      session.endSession();
      console.log("test", err);
      res.json({ message: err });
    });
});

//post method to return tenant details from roomId
router.get("/:roomId", tokenVerifier, async (req, res) => {
  console.log(req.params.roomId);
  try {
    const room = await Tenant.find({ roomId: req.params.roomId });
    console.log();
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

//post method to return tenant details from tenantId
router.get("/:tenantId", tokenVerifier, async (req, res) => {
  console.log(req.params.tenantId);
  try {
    const tenant = await Tenant.findById(req.params.tenantId);
    res.json(tenant);
  } catch (err) {
    res.json({ message: err });
  }
});

//update a tenant
router.patch("/:tenantId", tokenVerifier, async (req, res) => {
  try {
    let updatedData = createDataFromReqBody(req.body);

    //update user id in tenant
    if (updatedData.tenantPhone) {
      let user = User.find({ mobile: updatedData.tenantPhone });
      if (user) {
        updatedData.userId = user._id;
      }
    }

    await Tenant.updateOne({ _id: req.params.tenantId }, { $set: updatedData });

    res.json(updatedData);
  } catch (err) {
    res.json({ message: err });
  }
});

/*
 * method to convert req body data to tenant data
 */
const createDataFromReqBody = (body) => {
  const tenant = new Tenant({
    roomId: body.roomId,
    tenantName: body.tenantName,
    tenantPhone: body.tenantPhone,
    totalAdults: body.totalAdults,
    totalChildren: body.totalChildren,
    address: body.address,
  });
  if (body._id) {
    tenant._id = body._id;
  }
  return tenant;
};

module.exports = router;
