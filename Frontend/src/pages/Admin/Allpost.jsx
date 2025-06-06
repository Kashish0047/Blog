import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt, FaSearch, FaPlus, FaSpinner, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { get, del, BaseURL } from '../../services/Endpoint';
import { toast } from 'react-hot-toast';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await get('/admin/allposts');
      if (response.status === 200) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await del(`/blog/posts/${postId}`);
        if (response.status === 200) {
          toast.success('Post deleted successfully');
          fetchPosts(); // Refresh the posts list
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.desc?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>All Posts</h2>
        <Link to="/admin/addpost" className="btn btn-primary">
          Add New Post
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post._id}>
                <td>{post.title}</td>
                <td>{post.category}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="btn-group">
                    <Link 
                      to={`/post/${post._id}`} 
                      className="btn btn-sm btn-info me-2"
                    >
                      <FaEye /> View
                    </Link>
                    <Link 
                      to={`/admin/editpost/${post._id}`} 
                      className="btn btn-sm btn-warning me-2"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="btn btn-sm btn-danger"
                    >
                      <FaTrashAlt /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No posts found</p>
        </div>
      )}
    </div>
  );
}

export default AllPosts;