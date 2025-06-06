import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { post } from '../services/Endpoint';
import toast from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaCamera, FaSignInAlt } from 'react-icons/fa';

export default function Register() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [value, setValue] = useState({
        fullName: "",
        email: "",
        password: "",
        image: null,
    });
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setValue({ ...value, image: file });
        }
    };

    const handleImageClick = () => {
        document.getElementById('image').click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('FullName', value.fullName);
        formData.append('email', value.email);
        formData.append('password', value.password);
        formData.append('profile', value.image);

        try {
            const response = await post('/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const data = response.data;
            if (data.success) {
                toast.success(data.message || 'Registration successful!');
                if (data.user && data.token) {
                    dispatch(setCredentials({ user: data.user, token: data.token }));
                    localStorage.setItem('userData', JSON.stringify(data.user));
                    navigate('/', { replace: true });
                } else {
                    navigate('/login');
                }
            } else {
                toast.error(data.message || 'Registration failed.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An unexpected error occurred.');
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
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
                            <div className="row g-0">
                                <div className="col-lg-6 d-none d-lg-block">
                                     <img 
                                        src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
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
                                            <h5 className="text-muted fw-normal">Create your account.</h5>
                                        </div>

                                        <form onSubmit={handleSubmit}>
                                            <div className="text-center mb-4">
                                                <label htmlFor="image" className="form-label text-muted">Profile Picture</label>
                                                <div 
                                                    className="mx-auto"
                                                    style={{ position: 'relative', width: '120px', height: '120px', cursor: 'pointer' }}
                                                    onClick={handleImageClick}
                                                >
                                                    <img 
                                                        src={value.image ? URL.createObjectURL(value.image) : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} 
                                                        alt="avatar" 
                                                        className="rounded-circle shadow-sm" 
                                                        style={{ width: '120px', height: '120px', objectFit: 'cover', border: '4px solid white' }}
                                                    />
                                                    <div className="position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center"
                                                         style={{ backgroundColor: '#0d6efd', width: '35px', height: '35px', borderRadius: '50%', border: '3px solid white' }}>
                                                        <FaCamera color="white" size="1rem" />
                                                    </div>
                                                </div>
                                                <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="d-none" />
                                            </div>

                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control" id="fullName" placeholder="John Doe" required value={value.fullName} onChange={(e) => setValue({ ...value, fullName: e.target.value })} />
                                                <label htmlFor="fullName"><FaUser className="me-2" />Full Name</label>
                                            </div>

                                            <div className="form-floating mb-3">
                                                <input type="email" className="form-control" id="email" placeholder="name@company.com" required value={value.email} onChange={(e) => setValue({ ...value, email: e.target.value })} />
                                                <label htmlFor="email"><FaEnvelope className="me-2" />Email</label>
                                            </div>

                                            <div className="form-floating mb-4">
                                                <input type="password" className="form-control" id="password" placeholder="••••••••" required value={value.password} onChange={(e) => setValue({ ...value, password: e.target.value })} />
                                                <label htmlFor="password"><FaLock className="me-2" />Password</label>
                                            </div>
                                            
                                            <div className="d-grid">
                                                <button type="submit" className="btn btn-primary btn-lg fw-bold d-flex align-items-center justify-content-center" disabled={loading}>
                                                    {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : <><FaSignInAlt className="me-2" />Create Account</>}
                                                </button>
                                            </div>
                                        </form>

                                        <div className="text-center mt-4">
                                            <p className="mb-0 text-muted">
                                                Already have an account?{' '}
                                                <Link to="/login" className="fw-bold text-decoration-none">Sign in</Link>
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