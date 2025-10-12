import axios from "axios";

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

