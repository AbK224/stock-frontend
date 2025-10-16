import React,{useEffect} from "react";
import { useNavigate } from "react-router-dom";
// Composant de connexion via les réseaux sociaux
const SocialLogin = () => {
    const navigate = useNavigate(); 
// pour la navigation après la connexion réussie
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const token = query.get("token");
// Récupérer le token depuis les paramètres d'URL
        if (token) {
            localStorage.setItem("token", token);
            navigate("/dashboard");
        } else {
            navigate("/connexion");
        }
    }, [navigate]);
// rendu du composant
    return (
        <div>
            <h2>Connexion en cours...</h2>
        </div>);
}
export default SocialLogin;