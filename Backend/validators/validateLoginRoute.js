const validator = require('validator');
const { sendError } = require('../utils/response.js');

exports.validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, "Email and password are required");
  }

  if (!validator.isEmail(email)) {
      return sendError(res, 400, "Invalid Email format");
  }

  next();
};
