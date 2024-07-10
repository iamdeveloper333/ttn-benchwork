const mongoose = require("mongoose");

const fileLogSchema = new mongoose.Schema({
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, required: true },
  downloads: { type: Number, default: 0 },
  downloadedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  deleted: { type: Boolean, default: false },
});

const FileLog = mongoose.model("FileLog", fileLogSchema);
module.exports = FileLog;
