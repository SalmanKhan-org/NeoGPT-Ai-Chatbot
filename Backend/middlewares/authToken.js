const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const { sendError } = require("../utils/response");

exports.authenticateUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, 400, "Authorization header missing or malformed");
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Optionally fetch full user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return sendError(res, 403, "Login to Access");
    }
    req.user = user; // Attach user info to request
    next();
  } catch (err) {
    return sendError(res, 401, "Invalid or Expired Token error");
  }
};
