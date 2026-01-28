const express = require('express');
const router = express.Router();
const { getBorrowHistory, getPaymentHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/auth');

router.get('/borrows', protect, getBorrowHistory);
router.get('/payments', protect, getPaymentHistory);

module.exports = router;