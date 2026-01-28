import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBook, FiLogOut, FiUser } from 'react-icons/fi';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <FiBook />
          <span>Smart Library</span>
        </Link>
        
        {user && (
          <div className="navbar-user">
            <span className="user-name">
              <FiUser />
              {user.name}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};