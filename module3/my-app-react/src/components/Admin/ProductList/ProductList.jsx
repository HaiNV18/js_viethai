import { useEffect, useState } from "react";
import { productService } from "../../../services/productService";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await productService.getProducts();

                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Products</h1>

            {products.map((product) => (
                <div key={product.id}>
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <p>${product.price}</p>
                </div>
            ))}
        </div>
    );
}

export default ProductList;
