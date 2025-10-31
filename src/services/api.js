import axios from "axios";

// créer une instance axios avec les configurations de base
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true, // pour inclure les cookies dans les requêtes 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔹 Authentification
export const registerUser = (userData) => api.post("/register", userData);
export const loginUser = (credentials) => api.post("/login", credentials);
export const logoutUser = () => api.post("/logout");


// Récupération du token et ajout automatique aux headers


// produits avec pagination
export const fetchProducts = (page = 1) => api.get(`/products?page=${page}`);


// 🔹 Liste des produits
//export const fetchProducts = () => api.get("/products");

// liste des catégories
export const fetchCategories = () => api.get("/categories");

// ajouter un nouveau produit
export const addProduct = (productData) => api.post("/products", productData);


export default api;

