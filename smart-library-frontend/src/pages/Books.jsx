import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Loading } from '../components/Loading';
import { formatCurrency } from '../utils/formatters';
import { FiBook, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowLoading, setBorrowLoading] = useState(null);
  const [validationModal, setValidationModal] = useState(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books');
      setBooks(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowClick = async (book) => {
    setBorrowLoading(book.bookId);
    try {
      const res = await api.post('/borrow/validate', {
        bookId: book.bookId,
        days: parseInt(days)
      });
      
      if (res.data.data.valid) {
        setValidationModal({
          book,
          ...res.data.data
        });
      }
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setBorrowLoading(null);
    }
  };

  const confirmBorrow = async () => {
    try {
      await api.post('/borrow', {
        bookId: validationModal.book.bookId,
        days: parseInt(days)
      });
      toast.success('Book borrowed successfully!');
      setValidationModal(null);
      fetchBooks();
    } catch (error) {
      // Error handled
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Available Books</h1>
        <div className="days-selector">
          <label>Borrow for:</label>
          <select 
            value={days} 
            onChange={(e) => setDays(e.target.value)}
            className="form-select"
            style={{ width: 'auto' }}
          >
            <option value="3">3 days</option>
            <option value="7">7 days</option>
            <option value="14">14 days</option>
          </select>
        </div>
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.bookId} className={`book-card ${!book.isAvailable ? 'unavailable' : ''}`}>
            <div className="book-header">
              <div className="book-icon">
                <FiBook />
              </div>
              <span className={`availability-badge ${book.isAvailable ? 'available' : 'unavailable'}`}>
                {book.isAvailable ? (
                  <><FiCheckCircle /> Available</>
                ) : (
                  <><FiXCircle /> Borrowed</>
                )}
              </span>
            </div>
            
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">by {book.author}</p>
            
            <div className="book-price">
              <span>Price/Day:</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(book.pricePerDay)}</span>
            </div>
            
            <button
              onClick={() => handleBorrowClick(book)}
              disabled={!book.isAvailable || borrowLoading === book.bookId}
              className="btn btn-primary btn-full"
            >
              {borrowLoading === book.bookId ? 'Checking...' : 
               book.isAvailable ? 'Borrow Now' : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>

      {validationModal && (
        <div className="modal-overlay" onClick={() => setValidationModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Confirm Borrow</h3>
            <div className="modal-body">
              <div className="modal-row">
                <span>Book:</span>
                <span>{validationModal.book.title}</span>
              </div>
              <div className="modal-row">
                <span>Days:</span>
                <span>{validationModal.days}</span>
              </div>
              <div className="modal-row">
                <span>Due Date:</span>
                <span>{formatDate(validationModal.dueDate)}</span>
              </div>
              <div className="modal-row">
                <span>Estimated Cost:</span>
                <span>{formatCurrency(validationModal.estimatedCost)}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                onClick={() => setValidationModal(null)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmBorrow}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Confirm Borrow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};