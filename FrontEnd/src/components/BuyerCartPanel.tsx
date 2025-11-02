// src/components/BuyerCartPanel.tsx
import React, { useEffect, useState } from "react";
import "../styles/BuyerCartPanel.css";
import api from "../api/axiosConfig";

export interface CartProduct {
  id: number;
  productId?: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
}

export interface Address {
  id?: number;
  buyerEmail: string;
  firstName: string;
  lastName: string;
  phone: string;
  province: string;
  district: string;
  cityAddress: string;
}

interface Props {
  cart: CartProduct[];
  removeFromCart: (id: number) => void;
  onCheckout: () => void;
  onChangeQty: (id: number, qty: number) => void;
  buyerEmail: string;
}

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

const BuyerCartPanel: React.FC<Props> = ({ cart, removeFromCart, onCheckout, onChangeQty, buyerEmail }) => {
  const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);

  const [address, setAddress] = useState<Address>({
    buyerEmail,
    firstName: "",
    lastName: "",
    phone: "",
    province: "",
    district: "",
    cityAddress: ""
  });

  const [editMode, setEditMode] = useState(true); // allow add/edit initially

  // Load saved address if exists
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await api.get(`/address/${buyerEmail}`);
        if (res.data) {
          setAddress(res.data);
          setEditMode(false); // disable editing initially
        }
      } catch (err) {
        console.error("Failed to load address", err);
      }
    };
    fetchAddress();
  }, [buyerEmail]);

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAddress = async () => {
    try {
      await api.post("/address/save", address);
      alert("Address saved successfully!");
      setEditMode(false); // after save, disable editing
    } catch (err) {
      console.error("Failed to save address", err);
      alert("Failed to save address.");
    }
  };

  const handleDeleteAddress = async () => {
    if (!window.confirm("Are you sure you want to delete your saved address?")) return;
    try {
      await api.delete(`/address/${buyerEmail}`);
      setAddress({
        buyerEmail,
        firstName: "",
        lastName: "",
        phone: "",
        province: "",
        district: "",
        cityAddress: ""
      });
      setEditMode(true);
      alert("Address deleted.");
    } catch (err) {
      console.error("Failed to delete address", err);
      alert("Failed to delete address.");
    }
  };

  return (
    <div className="buyer-cart-panel">
      <h3>Your Cart</h3>
      {cart.length === 0 ? (
        <p className="empty">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-card" key={item.id}>
                <div className="cart-img-wrap">
                  {item.imageUrl ? (
                    <img src={item.imageUrl.startsWith("http") ? item.imageUrl : `http://localhost:8080${item.imageUrl}`} alt={item.name} />
                  ) : (
                    <div className="no-img">No Image</div>
                  )}
                </div>
                <div className="cart-info">
                  <h4>{item.name}</h4>
                  <p className="cat">{item.category}</p>
                  <div className="qty-row">
                    <label>Qty:</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => onChangeQty(item.id, Math.max(1, parseInt(e.target.value || "1")))}
                    />
                  </div>
                  <p className="price">LKR {(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="cart-actions">
                  <button className="remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-summary">
                <div>Total:</div>
                <div className="sum">LKR {total.toFixed(2)}</div>
              </div>
              <button className="checkout-btn" onClick={onCheckout}>Checkout</button>
            </div>
          )}
        </>
      )}

      {/* Address Form */}
      <div className="cart-address-form">
        <h4>Delivery Address</h4>
        <div className="address-actions">
          {!editMode && <button className="edit-address-btn" onClick={() => setEditMode(true)}>Edit</button>}
          {!editMode && <button className="delete-address-btn" onClick={handleDeleteAddress}>Delete</button>}
        </div>

        <div className={`address-form-fields ${editMode ? "editing" : "view"}`}>
          <div className="address-row">
            <input type="text" placeholder="First Name" value={address.firstName} disabled={!editMode} onChange={(e) => handleAddressChange("firstName", e.target.value)} />
            <input type="text" placeholder="Last Name" value={address.lastName} disabled={!editMode} onChange={(e) => handleAddressChange("lastName", e.target.value)} />
          </div>
          <div className="address-row">
            <input type="text" placeholder="Phone Number" value={address.phone} disabled={!editMode} onChange={(e) => handleAddressChange("phone", e.target.value)} />
          </div>
          <div className="address-row">
            <select value={address.province} disabled={!editMode} onChange={(e) => handleAddressChange("province", e.target.value)}>
              <option value="">Select Province</option>
              {provinces.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={address.district} disabled={!editMode} onChange={(e) => handleAddressChange("district", e.target.value)}>
              <option value="">Select District</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="address-row">
            <input type="text" placeholder="City Address" value={address.cityAddress} disabled={!editMode} onChange={(e) => handleAddressChange("cityAddress", e.target.value)} />
          </div>

          {editMode && <button className="save-address-btn" onClick={handleSaveAddress}>Save Address</button>}
        </div>
      </div>
    </div>
  );
};

export default BuyerCartPanel;
