const AppError = require("../utils/AppError");

function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  } else if (!err.isOperational) {
    console.error("Unexpected error:", err.message);
  }

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : message,
    errors: err.errors || []
  });
}

module.exports = {
  notFound,
  errorHandler
};
