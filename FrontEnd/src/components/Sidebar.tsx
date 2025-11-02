import React from "react";
import "../styles/Sidebar.css";
import logo from "../assets/img/GreenCart.png";

type Tab = "products" | "orders" | "messages" | "settings";

interface SidebarProps {
  onSelect: (tab: Tab) => void;
  farmerEmail?: string; // optional email to show under title
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect, farmerEmail }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">

         <img src={logo} alt="GreenCart Logo" className="sidebar-logo" />


        {farmerEmail && <p className="sidebar-email">{farmerEmail}</p>}
      </div>
      <nav className="sidebar-nav">
        <button onClick={() => onSelect("products")} className="sidebar-link">
          Products
        </button>
        <button onClick={() => onSelect("orders")} className="sidebar-link">
          Orders
        </button>
        <button onClick={() => onSelect("messages")} className="sidebar-link">
          Messages
        </button>
        <button onClick={() => onSelect("settings")} className="sidebar-link">
          Settings
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
