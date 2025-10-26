import axios from "axios";

const productAPI = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }, // ajouter le token d'authentification
    withCredentials: true,
});
// recupérer les produits après authentification 
export const fetchProducts = async () => {
  try {
    const response = await productAPI.get("/products");
    return response.data;
  } catch (error) {
    console.error("Erreur API :", error.response || error.message);
    throw error;
  }
};