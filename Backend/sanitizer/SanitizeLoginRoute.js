const validator = require("validator");
const sanitizeHtml = require("sanitize-html");


exports.sanitizeLoginInput = (req, res, next) => {
  let { email, password } = req.body;

  // Sanitize and normalize email
  if (typeof email === "string") {
    email = validator.trim(email);
    email = sanitizeHtml(email, {
      allowedTags: [],
      allowedAttributes: {},
    });
    email = validator.normalizeEmail(email);
  }

  // Trim password (optional)
  if (typeof password === "string") {
    password = validator.trim(password);
    // Do NOT sanitize or change password content itself
  }

  req.body = {
    email,
    password,
  };

  next();
};
