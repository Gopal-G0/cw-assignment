const Borrow = require('../models/Borrow');
const Payment = require('../models/Payment');
const { Book } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responses');

const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const activeBorrow = await Borrow.findOne({ userId, status: 'Active' }).lean();
    let activeBorrowDetails = null;
    
    if (activeBorrow) {
      const book = await Book.findOne({ bookId: activeBorrow.bookId });
      const now = new Date();
      const isOverdue = now > new Date(activeBorrow.dueDate);
      
      activeBorrowDetails = {
        ...activeBorrow,
        bookTitle: book?.title,
        isOverdue,
        daysRemaining: isOverdue 
          ? 0 
          : Math.ceil((new Date(activeBorrow.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      };
    }
    
    const pendingPayments = await Payment.find({ userId, status: 'Pending' });
    const totalDue = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
    const balance = -totalDue;
    
    const historyCount = await Borrow.countDocuments({ 
      userId, 
      status: { $in: ['Returned', 'Overdue'] } 
    });
    
    successResponse(res, {
      activeBorrow: activeBorrowDetails,
      totalAmountDue: totalDue,
      balance,
      historyCount,
      pendingPaymentsCount: pendingPayments.length
    });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

module.exports = { getDashboardSummary };