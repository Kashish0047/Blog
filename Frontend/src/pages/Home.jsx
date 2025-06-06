import React from 'react';
import RecentPost from '../components/RecentPost';

function Home() {
  return (
    <div className="sports-blog">
      {/* Hero Section with Sports Theme */}
      <div 
        className="position-relative text-white overflow-hidden" 
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          padding: '120px 0',
          minHeight: '100vh'
        }}
      >
        <div className="container text-center py-5">
          <h1 className="display-3 fw-bold mb-4 text-uppercase" style={{ 
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            letterSpacing: '2px'
          }}>
            Sports <span className="text-warning">Chronicle</span>
          </h1>
          <p className="lead mb-4" style={{ 
            maxWidth: '700px', 
            margin: '0 auto',
            fontSize: '1.5rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
          }}>
            Where Passion Meets the Game
          </p>
          <a 
            href="#latest" 
            className="btn btn-warning btn-lg px-5 py-3 fw-bold mt-3"
            style={{
              borderRadius: '50px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 7px 20px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            EXPLORE LATEST
          </a>
        </div>
      </div>

      {/* Latest Posts Section */}
      <div id="latest" className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <RecentPost />
        </div>
      </div>

      {/* Newsletter Section */}
      <div 
        className="py-5 text-white" 
        style={{
          background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="display-6 fw-bold mb-3">Never Miss a Beat</h2>
              <p className="lead mb-4">Subscribe to get the latest sports news and updates delivered to your inbox</p>
              <div className="row g-2 justify-content-center">
                <div className="col-md-8">
                  <input 
                    type="email" 
                    className="form-control form-control-lg border-0" 
                    placeholder="Your email address"
                    style={{ 
                      borderRadius: '50px',
                      padding: '12px 25px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
                <div className="col-md-auto">
                  <button 
                    className="btn btn-warning btn-lg w-100 fw-bold"
                    style={{ 
                      borderRadius: '50px',
                      padding: '12px 30px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 7px 20px rgba(0,0,0,0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                    }}
                  >
                    SUBSCRIBE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;