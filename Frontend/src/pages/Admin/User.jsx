import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaUserEdit } from 'react-icons/fa';
import { get, del } from '../../services/Endpoint';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaSearch } from 'react-icons/fa';

function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await get('/admin/users');
      const data = response.data;
      setUsers(data.Users || []);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await del(`/admin/deleteUser/${userId}`);
        if (response.data.success) {
          setUsers(users.filter(user => user._id !== userId));
          toast.success('User deleted successfully');
        } else {
          toast.error(response.data.message || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getUserDisplayName = (user) => {
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
    className="min-vh-100" 
    style={{ 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '2rem 0'
    }}
  >
    <div className="container-fluid px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-white mb-1" style={{ fontWeight: '700' }}>User Management</h2>
          <p className="mb-0" style={{ color: '#94a3b8' }}>Manage all registered users</p>
        </div>
        <div className="col-md-4">
          <div 
            className="input-group shadow-sm" 
            style={{ 
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid #334155'
            }}
          >
            <span 
              className="input-group-text" 
              style={{ 
                backgroundColor: '#1e293b', 
                border: 'none',
                color: '#64748b'
              }}
            >
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                backgroundColor: '#1e293b',
                border: 'none',
                color: '#f8fafc',
                padding: '0.75rem',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>
      </div>

      <div 
        className="card border-0 shadow" 
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        <div className="card-body p-0">
          <div className="table-responsive">
            <table 
              className="table align-middle mb-0" 
              style={{ 
                marginBottom: 0,
                '--bs-table-bg': 'transparent',
                '--bs-table-color': '#f8fafc',
                '--bs-table-hover-bg': 'rgba(255, 255, 255, 0.03)'
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <th style={{ 
                    width: '50px', 
                    color: '#94a3b8',
                    fontWeight: '500',
                    padding: '1.25rem 1.5rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)'
                  }}>#</th>
                  <th style={{ 
                    color: '#94a3b8',
                    fontWeight: '500',
                    padding: '1.25rem 1.5rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)'
                  }}>User</th>
                  <th style={{ 
                    color: '#94a3b8',
                    fontWeight: '500',
                    padding: '1.25rem 1.5rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)'
                  }}>Email</th>
                  <th style={{ 
                    color: '#94a3b8',
                    fontWeight: '500',
                    padding: '1.25rem 1.5rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)'
                  }}>Role</th>
                  <th style={{ 
                    textAlign: 'right',
                    padding: '1.25rem 1.5rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)'
                  }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr 
                      key={user._id} 
                      className="align-middle"
                      style={{ 
                        borderBottom: '1px solid #1e293b',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <td className="text-muted" style={{ padding: '1.25rem 1.5rem' }}>{index + 1}</td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ 
                              width: '42px', 
                              height: '42px', 
                              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                              color: '#fff',
                              fontWeight: '600',
                              fontSize: '1.1rem',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                          >
                            {getUserDisplayName(user).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-medium" style={{ color: '#f8fafc' }}>
                              {getUserDisplayName(user)}
                            </div>
                            <small style={{ color: '#94a3b8' }}>
                              {new Date(user.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', color: '#e2e8f0' }}>{user.email || 'N/A'}</td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span 
                          className="badge"
                          style={{
                            backgroundColor: user.role === 'admin' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                            color: user.role === 'admin' ? '#f87171' : '#94a3b8',
                            padding: '0.35em 0.75em',
                            borderRadius: '6px',
                            fontWeight: '500',
                            fontSize: '0.75rem',
                            textTransform: 'capitalize',
                            border: user.role === 'admin' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(100, 116, 139, 0.2)'
                          }}
                        >
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="text-end" style={{ padding: '1.25rem 1.5rem' }}>
                        <div className="btn-group" role="group">
                          <Link
                            to={`/admin/users/edit/${user._id}`}
                            className="btn btn-sm me-2 d-flex align-items-center justify-content-center"
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              color: '#f8fafc',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.1)';
                              e.currentTarget.style.borderColor = 'rgba(96, 165, 250, 0.3)';
                              e.currentTarget.style.color = '#60a5fa';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                              e.currentTarget.style.color = '#f8fafc';
                            }}
                            disabled={user.role === 'admin'}
                          >
                            <FaUserEdit size={14} />
                          </Link>
                          <button
                            className="btn btn-sm d-flex align-items-center justify-content-center"
                            onClick={() => handleDelete(user._id)}
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              color: '#f8fafc',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                              e.currentTarget.style.color = '#f87171';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                              e.currentTarget.style.color = '#f8fafc';
                            }}
                            disabled={user.role === 'admin'}
                          >
                            <FaTrashAlt size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td 
                      colSpan="5" 
                      className="text-center py-5"
                      style={{ 
                        color: '#94a3b8',
                        fontStyle: 'italic'
                      }}
                    >
                      {searchTerm ? 'No matching users found' : 'No users found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default User;