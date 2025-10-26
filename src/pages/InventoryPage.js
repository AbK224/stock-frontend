import { fetchProducts } from "../services/productAPI";
import { useState, useEffect } from "react";

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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

    if (loading) {
        return <div>Chargement des produits...</div>;
    }   
    if (error) {
        return <div>{error}</div>;
    }
    return (
        <div style={{ padding: "20px" }}>
            <h2>Inventaire des Produits</h2>
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
                    {products.map((product) => (
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default InventoryPage;                           