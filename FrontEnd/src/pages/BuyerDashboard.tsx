import React, { useEffect, useState } from "react";
import BuyerSidebar from "../components/BuyerSidebar";
import BuyerTopbar from "../components/BuyerTopbar";
import BuyerProductPanel from "../components/BuyerProductPanel";
import BuyerCartPanel, { type CartProduct } from "../components/BuyerCartPanel";
import BuyerCheckoutPanel from "../components/BuyerCheckoutPanel";
import BuyerOrdersPanel from "../components/BuyerOrdersPanel";
import BuyerMessagePanel from "../components/BuyerMessagesPanel";
import BuyerSettingsPanel from "../components/BuyerSettingsPanel";
import api from "../api/axiosConfig";
import "../styles/buyerDashboard.css";
import "../styles/BuyerProductPanel.css"; // Import the panel CSS here

interface Props {
  buyerEmail: string;
  onLogout: () => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
}

interface OrderSummary {
  orderId: string;
  total: number;
  status: string;
}

const BuyerDashboard: React.FC<Props> = ({ buyerEmail, onLogout }) => {
  const [buyerName, setBuyerName] = useState(""); 
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "cart" | "orders" | "messages" | "settings">("dashboard");
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [confirmedOrdersCount, setConfirmedOrdersCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [pendingOrders, setPendingOrders] = useState<OrderSummary[]>([]);

  // Load buyer info
  useEffect(() => {
    const fetchBuyerInfo = async () => {
      try {
        const res = await api.get(`/users/${buyerEmail}`);
        setBuyerName(res.data.name || "User");
      } catch (err) {
        console.error("Failed to load buyer info", err);
        setBuyerName("User");
      }
    };
    fetchBuyerInfo();
  }, [buyerEmail]);

  // Fetch products & orders
  const fetchDashboardData = async () => {
    try {
      const productsRes = await api.get("/products"); // fetch all products
      const ordersRes = await api.get(`/orders/buyer/${buyerEmail}`);
      const ordersData: OrderSummary[] = ordersRes.data;

      setAllProducts(productsRes.data);
      setTotalProducts(productsRes.data.length);
      setConfirmedOrdersCount(ordersData.filter(o => o.status.toLowerCase() === "confirmed").length);

      const pending = ordersData.filter(o => o.status.toLowerCase() === "pending");
      setPendingOrdersCount(pending.length);
      setPendingOrders(pending.slice(-3).reverse()); // last 3 pending orders
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const addToCart = (p: Product) => {
    const existing = cart.find(c => c.productId === p.id);
    if (existing) {
      setCart(cart.map(c => c.productId === p.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart(prev => [
        ...prev,
        { id: Date.now(), productId: p.id, name: p.name, price: p.price, quantity: 1, imageUrl: p.imageUrl, category: p.category }
      ]);
    }
    // Do NOT switch to cart automatically
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));
  const changeQty = (id: number, qty: number) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  const handleCheckout = () => setShowCheckout(true);

  const handlePlaced = (orderId: string) => {
    setShowCheckout(false);
    setCart([]);
    fetchDashboardData(); 
    setActiveTab("orders");
    alert(`Order placed: ${orderId}`);
  };

  const renderPanel = () => {
    if (showCheckout) {
      return <BuyerCheckoutPanel cart={cart} buyerEmail={buyerEmail} onCancel={() => setShowCheckout(false)} onPlaced={handlePlaced} />;
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <div className="dashboard-overview">
            <div className="welcome-banner">
              <h2>Welcome, {buyerName}</h2>
              <p>Browse all available products</p>
            </div>

            {/* Quick Summary Cards */}
            <div className="dashboard-cards">
              <div className="card">
                <h3>Total Products</h3>
                <p>{totalProducts}</p>
              </div>
              <div className="card">
                <h3>Cart Items</h3>
                <p>{cart.length}</p>
              </div>
              <div className="card">
                <h3>Confirmed Orders</h3>
                <p>{confirmedOrdersCount}</p>
              </div>
              <div className="card">
                <h3>Pending Orders</h3>
                <p>{pendingOrdersCount}</p>
              </div>
            </div>

            {/* Pending Orders List */}
            {pendingOrders.length > 0 && (
              <div className="section">
                <div className="section-header">
                  <h3>Pending Orders</h3>
                </div>
                <div className="orders-list">
                  {pendingOrders.map(o => (
                    <div key={o.orderId} className="order-card">
                      <p>Order ID: <strong>{o.orderId}</strong></p>
                      <p>Total: LKR {o.total.toLocaleString()}</p>
                      <p>Status: {o.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products Section */}
            <div className="section">
              <div className="section-header">
                <h3>Products</h3>
                <button onClick={() => setActiveTab("products")} className="view-all-btn">View All</button>
              </div>
              <BuyerProductPanel addToCart={addToCart} products={allProducts.slice(0, 16)} hideTitle={true} />
            </div>
          </div>
        );

      case "products":
        return <BuyerProductPanel addToCart={addToCart} products={allProducts} />;

      case "cart":
        return <BuyerCartPanel cart={cart} removeFromCart={removeFromCart} onCheckout={handleCheckout} onChangeQty={changeQty} buyerEmail={buyerEmail} />;

      case "orders":
        return <BuyerOrdersPanel buyerEmail={buyerEmail} refreshKey={0} />;

      case "messages":
        return <BuyerMessagePanel buyerName={buyerName} buyerEmail={buyerEmail} />;

      case "settings":
        return <BuyerSettingsPanel buyerEmail={buyerEmail} />;

      default:
        return <div>Unknown tab</div>;
    }
  };

  return (
    <div className="buyer-dashboard">
      <BuyerSidebar buyerName={buyerName} buyerEmail={buyerEmail} onSelect={setActiveTab} />
      <div className="buyer-main">
        <BuyerTopbar buyerName={buyerName} onLogout={onLogout} onSearch={() => {}} />
        <main className="buyer-content">{renderPanel()}</main>
      </div>
    </div>
  );
};

export default BuyerDashboard;
