import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/BuyerSettingsPanel.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface Props {
  buyerEmail: string;
  
}

const BuyerSettingsPanel: React.FC<Props> = ({ buyerEmail }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [existingPassword, setExistingPassword] = useState("");

  // Fetch current user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${buyerEmail}`);
        setName(res.data.name);
        setEmail(res.data.email);
        setPassword(res.data.password);
        setConfirmPassword(res.data.password);
        setExistingPassword(res.data.password);
      } catch (err) {
        console.error("Failed to fetch user", err);
        setMessage("Failed to load user details");
      }
    };
    fetchUser();
  }, [buyerEmail]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleUpdate = async () => {
    setError("");
    setMessage("");

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password && password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        email,
        password: password || existingPassword,
      };

      await api.put(`/users/update/${buyerEmail}`, payload);

      setMessage("Profile updated successfully!");
      setExistingPassword(payload.password);
    } catch (err) {
      console.error(err);
      setError("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buyer-settings-wrapper">
      <h2>Account Settings</h2>
      {error && <p className="status-message error">{error}</p>}
      {message && <p className="status-message success">{message}</p>}

      <div className="update-form">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />

        <label>Password</label>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        <label>Confirm Password</label>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="update-btn"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default BuyerSettingsPanel;
