import React, {useState} from "react";
import {registerUser} from "../services/auth";  


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
    <div style={{ width: "400px", margin: "auto", marginTop: "40px" }}>
      <h2>Créer un compte</h2>

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
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;