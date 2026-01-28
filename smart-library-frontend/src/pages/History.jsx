import { useEffect, useState } from 'react';
import api from '../services/api';
import { Loading } from '../components/Loading';
import { formatDate, formatCurrency } from '../utils/formatters';
import { FiBookOpen, FiCreditCard } from 'react-icons/fi';

export const History = () => {
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('borrows');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const [borrowsRes, paymentsRes] = await Promise.all([
        api.get('/history/borrows'),
        api.get('/history/payments')
      ]);
      setBorrowHistory(borrowsRes.data.data);
      setPaymentHistory(paymentsRes.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="dashboard-title">History</h1>
      
      <div className="tabs">
        <button
          onClick={() => setActiveTab('borrows')}
          className={`tab ${activeTab === 'borrows' ? 'active' : ''}`}
        >
          <FiBookOpen />
          Borrows
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`tab ${activeTab === 'payments' ? 'active' : ''}`}
        >
          <FiCreditCard />
          Payments
        </button>
      </div>

      {activeTab === 'borrows' && (
        <div className="table-container">
          {borrowHistory.length === 0 ? (
            <p className="text-center" style={{ color: '#666', padding: '32px' }}>
              No borrow history yet
            </p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Borrowed</th>
                  <th>Returned</th>
                  <th>Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {borrowHistory.map((record) => (
                  <tr key={record._id}>
                    <td className="book-cell">
                      {record.book?.title}
                      <br />
                      <small>{record.book?.author}</small>
                    </td>
                    <td>{formatDate(record.borrowDate)}</td>
                    <td>{formatDate(record.returnDate)}</td>
                    <td>
                      {formatCurrency(record.totalCost)}
                      {record.overdueFee > 0 && (
                        <div style={{ color: '#dc2626', fontSize: '0.75rem' }}>
                          + {formatCurrency(record.overdueFee)} overdue
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge-small ${record.status === 'Returned' ? 'returned' : 'overdue'}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="table-container">
          {paymentHistory.length === 0 ? (
            <p className="text-center" style={{ color: '#666', padding: '32px' }}>
              No payment history yet
            </p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Book</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment._id}>
                    <td>{formatDate(payment.createdAt)}</td>
                    <td className="book-cell">{payment.bookTitle}</td>
                    <td>{payment.type}</td>
                    <td>{formatCurrency(payment.amount)}</td>
                    <td>
                      <span className={`status-badge-small ${payment.status === 'Paid' ? 'paid' : 'pending'}`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};