import React, { useState, useEffect, useRef } from "react";
import "../styles/BuyerTopbar.css";
import {
  FaBell,
  FaSignOutAlt,
  FaSearch,
  FaTimes,
  FaShoppingCart,
} from "react-icons/fa";
import api from "../api/axiosConfig";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
}

interface Notification {
  id: number;
  type: "order" | "message";
  content: string;
  createdAt: string;
}

interface Props {
  buyerName: string;
  onLogout: () => void;
  onSearch?: (query: string) => void;
}

const BuyerTopbar: React.FC<Props> = ({ buyerName, onLogout, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch search results
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

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications/recent");
        setNotifications(res.data);
      } catch (err) {
        console.error("Notification fetch error:", err);
      }
    };
    fetchNotifications();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      await api.post("/cart/add", { productId: product.id, buyerName });
      alert(`${product.name} added to cart`);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    if (onSearch) onSearch("");
  };

  const handleLogoutConfirm = () => setShowLogoutConfirm(true);
  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const orderNotifications = notifications.filter((n) => n.type === "order");
  const messageNotifications = notifications.filter(
    (n) => n.type === "message"
  );

  return (
    <header className="buyer-topbar">
      <div className="topbar-left">
        <div className="search-bar-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
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
                    <span className="product-price">
                      {product.price.toFixed(2)} LKR
                    </span>
                  </div>
                  <button
                    className="add-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    <FaShoppingCart /> Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="topbar-right">
        <span className="buyer-name">Hi, {buyerName}</span>

        <div className="notification-wrapper" ref={dropdownRef}>
          <button
            className={`icon-btn ${notifications.length > 0 ? "has-notify" : ""}`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            {notifications.length > 0 && (
              <span className="notify-badge">{notifications.length}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <h4>Notifications</h4>
              <div className="notification-section">
                <h5>🛒 Orders</h5>
                {orderNotifications.length === 0 ? (
                  <p className="no-notify">No order notifications</p>
                ) : (
                  <ul>
                    {orderNotifications.map((n) => (
                      <li key={n.id}>
                        {n.content}
                        <div className="notify-time">
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="notification-section">
                <h5>💬 Messages</h5>
                {messageNotifications.length === 0 ? (
                  <p className="no-notify">No messages</p>
                ) : (
                  <ul>
                    {messageNotifications.map((n) => (
                      <li key={n.id}>
                        {n.content}
                        <div className="notify-time">
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        <button className="icon-btn logout" onClick={handleLogoutConfirm}>
          <FaSignOutAlt />
        </button>
      </div>

      {showLogoutConfirm && (
        <div className="logout-modal">
          <div className="logout-box">
            <p>Are you sure you want to log out?</p>
            <div className="logout-actions">
              <button className="confirm-btn" onClick={confirmLogout}>
                Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default BuyerTopbar;
