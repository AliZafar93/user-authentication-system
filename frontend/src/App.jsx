// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import NavBar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PersonalInfo from './pages/PersonalInfo'; // This is the "profile" page

import './App.css'; // Main stylesheet

// ProtectedRoute component to guard routes that require authentication
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    // If no token, redirect to login page
    // Pass the current location to redirect back after login (optional)
    return <Navigate to="/login" replace />;
  }
  return children; // If token exists, render the children components
};

// PublicOnlyRoute component to guard routes like login/signup for logged-in users
const PublicOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    // If token exists (user is logged in), redirect to profile or home
    return <Navigate to="/profile" replace />;
  }
  return children; // If no token, render the login/signup page
};


export default function App() {
  return (
    <Router>
      <NavBar />
      <main className="container"> {/* Main content wrapper */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Public Only Routes (e.g., login, signup should not be accessible if already logged in) */}
          <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PersonalInfo />
              </ProtectedRoute>
            }
          />
          
          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
