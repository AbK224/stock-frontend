import { fetchProducts } from "../services/productAPI";
import { useState, useEffect } from "react";

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    // Charger les produits au montage du composant
    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await fetchProducts();
                //console.log("Réponse API :", response.data);
                setProducts(response.data.data);
            } catch (err) {
                setError("Erreur lors du chargement des produits.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);
    // Filtrer les produits en fonction du terme de recherche
    useEffect(() => {
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) // recherche insensible à la casse 
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    if (loading) {
        return <div>Chargement des produits...</div>;
    }   
    if (error) {
        return <div>{error}</div>;
    }
    return (
        <div style={{ padding: "20px" }}>
            <h2>Inventaire des Produits</h2>
            {/* Champ de recherche */}
            <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "20px", padding: "8px", width: "300px", }}  
            />
            
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>

                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Nom</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Prix</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Quantité</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Threshold Value</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Expiry Date</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Availability</th>


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
                                ) : product.stock_quantity <= product.threshold_quantity && product.stock_quantity > 0 ? (
                                    <span style={{ color: "red" }}>Rupture de stock</span>
                                ) : (
                                    <span style={{ color: "green" }}>In Stock</span>
                                )}
                            </td>
                        </tr>
                        )) 
                    ): (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center", padding: "8px" }}>Aucun produit trouvé.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
export default InventoryPage;                           