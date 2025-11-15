import React, {useState} from "react";
import {registerUser} from "../services/api";  


// Composant d'inscription
const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" , password_confirmation:''});
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
// gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");
  
 

    // appeler le service d'inscription
    try {
      const res = await registerUser(form);
      console.log("Inscription réussie :", res.data);
      //alert("Compte créé !");
      //window.location.reload();
      setMessage("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setForm({ name: "", email: "", password: "" , password_confirmation:''});
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err.response?.data);
      //alert("Erreur lors de l’inscription");
      setErrorMessage(err.response?.data?.message || "Erreur lors de l’inscription");
      setTimeout(() => setErrorMessage(""), 5000);
      
       
    }
  };
  // rendu du formulaire

  return (
    <div className="login-container">
      <div className="login-box">
      <h2>Inscription</h2>

      {/* ✅ Message de succès */}
     {message && <div className="success-msg">{message}</div>}
      {errorMessage && <div className="error-msg">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <br />
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
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={form.password_confirmation}
          onChange={(e) =>
            setForm({ ...form, password_confirmation: e.target.value })
          }
          required
        />
        <br />
        <button type="submit" className="login-btn">S'inscrire</button>
      </form>
        <p>
            Déjà un compte ? <a href="/connexion">Connectez-vous</a>
        </p>
       
    </div>
    </div>

  );
};

export default Register;