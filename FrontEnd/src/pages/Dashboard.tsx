// src/pages/FarmerDashboard.tsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ProductPanel from "../components/ProductPanel";
import FarmerOrdersPanel from "../components/FarmerOrdersPanel";
import FarmerMessagePanel from "../components/FarmerMessagePanel";
import "../styles/Dashboard.css";

interface DashboardProps {
  onLogout: () => void;
  farmerEmail: string;
  farmerName: string;
}

const FarmerDashboard: React.FC<DashboardProps> = ({ onLogout, farmerEmail, farmerName }) => {
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "messages" | "settings">("products");

  const renderContent = () => {
    switch (activeTab) {
      case "products":
        return <ProductPanel />;
      case "orders":
        return <FarmerOrdersPanel />;
      case "messages":
        return <FarmerMessagePanel farmerEmail={farmerEmail} farmerName={farmerName} />;
      case "settings":
        return <div className="panel-placeholder">Settings Panel Coming Soon...</div>;
      default:
        return <div className="panel-placeholder">Select a Section</div>;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar onSelect={(tab) => setActiveTab(tab)} farmerEmail={farmerEmail} />
      <div className="main-content">
        <Topbar farmerName={farmerName} onLogout={onLogout} />
        <div className="content-area">{renderContent()}</div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
