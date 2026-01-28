const express = require('express');
const router = express.Router();
const { submitReturn } = require('../controllers/returnController');
const { protect } = require('../middleware/auth');
const { validateReturn } = require('../middleware/validation');

router.post('/:borrowId/submit', protect, validateReturn, submitReturn);

module.exports = router;