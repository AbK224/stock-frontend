import { useState, useEffect } from "react";
import { toast } from "sonner";
import { fetchProducts, fetchSuppliers, addOrder } from "../services/api";

const AddOrderModal = ({ onClose, onOrderAdded }) => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_id: "",
    supplier_id: "",
    quantity: "",
    expected_delivery_date: "",
  });
  const [loading, setLoading] = useState(false);

  // Charger les produits et fournisseurs
  useEffect(() => {
    const loadData = async () => {
      try {
        
        const [productsRes, suppliersRes] = await Promise.all([
          fetchProducts(),
          fetchSuppliers(),
        ]);

        const productList =
          productsRes.data?.data?.data ||
          productsRes.data?.data ||
          productsRes.data ||
          [];

        const supplierList =
          suppliersRes.data?.data?.data ||
          suppliersRes.data?.data ||
          suppliersRes.data ||
          [];

        setProducts(productList);
        setSuppliers(supplierList);
      } catch (err) {
        console.error("Erreur chargement produits/fournisseurs :", err);
        toast.error("Erreur de chargement des données");
      }
    };
    loadData();
  }, []);

  // Gérer les changements de champs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "product_id") {
      const product = products.find((p) => p.id === parseInt(e.target.value));
      setSelectedProduct(product || null);

      // Pré-sélection du fournisseur principal s’il existe
      if (product?.supplier_id) {
        setFormData((prev) => ({
          ...prev,
          supplier_id: product.supplier_id,
        }));
      }
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.product_id || !formData.quantity) {
      toast.error("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    try {
      setLoading(true);
      console.log("✅ Données envoyées :", formData);
      const response = await addOrder(formData);
      toast.success("Commande créée avec succès !");
      onOrderAdded(response.data.data);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l’ajout de la commande :", error);
      toast.error("Erreur lors de la création de la commande !");
    } finally {
      setLoading(false);
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
        <h3>🆕 Nouvelle commande</h3>
        <form onSubmit={handleSubmit}>
          <label>Produit :</label>
          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Sélectionner un produit --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.stock_quantity} en stock)
              </option>
            ))}
          </select>

          {selectedProduct && (
            <p style={{ fontSize: "12px", color: "#555" }}>
              Prix d’achat : {selectedProduct.buying_price} F CFA
            </p>
          )}

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

          <label>Quantité :</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />

          <label>Date de livraison prévue :</label>
          <input
            type="date"
            name="expected_delivery_date"
            value={formData.expected_delivery_date}
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
              disabled={loading}
              style={{
                backgroundColor: "#0ea5e9",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {loading ? "Ajout..." : "Ajouter"}
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: "#ccc",
                color: "black",
                border: "none",
                padding: "8px 12px",
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

export default AddOrderModal;
