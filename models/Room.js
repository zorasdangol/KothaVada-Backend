const mongoose = require("mongoose");

const RoomSchema = mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  landlordId: {
    type: String,
    required: true,
  },
  tenantId: {
    type: String,
  },
  tenantName: {
    type: String,
  },
  type: {
    type: String,
    required: true,
    enum: ["Flat", "Room"],
    default: "Flat",
  },
  occupancy: {
    type: String,
    required: true,
    enum: ["Vacant", "Full"],
    default: "Vacant",
  },
  floor: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  garbageCharge: {
    type: Number,
  },
  electricityPerUnit: {
    type: Number,
    required: true,
    default: 15,
  },
});

module.exports = mongoose.model("Rooms", RoomSchema);
