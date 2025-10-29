import { fetchProducts, fetchCategories } from "../services/api";
import { useState, useEffect } from "react";
import AddProductModal from "../components/AddProductModal";
import { Toaster, toast } from "sonner";

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState([]); // ⚙️ à connecter plus tard à ton API /categories

    // 🔹 Charger les produits
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetchProducts();
                console.log("Réponse API produits :", response.data);

                let productList = [];

                if (Array.isArray(response.data)) {
                    productList = response.data;
                } else if (Array.isArray(response.data.data)) {
                    productList = response.data.data;
                } else if (Array.isArray(response.data.data?.data)) {
                    productList = response.data.data.data;
                } else {
                    console.error("Format inattendu :", response.data);
                }

                setProducts(productList);
                setFilteredProducts(productList);

            } catch (err) {
                console.error("Erreur lors du chargement des produits :", err);
                setError("Erreur lors du chargement des produits.");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);
    // 🔹 Charger les catégories
    useEffect(() => {
    const loadData = async () => {
        try {
            const [productRes, categoryRes] = await Promise.all([
                fetchProducts(),
                fetchCategories(),
            ]);

            // 🔹 Extraction des produits
            const productList =
                productRes.data?.data?.data ||
                productRes.data?.data ||
                productRes.data ||
                [];

            setProducts(productList);
            setFilteredProducts(productList);

            // 🔹 Extraction des catégories
            const categoryList = categoryRes.data || [];
            setCategories(categoryList);

        } catch (err) {
            console.error("Erreur lors du chargement :", err);
            setError("Erreur lors du chargement des données.");
        } finally {
            setLoading(false);
        }
    };

    loadData();
}, []);


    // 🔍 Recherche dynamique
    useEffect(() => {
        const filtered = products.filter((product) =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    // 🔹 Quand un produit est ajouté depuis la modale
    const handleProductAdded = (newProduct) => {
        setProducts((prev) => [newProduct, ...prev]);
        toast.success("Produit ajouté avec succès !");
        setShowModal(false);
    };

    if (loading) return <div>Chargement des produits...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div style={{ padding: "20px" }}>
            <Toaster position="top-right" />
            <h2>Inventaire des Produits</h2>

            {/* Bouton pour ouvrir la modale d’ajout */}
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
                ➕ Ajouter un produit
            </button>

            {/* Champ de recherche */}
            <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "20px", padding: "8px", width: "300px" }}
            />

            {/* Tableau des produits */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Nom</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Prix</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Quantité</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Seuil</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date d’expiration</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Disponibilité</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <tr key={product.id}>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.name}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.buying_price} €</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.stock_quantity}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.threshold_quantity}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{product.expiration_date}</td>
                                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                    {product.stock_quantity === 0 ? (
                                        <span style={{ color: "orange" }}>Out of stock</span>
                                    ) : product.stock_quantity <= product.threshold_quantity ? (
                                        <span style={{ color: "red" }}>Rupture de stock</span>
                                    ) : (
                                        <span style={{ color: "green" }}>In Stock</span>
                                    )}
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

            {/* Modale d’ajout */}
            {showModal && (
                <AddProductModal
                    onClose={() => setShowModal(false)}
                    onProductAdded={handleProductAdded}
                    categories={categories}
                />
            )}
        </div>
    );
};

export default InventoryPage;
