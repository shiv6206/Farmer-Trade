import mongoose from "mongoose";

const evidenceLogSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    index: true,
  },
  uploaderId: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
    default: [],
  },
  weighmentSlipUrl: {
    type: String,
  },
  remarks: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const EvidenceLog = mongoose.model("EvidenceLog", evidenceLogSchema);

export default EvidenceLog;
