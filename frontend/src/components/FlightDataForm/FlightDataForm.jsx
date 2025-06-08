import "./FlightDataForm.css";
import { useState, useRef } from "react";

// Define the fields for a flight
const flightFields = [
  "Flight No",
  "Dep Port",
  "Arr Port",
  "AC Type",
  "Status",
  "Dep Time",
  "Arr Time",
  "Valid From",
  "Valid Until",
  "DOW",
  "Reporting Group"
];

const initialFlight = Object.fromEntries(flightFields.map(f => [f, ""]));

const FlightDataForm = ({ onAddFlight }) => {
  const [showCard, setShowCard] = useState(false);
  const [form, setForm] = useState(initialFlight);
  const modalRef = useRef(null);

  // Handle form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some(v => !v)) {
      alert("Please fill all fields.");
      return;
    }
    onAddFlight(form);
    setForm(initialFlight);
    setShowCard(false);
  };

  // Handle click outside modal
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowCard(false);
    }
  };

  return (
    <div>
      {!showCard && (
        <div className="flightdata-crud-container" style={{ maxWidth: 600, margin: "20px auto", textAlign: "center" }}>
          <h2 className="flightdata-crud-title">Add Flight Info</h2>
          <button
            className="flightdata-crud-add-btn"
            style={{ width: "100%", fontSize: "1.3rem", padding: "18px 0", marginTop: "18px" }}
            onClick={() => setShowCard(true)}
          >
            Add New Flight
          </button>
        </div>
      )}

      {showCard && (
        <div
          className="flightdata-crud-modal-bg"
          onClick={handleOverlayClick}
        >
          <div
            className="flightdata-crud-modal"
            ref={modalRef}
          >
            <button
              className="flightdata-crud-modal-close"
              onClick={() => setShowCard(false)}
              title="Close"
            >
              &times;
            </button>
            <h2 className="flightdata-crud-title" style={{ marginBottom: 24 }}>Add Flight Info</h2>
            <form onSubmit={handleSubmit}>
              {flightFields.map(field => (
                <div key={field} className="flightdata-crud-form-group">
                  <label className="flightdata-crud-form-label">{field}</label>
                  <input
                    type="text"
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="flightdata-crud-form-input"
                    required
                  />
                </div>
              ))}
              <button
                type="submit"
                className="flightdata-crud-save-btn"
                style={{ marginTop: 16 }}
              >
                Save Flight
              </button>
              <button
                type="button"
                className="flightdata-crud-add-btn"
                style={{ background: "#888", marginLeft: 8, marginTop: 16 }}
                onClick={() => setShowCard(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlightDataForm;