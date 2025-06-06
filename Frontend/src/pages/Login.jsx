import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { post } from '../services/Endpoint';
import toast from 'react-hot-toast';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await post('/auth/login', formData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userData', JSON.stringify(response.data.user));
                dispatch(setCredentials({
                    user: response.data.user,
                    token: response.data.token,
                }));
                toast.success('Login successful!');
                navigate('/', { replace: true });
            } else {
                toast.error(response.data.message || 'Login failed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section 
            className="d-flex align-items-center justify-content-center min-vh-100"
            style={{
                background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)'
            }}
        >
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
                            <div className="row g-0">
                                <div className="col-lg-6 d-none d-lg-block">
                                    <img 
                                        src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                                        alt="Sports Collage"
                                        className="img-fluid h-100"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="col-lg-6">
                                    <div className="card-body p-4 p-md-5">
                                        <div className="text-center mb-4">
                                            <Link to="/" className="text-dark text-decoration-none d-flex align-items-center justify-content-center mb-3">
                                                
                                                <h2 className="fw-bold mb-0">Sports Chronicle</h2>
                                            </Link>
                                            <h5 className="text-muted fw-normal">Welcome back! Sign in to continue.</h5>
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    name="email"
                                                    placeholder="name@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    autoComplete="email"
                                                />
                                                <label htmlFor="email">
                                                    <FaEnvelope className="me-2" />
                                                    Email address
                                                </label>
                                            </div>

                                            <div className="form-floating mb-4">
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    name="password"
                                                    placeholder="Password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    autoComplete="current-password"
                                                />
                                                <label htmlFor="password">
                                                    <FaLock className="me-2" />
                                                    Password
                                                </label>
                                            </div>

                                            <div className="d-grid">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary btn-lg fw-bold d-flex align-items-center justify-content-center"
                                                    disabled={loading}
                                                    style={{
                                                        padding: '0.75rem',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    {loading ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    ) : (
                                                        <>
                                                            <FaSignInAlt className="me-2" />
                                                            Sign In
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>

                                        <div className="text-center mt-4">
                                            <p className="mb-0 text-muted">
                                                Don't have an account?{' '}
                                                <Link to="/register" className="fw-bold text-decoration-none">
                                                    Register here
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}