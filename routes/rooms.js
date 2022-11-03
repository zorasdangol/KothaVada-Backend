const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const tokenVerifier = require("./verifyToken");

//get back all the rooms
router.get("/", tokenVerifier, async (req, res) => {
  try {
    const rooms = await Room.find({ landlordId: req.user._id });
    res.json(rooms);
  } catch (err) {
    req.status(400).json({ message: err });
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
  try {
    const removedItem = await Room.remove({ _id: req.params.roomId });
    res.json(removedItem);
  } catch (err) {
    res.status(400).json({ message: err });
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
