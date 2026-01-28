const mongoose = require('mongoose');
const { PREDEFINED_BOOKS } = require('./constants');

const BookSchema = new mongoose.Schema({

    bookId: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    groupPricePerDay: { type: Number, require: true },
    isAvailable: { type: Boolean, default: true }
});

const Book = mongoose.model('Book', BookSchema);

const connectDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL || 
            'mongodb://localhost:27017');
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const count = await Book.countDocuments();
        if(count === 0) {
            await Book.insertMany(
                PREDEFINED_BOOKS.map(book => ({...book, bookId: book.id}))
            );
            console.log('20 Books seeded successfully');
        }
    } catch(error) {
        console.error('Database connection error: ', error);
        process.exit(1);
    }
}

module.exports = { connectDB, Book };