// src/routes/productRoutes.ts
import { Router } from "express";

const router = Router();

let products = [
    { id: 1, name: "iPhone", category: "phone", price: 2000000 }
];

router.get("/", (req, res) => {
    res.json({ message: "Server đang chạy!" });
});

router.get("/products", (req, res) => {
    res.json(products);
});

router.get("/product/:id", (req, res) => {
    const id = parseInt(req.params.id); // "42" → 42
    const product = products.find((p) => p.id === id);

    if (!product) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(product);
});

// URL: GET /products?category=phone&minPrice=5000000
router.get("/products", (req, res) => {
    const { category, minPrice, maxPrice } = req.query;
    // req.query = { category: "phone", minPrice: "5000000" }
    // Lưu ý: tất cả giá trị query đều là string → cần chuyển kiểu

    let result = [...products];
    if (category) result = result.filter((p) => p.category === category);
    if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));

    res.json(result);
});

router.get("/categories/:category/products/:id", (req, res) => {
    const { category, id } = req.params;
    console.log(`Category: ${category}, Product ID: ${id}`);
    res.status(201).json("ok");
    // req.params = { category: "phone", id: "42" }
});


// Tạo mới — body được parse tự động nhờ express.json()
router.post("/product", (req, res) => {
    const newProduct = { ...req.body };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

router.put("/product/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === productId);
    console.log(productIndex)

    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    const newProduct = { id: productId, ...req.body };
    products[productIndex] = newProduct;
    res.status(200).json(newProduct);
});

router.delete("/product/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === productId);
    console.log(productIndex)

    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    products.splice(productIndex, 1);
    res.status(200).json({ message: "Product deleted successfully" });
});


export default router;
