const mongoose = require('mongoose');

const BorrowSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true,
        index: true
    },
    bookId: {
        type: String,
        required: true,
        index: true
    },
    borrowDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    daysBorrowed: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    overdueFee: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Active', 'Returned', 'Overdue'],
        default: 'Active',
        index: true
    },
    amountPaid: { type: Number, default: 0 },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    }
}, {timestamps: true});

BorrowSchema.index({ userId: 1, status: 1 }, { 
  partialFilterExpression: { status: 'Active' },
  unique: true 
});

module.exports = mongoose.model('Borrow', BorrowSchema);