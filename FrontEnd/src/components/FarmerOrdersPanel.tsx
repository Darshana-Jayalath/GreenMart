// src/components/FarmerOrdersPanel.tsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/FarmerOrdersPanel.css";

interface OrderItem {
  id?: number;
  productId?: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

interface Order {
  id?: number;
  orderId: string;
  buyerEmail: string;
  firstName: string;
  lastName: string;
  phone: string;
  province?: string;
  district?: string;
  city?: string;
  address?: string;
  payment?: string;
  deliveryFee?: number;
  total?: number;
  status?: string;
  orderDate?: string;
  items?: OrderItem[];
}

const FarmerOrdersPanel: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch pending orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.get("/orders/pending");
      console.log("Fetched orders:", res.data); // debug log
      if (Array.isArray(res.data) && res.data.length > 0) {
        setOrders(res.data);
      } else {
        setOrders([]);
        setMessage("No pending orders.");
      }
    } catch (err) {
      console.error("Failed to load pending orders", err);
      setMessage("❌ Failed to load pending orders. Check backend or network.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Confirm an order
  const confirmOrder = async (orderId: string) => {
    if (!window.confirm("Confirm this order?")) return;
    try {
      const res = await api.put(`/orders/status/${orderId}?status=Confirmed`);
      console.log("Order confirmed:", res.data);
      setMessage(`✅ Order ${orderId} confirmed.`);
      fetchOrders(); // refresh list after confirming
    } catch (err) {
      console.error("Failed to confirm order", err);
      setMessage(`❌ Failed to confirm order ${orderId}.`);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "—" : d.toLocaleString();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="farmer-orders">
      <h3>Pending Orders</h3>

      {message && <p className="message">{message}</p>}
      {loading && <p className="loading">Loading orders...</p>}

      <div className="orders-grid">
        {orders.map((o) => (
          <div className="order-card" key={o.orderId || o.id}>
            <div className="order-head">
              <div>
                <strong>{o.orderId || "N/A"}</strong>
                <div className="muted">{formatDate(o.orderDate)}</div>
              </div>
              <div className={`status ${o.status?.toLowerCase() || "pending"}`}>
                {o.status || "Pending"}
              </div>
            </div>

            <div className="order-address">
              <div>
                <strong>{o.firstName} {o.lastName}</strong> • {o.phone}
              </div>
              <div className="muted">
                {[o.province, o.district, o.city].filter(Boolean).join(" / ")}
              </div>
              <div className="muted">{o.address}</div>
            </div>

            <div className="items-list">
              {o.items && o.items.length > 0 ? (
                o.items.map((it, idx) => (
                  <div className="item-row" key={idx}>
                    <div className="item-img">
                      {it.imageUrl ? (
                        <img
                          src={it.imageUrl.startsWith("http") ? it.imageUrl : `http://localhost:8080${it.imageUrl}`}
                          alt={it.productName}
                        />
                      ) : (
                        <div className="placeholder" />
                      )}
                    </div>
                    <div className="item-info">
                      <div className="name">{it.productName}</div>
                      <div className="qty">x{it.quantity}</div>
                    </div>
                    <div className="item-price">
                      LKR {(it.price * it.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="muted small">No items in this order.</div>
              )}
            </div>

            <div className="order-footer">
              <div className="totals">
                <div>Delivery: LKR {(o.deliveryFee ?? 0).toFixed(2)}</div>
                <div className="grand">Total: LKR {(o.total ?? 0).toFixed(2)}</div>
              </div>
              <div className="order-actions">
                {o.status?.toLowerCase() === "pending" && (
                  <button className="confirm-btn" onClick={() => confirmOrder(o.orderId)}>
                    Confirm
                  </button>
                )}
                {o.status?.toLowerCase() === "confirmed" && (
                  <span className="confirmed-text">Confirmed ✅</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmerOrdersPanel;
