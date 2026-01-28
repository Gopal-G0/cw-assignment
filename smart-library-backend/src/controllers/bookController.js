const { Book } = require('../config/database');
const Borrow = require('../models/Borrow');
const { successResponse, errorResponse } = require('../utils/responses');

const getAllBooks = async (req, res) => {
  try {
    const activeBorrows = await Borrow.find({ status: 'Active' }).select('bookId');
    const borrowedBookIds = new Set(activeBorrows.map(b => b.bookId));
    
    const books = await Book.find();
    
    const booksWithStatus = books.map(book => ({
      ...book.toObject(),
      isAvailable: !borrowedBookIds.has(book.bookId)
    }));
    
    successResponse(res, booksWithStatus);
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

const getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findOne({ bookId });
    
    if (!book) {
      return errorResponse(res, 'Book not found', 404);
    }
    
    const activeBorrow = await Borrow.findOne({ bookId, status: 'Active' });
    
    successResponse(res, {
      ...book.toObject(),
      isAvailable: !activeBorrow
    });
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

module.exports = { getAllBooks, getBookById };