import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { get } from '../../services/Endpoint';
import toast from 'react-hot-toast';
import { FaUsers, FaNewspaper, FaComments, FaChartLine, FaMoon, FaSun } from 'react-icons/fa';

function Dashboard() {
  const [post, setPost] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect non-admin users
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const getData = async () => {
      try {
        setLoading(true);
        const response = await get('/admin/dashboard');
        const data = response.data;
        
        setPost(data.posts || []);
        setUsers(data.users || []);
        setComments(data.comments || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        
        if (error.response?.status === 403) {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };
    
    getData();
  }, [user, navigate]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className={`dashboard-loading ${darkMode ? 'dark' : ''}`}>
        <div className="spinner-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${darkMode ? 'dark' : ''}`}>
      <div className="dashboard-header">
        <div className="header-content">
          <h2 className="dashboard-title">
            <FaChartLine className="me-2" />
            Dashboard Overview
          </h2>
          <p className="dashboard-subtitle">Welcome back, {user?.FullName}!</p>
        </div>
        <button 
          className="theme-toggle"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Users Card */}
        <div className="dashboard-card users-card">
          <div className="card-icon">
            <FaUsers />
          </div>
          <div className="card-content">
            <h3 className="card-title">Total Users</h3>
            <p className="card-value">{users?.length || 0}</p>
            <div className="card-footer">
              <span className="trend positive">
                <i className="fas fa-arrow-up"></i> 12%
              </span>
              <span className="period">vs last month</span>
            </div>
          </div>
        </div>

        {/* Posts Card */}
        <div className="dashboard-card posts-card">
          <div className="card-icon">
            <FaNewspaper />
          </div>
          <div className="card-content">
            <h3 className="card-title">Total Posts</h3>
            <p className="card-value">{post?.length || 0}</p>
            <div className="card-footer">
              <span className="trend positive">
                <i className="fas fa-arrow-up"></i> 8%
              </span>
              <span className="period">vs last month</span>
            </div>
          </div>
        </div>

        {/* Comments Card */}
        <div className="dashboard-card comments-card">
          <div className="card-icon">
            <FaComments />
          </div>
          <div className="card-content">
            <h3 className="card-title">Total Comments</h3>
            <p className="card-value">{comments?.length || 0}</p>
            <div className="card-footer">
              <span className="trend positive">
                <i className="fas fa-arrow-up"></i> 15%
              </span>
              <span className="period">vs last month</span>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .dashboard-container {
            padding: 2rem;
            min-height: 100vh;
            transition: all 0.3s ease;
            background-color: #f8f9fa;
          }

          .dashboard-container.dark {
            background-color: #1a1a1a;
            color: #ffffff;
          }

          .dashboard-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f8f9fa;
            transition: all 0.3s ease;
          }

          .dashboard-loading.dark {
            background-color: #1a1a1a;
            color: #ffffff;
          }

          .spinner-container {
            text-align: center;
          }

          .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            animation: fadeInDown 0.5s ease-out;
          }

          .header-content {
            flex: 1;
          }

          .theme-toggle {
            background: none;
            border: none;
            color: #2d3436;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
          }

          .dark .theme-toggle {
            color: #ffffff;
          }

          .theme-toggle:hover {
            background-color: rgba(0, 0, 0, 0.1);
          }

          .dark .theme-toggle:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }

          .dashboard-title {
            font-size: 2rem;
            font-weight: 600;
            color: #2d3436;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
          }

          .dark .dashboard-title {
            color: #ffffff;
          }

          .dashboard-subtitle {
            color: #636e72;
            font-size: 1.1rem;
          }

          .dark .dashboard-subtitle {
            color: #a0a0a0;
          }

          .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
          }

          .dashboard-card {
            background: white;
            border-radius: 20px;
            padding: 1.5rem;
            display: flex;
            align-items: flex-start;
            gap: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            animation: fadeInUp 0.5s ease-out;
            position: relative;
            overflow: hidden;
          }

          .dark .dashboard-card {
            background: #2d2d2d;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
          }

          .dashboard-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1));
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
          }

          .dashboard-card:hover::before {
            opacity: 1;
          }

          .card-icon {
            width: 60px;
            height: 60px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            color: white;
            transition: all 0.3s ease;
          }

          .users-card .card-icon {
            background: linear-gradient(135deg, #6c5ce7, #a8a4e6);
          }

          .posts-card .card-icon {
            background: linear-gradient(135deg, #00b894, #00cec9);
          }

          .comments-card .card-icon {
            background: linear-gradient(135deg, #e17055, #ff7675);
          }

          .card-content {
            flex: 1;
          }

          .card-title {
            font-size: 1.1rem;
            color: #636e72;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }

          .dark .card-title {
            color: #a0a0a0;
          }

          .card-value {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2d3436;
            margin-bottom: 0.5rem;
            line-height: 1;
          }

          .dark .card-value {
            color: #ffffff;
          }

          .card-footer {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
          }

          .trend {
            font-size: 0.875rem;
            font-weight: 500;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .trend.positive {
            background-color: rgba(0, 184, 148, 0.1);
            color: #00b894;
          }

          .trend.negative {
            background-color: rgba(225, 112, 85, 0.1);
            color: #e17055;
          }

          .period {
            font-size: 0.875rem;
            color: #636e72;
          }

          .dark .period {
            color: #a0a0a0;
          }

          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 768px) {
            .dashboard-container {
              padding: 1rem;
            }

            .dashboard-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 1rem;
            }

            .theme-toggle {
              align-self: flex-end;
            }

            .dashboard-grid {
              grid-template-columns: 1fr;
            }

            .dashboard-card {
              margin-bottom: 1rem;
            }

            .card-value {
              font-size: 2rem;
            }
          }

          @media (max-width: 480px) {
            .dashboard-title {
              font-size: 1.5rem;
            }

            .dashboard-subtitle {
              font-size: 1rem;
            }

            .card-icon {
              width: 50px;
              height: 50px;
              font-size: 1.5rem;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard;