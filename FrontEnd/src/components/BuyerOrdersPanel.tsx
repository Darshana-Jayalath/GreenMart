// src/components/BuyerOrdersPanel.tsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/BuyerOrdersPanel.css";

interface OrderItemDTO {
  id?: number;
  productId?: number;
  productName?: string;
  category?: string;
  price?: number;
  quantity?: number;
  imageUrl?: string;
}

interface OrderDTO {
  orderId: string;
  buyerEmail: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  province?: string;
  district?: string;
  city?: string;
  address?: string;
  payment?: string;
  deliveryFee?: number;
  total?: number;
  status?: string;
  orderDate?: string | null;
  items?: OrderItemDTO[] | null;
}

interface Props {
  buyerEmail: string;
  refreshKey?: number;
}

const BuyerOrdersPanel: React.FC<Props> = ({ buyerEmail, refreshKey = 0 }) => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const fetchOrders = async () => {
    if (!buyerEmail) {
      console.warn("⚠️ No buyer email provided — cannot fetch orders");
      setMessage("No email detected. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      console.log("📦 Fetching orders for:", buyerEmail);
      const res = await api.get(`/orders/buyer/${encodeURIComponent(buyerEmail)}`);
      console.log("✅ API Response:", res.data);

      const formattedOrders: OrderDTO[] = (Array.isArray(res.data) ? res.data : []).map((o: any) => ({
        orderId: o.orderId || o.order_id,
        buyerEmail: o.buyerEmail || o.buyer_email,
        firstName: o.firstName || o.first_name,
        lastName: o.lastName || o.last_name,
        phone: o.phone,
        province: o.province,
        district: o.district,
        city: o.city,
        address: o.address,
        payment: o.payment,
        deliveryFee: o.deliveryFee || o.delivery_fee,
        total: o.total,
        status: o.status,
        orderDate: o.orderDate || o.order_date,
        items: Array.isArray(o.items)
          ? o.items.map((item: any) => ({
              id: item.id,
              productId: item.productId || item.product_id,
              productName: item.productName || item.product_name,
              category: item.category,
              price: item.price,
              quantity: item.quantity,
              imageUrl: item.imageUrl || item.image_url,
            }))
          : [],
      }));

      setOrders(formattedOrders);
      setMessage(formattedOrders.length === 0 ? "No orders yet." : "");
    } catch (err) {
      console.error("❌ Failed to load orders:", err);
      setMessage("Failed to load your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [buyerEmail, refreshKey]);

  const cancelOrder = async (orderId: string) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await api.delete(`/orders/cancel/${orderId}`);
      setMessage("✅ Order cancelled successfully.");
      fetchOrders();
    } catch (err) {
      console.error("Cancel failed", err);
      setMessage("❌ Failed to cancel order.");
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "—" : d.toLocaleString();
  };

  return (
    <div className="buyer-orders">
      <h3>Your Orders</h3>
      {loading && <p className="loading">Loading your orders...</p>}
      {message && <p className="message">{message}</p>}

      <div className="orders-grid">
        {orders.map((o) => (
          <div className="order-card" key={o.orderId}>
            <div className="order-head">
              <div>
                <strong>{o.orderId}</strong>
                <div className="muted">{formatDate(o.orderDate)}</div>
              </div>
              <div className={`status ${o.status?.toLowerCase() || "pending"}`}>
                {o.status || "Pending"}
              </div>
            </div>

            <div className="order-address">
              <div>
                <strong>{o.firstName ?? ""} {o.lastName ?? ""}</strong> • {o.phone ?? ""}
              </div>
              <div className="muted">
                {[o.province, o.district, o.city].filter(Boolean).join(" / ")}
              </div>
              <div className="muted">{o.address ?? ""}</div>
            </div>

            <div className="items-list">
              {o.items && o.items.length > 0 ? (
                o.items.map((item, idx) => (
                  <div className="item-row" key={idx}>
                    <div className="item-img">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl.startsWith("http") ? item.imageUrl : `http://localhost:8080${item.imageUrl}`}
                          alt={item.productName ?? "Product"}
                        />
                      ) : (
                        <div className="placeholder" />
                      )}
                    </div>
                    <div className="item-info">
                      <div className="name">{item.productName ?? ""}</div>
                      <div className="qty">x{item.quantity ?? 0}</div>
                    </div>
                    <div className="item-price">
                      LKR {((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
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
                {o.status === "Pending" && (
                  <button className="cancel-btn" onClick={() => cancelOrder(o.orderId)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerOrdersPanel;
