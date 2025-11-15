import { useEffect, useState } from "react";
import { fetchOrders, deleteOrder } from "../services/api"; // 🔹 à ajouter dans api.js
import Swal from "sweetalert2";
import { Toaster,toast } from "sonner";
import AddOrderModal from "../components/AddOrderModal";
import EditOrderModal from "../components/EditOrderModal"

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Charger les commandes
  const loadOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetchOrders(page);
      const data = response.data;

      const orderList = Array.isArray(data.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : data?.data?.data || [];

      setOrders(orderList);
      setFilteredOrders(orderList);
      setCurrentPage(data.current_page ?? 1);
      setLastPage(data.last_page ?? 1);
    } catch (err) {
      console.error("Erreur chargement commandes :", err);
      setError("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage]);

  // Gestion de la pagination
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < lastPage) setCurrentPage((prev) => prev + 1);
  };

  // Filtrage commandes “en cours” ou “toutes”
  useEffect(() => {
    if (showHistory) {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((o) => !["received", "returned"].includes(o.status))
      );
    }
  }, [showHistory, orders]);

  // Formatage de la date (JJ/MM/AA)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  // Style du badge de statut
  const getStatusStyle = (status) => {
    const colors = {
      confirmed: "#3b82f6",
      pending: "#facc15",
      received: "#22c55e",
      delayed: "#f97316",
      returned: "#ef4444",
    };
    return {
      backgroundColor: colors[status] || "#94a3b8",
      color: "white",
      padding: "5px 10px",
      borderRadius: "12px",
      textTransform: "capitalize",
      fontWeight: "bold",
    };
  };
  // 🔹 Modifier une commande
  const handleEdit = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  // 🔹 Supprimer une commande
  const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Supprimer cette commande ?",
    text: "Cette action est irréversible.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Oui, supprimer",
    cancelButtonText: "Annuler",
  });

  if (result.isConfirmed) {
    try {
      await deleteOrder(id);
      toast.success("Commande supprimée !");
      loadOrders();
    } catch (error) {
      console.error("Erreur suppression :", error);
      toast.error("Erreur lors de la suppression.");
    }
  }
};





  if (loading) return <div>Chargement des commandes...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <Toaster position="top-right" />
      <h2>📦 Liste des commandes</h2>
      <button
        onClick={() => setShowModal(true)}
        style={{
          marginBottom: "20px",
          padding: "8px 12px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        ➕ Ajouter une commande
      </button>

      {/* Bouton Historique */}
      <button
        onClick={() => setShowHistory((prev) => !prev)}
        style={{
          marginBottom: "20px",
          padding: "8px 12px",
          backgroundColor: showHistory ? "#334155" : "#0ea5e9",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {showHistory ? "Voir commandes en cours" : "Voir historique complet"}
      </button>

      {/* Tableau */}
      <div className="table-container">

        <table className="custom-table" >
          <thead>
            <tr>
              <th>Product</th>
              <th>Order Value (F CFA)</th>
              <th>Quantity</th>
              <th>Order ID</th>
              <th>Expected Delivery</th>
              <th>Status</th>
              <th>Action</th>

            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    {order.product?.name || "-"}
                  </td>
                  <td>
                    {order.order_value} 
                  </td>
                  <td>
                    {order.quantity} {order.unit || "units"}
                  </td>
                  <td>
                    #{String(order.id).padStart(4, "0")}
                  </td>
                  <td>
                    {formatDate(order.expected_delivery_date)}
                  </td>
                  <td>
                    <span style={getStatusStyle(order.status)}>{order.status}</span>
                  </td>

                {/* ✅ Actions */}
                <td className="table-actions">
                  <button
                    onClick={() => handleEdit(order)}
                    className="btn-edit"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="btn-delete"
                  >
                    🗑️ Supprimer
                  </button>
                </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "8px" }}>
                  Aucune commande trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          style={{
            padding: "8px 12px",
            backgroundColor: currentPage === 1 ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          ⬅️ Previous
        </button>

        <span>
          Page {currentPage} sur {lastPage}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === lastPage}
          style={{
            padding: "8px 12px",
            backgroundColor: currentPage === lastPage ? "#ccc" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: currentPage === lastPage ? "not-allowed" : "pointer",
          }}
        >
          Next ➡️
        </button>
      </div>
                {showModal && (
        <AddOrderModal
          onClose={() => setShowModal(false)}
          onOrderAdded={(newOrder) => {
            setOrders((prev) => [newOrder, ...prev]);
            toast.success("Commande ajoutée !");
          }}
        />
      )}

      {showEditModal && (
        <EditOrderModal
          order={selectedOrder}
          onClose={() => setShowEditModal(false)}
          onOrderUpdated={loadOrders}
        />
      )}
    </div>
  );
};

export default OrdersPage;
