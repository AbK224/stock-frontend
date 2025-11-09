// src/components/AddProductModal.js
import { useState } from "react";
import { toast } from "sonner";
import { addProduct } from "../services/api";


const AddProductModal = ({ onClose, onProductAdded, categories, suppliers }) => {
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    buying_price: "",
    selling_price: "",
    stock_quantity: "",
    treshold_quantity: "",
    expiration_date: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      const response = await addProduct(formData);
      toast.success("Produit ajouté avec succès !");
      onProductAdded(response.data.data); // maj liste
      onClose();
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        toast.error("Erreur de validation");
      } else {
        toast.error("Erreur lors de l’ajout du produit");
      }
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex", justifyContent: "center", alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          width: "400px",
        }}
      >
        <h3>Ajouter un produit</h3>
        <form onSubmit={handleSubmit}>
          <label>Nom :</label>
          <input name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <p style={{ color: "red" }}>{errors.name[0]}</p>}

        <label>Fournisseur :</label>
          <select
            name="supplier_id"
            value={formData.supplier_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionner un fournisseur --</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>


          <label>Catégorie :</label>
          <select name="category_id" value={formData.category_id} onChange={handleChange}> 
            <option value="">-- Sélectionner --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category_id && <p style={{ color: "red" }}>{errors.category_id[0]}</p>}

          <label>Prix d’achat :</label>
          <input type="number" name="buying_price" value={formData.buying_price} onChange={handleChange} />

          <label>Prix de vente :</label>
          <input type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} />

          <label>Quantité initiale :</label>
          <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} />

          <label>Seuil :</label>
          <input type="number" name="treshold_quantity" value={formData.treshold_quantity} onChange={handleChange} />

          <label>Date d’expiration :</label>
          <input type="date" name="expiration_date" value={formData.expiration_date} onChange={handleChange} />

          <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
            <button type="submit">Ajouter</button>
            <button type="button" onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
