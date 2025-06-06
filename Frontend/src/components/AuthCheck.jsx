import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, setAuthLoading, logout } from '../store/slices/authSlice';

const AuthCheck = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuthLoading(true));
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('userData');
      
      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData) {
          dispatch(setCredentials({
            user: userData,
            token: storedToken
          }));
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch(logout());
    } finally {
      dispatch(setAuthLoading(false));
    }
  }, [dispatch]);

  return null;
};

export default AuthCheck; 