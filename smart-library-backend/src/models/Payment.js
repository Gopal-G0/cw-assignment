const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    borrowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Borrow',
        required: true
    },
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: ['BorrowFee', 'OverdueFee'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending',   
    },
    paidAt: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);