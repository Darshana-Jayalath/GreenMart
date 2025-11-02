import React from "react";
import "../styles/BuyerSidebar.css";
import logo from "../assets/img/GreenCart.png";

interface BuyerSidebarProps {
  buyerName: string;  // User name
  buyerEmail: string; // Email
  onSelect: (tab: "dashboard" | "products" | "cart" | "orders" | "messages" | "settings") => void;
}

const BuyerSidebar: React.FC<BuyerSidebarProps> = ({ buyerEmail, onSelect }) => {
  return (
    <aside className="buyer-sidebar">
      <div className="sidebar-header">
       

        {/* ✅ Added Logo Here */}
     <img src={logo} alt="GreenCart Logo" className="sidebar-logo" />


        {/*<p className="sidebar-email">{buyerEmail}</p> */}
      </div>

      <nav className="sidebar-nav">
        <button onClick={() => onSelect("dashboard")} className="sidebar-link">Dashboard</button>
        <button onClick={() => onSelect("products")} className="sidebar-link">Products</button>
        <button onClick={() => onSelect("cart")} className="sidebar-link">Cart</button>
        <button onClick={() => onSelect("orders")} className="sidebar-link">Orders</button>
        <button onClick={() => onSelect("messages")} className="sidebar-link">Messages</button>
        <button onClick={() => onSelect("settings")} className="sidebar-link">Settings</button>
      </nav>
    </aside>
  );
};

export default BuyerSidebar;
