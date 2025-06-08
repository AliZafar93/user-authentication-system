import "./Login.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import piaLogo from "../../assets/pia-logo.png";
import api from "../../services/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      window.location = "/Home";
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section id="login-page">
      <div className="login-container">
        <div className="login-left">
          <img src={piaLogo} alt="PIA Logo" className="pia-logo" />
          <div className="plane-icon">✈</div>
          <h2>Crew Operation & Roster Generation</h2>
        </div>

        <div className="login-right">
          <h2>Login</h2>
          {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="show-password">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>

            <button type="submit">Login</button>

            <p>
              Create an account? <Link to="/SignupPage">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;