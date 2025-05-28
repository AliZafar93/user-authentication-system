  // frontend/src/pages/PersonalInfo.js
  import React, { useState, useEffect, useCallback } from 'react';
  import api from '../services/api'; // Axios instance

  export default function PersonalInfo() {
    const [list, setList] = useState([]);
    const [form, setForm] = useState({ firstName: '', lastName: '', address: '', phone: '' });
    const [editingId, setEditingId] = useState(null); // To track which item is being edited
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');


    const fetchAll = useCallback(async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/personal'); // Endpoint for personal info
        setList(res.data);
      } catch (err) {
        console.error("Fetch PersonalInfo error:", err);
        setError(err.response?.data?.message || 'Failed to fetch personal information. You might need to login again.');
        if (err.response?.status === 401) { // Unauthorized
          // Optionally redirect to login or clear token
          // localStorage.removeItem('token');
          // navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    }, []); // Empty dependency array, fetchAll is stable

    useEffect(() => {
      fetchAll();
    }, [fetchAll]); // useEffect depends on fetchAll

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
      setFormError(''); // Clear form error on change
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError('');
      if (!form.firstName || !form.lastName) {
          setFormError('First name and last name are required.');
          return;
      }
      setLoading(true);
      try {
        if (editingId) {
          // Update existing item
          await api.put(`/personal/${editingId}`, form);
        } else {
          // Create new item
          await api.post('/personal', form);
        }
        // Reset form and editing state, then refresh list
        setForm({ firstName: '', lastName: '', address: '', phone: '' });
        setEditingId(null);
        fetchAll(); // Refresh the list
      } catch (err) {
        console.error("Submit PersonalInfo error:", err);
        setFormError(err.response?.data?.message || 'Failed to save information.');
      } finally {
        setLoading(false);
      }
    };

    const startEdit = (pi) => {
      setEditingId(pi._id);
      setForm({
        firstName: pi.firstName,
        lastName: pi.lastName,
        address: pi.address || '', // Ensure address and phone are not undefined
        phone: pi.phone || ''
      });
      setFormError('');
      window.scrollTo(0, 0); // Scroll to top to see the form
    };

    const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this information?')) {
        setLoading(true);
        try {
          await api.delete(`/personal/${id}`);
          fetchAll(); // Refresh the list
        } catch (err) {
          console.error("Delete PersonalInfo error:", err);
          setError(err.response?.data?.message || 'Failed to delete information.');
        } finally {
          setLoading(false);
        }
      }
    };

    const cancelEdit = () => {
      setEditingId(null);
      setForm({ firstName: '', lastName: '', address: '', phone: '' });
      setFormError('');
    }

    return (
      <div className="auth-page"> {/* Using auth-page for consistent padding */}
        <div className="auth-container" style={{maxWidth: '700px'}}> {/* Wider container for this page */}
          <h2>My Personal Information</h2>
          {error && <div className="error-message" style={{textAlign: 'center'}}>{error}</div>}

          <form onSubmit={handleSubmit} className="card"> {/* Form styled as a card */}
            <h3>{editingId ? 'Update Information' : 'Add New Information'}</h3>
            {formError && <p className="error-message">{formError}</p>}
            <div>
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="address">Address:</label>
              <textarea
                name="address"
                id="address"
                placeholder="Address (Optional)"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone">Phone:</label>
              <input
                type="text" /* Consider type="tel" for better mobile UX */
                name="phone"
                id="phone"
                placeholder="Phone (Optional)"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingId ? 'Update Info' : 'Add Info')}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} disabled={loading} className="btn-secondary" style={{marginLeft: '10px'}}>
                Cancel Edit
              </button>
            )}
          </form>

          <div className="personal-info-list">
            <h3>Stored Information</h3>
            {loading && !list.length && <p>Loading information...</p>}
            {!loading && !list.length && !error && <p>No personal information found. Add some using the form above.</p>}
            {list.map((pi) => (
              <div key={pi._id} className="card">
                <div>
                  <strong>{pi.firstName} {pi.lastName}</strong><br />
                  {pi.address && <>Address: {pi.address}<br /></>}
                  {pi.phone && <>Phone: {pi.phone}<br /></>}
                  <small>Last updated: {new Date(pi.updatedAt).toLocaleDateString()}</small>
                </div>
                <div className="actions">
                  <button onClick={() => startEdit(pi)} disabled={loading} className="btn-secondary">Edit</button>
                  <button onClick={() => handleDelete(pi._id)} disabled={loading} className="btn-danger">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
