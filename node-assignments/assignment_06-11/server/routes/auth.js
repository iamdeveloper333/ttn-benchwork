const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../config/email");
const passport = require("../config/passport");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { firstName, lastName, age, email, password, employment } =
    Object.assign({}, req.body);
  const profilePicture = req.file ? req.file.path : null;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      firstName,
      lastName,
      profilePicture,
      age,
      email,
      password: hashedPassword,
      employment,
      verificationToken,
    });

    await newUser.save();

    await sendEmail({
      email,
      subject: "Email Verification",
      message: `<h2>Please verify your email</h2><br/><br/><h3>Dear ${firstName} ${lastName},</h3><br />Please verify your email by clicking on the link below:<br /><a href="${process.env.SERVER_URL}/api/auth/verify-email?token=${verificationToken}">Verify Email</a>`,
    });
    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }

      if (!user.isVerified) {
        return res
          .status(403)
          .json({ message: "Email not verified. Please verify your email." });
      }

      const payload = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const loggedInUser = {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        age: user.age,
        email: user.email,
        employment: user.employment,
      };

      // res.cookie("auth-token", token, {
      //   httpOnly: true,
      //   secure: false,
      // });

      res.json({ user: loggedInUser, token, message: "Login successful" });
    }
  )(req, res, next);
});

router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    if (user.pendingEmail) {
      user.email = user.pendingEmail;
      user.pendingEmail = undefined;
    }
    user.verificationToken = undefined;
    await user.save();

    res.redirect(`${process.env.CLIENT_URL}/login`);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
