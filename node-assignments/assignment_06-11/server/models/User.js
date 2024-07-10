const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePicture: { type: String },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  employment: { type: String, enum: ["Public", "Private"], required: true },
  isVerified: { type: Boolean, default: false },
  pendingEmail: { type: String },
  verificationToken: { type: String },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
