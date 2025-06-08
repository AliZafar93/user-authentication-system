import "./SignUp.css";
import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import piaLogo from "../../assets/pia-logo.png";
import api from "../../services/api.jsx";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handle = (e) => {
    setError("");
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", { name, email, password });
      window.location = "/LoginPage";
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <section id="signup-page">
      <div className="signup-container">
        <div className="signup-left">
          <img src={piaLogo} alt="PIA Logo" className="pia-logo" />
          <div className="plane-icon">✈</div>
          <h2>Airline Information Management System</h2>
        </div>

        <div className="signup-right">
          <h2>Sign Up</h2>
          {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
          <form onSubmit={handleSignUp}>
            <label>Name</label>
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={handle}
              required
            />

            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handle}
              required
            />

            <label>Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handle}
              required
            />

            <div className="show-password">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((prev) => !prev)}
              />
              <label>Show Password</label>
            </div>

            <button type="submit">Sign Up</button>
          </form>

          <p>
            Already have an account? <Link to="/LoginPage">Log in</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
