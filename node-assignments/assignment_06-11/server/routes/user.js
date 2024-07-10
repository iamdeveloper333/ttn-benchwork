const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const multer = require("multer");
const { authenticateJWT } = require("../config/jwt");
const User = require("../models/User");
const Address = require("../models/Address");
const sendEmail = require("../config/email");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.put(
  "/profile",
  authenticateJWT,
  upload.single("profilePicture"),
  async (req, res) => {
    const { firstName, lastName, age, email, password, employment, userId } =
      req.body;
    const profilePicture = req.file ? req.file.path : null;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (email && email !== user.email) {
        user.pendingEmail = email;
        const verificationToken = crypto.randomBytes(32).toString("hex");
        user.verificationToken = verificationToken;
        await sendEmail({
          email,
          subject: "Email Verification",
          message: `<h2>Please verify your email</h2><br/><br/><h3>Dear ${firstName} ${lastName},</h3><br />Please verify your email by clicking on the link below:<br /><a href="${process.env.SERVER_URL}/api/auth/verify-email?token=${verificationToken}">Verify Email</a>`,
        });
      }

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (profilePicture) user.profilePicture = profilePicture;
      if (age) user.age = age;
      if (employment) user.employment = employment;

      const loggedInUser = {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        age: user.age,
        email: user.email,
        employment: user.employment,
      };

      await user.save();
      res
        .status(200)
        .json({ user: loggedInUser, message: "Profile updated successfully." });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

router.get("/addresses", authenticateJWT, async (req, res) => {
  const userId = req.user._id;

  try {
    const addresses = await Address.find({ user: userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/address", authenticateJWT, async (req, res) => {
  const { userId, street, city, state, postalCode, country } = req.body;

  try {
    const address = new Address({
      userId,
      street,
      city,
      state,
      postalCode,
      country,
    });

    await address.save();
    res.status(201).json({ message: "Address added successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
