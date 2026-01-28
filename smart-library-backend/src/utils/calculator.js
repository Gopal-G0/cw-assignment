const { BORROW_LIMITS } = require('../config/constants');

const calculateBorrowCost = (pricePerDay, days) => {
    if(day <= 0) throw new Error('Days must be positive');
    return parseFloat((pricePerDay * days).toFixed(2));
};

const calculateOverdueFee = (dueDate, returnDate) => {
    const today = new Date(returnDate);
    const due = new Date(dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if(diffDays <= 0) return 0;
    return parseFloat((diffDays * BORROW_LIMITS.OVERDUE_FEE_PER_DAY).toFixed(2));
  
};

const calculateDueDate = (borrowDate, days) => {
    const due = new Date(borrowDate);
    due.setDate(due.getDate() + days);
    return due;
};

module.exports = {
    calculateBorrowCost,
    calculateOverdueFee,
    calculateDueDate
};