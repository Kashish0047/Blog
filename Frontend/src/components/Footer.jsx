import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>About Us</h5>
            <p className="text-muted">
              A platform for sharing knowledge, experiences, and stories through blog posts.
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-muted text-decoration-none">Home</Link></li>
              <li><Link to="/login" className="text-muted text-decoration-none">Login</Link></li>
              <li><Link to="/register" className="text-muted text-decoration-none">Register</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Contact</h5>
            <ul className="list-unstyled text-muted">
              <li>Email: contact@blog.com</li>
              <li>Phone: +1 234 567 890</li>
              <li>Address: 123 Blog Street, City</li>
            </ul>
          </div>
        </div>
        <hr className="my-4 bg-secondary" />
        <div className="text-center text-muted">
          <small>&copy; {new Date().getFullYear()} Blog Platform. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 