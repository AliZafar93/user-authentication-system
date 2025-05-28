// frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom'; // For navigation buttons

export default function Home() {
  const token = localStorage.getItem('token'); // Check if user is logged in

  return (
    <div className="container">
      <div className="banner">
        <h1>Welcome to IT Solution Provider</h1>
      </div>

      <div className="section">
        <h2>Our Core Services</h2>
        <p>We specialize in delivering cutting-edge technology solutions tailored to your business needs.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
        <div className="card" style={{ flex: '1 1 300px' }}>
            <h3>Service Category 1: Mobile App Development</h3>
            <p>Cross-platform and native mobile applications that engage your users and grow your business.</p>
        </div>
        <div className="card" style={{ flex: '1 1 300px' }}>
            <h3>Service Category 2: Software Development</h3>
            <p>Custom software solutions, from web applications to enterprise-level systems, built for performance and scalability.</p>
        </div>
      </div>

      {!token && (
        <div className="section text-center" style={{marginTop: '2rem', textAlign: 'center'}}>
          <h2>Join Us or Login</h2>
          <p>Become a part of our platform or access your account.</p>
          <Link to="/signup" style={{marginRight: '1rem'}}>
            <button>Sign Up</button>
          </Link>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      )}

      {token && (
         <div className="section text-center" style={{marginTop: '2rem', textAlign: 'center'}}>
          <h2>Manage Your Information</h2>
          <p>View and update your personal details.</p>
          <Link to="/profile">
            <button>Go to My Profile</button>
          </Link>
        </div>
      )}
    </div>
  );
}
