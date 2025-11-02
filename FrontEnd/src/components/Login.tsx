import React, { useState } from "react";
import api from "../api/users";
import "../styles/loginregister.css";
import { FaTimes } from "react-icons/fa";
import logo from "../assets/img/GreenCart.png";

interface LoginProps {
  switchForm: () => void;
  onLoginSuccess: (role: string, email: string) => void;
  onClose: () => void; // ✅ New prop to go back to FarmerMarketWebsite
}

const Login: React.FC<LoginProps> = ({ switchForm, onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [emailValid, setEmailValid] = useState(true);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    setEmailValid(isEmailValid);

    if (!email || !password || !isEmailValid) {
      setMessage("Please fill all fields correctly.");
      return;
    }

    try {
      const response = await api.post("/login", { email, password });
      const user = response.data;

      if (!user.role) {
        setMessage("User role not found. Contact admin.");
        return;
      }

      setMessage(`✅ Login successful as ${user.role}`);
      setEmail("");
      setPassword("");

      onLoginSuccess(user.role, user.email);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Invalid credentials.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <img src={logo} alt="Farmer Market Logo" className="logo" />


        <h2>Welcome Back!</h2>
        <p className="subtitle">Login to continue shopping..</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            className={email ? (emailValid ? "valid" : "invalid") : ""}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailValid(validateEmail(e.target.value));
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="main-btn">Login</button>
        </form>

        {message && (
          <p className={`message ${message.startsWith("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <div className="toggle-link" onClick={switchForm}>
          Don't have an account? <span>Register</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
