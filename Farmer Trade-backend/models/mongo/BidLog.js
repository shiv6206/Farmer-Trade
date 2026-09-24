import mongoose from "mongoose";

const bidLogSchema = new mongoose.Schema({
  bulkLotId: {
    type: String,
    required: true,
    index: true,
  },
  buyerId: {
    type: String,
    required: true,
  },
  buyerName: {
    type: String,
    required: true,
  },
  bidAmount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const BidLog = mongoose.model("BidLog", bidLogSchema);

export default BidLog;
