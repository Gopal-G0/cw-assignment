const Borrow = require('../models/Borrow');
const Payment = require('../models/Payment');
const { Book } = require('../config/database');
const { calculateOverdueFee } = require('../utils/calculator');
const { successResponse, errorResponse } = require('../utils/responses');

const submitReturn = async (req, res) => {
  try {
    const { borrowId } = req.params;
    const { returnDate } = req.body;
    const userId = req.user._id;
    
    const borrow = await Borrow.findOne({
      _id: borrowId,
      userId,
      status: 'Active'
    });
    
    if (!borrow) {
      return errorResponse(res, 'Active borrow not found', 404);
    }
    
    const returnDateObj = new Date(returnDate);
    const borrowDateObj = new Date(borrow.borrowDate);
    
    if (returnDateObj < borrowDateObj) {
      return errorResponse(res, 'Return date cannot be before borrow date', 400);
    }
    
    const overdueFee = calculateOverdueFee(borrow.dueDate, returnDateObj);
    const totalAmount = borrow.totalCost + overdueFee;
    
    borrow.returnDate = returnDateObj;
    borrow.overdueFee = overdueFee;
    borrow.status = 'Returned';
    await borrow.save();
    
    const existingPayment = await Payment.findOne({ borrowId: borrow._id });
    if (existingPayment) {
      existingPayment.amount = totalAmount;
      await existingPayment.save();
    } else {
      await Payment.create({
        userId,
        borrowId: borrow._id,
        amount: totalAmount,
        type: overdueFee > 0 ? 'OverdueFee' : 'BorrowFee',
        status: 'Pending'
      });
    }
    
    const book = await Book.findOne({ bookId: borrow.bookId });
    
    successResponse(res, {
      borrowId: borrow._id,
      book: book ? { title: book.title } : null,
      borrowDate: borrow.borrowDate,
      returnDate: returnDateObj,
      daysPlanned: borrow.daysBorrowed,
      actualDays: Math.ceil((returnDateObj.getTime() - borrowDateObj.getTime()) / (1000 * 60 * 60 * 24)),
      baseCost: borrow.totalCost,
      overdueFee,
      totalAmount,
      paymentStatus: 'Pending'
    }, 'Book returned successfully');
  } catch (error) {
    errorResponse(res, error.message, 500);
  }
};

module.exports = { submitReturn };