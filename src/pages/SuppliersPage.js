import { useEffect, useState } from "react";
import { fetchSuppliers } from "../services/api";
import { Toaster, toast } from "sonner";
import AddSupplierModal from "../components/AddSupplierModal";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // 🔹 Charger les fournisseurs avec pagination

  const loadSuppliers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetchSuppliers(page);
      const data = response.data;

      console.log("Réponse fournisseurs :", data);

      const supplierList =
        Array.isArray(data.data) ? data.data :
        Array.isArray(data) ? data :
        data?.data?.data || [];

      setSuppliers(supplierList);
      setFilteredSuppliers(supplierList);

      // Récupération des infos de pagination
      setCurrentPage(data.current_page ?? 1);
      setLastPage(data.last_page ?? 1);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
      setError("Erreur lors du chargement des fournisseurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers(currentPage);
  }, [currentPage]);

  // Recherche dynamique

  useEffect(() => {
    const filtered = suppliers.filter((supplier) =>
      supplier.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  }, [searchTerm, suppliers]);

  // quand un fournisseur est ajouté

  const handleSupplierAdded = async (newSupplier) => {
    toast.success("Fournisseur ajouté !");
    setShowModal(false);
    await loadSuppliers(currentPage); // recharger la liste depuis l’API
  };

  // Gestion de la pagination
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    if (currentPage < lastPage) setCurrentPage((prev) => prev + 1);
  };


  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <Toaster position="top-right" />
      <h2>Liste des Fournisseurs</h2>

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
        ➕ Ajouter un fournisseur
      </button>

      <input
        type="text"
        placeholder="Rechercher un fournisseur..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "20px", padding: "8px", width: "300px" }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Supplier Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Product</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Contact number</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>accepte retour ?</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>On the way</th>
          </tr>
        </thead>
        <tbody>
          {filteredSuppliers.length > 0 ? (
            filteredSuppliers.map((s) => (
              <tr key={s.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{s.name}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{s.main_product}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{s.Phone}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{s.email}</td>

                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {s.takes_back_returns ? "Oui" : "Non"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                 {s.on_the_way_count ?? 0}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "8px" }}>
                Aucun fournisseur trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* pagination */}
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
        <AddSupplierModal
          onClose={() => setShowModal(false)}
          onSupplierAdded={handleSupplierAdded}
        />
      )}
    </div>
  );
};

export default SuppliersPage;



