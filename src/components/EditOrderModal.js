import React, { useState } from "react";
import { updateOrder } from "../services/api";
import { toast } from "sonner";

const EditOrderModal = ({ order, onClose, onOrderUpdated }) => {
  const [status, setStatus] = useState(order.status);
  const [expectedDate, setExpectedDate] = useState(
    order.expected_delivery_date ? order.expected_delivery_date.split("T")[0] : ""
  );
  const [quantity, setQuantity] = useState(order.quantity);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        status,
        expected_delivery_date: expectedDate,
        quantity: Number(quantity),
      };

      const response = await updateOrder(order.id, payload);

      if (response.status === 200) {
        toast.success("Commande mise à jour avec succès !");
        onOrderUpdated();
        onClose();
      } else {
        toast.error("Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur update :", error);
      toast.error("Erreur lors de la mise à jour de la commande.");
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
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          width: "400px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        <h3 style={{ marginBottom: "15px", textAlign: "center" }}>
          Modifier la commande #{order.id}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* 🔹 Champ statut */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Statut :
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="received">Received</option>
              <option value="delayed">Delayed</option>
              <option value="returned">Returned</option>
            </select>
          </div>

          {/* 🔹 Champ quantité */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Quantité :
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          {/* 🔹 Champ date prévue */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Date de livraison prévue :
            </label>
            <input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          {/* 🔹 Boutons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 12px",
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "8px 12px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderModal;
