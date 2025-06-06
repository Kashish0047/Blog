import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { get, BaseURL } from '../services/Endpoint'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { FaArrowLeft, FaTrash, FaUserCircle } from 'react-icons/fa'

function Post() {
   const { id } = useParams()
   const navigate = useNavigate()
   const [post, setPost] = useState(null)
   const [loading, setLoading] = useState(true)
   const [comments, setComments] = useState([])
   const [newComment, setNewComment] = useState('')
   const [commentLoading, setCommentLoading] = useState(false)
   const { user } = useSelector((state) => state.auth)

   useEffect(() => {
      const fetchPost = async () => {
         try {
            setLoading(true);
            const response = await get(`/blog/getpost/${id}`);
            console.log('[Post.jsx] Raw response.data (useEffect):', JSON.parse(JSON.stringify(response.data))); // Deep clone for accurate logging

            if (response.data && response.data.success) {
               const postData = response.data.post; // Store in a variable
               console.log('[Post.jsx] Extracted postData:', JSON.parse(JSON.stringify(postData))); // Log the extracted postData
               
               setPost(postData); 

               if (postData && postData.comment) { // Check if postData and postData.comment exist
                  console.log('[Post.jsx] Setting comments with postData.comment:', JSON.parse(JSON.stringify(postData.comment)));
                  setComments(postData.comment); // Directly use postData.comment
               } else {
                  console.log('[Post.jsx] postData.comment is missing or undefined. Setting comments to []. postData was:', JSON.parse(JSON.stringify(postData)));
                  setComments([]);
               }
            } else {
               console.log('[Post.jsx] Fetch unsuccessful or no response.data. success:', response.data?.success);
               toast.error(response.data?.message || 'Failed to fetch post details');
               setComments([]);
            }
         } catch (error) {
            console.error('[Post.jsx] Error fetching post (useEffect):', error);
            toast.error(error.response?.data?.message || 'Failed to fetch post in catch');
            setComments([]);
         } finally {
            setLoading(false);
         }
      };

      if (id) {
         console.log('[Post.jsx] useEffect triggered. ID:', id);
         fetchPost();
      } else {
         console.log('[Post.jsx] useEffect: id is null/undefined, not fetching post.');
         setLoading(false);
         setComments([]); 
      }
   }, [id]);

   const handleCommentSubmit = async (e) => {
      e.preventDefault()
      if (!newComment.trim()) {
         toast.error('Please enter a comment')
         return
      }

      try {
         setCommentLoading(true)
         const token = localStorage.getItem('token')
         const response = await axios.post(
            `${BaseURL}/comment/addcomment`,
            { 
               comment: newComment,
               postId: id 
            },
            {
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
               }
            }
         )
         console.log('Comment response:', response.data)
         
         if (response.data.success) {
            const newCommentData = {
               ...response.data.comment,
               userId: {
                  ...response.data.comment.userId,
                  FullName: response.data.comment.userId.FullName,
                  profile: response.data.comment.userId.profile
               }
            }
            setComments(prevComments => [newCommentData, ...prevComments])
            setNewComment('')
            toast.success('Comment added successfully')
         } else {
            toast.error(response.data.message || 'Failed to add comment')
         }
      } catch (error) {
         console.error('Error adding comment:', error)
         toast.error(error.response?.data?.message || 'Failed to add comment')
      } finally {
         setCommentLoading(false)
      }
   }

   const handleDeleteComment = async (commentId) => {
      if (!window.confirm('Are you sure you want to delete this comment?')) {
         return
      }

      try {
         const token = localStorage.getItem('token')
         const response = await axios.post(
            `${BaseURL}/comment/deletecomment`,
            { commentId },
            {
               headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
               }
            }
         )

         if (response.data.success) {
            setComments(prevComments => prevComments.filter(comment => comment._id !== commentId))
            toast.success('Comment deleted successfully')
         } else {
            toast.error(response.data.message || 'Failed to delete comment')
         }
      } catch (error) {
         console.error('Error deleting comment:', error)
         toast.error(error.response?.data?.message || 'Failed to delete comment')
      }
   }

   console.log('[Post.jsx] State before render - comments:', comments, 'post:', post, 'loading:', loading);

   if (loading) {
      console.log('[Post.jsx] Rendering: Loading...');
      return (
         <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
               <span className="visually-hidden">Loading...</span>
            </div>
         </div>
      )
   }

   if (!post) {
      console.log('[Post.jsx] Rendering: Post not found state.');
      return (
         <div className="container text-center py-5">
            <h3 className="text-muted mb-3">Post not found</h3>
            <p className="text-muted mb-4">The post you are looking for does not exist or may have been removed.</p>
            <button onClick={() => navigate('/home')} className="btn btn-primary">Go to Homepage</button>
         </div>
      )
   }
   console.log('[Post.jsx] Rendering: Main content. Comments length:', comments ? comments.length : 'null or undefined');
   return (
      <div className="container py-4 py-lg-5">
         <button 
            onClick={() => navigate(-1)}
            className="btn btn-outline-secondary btn-sm mb-4 d-flex align-items-center"
         >
            <FaArrowLeft className="me-2" /> Back
         </button>
         
         <div className="row justify-content-center">
            <div className="col-lg-9">
               <article className="bg-white p-4 p-md-5 rounded shadow-sm mb-5">
                  <h1 className="mb-3 h2 fw-bold text-dark">{post.title}</h1>
                  <div className="mb-4 text-muted">
                     <small>
                        Posted on{' '}
                        {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                     </small>
                  </div>
                  {post.image && (
                     <div className="mb-4" style={{ maxHeight: '500px', overflow: 'hidden'}}>
                        <img
                           src={`${BaseURL}/images/${post.image}`}
                           alt={post.title}
                           className="img-fluid rounded-3 w-100"
                           style={{ objectFit: 'cover', height: 'auto' }}
                           onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                           }}
                        />
                     </div>
                  )}
                  <div className="content text-break" style={{ 
                     fontSize: '1.1rem',
                     lineHeight: '1.8',
                     color: '#343a40'
                  }}>
                     {post.description || post.desc}
                  </div>
               </article>

               {/* Comments Section */}
               <div className="bg-white p-4 p-md-5 rounded shadow-sm">
                  <h3 className="mb-4 h4 fw-bold text-dark">Comments ({comments ? comments.length : 0})</h3>
                  
                  {/* Add Comment Form */}
                  {user ? (
                     <form onSubmit={handleCommentSubmit} className="mb-4">
                        <div className="mb-3">
                           <textarea
                              className="form-control form-control-lg shadow-sm"
                              rows="3"
                              placeholder={`Commenting as ${user.FullName || 'User'}...`}
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              style={{
                                 borderRadius: '0.5rem',
                                 borderColor: '#ced4da',
                                 fontSize: '1rem',
                                 resize: 'none'
                              }}
                           ></textarea>
                        </div>
                        <div className="d-flex justify-content-end">
                           <button
                              type="submit"
                              className="btn btn-primary shadow-sm"
                              disabled={commentLoading}
                              style={{
                                 borderRadius: '0.5rem',
                                 padding: '0.5rem 1.5rem',
                                 fontWeight: '500'
                              }}
                           >
                              {commentLoading ? (
                                 <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Posting...
                                 </>
                              ) : (
                                 'Post Comment'
                              )}
                           </button>
                        </div>
                     </form>
                  ) : (
                     <div className="mb-4 text-center p-4 border rounded bg-light">
                        <p className="mb-2">Please log in to post a comment.</p>
                        <button onClick={() => navigate('/login')} className="btn btn-primary btn-sm">
                           Login
                        </button>
                     </div>
                  )}

                  {/* Comments List */}
                  <div className="comments-list mt-4 pt-2">
                     {comments && comments.length > 0 ? (
                        comments.map((comment) => (
                           <div key={comment._id} className="comment d-flex align-items-start mb-4 pb-3 border-bottom border-light">
                              {/* Profile Image or Avatar */}
                              <div 
                                 className="rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm"
                                 style={{ 
                                    width: '48px', 
                                    height: '48px', 
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: '1.25rem',
                                    flexShrink: 0,
                                    overflow: 'hidden'
                                 }}
                              >
                                 {comment.userId?.profile ? (
                                    <img 
                                       src={`${BaseURL}/images/${comment.userId.profile}`}
                                       alt={comment.userId?.FullName || 'User Avatar'}
                                       className="rounded-circle"
                                       style={{ width: '100%', height: '100%', objectFit: 'cover'}}
                                       onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.style.display = 'none'; // Hide broken image icon
                                          const parent = e.target.parentElement;
                                          if(parent) {
                                              const name = comment.userId?.FullName || 'A';
                                              parent.innerHTML = `<span title="${name}">${name.charAt(0).toUpperCase()}</span>`;
                                          }
                                       }}
                                    />
                                 ) : (
                                    <span title={comment.userId?.FullName || 'Anonymous'}>
                                        {(comment.userId?.FullName || 'A').charAt(0).toUpperCase()}
                                    </span>
                                 )}
                              </div>

                              {/* Comment Content */}
                              <div className="flex-grow-1">
                                 <div className="d-flex align-items-center justify-content-between mb-1">
                                    <div className="d-flex align-items-baseline">
                                       <span className="fw-bold text-dark me-2">
                                          {comment.userId?.FullName || 'Anonymous User'}
                                       </span>
                                       <small className="text-muted" style={{fontSize: '0.8rem'}}>
                                          {new Date(comment.createdAt).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' })}
                                       </small>
                                    </div>
                                    {user?.role === 'admin' && (
                                       <button
                                          onClick={() => handleDeleteComment(comment._id)}
                                          className="btn btn-sm btn-link text-danger p-0"
                                          title="Delete comment"
                                          style={{ fontSize: '0.85rem' }}
                                       >
                                          <FaTrash />
                                       </button>
                                    )}
                                 </div>
                                 <p className="mb-0 text-secondary" style={{ lineHeight: '1.6' }}>
                                    {comment.comment.split('\n').map((line, idx) => (
                                       <React.Fragment key={idx}>{line}<br/></React.Fragment>
                                    ))}
                                 </p>
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="text-center py-4">
                           <FaUserCircle size={48} className="text-muted mb-3" />
                           <p className="mb-1 fw-semibold text-dark">No comments yet.</p>
                           <p className="text-muted small">Be the first to share your thoughts!</p>
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default Post