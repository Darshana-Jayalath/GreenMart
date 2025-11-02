// src/App.tsx
import React, { useState } from "react";
import FarmerDashboard from "./pages/Dashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import FarmerMarketWebsite from "./components/FarmerMarketWebsite";

const App: React.FC = () => {
  const [view, setView] = useState<
    "landing" | "farmer" | "buyer" | "login" | "register"
  >("landing");

  const [loggedInEmail, setLoggedInEmail] = useState<string>("");

  // Logout handler
  const handleLogout = () => {
    setView("login");
    setLoggedInEmail("");
  };

  // Navigation handlers
  const switchToRegister = () => setView("register");
  const switchToLogin = () => setView("login");
  const switchToLanding = () => setView("landing");

  // After successful login (role, email)
  const handleLoginSuccess = (role: string, email: string) => {
    setLoggedInEmail(email);
    if (role.toLowerCase() === "farmer") setView("farmer");
    else setView("buyer");
  };

  return (
    <>
      {/* Landing page */}
      {view === "landing" && (
        <FarmerMarketWebsite
          onLoginClick={switchToLogin}
        />
      )}

      {/* Farmer Dashboard */}
      {view === "farmer" && (
        <FarmerDashboard
          onLogout={handleLogout}
          farmerEmail={loggedInEmail}
          farmerName={""}
        />
      )}

      {/* Buyer Dashboard */}
      {view === "buyer" && (
        <BuyerDashboard onLogout={handleLogout} buyerEmail={loggedInEmail} />
      )}

      {/* Login Page (with working close) */}
      {view === "login" && (
        <Login
          switchForm={switchToRegister}
          onLoginSuccess={handleLoginSuccess}
          onClose={switchToLanding}
        />
      )}

      {/* Register Page (with working close) */}
      {view === "register" && (
        <Register
          switchForm={switchToLogin}
          onClose={switchToLanding}
        />
      )}
    </>
  );
};

export default App;
