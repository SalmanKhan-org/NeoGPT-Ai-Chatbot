// utils/response.js
exports.sendSuccess = (res, status, message, data = {}) => {
  return res.status(status).json({
    success: true,
    status,
    message,
    data,
  });
};

exports.sendError = (res, status, message, error = null) => {
  return res.status(status).json({
    success: false,
    status,
    message,
    error: process.env.NODE_ENV === "development" ? error : undefined,
  });
};
