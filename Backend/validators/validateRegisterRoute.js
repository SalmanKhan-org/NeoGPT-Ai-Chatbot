const validator = require("validator");
const { sendError } = require("../utils/response.js");

exports.validateRegisterInput = (req, res, next) => {
  const { username, email, password } = req.body;

  // Check all fields exist
  if (!username || !email || !password) {
    return sendError(res, 400, "All fields are required");
  }

  // Username validation
  if (typeof username !== "string" || username.trim().length < 3) {
    return sendError(res, 400, "Username must be at least 3 characters long");
  }

  // Email validation
  if (!validator.isEmail(email)) {
      return sendError(res, 400, "Invalid Email format");
  }

  // Password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return sendError(
      res,
      400,
      "Password must be at least 8+ chars, one lowercase, one uppercase, one digit, one special char."
    );
  }

  next(); // Input is valid → pass to controller
};
