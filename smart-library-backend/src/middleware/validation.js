const { body, param, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responses');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }
  next();
};


const validateSignup = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const validateBorrowRequest = [
  body('bookId').notEmpty().withMessage('Book ID is required'),
  body('days').isInt({ min: 1 }).withMessage('Days must be a positive integer'),
  handleValidationErrors
];

const validateReturn = [
  param('borrowId').isMongoId().withMessage('Invalid borrow ID'),
  body('returnDate').isISO8601().withMessage('Valid return date is required (ISO format)'),
  handleValidationErrors
];

module.exports = {
  validateSignup,
  validateLogin,
  validateBorrowRequest,
  validateReturn,
  handleValidationErrors
};