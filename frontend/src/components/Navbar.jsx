// frontend/src/components/NavBar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // Check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    localStorage.removeItem('user'); // Remove user info if stored
    navigate('/login'); // Redirect to login
    // Optionally, you might want to refresh the page or update global state
    // window.location.reload(); // Simple way to ensure UI updates
  };

  return (
    <nav className="navbar">
      <div className="container">
        <NavLink className="navbar-brand" to="/">MERN App</NavLink>
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink> {/* 'end' prop for exact match on root */}
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {token ? (
            <>
              <NavLink to="/profile">My Profile</NavLink> {/* Corresponds to PersonalInfo page */}
              <button onClick={handleLogout} className="nav-logout-btn" style={{background: 'transparent', color: 'white', border: '1px solid white', marginLeft: '1rem', padding: '0.4rem 0.8rem', cursor: 'pointer'}}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/signup">Sign Up</NavLink>
              <NavLink to="/login">Login</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
