import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "../styles/ProductPanel.css";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

const ProductPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("FRUIT");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddForm = () => {
    setEditingProduct(null);
    setName("");
    setCategory("FRUIT");
    setPrice(0);
    setDescription("");
    setImage(null);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setPrice(product.price);
    setDescription(product.description || "");
    setImage(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price.toString());
    formData.append("description", description);
    if (image) formData.append("image", image);

    if (editingProduct) {
      await api.put(`/products/${editingProduct.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    setShowForm(false);
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await api.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div className="product-panel">
      <div className="panel-header">
        <h1 className="panel-title">Products</h1>
        <button className="add-btn" onClick={openAddForm}>
          + Add Product
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="add-product-form">
          <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="FRUIT">Fruit</option>
            <option value="VEGETABLE">Vegetable</option>
          </select>
          <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} />
          <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="file" onChange={(e) => e.target.files && setImage(e.target.files[0])} />
          <div className="form-actions">
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={() => setShowForm(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}

      {/* Product List */}
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            {product.imageUrl && (
              <img
                src={`http://localhost:8080${product.imageUrl}`}
                alt={product.name}
                className="product-image"
              />
            )}
            <div className="product-info">
              <h2>{product.name}</h2>
              <p className="product-category">{product.category}</p>
              <p className="product-price">{product.price} LKR</p>
              <p className="product-description">{product.description}</p>
              <div className="product-actions">
                <button className="edit-btn" onClick={() => openEditForm(product)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPanel;
