import { fetchProducts, fetchCategories, fetchSuppliers, deleteProduct  } from "../services/api";
import { useState, useEffect } from "react";
import AddProductModal from "../components/AddProductModal";
import { Toaster, toast } from "sonner";
import Swal from "sweetalert2";

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // 🔹 Charger les produits + categories + suppliers
    const loadData = async (page = 1) => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
                fetchProducts(page),
                fetchCategories(),
                fetchSuppliers(),
            ]);

            console.log("Réponse des produits :", productsRes.data);

            // verifier la structure de la réponse
            const data = productsRes.data;
            const productList = 
            Array.isArray(data.data)
            ? data.data
            : Array.isArray(data)
            ? data
            : data?.data?.data || [];
            setProducts(productList);
            setFilteredProducts(productList);
            setCategories(categoriesRes.data || []);
            setSuppliers(suppliersRes.data?.data || suppliersRes.data || []);




            // recuperation des infos de pagination
            setCurrentPage(data.current_page ?? 1);
            setLastPage(data.last_page ?? 1);
        } catch (err) {
            console.error("Erreur lors du chargement des produits :", err);
            setError("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadData( currentPage );
    }, [currentPage]);


    // Recherche dynamique
    useEffect(() => {
        const filtered = products.filter((product) =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    // Quand un produit est ajouté depuis la modale
    const handleProductAdded = (newProduct) => {
        setProducts((prev) => [newProduct, ...prev]); 
        toast.success("Produit ajouté avec succès !");
        setShowModal(false);
    };

    // 🔹 Pagination handlers
    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < lastPage) setCurrentPage((prev) => prev + 1);
    };
    const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: "Supprimer ce produit du stock ?",
        text: "Cette action est irréversible.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Oui, supprimer",
        cancelButtonText: "Annuler",
        })
    if (result.isConfirmed){
        try{
            await deleteProduct(id);
            toast.success("Produit supprimé !");
            setProducts((prev) => prev.filter((p) => p.id !== id)); 
        }catch (error) {
            console.error("Erreur lors de la suppression :", error);
            toast.error("Erreur lors de la suppression du produit.");
        }
     }
    };
      /*   if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

        try {
            await deleteProduct(id);
            toast.success("Produit supprimé !");
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            toast.error("Erreur lors de la suppression du produit.");
        }
    }; */

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };


    // rendu

    if (loading) return <div>Chargement des produits...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div style={{ padding: "20px" }}>
            <Toaster position="top-right" />
            <h2>Inventaire des Produits</h2>

            {/* Bouton pour ouvrir la modale d’ajout */}
            <button
                onClick={() => setShowModal(true)}
                className="btn-add"
            >
                Ajouter un produit
            </button>

            {/* Champ de recherche */}
            <input
                type="text"
                className="search-input"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "20px", padding: "8px", width: "300px" }}
            />

            <div className="table-container">
            {/* Tableau des produits */}
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prix</th>
                            <th>Quantité</th>
                            <th>Seuil</th>
                            <th>Date d’expiration</th>
                            <th>Disponibilité</th>
                            <th>Action</th>

                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.buying_price} F CFA</td>
                                    <td>{product.stock_quantity}</td>
                                    <td>{product.treshold_quantity}</td>
                                    <td>{product.expiration_date}</td>
                                    <td>
                                        {product.stock_quantity === 0 ? (
                                            <span style={{ color: "orange" }}>Out of stock</span>
                                        ) : product.stock_quantity <= product.treshold_quantity ? (
                                            <span style={{ color: "red" }}>Rupture de stock</span>
                                        ) : (
                                            <span style={{ color: "green" }}>In Stock</span>
                                        )}
                                    </td>
                                    {/* ✅ Actions */}
                                    <td className="table-actions">
                                        <button
                                        onClick={() => handleEdit(product)}
                                        className="btn-edit"
                                        >
                                        ✏️ Modifier
                                        </button>
                                        <button
                                        onClick={() => handleDelete(product.id)}
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
                                    Aucun produit trouvé.
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

            {/* Modale d’ajout */}
            {showModal && (
                <AddProductModal
                    onClose={() =>{
                    setShowModal(false);
                    setSelectedProduct(null);
                    }}
                    onProductAdded={handleProductAdded}
                    categories={categories}
                    suppliers={suppliers}
                    productToEdit={selectedProduct}
                />
            )}
        </div>
    );
};

export default InventoryPage;
