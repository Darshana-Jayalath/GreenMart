// src/components/BuyerCheckoutPanel.tsx
import React, { useState, useEffect, useMemo } from "react";
import api from "../api/axiosConfig";
import "../styles/CheckoutPanel.css";

import type { CartProduct } from "./BuyerCartPanel";

interface Props {
  cart: CartProduct[];
  buyerEmail: string;
  onCancel: () => void;
  onPlaced: (orderId: string) => void;
}

const DELIVERY_FEE = 200;

const provinces = [
  "Western Province", "Central Province", "Southern Province", "Northern Province",
  "Eastern Province", "North Western Province", "North Central Province", "Uva Province", "Sabaragamuwa Province"
];

const districts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", 
  "Hambantota", "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu", "Batticaloa",
  "Ampara", "Trincomalee", "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa",
  "Badulla", "Monaragala", "Ratnapura", "Kegalle"
];

const BuyerCheckoutPanel: React.FC<Props> = ({ cart, buyerEmail, onCancel, onPlaced }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Cash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fill buyer address automatically if exists
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await api.get(`/address/${buyerEmail}`);
        const data = res.data;
        if (data) {
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setPhone(data.phone || "");
          setProvince(data.province || "");
          setDistrict(data.district || "");
          setCity(data.cityAddress || "");
          setAddress(data.cityAddress || "");
        }
      } catch (err) {
        console.error("Failed to load address", err);
      }
    };
    fetchAddress();
  }, [buyerEmail]);

  const subtotal = useMemo(() => cart.reduce((s, it) => s + it.price * it.quantity, 0), [cart]);
  const total = useMemo(() => subtotal + DELIVERY_FEE, [subtotal]);

  const generateOrderId = () => {
    const t = new Date();
    const stamp = t.toISOString().replace(/[-:.TZ]/g, "");
    return `ORD${stamp}-${Math.floor(Math.random() * 900 + 100)}`;
  };

  const validate = () => {
    if (!firstName || !lastName || !phone || !province || !district || !city || !address) {
      setError("⚠️ Please fill all required fields.");
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    setError(null);
    if (!validate()) return;
    if (cart.length === 0) {
      setError("🛒 Cart is empty.");
      return;
    }

    const orderId = generateOrderId();
    const payload = {
      orderId,
      buyerEmail,
      firstName,
      lastName,
      phone,
      province,
      district,
      city,
      address,
      payment,
      deliveryFee: DELIVERY_FEE,
      total,
      status: "Pending",
      items: cart.map(item => ({
        productId: item.productId ?? item.id,
        productName: item.name,
        category: item.category ?? "",
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl ?? "",
      })),
    };

    try {
      setLoading(true);
      await api.post("/orders", payload, { headers: { "Content-Type": "application/json" } });
      setLoading(false);
      onPlaced(orderId);
    } catch (err: any) {
      setLoading(false);
      console.error("❌ Order placement error:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to place order.");
    }
  };

  return (
    <div className="checkout-panel">
      <h3>Enter Shipping Details</h3>
      <div className="checkout-grid">
        <input placeholder="First name *" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input placeholder="Last name *" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input placeholder="Phone number *" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input placeholder="Email" value={buyerEmail} readOnly />
        <select value={province} onChange={(e) => setProvince(e.target.value)}>
          <option value="">Select Province *</option>
          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={district} onChange={(e) => setDistrict(e.target.value)}>
          <option value="">Select District *</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <input placeholder="City *" value={city} onChange={(e) => setCity(e.target.value)} />
        <input placeholder="Address *" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      <div className="checkout-summary">
        <div>
          <div className="row"><span>Subtotal</span><span>LKR {subtotal.toFixed(2)}</span></div>
          <div className="row"><span>Delivery fee</span><span>LKR {DELIVERY_FEE.toFixed(2)}</span></div>
          <div className="row total"><strong>Total</strong><strong>LKR {total.toFixed(2)}</strong></div>
        </div>

        <div className="payment-block">
          <label>Payment</label>
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
           
            <option>Card on delivery</option>
          
          </select>
          <div className="btn-row">
            <button className="place" onClick={placeOrder} disabled={loading}>
              {loading ? "Placing..." : "Place Order"}
            </button>
            <button className="cancel" onClick={onCancel}>Cancel</button>
          </div>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default BuyerCheckoutPanel;
