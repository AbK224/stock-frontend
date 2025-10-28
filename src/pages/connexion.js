import { loginUser } from "../services/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


// Composant de connexion
const Connexion = () => {
    // états pour gérer le formulaire, les messages d'erreur et de succès
  const [form, setForm] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // pour la navigation après la connexion réussie
    // gérer la soumission du formulaire
    const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage("");
      setErrorMessage("");
        // appeler le service de connexion
        try {
            const res = await loginUser(form);
            console.log("token1", res.data.access_token);
            localStorage.setItem('token', res.data.access_token);// Stocker le token dans le localStorage
            setMessage("Connexion réussie !");
            setTimeout(() => {
                navigate("/dashboard"); // Rediriger vers le tableau de bord après la connexion réussie
            }, 1000);
            //window.location.reload();
        } catch (err) {
            setErrorMessage("Email ou mot de passe incorrect");
            console.error(err.response?.data);
        }   
    };
  // rendu du formulaire
  return (
    <div style={{ width: "400px", margin: "auto", marginTop: "40px" }}>
      <h2>Se connecter</h2>
        {/* ✅ Message de succès */}
        {message && (
            <div
                style={{
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "15px",
                }}
            >
                {message}
            </div>
        )}
        {/* ⚠️ Message d’erreur */}
        {errorMessage && (
            <div
                style={{
                    backgroundColor: "#f8d7da",
                    color: "#721c24",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "15px",
                }}
            >   
                {errorMessage}
            </div>
        )}  
        <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
        />
        <br />
        <input
            type="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
        />
        <br />
         <a href="/dashboard"><button type="submit">Se connecter</button></a>
       
        </form>
        <p>
            Pas encore de compte ? <a href="/register">Inscrivez-vous</a>
        </p>
    </div>
  );
};

export default Connexion;