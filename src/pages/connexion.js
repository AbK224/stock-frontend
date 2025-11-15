import { loginUser } from "../services/api";
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
    <div className="login-container">
      <div className="login-box">
        <h2>🔐 Connexion</h2>
        {/* ✅ Message de succès */}
        {message && <div className="success-msg">{message}</div>}
        {errorMessage && <div className="error-msg">{errorMessage}</div>}
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
         <a href="/dashboard"><button type="submit" className="login-btn">Se connecter</button></a>
       
        </form>
        <p>
            Pas encore de compte ? <a href="/register">Inscrivez-vous</a>
        </p>
    </div>
    </div>

  );
};

export default Connexion;