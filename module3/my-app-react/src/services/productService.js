const API_URL = "https://dummyjson.com/products";

export const productService = {
    async getProducts() {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `Failed to fetch products: ${response.status}`
            );
        }

        const data = await response.json();

        return data.products;
    },
};
