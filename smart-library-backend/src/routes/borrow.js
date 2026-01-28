const express = require('express');
const router = express.Router();
const { 
  validateBorrow, 
  calculateBorrow, 
  createBorrow,
  getActiveBorrow 
} = require('../controllers/borrowController');
const { protect } = require('../middleware/auth');
const { validateBorrowRequest } = require('../middleware/validation');

router.post('/validate', protect, validateBorrowRequest, validateBorrow);
router.post('/calculate', protect, calculateBorrow);
router.post('/', protect, validateBorrowRequest, createBorrow);
router.get('/active', protect, getActiveBorrow);

module.exports = router;