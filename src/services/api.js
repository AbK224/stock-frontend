import axios from "axios";

// créer une instance axios avec les configurations de base
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true, // pour inclure les cookies dans les requêtes 
});

// ✅ Intercepteur : injecte le token AVANT chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("⚠️ Aucun token trouvé dans localStorage");
  }
  return config;
}, (error) => Promise.reject(error));
// 🔹 Authentification
export const registerUser = (userData) => api.post("/register", userData);
export const loginUser = (credentials) => api.post("/login", credentials);
export const logoutUser = () => api.post("/logout");


// 🔹 Gestion des


// produits
export const fetchProducts = (page = 1) => api.get(`/products?page=${page}`);

export const addProduct = (productData) => api.post("/products", productData);



//catégories
export const fetchCategories = () => api.get("/categories");

// Fournisseurs
export const fetchSuppliers = (page = 1) => api.get(`/suppliers?page=${page}`);
export const addSupplier = (supplierData) => api.post("/suppliers", supplierData);

export default api;

