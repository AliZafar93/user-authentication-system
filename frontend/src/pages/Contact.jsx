// frontend/src/pages/Contact.js
import React from 'react';

export default function Contact() {
  return (
    <div className="container">
      <h2>Contact Us</h2>
      <p>If you have any questions or inquiries, feel free to reach out to us through the following channels:</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}> {/* Added flexWrap and marginTop */}
        <div className="card" style={{ flex: '1 1 300px' }}> {/* Responsive flex basis */}
          <h3>Sales Department</h3>
          <p><strong>Email:</strong> sales@example.com</p>
          <p><strong>Phone:</strong> +92 336 5656445 (As per PDF)</p>
          <p>For product inquiries, demos, and partnership opportunities.</p>
        </div>
        <div className="card" style={{ flex: '1 1 300px' }}> {/* Responsive flex basis */}
          <h3>Support Team</h3>
          <p><strong>Email:</strong> junaid@yahoo.com (As per PDF)</p>
          <p><strong>Phone:</strong> +92 332 5655655 (As per PDF)</p>
          <p>For technical assistance, bug reports, and service questions.</p>
        </div>
      </div>
    </div>
  );
}
