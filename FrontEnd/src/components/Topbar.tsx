import React, { useState, useEffect } from "react";
import "../styles/Topbar.css";
import { FaBell, FaSignOutAlt, FaSearch, FaTimes } from "react-icons/fa";
import api from "../api/axiosConfig";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
}

interface Props {
  farmerName: string;
  onLogout: () => void;
  onViewProduct?: (product: Product) => void;
}

const Topbar: React.FC<Props> = ({ farmerName, onLogout, onViewProduct }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await api.get("/products");
        const filtered = res.data.filter((p: Product) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      } catch (err) {
        console.error("Search error:", err);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="dashboard-title"></h2>
        <div className="search-bar-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button className="clear-btn" onClick={handleClear}>
              <FaTimes />
            </button>
          )}
          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map((product) => (
                <li key={product.id} className="search-result-item">
                  {product.imageUrl && (
                    <img
                      src={`http://localhost:8080${product.imageUrl}`}
                      alt={product.name}
                      className="result-img"
                    />
                  )}
                  <div className="result-info">
                    <span className="product-name">{product.name}</span>
                    <span className="product-category">{product.category}</span>
                    <span className="product-price">{product.price.toFixed(2)} LKR</span>
                  </div>
                  <button
                    className="view-btn"
                    onClick={() => onViewProduct && onViewProduct(product)}
                  >
                    Available
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="topbar-right">
        <span className="farmer-name">Hi, {farmerName}</span>
        <button className="icon-btn" title="Orders">
   
        </button>
        <button className="icon-btn" title="Notifications">
          <FaBell />
          <span className="notif-dot"></span>
        </button>
        <button
          className="icon-btn logout"
          title="Logout"
          onClick={() => {
            const confirmLogout = window.confirm("Do you want to log out?");
            if (confirmLogout) onLogout();
          }}
        >
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
