import React from 'react'
import {FaFileAlt, FaHome, FaPlusSquare} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <>
      <div className='bg-dark text-white vh-100' style={{width: '250px'}}>
         <div className='p-3'>
            <ul className='nav flex-column'>
                <li className='nav-item mb-3'>
                   <Link to={'/admin'} className='nav-link text-white'>
                   <FaHome className='me-2'/> Dashboard
                   </Link>
                </li>
                <li className='nav-item mb-3'>
                   <Link to={'/admin/addpost'} className='nav-link text-white'>
                   <FaPlusSquare className='me-2'/> Add Post
                   </Link>
                </li>
                <li className='nav-item mb-3'>
                   <Link to={'/admin/allposts'} className='nav-link text-white'>
                   <FaFileAlt className='me-2'/> All Posts
                   </Link>
                </li>
            </ul>
         </div>
      </div>
    </>
  )
}

export default Sidebar