const validator = require("validator");
const sanitizeHtml = require("sanitize-html");

exports.sanitizeRegisterInput = (req, res, next) => {
  let { username, email, password } = req.body;

  // Sanitize username: trim, normalize, and remove HTML
  if (typeof username === "string") {
    username = validator.trim(username);
    username = sanitizeHtml(username, {
      allowedTags: [], // Remove all HTML tags
      allowedAttributes: {}, // Remove attributes like onerror, onclick, etc.
    });
  }

  // Sanitize and normalize email
  if (typeof email === "string") {
    email = validator.trim(email);
    email = validator.normalizeEmail(email);
  }

  // Optional: trim password, but don't sanitize (don't alter chars)
  if (typeof password === "string") {
    password = validator.trim(password);
  }

  req.body = {
    username,
    email,
    password,
  };

  next();
};
