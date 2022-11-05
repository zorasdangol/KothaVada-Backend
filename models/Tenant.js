const mongoose = require("mongoose");

const RentSchema = mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  tenantPhone: {
    type: Number,
    min: 10,
  },
  tenantName: {
    type: String,
    required: true,
  },
  totalAdults: {
    type: Number,
  },
  totalChildren: {
    type: Number,
  },
  address: {
    type: String,
  },
  userId: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ["Active", "InActive"],
    default: "Active",
  },
});

module.exports = mongoose.model("Tenants", RentSchema);
