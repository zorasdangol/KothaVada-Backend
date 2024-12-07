const express = require("express");
const router = express.Router();
const Tenant = require("../models/Tenant");
const User = require("../models/User");
const Room = require("../models/Room");
const tokenVerifier = require("./verifyToken");

const conn = require("../services/connection");
const { default: mongoose } = require("mongoose");
const { STATUS_TENANT, OCCUPANCY } = require("../constants/appContants");

//ADD A Tenent
router.post("/", tokenVerifier, async (req, res) => {
  const session = await conn.startSession();
  session.startTransaction();
  try {
    const tenant = createDataFromReqBody(req.body);

    //update user id in tenant
    if (tenant.tenantPhone) {
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
    const result = await Tenant.updateMany(filter, updateTenant);

    await tenant
      .save()
      .then(async (data) => {
        //Update room for tenant
        updateRoom(session, data);

        await session.commitTransaction();
        res.json(data);
      })
      .catch(async (err) => {
        await session.abortTransaction();
        console.log("test", err);
        res.json({ message: err });
      });
  } catch (err) {
    await session.abortTransaction();
    res.json({ message: err });
  } finally {
    session.endSession();
  }
});

//post method to return tenant details from roomId
router.get("/queryFromRoomId/:roomId", tokenVerifier, async (req, res) => {
  try {
    const tenants = await Tenant.find({ roomId: req.params.roomId });
    res.json(tenants);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

//post method to return tenant details from tenantId
router.get("/:tenantId", tokenVerifier, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.tenantId);
    res.json(tenant);
  } catch (err) {
    res.json({ message: err });
  }
});

//update a tenant
router.patch("/:tenantId", tokenVerifier, async (req, res) => {
  const session = await conn.startSession();
  await session.startTransaction();
  try {
    let updatedData = createDataFromReqBody(req.body);

    //update user id in tenant

    if (updatedData.tenantPhone) {
      let user = User.find({ mobile: updatedData.tenantPhone });
      if (user) {
        updatedData.userId = user._id;
      }
    }

    //update tenant data
    await Tenant.updateOne({ _id: req.params.tenantId }, { $set: updatedData });

    //update room data
    await updateRoom(session, updatedData);

    await session.commitTransaction();

    res.json(updatedData);
  } catch (err) {
    await session.abortTransaction();
    res.json({ message: err });
  } finally {
    session.endSession();
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

/*
 * method to update room based on tenant data
 */
const updateRoom = async (session, tenant) => {
  try {
    //Update room for tenant
    let room = await Room.findById(tenant.roomId);
    if (room) {
      room.tenantId = tenant._id;
      room.tenantName = tenant.tenantName;
      room.occupancy = OCCUPANCY.FULL;
      await Room.updateOne({ _id: room._id }, { $set: room });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = router;
