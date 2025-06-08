import "./AddFlightForm.css";
import { useState } from "react";

const initialState = {
  "Flight No": "",
  "Dep Port": "",
  "Arr Port": "",
  "AC Type": "",
  "Status": "",
  "Dep Time": "",
  "Arr Time": "",
  "Valid From": "",
  "Valid Until": "",
  "DOW": "",
  "Reporting Group": ""
};

const AddFlightForm = ({ onAdd }) => {
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some(v => !v)) {
      alert("Please fill all fields.");
      return;
    }
    onAdd(form);
    setForm(initialState);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-green-100 p-6 rounded-lg text-center max-w-xl mx-auto mt-4"
    >
      <h2 className="text-3xl font-bold text-green-900 mb-6">Add Flight Manually</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.keys(initialState).map((key) => (
          <div key={key} className="flex flex-col items-start">
            <label className="font-semibold text-green-900 mb-1">{key}</label>
            <input
              type="text"
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
              required
            />
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="w-full bg-green-800 text-white rounded py-2 text-lg font-semibold"
      >
        Add Flight
      </button>
    </form>
  );
}

export default AddFlightForm;