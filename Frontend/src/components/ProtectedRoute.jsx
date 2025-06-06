import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();
  const storedToken = localStorage.getItem('token');

  // Show loading indicator only on initial app load, not during navigation
  if (isLoading && !storedToken) {
    return <div>Loading authentication...</div>;
  }

  // If not logged in (after loading is complete), redirect to login
  if (!storedToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If adminOnly is true and user is not admin, redirect to home
  if (adminOnly) {
    if (!user) {
      return <div>Loading user information...</div>;
    }
    if (user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
  }

  // If all checks pass, render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 