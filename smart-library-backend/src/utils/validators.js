const Borrow = require('../models/Borrow');
const Payment = require('../models/Payment');
const { BORROW_LIMITS } = require('../config/constants');

const checkActiveBorrow = async (userId) => {
    const active = await Borrow.findOne({ userId, status: 'Active' });
    return !!active;
};

const hasOutstandingDebt = async (userId) => {
    const pendingPayment = await Payment.findOne({
        userId,
        status: 'Pending'
    });

    const overdueBorrow = await Borrow.findOne({
        userId,
        status: 'Active',
        dueDate: { $lt: new Date() }
    });

    return !!(pendingPayment || overdueBorrow);
};

const validateBorrowDays = (days) => {
    if(!days || days <= 0) {
        return { valid: false, message: 'Days must be greater than 0'};
    }
    if(days > BORROW_LIMITS.MAX_DAYS) {
        return { valid: false, message: `Maximum borrow period is 
            ${BORROW_LIMITS.MAX_DAYS}days`};
    }

    return { valid: true };
};

module.exports = {
    checkActiveBorrow,
    hasOutstandingDebt,
    validateBorrowDays
};