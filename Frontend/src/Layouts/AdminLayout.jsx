import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaHome, FaNewspaper, FaPlus, FaUsers } from 'react-icons/fa';

function AdminLayout() {
  const { user } = useSelector((state) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !user || user.role !== 'admin') {
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch {
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [user]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item">
            <FaHome className="me-2" /> Dashboard
          </Link>
          <Link to="/admin/allpost" className="nav-item">
            <FaNewspaper className="me-2" /> All Posts
          </Link>
          <Link to="/admin/addpost" className="nav-item">
            <FaPlus className="me-2" /> Add Post
          </Link>
          <Link to="/admin/users" className="nav-item">
            <FaUsers className="me-2" /> Users
          </Link>
          <Link to="/home" className="nav-item">
            <FaHome className="me-2" /> Back to Site
          </Link>
        </nav>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        .admin-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        .admin-sidebar {
          width: 250px;
          background: white;
          padding: 1.5rem;
          box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
          position: fixed;
          height: 100vh;
          overflow-y: auto;
          z-index: 1000;
        }
        .sidebar-header {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }
        .sidebar-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3436;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .nav-item {
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: #2d3436;
          border-radius: 8px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
        .nav-item:hover {
          background-color: rgba(0, 0, 0, 0.05);
          color: #0984e3;
        }
        .admin-content {
          flex: 1;
          margin-left: 250px;
          padding: 2rem;
        }
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 100%;
            height: auto;
            position: relative;
          }
          .admin-content {
            margin-left: 0;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminLayout;