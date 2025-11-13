import { useEffect, useState } from "react";
import { toast } from "sonner";
import { addProduct, updateProduct } from "../services/api";

const AddProductModal = ({ onClose, onProductAdded, categories, suppliers, productToEdit }) => {
  const isEditing = !!productToEdit; // ✅ vrai si on édite un produit

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    supplier_id: "",
    buying_price: "",
    selling_price: "",
    stock_quantity: "",
    treshold_quantity: "",
    expiration_date: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Si on est en mode édition, préremplir les champs
  useEffect(() => {
    if (isEditing && productToEdit) {
      setFormData({
        name: productToEdit.name || "",
        category_id: productToEdit.category_id || "",
        supplier_id: productToEdit.supplier_id || "",
        buying_price: productToEdit.buying_price || "",
        selling_price: productToEdit.selling_price || "",
        stock_quantity: productToEdit.stock_quantity || "",
        treshold_quantity: productToEdit.treshold_quantity || "",
        expiration_date: productToEdit.expiration_date || "",
      });
    }
  }, [isEditing, productToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (isEditing) {
        // ✅ Mise à jour d’un produit existant
        await updateProduct(productToEdit.id, formData);
        toast.success("Produit mis à jour avec succès !");
      } else {
        // ✅ Ajout d’un nouveau produit
        const response = await addProduct(formData);
        onProductAdded(response.data);
        toast.success("Produit ajouté avec succès !");
      }

      onClose();
    } catch (error) {
      console.error("Erreur API :", error);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        toast.error("Erreur de validation !");
      } else {
        toast.error("Erreur lors de l’enregistrement du produit !");
      }
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          width: "420px",
        }}
      >
        <h3>{isEditing ? "Modifier le produit" : "Ajouter un produit"}</h3>
        <form onSubmit={handleSubmit}>
          <label>Nom :</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name[0]}</p>}

          <label>Catégorie :</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionner --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p style={{ color: "red" }}>{errors.category_id[0]}</p>}

          <label>Fournisseur :</label>
          <select
            name="supplier_id"
            value={formData.supplier_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionner --</option>
            {Array.isArray(suppliers) &&
              suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name}
                </option>
              ))}
          </select>
          {errors.supplier_id && <p style={{ color: "red" }}>{errors.supplier_id[0]}</p>}

          <label>Prix d’achat :</label>
          <input
            type="number"
            name="buying_price"
            value={formData.buying_price}
            onChange={handleChange}
            required
          />

          <label>Prix de vente :</label>
          <input
            type="number"
            name="selling_price"
            value={formData.selling_price}
            onChange={handleChange}
            required
          />

          <label>Quantité :</label>
          <input
            type="number"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            required
          />

          <label>Seuil d’alerte :</label>
          <input
            type="number"
            name="treshold_quantity"
            value={formData.treshold_quantity}
            onChange={handleChange}
            required
          />

          <label>Date d’expiration :</label>
          <input
            type="date"
            name="expiration_date"
            value={formData.expiration_date}
            onChange={handleChange}
          />

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button
              type="submit"
              style={{
                backgroundColor: isEditing ? "#007bff" : "#28a745",
                color: "#fff",
                padding: "8px 14px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: "#6c757d",
                color: "#fff",
                padding: "8px 14px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
