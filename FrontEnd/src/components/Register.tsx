import React, { useState } from "react";
import api from "../api/users";
import "../styles/loginregister.css";
import { FaTimes } from "react-icons/fa";
import logo from "../assets/img/GreenCart.png";

interface RegisterProps {
  switchForm: () => void;
  onClose: () => void; // ✅ go back to FarmerMarketWebsite
}

const Register: React.FC<RegisterProps> = ({ switchForm, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");

  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password: string) =>
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    setEmailValid(isEmailValid);
    setPasswordValid(isPasswordValid);

    if (!name || !email  || !role || !isEmailValid ) {
      setMessage("Please fill all fields correctly.");
      return;
    }

    try {
      await api.post("/register", { name, email, password, role });
      setMessage("✅ Registration successful!");
      setName(""); setEmail(""); setPassword(""); setRole("");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error registering user.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <img src={logo} alt="Farmer Market Logo" className="logo" />

        <h2>Create Account</h2>
        <p className="subtitle">Join our community of buyers</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            className={password ? (passwordValid ? "valid" : "invalid") : ""}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordValid(validatePassword(e.target.value));
            }}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="buyer">Buyer</option>
          </select>

          <button type="submit" className="main-btn">Register</button>
        </form>

        {message && (
          <p className={`message ${message.startsWith("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <div className="toggle-link" onClick={switchForm}>
          Already have an account? <span>Login</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
