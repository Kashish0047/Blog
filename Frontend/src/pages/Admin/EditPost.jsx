import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSpinner, FaCloudUploadAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { get, patch, BaseURL } from '../../services/Endpoint';

function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await get(`/blog/getpost/${id}`);
      const post = response.data.post;
      setFormData({
        title: post.title,
        desc: post.desc,
        image: null
      });
      setPreview(`${BaseURL}/images/${post.image}`);
    } catch (error) {
      console.error('Failed to load post for editing:', error);
      toast.error('Failed to load post');
      navigate('/dashboard/allposts');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.desc.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('desc', formData.desc);
      if (formData.image) {
        formDataToSend.append('postImage', formData.image);
      }
      const token = localStorage.getItem('token');

      await patch(`/blog/update/${id}`, formDataToSend, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      toast.success('Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      console.error('Error response data:', error?.response?.data);
      toast.error(error?.response?.data?.message || 'Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <FaSpinner className="fa-spin me-2" size={24} />
        <span>Loading post...</span>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0 py-4">
              <h2 className="text-center mb-0" style={{
                fontWeight: 700,
                background: 'linear-gradient(90deg, #6366f1, #f59e42)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Edit Post
              </h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Image Upload */}
                <div className="mb-4">
                  <label className="form-label">Post Image</label>
                  <div
                    className="border rounded p-3 text-center"
                    style={{
                      background: '#f8fafc',
                      cursor: 'pointer',
                      minHeight: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={() => document.getElementById('image').click()}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{ maxHeight: '200px' }}
                      />
                    ) : (
                      <div>
                        <FaCloudUploadAlt size={48} className="text-primary mb-2" />
                        <p className="mb-0">Click to upload image</p>
                      </div>
                    )}
                    <input
                      type="file"
                      id="image"
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>

                {/* Title Input */}
                <div className="mb-4">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Description Input */}
                <div className="mb-4">
                  <label className="form-label">Description</label>
                  <textarea
                    name="desc"
                    className="form-control"
                    rows="6"
                    value={formData.desc}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/dashboard/allposts')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{
                      background: 'linear-gradient(90deg, #6366f1, #f59e42)',
                      border: 'none'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="fa-spin me-2" />
                        Updating...
                      </>
                    ) : (
                      'Update Post'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPost; 