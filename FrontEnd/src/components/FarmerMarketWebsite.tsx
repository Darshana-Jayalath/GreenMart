import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/FarmerMarketWebsite.css";
import logo from "../assets/img/GreenCart.png";
import banner from "../assets/img/banner.jpg";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

interface FarmerMarketWebsiteProps {
  onLoginClick: () => void;
}

const FarmerMarketWebsite: React.FC<FarmerMarketWebsiteProps> = ({ onLoginClick }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    fetchProducts(categoryFilter);
  }, [categoryFilter]);

  const fetchProducts = async (category: string = "all") => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/products", {
        params: category !== "all" ? { category } : {},
      });

      const productsWithImages = response.data
        .map((product: Product) => ({
          ...product,
          imageUrl: product.imageUrl
            ? product.imageUrl.startsWith("http")
              ? product.imageUrl
              : `http://localhost:8080${product.imageUrl}`
            : null,
        }))
        .sort((a: Product, b: Product) => b.id - a.id)
        .slice(0, 20);

      setProducts(productsWithImages);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategory = (category: string) => {
    setCategoryFilter(category);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = "none";
    const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
    if (placeholder) {
      placeholder.style.display = "flex";
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="farmer-market-website">
      {/* HEADER */}
      <header className="navbar">
        <div className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <img src={logo} alt="GreenCart Logo" className="logo-image" />
          <span className="logo-text">GreenCart</span>
        </div>
        <nav className="nav-links">
          <button className="nav-link" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Home
          </button>
          <button className="nav-link" onClick={() => scrollToSection("products")}>
            Products
          </button>
          <button className="nav-link" onClick={() => scrollToSection("about")}>
            About Us
          </button>
        </nav>
        <button className="login-btn" onClick={onLoginClick}>
          Login
        </button>
      </header>

      {/* HERO BANNER */}
      <section className="hero-section">
        <div className="hero-banner">
          <img src={banner} alt="Fresh organic products from local farmers" />
        </div>
        <div className="hero-text">
          <h1>Fresh and Organic Products Delivered to Your Door</h1>
          <p>
            Shop directly from local farmers and enjoy the freshest fruits,
            vegetables, and groceries with GreenCart.
          </p>
          <button className="btn-primary" onClick={() => scrollToSection("products")}>
            Shop Now
          </button>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="products-section" id="products">
        <div className="section-container">
          <div className="section-header align-center">
            <h2 className="section-title">Our Products</h2>
            <p className="section-subtitle">
              Explore a wide range of fresh and organic items.
            </p>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {["all", "fruits", "vegetables"].map((cat) => (
              <button
                key={cat}
                className={`category-btn ${categoryFilter === cat ? "active" : ""}`}
                onClick={() => handleCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="products-loading">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="error-message">
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button className="retry-btn" onClick={() => fetchProducts(categoryFilter)}>
                Retry
              </button>
            </div>
          )}

          {/* No Products */}
          {!loading && !error && products.length === 0 && (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try selecting another category</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="products-grid">
              {products.map((product) => (
                <div className="product-card" key={product.id}>
                  <div className="product-image">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} onError={handleImageError} />
                    ) : null}
                    <div
                      className="product-placeholder"
                      style={{ display: product.imageUrl ? "none" : "flex" }}
                    >
                      <span className="placeholder-icon">🍃</span>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-footer">
                      <div className="product-price">
                        <span className="price-label">Price:</span>
                        <span className="price-value">LKR {product.price.toLocaleString()}</span>
                      </div>
                      <button className="add-to-cart-btn" onClick={onLoginClick}>
                        🛒 Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section" id="about">
        <div className="section-container">
          <h2 className="section-title">About Us</h2>
          <div className="about-content">
            <p className="about-intro">
              GreenCart connects local farmers directly with consumers. We ensure fresh, organic,
              and high-quality products delivered straight to your doorstep.
            </p>
            <div className="about-features">
              <div className="feature-card">
                <h3>Fresh Products</h3>
                <p>Direct from local farms to your table</p>
              </div>
              <div className="feature-card">
                <h3>Quality Assured</h3>
                <p>Only the best organic produce</p>
              </div>
              <div className="feature-card">
                <h3>Fast Delivery</h3>
                <p>Same-day delivery available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <img src={logo} alt="GreenCart Logo" className="footer-logo" />
            <p>Fresh and Organic Products from Local Farmers.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</button>
            <button onClick={() => scrollToSection("products")}>Products</button>
            <button onClick={() => scrollToSection("about")}>About Us</button>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <p>Email: info@greencart.com</p>
            <p>Phone: +94 77 123 4567</p>
            <p>Address: Colombo, Sri Lanka</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GreenCart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default FarmerMarketWebsite;
