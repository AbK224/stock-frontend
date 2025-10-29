import axios from "axios";

// créer une instance axios avec les configurations de base
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true, // pour inclure les cookies dans les requêtes 
});

// enregistrer un nouvel utilisateur
export const registerUser = (userData) => {
  return api.post("/register", userData);
};


// connecter un utilisateur
export const loginUser = (credentials) => {
  return api.post("/login", credentials);
};

// deconnecter un utilisateur
export const logoutUser = () => {
  return api.post("/logout");
};


// Récupération du token et ajout automatique aux headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔹 Liste des produits
export const fetchProducts = () => api.get("/products");

// liste des catégories
export const fetchCategories = () => api.get("/categories");

// ajouter un nouveau produit
export const addProduct = (productData) => api.post("/products", productData);


export default api;

