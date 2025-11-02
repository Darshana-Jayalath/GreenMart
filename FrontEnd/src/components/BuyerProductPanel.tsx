import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/BuyerProductPanel.css";
import { FaShoppingCart } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

interface Props {
  addToCart: (product: Product) => void;
  products?: Product[]; // <-- optional products prop
   hideTitle?: boolean;
}

const BuyerProductPanel: React.FC<Props> = ({ addToCart, products ,hideTitle  }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [addedIds, setAddedIds] = useState<number[]>([]);

  // Only fetch if products prop not provided
  useEffect(() => {
    if (!products) {
      const fetchProducts = async () => {
        try {
          const res = await api.get("/products");
          setAllProducts(res.data);
        } catch (error) {
          console.error("Error loading products:", error);
        }
      };
      fetchProducts();
    } else {
      setAllProducts(products);
    }
  }, [products]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  return (
    <div className="buyer-products">
      {!hideTitle && <h2 className="panel-title">All Products</h2>}
      <div className="product-grid">
        {allProducts.map((product) => (
          <div key={product.id} className="product-card">
            {product.imageUrl && (
              <img
                src={product.imageUrl.startsWith("http") ? product.imageUrl : `http://localhost:8080${product.imageUrl}`}
                alt={product.name}
                className="product-image"
              />
            )}
            <div className="product-info">
              <h4>{product.name}</h4>
              <p className="product-category">{product.category}</p>
              <p className="product-description">{product.description}</p>
              <p className="product-price">LKR {product.price.toFixed(2)}</p>
              <button
                className="add-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                <FaShoppingCart style={{ marginRight: "6px" }} />
                {addedIds.includes(product.id) ? "Added!" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerProductPanel;
