import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'bg-dark shadow-lg' : 'bg-dark'}`} style={{ transition: 'all 0.3s ease' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="d-flex flex-column">
            <span className="fw-bold fs-4 text-white">Sports <span className="text-warning">Chronicle</span></span>
            <small className="text-light-emphasis">Your Daily Sports Update</small>
          </div>
        </Link>

        <div className="d-flex align-items-center gap-3">
          {user ? (
            <div className="position-relative">
              <button
                className="btn btn-link text-white d-flex align-items-center gap-2"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{ textDecoration: 'none' }}
              >
                <div className="position-relative">
                  <img
                    src={user.profile ? `http://localhost:8000/images/${user.profile}` : 'https://via.placeholder.com/32'}
                    alt="Profile"
                    className="rounded-circle border border-warning"
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      objectFit: 'cover'
                    }}
                  />
                  <div className="position-absolute bottom-0 end-0 bg-success rounded-circle" style={{ width: '12px', height: '12px', border: '2px solid #212529' }}></div>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <span className="fw-bold">{user.FullName}</span>
                  <small className="text-light-emphasis">{user.role === 'admin' ? 'Administrator' : 'User'}</small>
                </div>
              </button>

              {isDropdownOpen && (
                <div 
                  className="position-absolute end-0 mt-2 py-2 bg-dark rounded-3 shadow-lg" 
                  style={{ 
                    minWidth: '220px', 
                    zIndex: 1000,
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="dropdown-item d-flex align-items-center px-3 py-2 text-white"
                      onClick={() => setIsDropdownOpen(false)}
                      style={{ transition: 'background-color 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <FaTachometerAlt className="me-2 text-warning" />
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="dropdown-item d-flex align-items-center px-3 py-2 text-white"
                    onClick={() => setIsDropdownOpen(false)}
                    style={{ transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FaUser className="me-2 text-warning" />
                    Profile
                  </Link>
                  <div className="dropdown-divider border-secondary"></div>
                  <button
                    className="dropdown-item d-flex align-items-center px-3 py-2 text-danger"
                    onClick={handleLogout}
                    style={{ transition: 'background-color 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-warning px-4 py-2 rounded-pill fw-bold">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;