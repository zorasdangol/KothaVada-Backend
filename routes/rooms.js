const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const Tenant = require("../models/Tenant");
const tokenVerifier = require("./verifyToken");

const conn = require("../services/connection");
const { STATUS_TENANT } = require("../constants/appContants");

//get back all the rooms
router.get("/", tokenVerifier, async (req, res) => {
  try {
    const rooms = await Room.find({ landlordId: req.user._id });
    let responseData = { rooms: rooms };
    if (rooms) {
      let roomIds = [];
      rooms.forEach((element) => {
        if (element.tenantId) {
          roomIds.push(element._id);
        }
      });
      //get tenant list for tenant
      let tenantDetails = await Tenant.find({
        roomId: { $in: roomIds },
        status: STATUS_TENANT.ACTIVE,
      });
      responseData.tenantDetails = tenantDetails;
    }
    res.json(responseData);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

//get back teannt room details
router.get("/tenantRooms", tokenVerifier, async (req, res) => {
  try {
    //get tenant list for tenant
    const tenantDetails = await Tenant.find({
      userId: req.user._id,
      status: STATUS_TENANT.ACTIVE,
    });
    if (tenantDetails && tenantDetails.length > 0) {
      //get rooms related to tenant
      let roomIds = [];
      tenantDetails.forEach((element) => {
        roomIds.push(element.roomId);
      });
      let rooms = await Room.find({ _id: { $in: roomIds } });
      res.json(rooms);
    } else {
      res.json([]);
    }
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

//ADD A ROOM
router.post("/", tokenVerifier, async (req, res) => {
  console.log(req.body);
  const room = createDataFromReqBody(req.body);

  //update landlordId in room
  room.landlordId = req.user._id;
  await room
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log("test", err);
      res.status(400).json({ message: err });
    });
});

//post method to return room details from roomId
router.get("/:roomId", tokenVerifier, async (req, res) => {
  console.log(req.params.roomId);
  try {
    const room = await Room.findById(req.params.roomId);
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.delete("/:roomId", async (req, res) => {
  const session = await conn.startSession();
  session.startTransaction();
  try {
    const removedItem = await Room.remove({ _id: req.params.roomId });
    const tenants = await Tenant.remove({ roomId: req.params.roomId });
    await session.commitTransaction();
    res.json(removedItem);
  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ message: err });
  } finally {
    session.endSession();
  }
});

//update a post
router.patch("/:roomId", tokenVerifier, async (req, res) => {
  try {
    console.log("test here" + req.params.roomId);
    const updatedRoom = createDataFromReqBody(req.body);
    await Room.updateOne({ _id: req.params.roomId }, { $set: updatedRoom });
    res.json(updatedRoom);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

/*
 * method to convert req body data to room data
 */
const createDataFromReqBody = (body) => {
  const room = new Room({
    roomName: body.roomName,
    landlordId: body.landlordId,
    tenantId: body.tenantId,
    type: body.type,
    occupancy: body.occupancy,
    floor: body.floor,
    price: body.price,
    garbageCharge: body.garbageCharge,
  });
  if (body._id) {
    room._id = body._id;
  }
  return room;
};

module.exports = router;
