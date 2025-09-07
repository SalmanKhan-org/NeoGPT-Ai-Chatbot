const jwt = require("jsonwebtoken");
const { sendSuccess } = require("./response.js");
exports.generateToken = (user, res, statusCode, message) => {
  // Create a token with the user's id and expiration date
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  sendSuccess(res, statusCode, message, accessToken);
};
