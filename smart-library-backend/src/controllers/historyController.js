const Borrow = require('../models/Borrow');
const Payment = require('../models/Payment');
const { Book } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responses');

const getBorrowHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const history = await Borrow.find({ 
      userId, 
      status: { $in: ['Returned', 'Overdue'] } 
    })
    .sort({ createdAt: -1 })
    .lean();
    
    const enrichedHistory = await Promise.all(
      history.map(async (record) => {
        const book = await Book.findOne({ bookId: record.bookId });
        return {
          ...record,
          book: book ? {
            title: book.title,
            author: book.author
          } : null
        };
      })
    );
    
    successResponse(res, enrichedHistory);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const payments = await Payment.find({ userId })
      .populate('borrowId', 'bookId borrowDate returnDate')
      .sort({ createdAt: -1 })
      .lean();
    
    const enrichedPayments = await Promise.all(
      payments.map(async (payment) => {
        const borrow = payment.borrowId;
        const book = await Book.findOne({ bookId: borrow?.bookId });
        return {
          ...payment,
          bookTitle: book?.title || 'Unknown Book'
        };
      })
    );
    
    successResponse(res, enrichedPayments);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

module.exports = { getBorrowHistory, getPaymentHistory };