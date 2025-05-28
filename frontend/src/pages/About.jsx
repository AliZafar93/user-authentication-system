// frontend/src/pages/About.js
import React from 'react';

export default function About() {
  return (
    <div className="container"> {/* Use .container for consistent padding */}
      <div className="about-container">
        <h2>About Us</h2>
        <p>
          We're a team dedicated to building single-page applications (SPAs)
          using the MERN (MongoDB, Express.js, React, Node.js) stack.
          This application demonstrates user authentication, CRUD operations,
          and a responsive frontend design.
        </p>
        <p>
          Our goal is to provide robust and scalable web solutions.
        </p>
      </div>
    </div>
  );
}
