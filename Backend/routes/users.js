const express = require("express");
const { sendError, sendSuccess } = require("../utils/response.js");
const User = require("../models/userSchema.js");
const bcryptjs = require("bcryptjs");
const { generateToken } = require("../utils/generateToken.js");
const { authenticateUser } = require("../middlewares/authToken.js");
const { sendVerificationEmail } = require("../utils/sendEmail.js");
const jwt = require("jsonwebtoken");
const {
  sanitizeRegisterInput,
} = require("../sanitizer/SanitizeRegisterRoute.js");
const {
  validateRegisterInput,
} = require("../validators/validateRegisterRoute.js");
const { sanitizeLoginInput } = require("../sanitizer/SanitizeLoginRoute.js");
const { validateLoginInput } = require("../validators/validateLoginRoute.js");

const router = express.Router();

router.post(
  "/register",
  sanitizeRegisterInput,
  validateRegisterInput,
  async (req, res) => {
    try {
      const { username, email, password } = req.body;
      // if any field missing
      if (!username || !email || !password) {
        return sendError(res, 400, "Missing Information Required");
      }
      // Check if Email Already used or not
      const isExist = await User.findOne({ email });
      if (isExist) {
        return sendError(res, 400, "Email is Already in Use");
      }

      // Hash your password
      const hashedPassword = await bcryptjs.hash(password, 10);

      const newuser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      await sendVerificationEmail(newuser);

      await generateToken(
        newuser,
        res,
        200,
        "A Verification Email  is sent. Please verify you email"
      );
    } catch (err) {
      sendError(res, 500, err.message);
    }
  }
);

router.post(
  "/login",
  sanitizeLoginInput,
  validateLoginInput,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendError(res, 400, "Missing Information Required");
      }

      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return sendError(res, 401, "Invalid Email or Password");
      }

      const isPasswordCorrect = await bcryptjs.compare(password, user.password);
      if (!isPasswordCorrect) {
        return sendError(res, 401, "Invalid Email or Password");
      }

      await generateToken(user, res, 200, "User Logged in Successfully");
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }
);

//getting user information
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return sendError(res, 404, "user not found");
    }

    sendSuccess(res, 200, "User found", user);
  } catch (error) {
    sendError(res, 500, error.message);
  }
});

router.post("/google-login", async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return sendError(res, 400, "Missing information required");
    }
    let user = await User.findOne({ email });
    if (!user) {
      const password = await bcryptjs.hash(
        Math.floor(Math.random() * 1000000).toString(),
        10
      );
      let newUser = new User({
        username,
        email,
        password,
        isVerifiedEmail: true,
      });

      user = await newUser.save();
    }

    await generateToken(user, res, 200, "User logged in Successfully");
  } catch (error) {}
});

router.get("/verify-email", async (req, res) => {
  const token = req.query.token;

  if (!token) return sendError(res, 400, "Missing token required");

  try {
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return sendError(res, 404, "User not found");

    if (user.isVerifiedEmail) {
      return sendError(res, 200, "User Already Verified");
    }

    user.isVerifiedEmail = true;
    await user.save();

    sendSuccess(res, 200, "Email Verified Successfully");
  } catch (err) {
    return sendError(res, 400, "Invalid or Expired Token Error");
  }
});

module.exports = router;