const { Book } = require('../config/database');
const Borrow = require('../models/Borrow');
const Payment = require('../models/Payment');
const { calculateBorrowCost, calculateDueDate } = require('../utils/calculator');
const { checkActiveBorrow, hasOutstandingDebt, validateBorrowDays } = require('../utils/validators');
const { successResponse, errorResponse } = require('../utils/responses');

const validateBorrow = async (req, res) => {
  try {
    const { bookId, days } = req.body;
    const userId = req.user._id;
    
    const daysValidation = validateBorrowDays(days);
    if (!daysValidation.valid) {
      return errorResponse(res, daysValidation.message, 400);
    }
    
    const hasActive = await checkActiveBorrow(userId);
    if (hasActive) {
      return errorResponse(res, 'You already have an active borrow. Return it first.', 409);
    }
    
    const hasDebt = await hasOutstandingDebt(userId);
    if (hasDebt) {
      return errorResponse(res, 'You have outstanding debts. Please clear them first.', 403);
    }
    
    const book = await Book.findOne({ bookId });
    if (!book) {
      return errorResponse(res, 'Book not found', 404);
    }
    
    const isBorrowed = await Borrow.findOne({ bookId, status: 'Active' });
    if (isBorrowed) {
      return errorResponse(res, 'Book is currently unavailable', 409);
    }
    
    const totalCost = calculateBorrowCost(book.pricePerDay, days);
    const dueDate = calculateDueDate(new Date(), days);
    
    successResponse(res, {
      valid: true,
      book: {
        id: book.bookId,
        title: book.title,
        pricePerDay: book.pricePerDay
      },
      days,
      dueDate,
      estimatedCost: totalCost
    });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const calculateBorrow = async (req, res) => {
  try {
    const { bookId, days, borrowDate = new Date() } = req.body;
    
    const book = await Book.findOne({ bookId });
    if (!book) {
      return errorResponse(res, 'Book not found', 404);
    }
    
    const totalCost = calculateBorrowCost(book.pricePerDay, days);
    const dueDate = calculateDueDate(new Date(borrowDate), days);
    
    successResponse(res, {
      bookId,
      days,
      borrowDate,
      dueDate,
      pricePerDay: book.pricePerDay,
      totalCost,
      breakdown: {
        baseCost: totalCost,
        overdueFee: 0
      }
    });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const createBorrow = async (req, res) => {
  try {
    const { bookId, days } = req.body;
    const userId = req.user._id;
    
    const daysValidation = validateBorrowDays(days);
    if (!daysValidation.valid) {
      return errorResponse(res, daysValidation.message, 400);
    }
    
    const hasActive = await checkActiveBorrow(userId);
    if (hasActive) {
      return errorResponse(res, 'Active borrow exists', 409);
    }
    
    const hasDebt = await hasOutstandingDebt(userId);
    if (hasDebt) {
      return errorResponse(res, 'Outstanding debt exists', 403);
    }
    
    const book = await Book.findOne({ bookId });
    if (!book) {
      return errorResponse(res, 'Book not found', 404);
    }
    
    const isBorrowed = await Borrow.findOne({ bookId, status: 'Active' });
    if (isBorrowed) {
      return errorResponse(res, 'Book unavailable', 409);
    }
    
    const borrowDate = new Date();
    const dueDate = calculateDueDate(borrowDate, days);
    const totalCost = calculateBorrowCost(book.pricePerDay, days);
    
    const borrow = await Borrow.create({
      userId,
      bookId,
      borrowDate,
      dueDate,
      daysBorrowed: days,
      totalCost,
      overdueFee: 0,
      status: 'Active'
    });
    
    await Payment.create({
      userId,
      borrowId: borrow._id,
      amount: totalCost,
      type: 'BorrowFee',
      status: 'Pending'
    });
    
    successResponse(res, {
      borrowId: borrow._id,
      book: {
        id: book.bookId,
        title: book.title
      },
      borrowDate,
      dueDate,
      totalCost,
      status: 'Active'
    }, 'Book borrowed successfully', 201);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const getActiveBorrow = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const activeBorrow = await Borrow.findOne({ userId, status: 'Active' }).lean();
    
    if (!activeBorrow) {
      return successResponse(res, null, 'No active borrow found');
    }
    
    const book = await Book.findOne({ bookId: activeBorrow.bookId });
    const now = new Date();
    const isOverdue = now > new Date(activeBorrow.dueDate);
    
    successResponse(res, {
      ...activeBorrow,
      book: book ? {
        title: book.title,
        author: book.author
      } : null,
      isOverdue,
      daysRemaining: isOverdue 
        ? 0 
        : Math.ceil((new Date(activeBorrow.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

module.exports = { validateBorrow, calculateBorrow, createBorrow, getActiveBorrow };