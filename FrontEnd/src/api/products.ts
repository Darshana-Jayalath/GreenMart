import api from "./axiosConfig";

export const getAllProducts = () => api.get("/products");

export const addToCart = (productId: number) => api.post("/cart", { productId });
