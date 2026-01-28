import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Loading } from '../components/Loading';
import { formatDate, formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

export const ActiveBorrow = () => {
  const [borrow, setBorrow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [returnDate, setReturnDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveBorrow();
  }, []);

  const fetchActiveBorrow = async () => {
    try {
      const res = await api.get('/borrow/active');
      if (res.data.data) {
        setBorrow(res.data.data);
        setReturnDate(new Date().toISOString().split('T')[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await api.post(`/borrows/${borrow._id}/submit`, {
        returnDate: new Date(returnDate).toISOString()
      });
      
      toast.success(`Book returned! Total amount: ${formatCurrency(res.data.data.totalAmount)}`);
      navigate('/history');
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  if (!borrow) {
    return (
      <div className="card text-center" style={{ padding: '48px' }}>
        <h2 style={{ marginBottom: '16px' }}>No Active Borrow</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          You don't have any books currently borrowed.
        </p>
        <button onClick={() => navigate('/books')} className="btn btn-primary">
          Browse Books
        </button>
      </div>
    );
  }

  return (
    <div className="borrow-page">
      <h1 className="borrow-page-title">Active Borrow</h1>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{borrow.book?.title}</h2>
            <p style={{ color: '#666' }}>by {borrow.book?.author}</p>
          </div>
          <span className={`status-badge ${borrow.isOverdue ? 'overdue' : 'active'}`}>
            {borrow.isOverdue ? 'Overdue' : 'Active'}
          </span>
        </div>

        <div className="borrow-info-grid">
          <div className="info-box">
            <p className="info-label">Borrow Date</p>
            <p className="info-value">{formatDate(borrow.borrowDate)}</p>
          </div>
          <div className="info-box">
            <p className="info-label">Due Date</p>
            <p className={`info-value ${borrow.isOverdue ? 'warning' : ''}`}>
              {formatDate(borrow.dueDate)}
            </p>
          </div>
          <div className="info-box">
            <p className="info-label">Days Borrowed</p>
            <p className="info-value">{borrow.daysBorrowed} days</p>
          </div>
          <div className="info-box">
            <p className="info-label">Base Cost</p>
            <p className="info-value">{formatCurrency(borrow.totalCost)}</p>
          </div>
        </div>

        {borrow.isOverdue && (
          <div className="overdue-notice">
            <h4>⚠️ Overdue Notice</h4>
            <p>This book is overdue. Additional fees may apply upon return.</p>
          </div>
        )}

        <div className="return-section">
          <h3 className="return-title">Return Book</h3>
          <form onSubmit={handleReturn}>
            <div className="form-group">
              <label className="form-label">Return Date (Mock)</label>
              <input
                type="date"
                required
                className="form-input"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={new Date(borrow.borrowDate).toISOString().split('T')[0]}
              />
              <p className="return-hint">
                Select a date to simulate when the book is returned
              </p>
            </div>
            <button 
              type="submit" 
              disabled={submitting}
              className="btn btn-primary btn-full"
            >
              {submitting ? 'Processing...' : 'Submit Return'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};