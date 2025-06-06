import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaPlus, FaCloudUploadAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { post } from '../../services/Endpoint';

function AddPost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    setFormData((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => handleImageFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleImageFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, desc, image } = formData;

    if (!title.trim() || !desc.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!image) {
      toast.error('Please select an image');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', title);
      formDataToSend.append('desc', desc);
      formDataToSend.append('postImage', image);

      const token = localStorage.getItem('token');

      const response = await post('/blog/create', formDataToSend, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.data.success) {
        toast.success('Post created successfully!');
        navigate('/admin/allposts');
      } else {
        toast.error(response.data.message || 'Failed to create post');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow-lg" style={{
            borderRadius: '20px',
            background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
            overflow: 'hidden'
          }}>
            <div className="card-header border-0 py-4" style={{
              background: 'linear-gradient(90deg, #6366f1, #f59e42)',
              color: 'white'
            }}>
              <h2 className="text-center mb-0" style={{ fontWeight: '700' }}>
                Create New Post
              </h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Image Upload Section */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Post Image</label>
                  <div
                    className={`border rounded-3 p-4 text-center ${dragActive ? 'border-primary' : ''}`}
                    style={{
                      background: dragActive ? 'rgba(99, 102, 241, 0.1)' : '#f8fafc',
                      cursor: 'pointer',
                      minHeight: '250px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      border: '2px dashed #e2e8f0'
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('image').click()}
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="img-fluid rounded-3 shadow-sm"
                        style={{ maxHeight: '200px' }}
                      />
                    ) : (
                      <div className="text-center">
                        <FaCloudUploadAlt size={48} className="text-primary mb-3" />
                        <h5 className="mb-2">Drag & Drop or Click to Upload</h5>
                        <p className="text-muted mb-0">Supports JPG, PNG up to 5MB</p>
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
                  <label className="form-label fw-bold">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control form-control-lg"
                    placeholder="Enter post title"
                    value={formData.title}
                    onChange={handleInputChange}
                    style={{
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      padding: '12px',
                      fontSize: '1.1rem'
                    }}
                    required
                  />
                </div>

                {/* Description Input */}
                <div className="mb-4">
                  <label className="form-label fw-bold">Description</label>
                  <textarea
                    name="desc"
                    className="form-control"
                    rows="8"
                    placeholder="Write your post content here..."
                    value={formData.desc}
                    onChange={handleInputChange}
                    style={{
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      padding: '12px',
                      fontSize: '1.1rem',
                      resize: 'vertical'
                    }}
                    required
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-end gap-3">
                  <button
                    type="button"
                    className="btn btn-light px-4"
                    onClick={() => navigate('/dashboard/allposts')}
                    disabled={isSubmitting}
                    style={{
                      borderRadius: '10px',
                      fontWeight: '600',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn px-4"
                    disabled={isSubmitting}
                    style={{
                      background: 'linear-gradient(90deg, #6366f1, #f59e42)',
                      color: 'white',
                      borderRadius: '10px',
                      fontWeight: '600',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(99, 102, 241, 0.2)'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="fa-spin me-2" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <FaPlus className="me-2" />
                        Publish Post
                      </>
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

export default AddPost;
