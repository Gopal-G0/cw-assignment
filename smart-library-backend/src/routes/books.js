const express = require('express');
const router = express.Router();
const { getAllBooks, getBookById } = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllBooks);
router.get('/:bookId', protect, getBookById);

module.exports = router;