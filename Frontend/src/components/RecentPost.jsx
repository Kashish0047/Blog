import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseURL, get } from '../services/Endpoint'
import toast from 'react-hot-toast'

function RecentPost() {
   const navigate = useNavigate()
   const [posts, setPosts] = useState([])
   const [loading, setLoading] = useState(true)

   const handleNavigate = (id) => {
      navigate(`/post/${id}`)
   }

   const Getpost = async () => {
      try {
         setLoading(true)
         const response = await get('/blog/getpost')
         console.log('Posts response:', response.data) // Debug log
         
         if (response.data.success) {
            setPosts(response.data.posts || [])
         } else {
            console.error('Failed to fetch posts:', response.data.message)
            toast.error(response.data.message || 'Failed to fetch posts')
         }
      } catch (error) {
         console.error('Error fetching posts:', error)
         toast.error(error.response?.data?.message || 'Failed to fetch posts')
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      Getpost()
   }, [])

   if (loading) {
      return (
         <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
               <span className="visually-hidden">Loading...</span>
            </div>
         </div>
      )
   }

   if (!posts || posts.length === 0) {
      return (
         <div className="text-center py-5">
            <h3 className="text-muted">No posts found</h3>
         </div>
      )
   }

   return (
      <>
         <div className='container py-5'>
            <div className='text-center mb-5'>
               <h2 className='display-4 fw-bold text-dark mb-3'>Recent Posts</h2>
               <div className='divider bg-primary mx-auto' style={{ height: '4px', width: '80px' }}></div>
            </div>
            <div className='row g-4'>
               {posts.map((post) => (
                  <div key={post._id} className='col-12 col-md-6 col-lg-4'>
                     <div
                        className='card h-100 shadow-sm border-0 overflow-hidden'
                        style={{
                           transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                           borderRadius: '12px'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
                     >
                        <div className='position-relative' style={{ height: '200px', overflow: 'hidden' }}>
                           <img
                              src={post.image ? `${BaseURL}/images/${post.image}` : 'https://via.placeholder.com/400x200?text=No+Image'}
                              className='img-fluid w-100 h-100'
                              style={{ objectFit: 'cover' }}
                              alt={post.title}
                              onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                              }}
                           />
                        </div>
                        <div className='card-body p-4'>
                           <h5 className='card-title fw-bold mb-3'>{post.title}</h5>
                           <p className='card-text text-muted mb-4' style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                           }}>
                              {post.description || post.desc}
                           </p>
                           <button
                              className='btn btn-primary px-4 py-2 w-100'
                              style={{
                                 borderRadius: '25px',
                                 fontWeight: '500',
                                 letterSpacing: '0.5px'
                              }}
                              onClick={() => handleNavigate(post._id)}
                           >
                              Read Article
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </>
   )
}

export default RecentPost