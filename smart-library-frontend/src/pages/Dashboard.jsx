import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Loading } from '../components/Loading';
import { formatDate, formatCurrency, getDaysRemaining } from '../utils/formatters';
import { FaBook, FaDollarSign, FaHistory } from 'react-icons/fa';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/summary');
      setStats(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="dashboard-title">Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card blue">
          <div>
            <p className="stat-label">Total Due</p>
            <p className="stat-value">{formatCurrency(stats?.totalAmountDue || 0)}</p>
          </div>
          <FiDollarSign className="stat-icon" />
        </div>

        <div className="stat-card green">
          <div>
            <p className="stat-label">Current Balance</p>
            <p className={`stat-value ${stats?.balance < 0 ? 'text-red' : ''}`}>
              {formatCurrency(stats?.balance || 0)}
            </p>
          </div>
          <FiDollarSign className="stat-icon" />
        </div>

        <div className="stat-card purple">
          <div>
            <p className="stat-label">History Count</p>
            <p className="stat-value">{stats?.historyCount || 0}</p>
          </div>
          <FiHistory className="stat-icon" />
        </div>
      </div>

      {stats?.activeBorrow ? (
        <div className="active-borrow-section">
          <div className="active-borrow-card">
            <div className="active-borrow-header">
              <div>
                <h3 className="active-borrow-title">
                  <FiBook />
                  Active Borrow
                </h3>
                <p className="active-borrow-book">{stats.activeBorrow.bookTitle}</p>
              </div>
              <span className={`status-badge ${stats.activeBorrow.isOverdue ? 'overdue' : 'active'}`}>
                {stats.activeBorrow.isOverdue ? 'Overdue' : 'Active'}
              </span>
            </div>

            <div className="borrow-details">
              <div className="detail-item">
                <p className="detail-label">Borrow Date</p>
                <p className="detail-value">{formatDate(stats.activeBorrow.borrowDate)}</p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Due Date</p>
                <p className={`detail-value ${stats.activeBorrow.isOverdue ? 'warning' : ''}`}>
                  {formatDate(stats.activeBorrow.dueDate)}
                </p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Days Remaining</p>
                <p className={`detail-value ${stats.activeBorrow.daysRemaining < 3 ? 'warning' : ''}`}>
                  {stats.activeBorrow.daysRemaining} days
                </p>
              </div>
              <div className="detail-item">
                <p className="detail-label">Total Cost</p>
                <p className="detail-value">{formatCurrency(stats.activeBorrow.totalCost)}</p>
              </div>
            </div>

            <Link to="/active-borrow" className="manage-link">
              Manage Borrow →
            </Link>
          </div>
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '48px' }}>
          <FiBook style={{ fontSize: '3rem', color: '#9ca3af', marginBottom: '16px' }} />
          <p className="empty-state-text">No active borrow</p>
          <Link to="/books" className="btn btn-primary">
            Browse Books
          </Link>
        </div>
      )}

      {stats?.pendingPaymentsCount > 0 && (
        <div className="alert alert-red">
          <div className="alert-icon">
            <FiDollarSign />
          </div>
          <div className="alert-content">
            <h4>You have {stats.pendingPaymentsCount} pending payment(s)</h4>
            <p>Please clear your dues to borrow more books</p>
          </div>
          <Link to="/history" className="alert-link">
            View Details
          </Link>
        </div>
      )}
    </div>
  );
};