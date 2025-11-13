import { useState, useEffect } from "react";
import { toast } from "sonner";
import { addSupplier,updateSupplier } from "../services/api";

const AddSupplierModal = ({ onClose, onSupplierAdded, supplierToEdit }) => {
  const isEditing = !!supplierToEdit;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    main_product: "",
    takes_back_returns: false,
  });

  const [errors, setErrors] = useState({});

  // ✅ Pré-remplir les champs si on est en mode édition
    useEffect(() => {
      if (isEditing && supplierToEdit) {
        setFormData({
          name: supplierToEdit.name || "",
          email: supplierToEdit.email || "",
          phone: supplierToEdit.phone || "",
          main_product: supplierToEdit.main_product || "",
          takes_back_returns: supplierToEdit.takes_back_returns || false,
        });
      }
        }, [isEditing, supplierToEdit]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (isEditing) {
        await updateSupplier(supplierToEdit.id, formData);
        toast.success("✅ Fournisseur mis à jour !");
      } else {
        const response = await addSupplier(formData);
        onSupplierAdded(response.data);
        toast.success("✅ Fournisseur ajouté !");
      }
      onClose();
    } catch (error) {
      console.error("Erreur API :", error);
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        toast.error("Erreur de validation !");
      } else {
        toast.error("Erreur lors de l’enregistrement du fournisseur !");
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
          width: "400px",
        }}
      >
        <h3>Ajouter un fournisseur</h3>
        <form onSubmit={handleSubmit}>
          <label>Nom :</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name[0]}</p>}

          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email[0]}</p>}

          <label>Téléphone :</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p style={{ color: "red" }}>{errors.phone[0]}</p>}

          <label>Produit principal :</label>
          <input
            name="main_product"
            value={formData.main_product}
            onChange={handleChange}
            placeholder="Ex: Ordinateurs portables"
          />
          {errors.main_product && (
            <p style={{ color: "red" }}>{errors.main_product[0]}</p>
          )}

          <label>
            <input
              type="checkbox"
              name="takes_back_returns"
              checked={formData.takes_back_returns}
              onChange={handleChange}
            />
            Accepte les retours
          </label>

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button type="submit">Ajouter</button>
            <button type="button" onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierModal;
