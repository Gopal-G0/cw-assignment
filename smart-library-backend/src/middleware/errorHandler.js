const { errorResponse } = require('../utils/responses');

const errorHandler = (err, req, res, next) => {
  console.error(err);
  
  if (err.code === 11000) {
    return errorResponse(res, 'Duplicate field value entered', 400);
  }
  
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return errorResponse(res, 'Validation Error', 400, messages);
  }
  
  if (err.name === 'CastError') {
    return errorResponse(res, `Resource not found with id: ${err.value}`, 404);
  }
  
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }
  
  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }
  
  return errorResponse(res, err.message || 'Server Error', err.statusCode || 500);
};

module.exports = { errorHandler };