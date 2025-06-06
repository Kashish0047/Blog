import React, { useState, useEffect } from 'react';
import { FaUser, FaCamera, FaLock, FaCheck } from 'react-icons/fa';
import { BaseURL, post } from '../services/Endpoint';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    FullName: user?.FullName || '',
    oldPassword: '',
    newPassword: '',
    profile: null
  });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
        setFormData(currentFormData => ({
            ...currentFormData,
            FullName: user.FullName,
            // Do not reset password fields here, only sync FullName if it differs from current user in Redux
            // Or if it's the initial load and FullName in formData is empty
            ...(currentFormData.FullName === '' && user.FullName ? { FullName: user.FullName } : {}),
            ...(user.FullName !== currentFormData.FullName && !isLoading ? { FullName: user.FullName } : {}) // More careful sync
        }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]); // Added isLoading back to prevent overriding during active submission cycles

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear password error when user types
    if (name === 'oldPassword' || name === 'newPassword') {
      setPasswordError('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profile: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError('');

    try {
      // Validate password fields
      if (formData.newPassword && !formData.oldPassword) {
        setPasswordError('Please enter your old password to update to a new password');
        setIsLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('FullName', formData.FullName);
      if (formData.oldPassword) {
        formDataToSend.append('oldPassword', formData.oldPassword);
      }
      if (formData.newPassword) {
        formDataToSend.append('newPassword', formData.newPassword);
      }
      if (formData.profile) {
        formDataToSend.append('profile', formData.profile);
      }

      const response = await post('/auth/updateprofile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const updatedUserFromServer = response.data.user;
        
        console.log("[Profile.jsx] handleSubmit SUCCESS. User from server:", updatedUserFromServer);

        dispatch(updateUser(updatedUserFromServer));
        localStorage.setItem('userData', JSON.stringify(updatedUserFromServer));
        
        toast.success('Profile updated successfully');
        
        setFormData({
          FullName: updatedUserFromServer.FullName,
          oldPassword: '',
          newPassword: '',
          profile: null
        });
        
        if (formData.oldPassword && formData.newPassword) {
          toast.success('Password updated. Please login with your new password.');
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.response?.data?.message === 'Old password is incorrect') {
        setPasswordError('Old password is incorrect');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-lg profile-card">
            <div className="card-body p-4">
              <h2 className="text-center mb-4 gradient-text">Update Profile</h2>
              
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="text-center mb-4">
                  <div 
                    className="profile-image-container mx-auto"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <label htmlFor="profileImage" className="profile-image-label">
                      <img 
                        src={formData.profile ? URL.createObjectURL(formData.profile) : 
                             user?.profile ? `${BaseURL}/images/${user.profile}` : 
                             'https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg'} 
                        alt="Profile"
                        className="profile-image"
                      />
                      <div className={`profile-overlay ${isHovered ? 'show' : ''}`}>
                        <FaCamera className="profile-camera-icon" />
                        <span className="profile-change-text">Change Photo</span>
                      </div>
                    </label>
                    <input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      className="d-none"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                <div className="form-floating mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <FaUser className="text-primary" />
                    </span>
                    <input
                      type="text"
                      name="FullName"
                      className="form-control border-start-0"
                      placeholder="Update Name"
                      value={formData.FullName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-floating mb-3">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <FaLock className="text-primary" />
                    </span>
                    <input
                      type="password"
                      name="oldPassword"
                      className={`form-control border-start-0 ${passwordError ? 'is-invalid' : ''}`}
                      placeholder="Old Password"
                      value={formData.oldPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  {passwordError && (
                    <div className="invalid-feedback d-block">
                      {passwordError}
                    </div>
                  )}
                </div>

                <div className="form-floating mb-4">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0">
                      <FaLock className="text-primary" />
                    </span>
                    <input
                      type="password"
                      name="newPassword"
                      className="form-control border-start-0"
                      placeholder="New Password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2 update-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaCheck className="me-2" />
                      Update Profile
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .profile-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            transition: all 0.3s ease;
          }

          .profile-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
          }

          .gradient-text {
            background: linear-gradient(45deg, #6c5ce7, #a8a4e6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .profile-image-container {
            position: relative;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
          }

          .profile-image-container:hover {
            transform: scale(1.05);
          }

          .profile-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: all 0.3s ease;
          }

          .profile-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(108, 92, 231, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: all 0.3s ease;
          }

          .profile-overlay.show {
            opacity: 1;
          }

          .profile-camera-icon {
            font-size: 2rem;
            color: white;
            margin-bottom: 0.5rem;
          }

          .profile-change-text {
            color: white;
            font-size: 0.9rem;
            font-weight: 500;
          }

          .input-group {
            border: 2px solid #e9ecef;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .input-group:focus-within {
            border-color: #6c5ce7;
            box-shadow: 0 0 0 0.2rem rgba(108,92,231,.25);
          }

          .input-group-text {
            border: none;
            background: transparent;
          }

          .form-control {
            border: none;
            padding: 1rem;
            font-size: 1rem;
          }

          .form-control:focus {
            box-shadow: none;
          }

          .form-control.is-invalid {
            border-color: #dc3545;
          }

          .invalid-feedback {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }

          .update-button {
            background: linear-gradient(45deg, #6c5ce7, #a8a4e6);
            border: none;
            font-weight: 500;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
          }

          .update-button:hover:not(:disabled) {
            background: linear-gradient(45deg, #5b4bc4, #8f8bd4);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(108,92,231,0.2);
          }

          .update-button:active:not(:disabled) {
            transform: translateY(0);
          }

          .update-button:disabled {
            background: linear-gradient(45deg, #a8a4e6, #c5c3e6);
            cursor: not-allowed;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .profile-form {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>
    </div>
  );
}

export default Profile;