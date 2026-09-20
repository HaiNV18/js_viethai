// src/routes/productRoutes.ts
import { Router } from "express";
import {ok} from "../error/ApiResponse.js";
import AppError from "../error/AppError.js";
import ProductMessages from "../error/message.js";

import createProductSchema from "../schemas/productSchema.js";
import { validate } from "../middleware/validate.js";

const router = Router();

let products = [
    { id: 1, name: "iPhone", category: "phone", price: 2000000 },
    { id: 2, name: "Samsung Galaxy", category: "phone", price: 1500000 },
    { id: 3, name: "iPad", category: "tablet", price: 3000000 },
    { id: 4, name: "MacBook", category: "laptop", price: 15000000 },
    { id: 5, name: "Dell XPS", category: "laptop", price: 12000000 },
    { id: 6, name: "Sony WH-1000XM4", category: "headphones", price: 2500000 },
    { id: 7, name: "Apple Watch", category: "watch", price: 800000 },
    { id: 8, name: "iPhone", category: "phone", price: 2000000 },
    { id: 9, name: "iPhone", category: "phone", price: 2000000 },
    { id: 10, name: "iPhone", category: "phone", price: 2000000 },
    { id: 11, name: "iPhone", category: "phone", price: 2000000 },
];

let categories = [
    { id: 1, name: "phone" },
    { id: 2, name: "tablet" },
    { id: 3, name: "laptop" },
    { id: 4, name: "headphones" },
    { id: 5, name: "watch" },
];

router.get("/", (req, res) => {
    res.json({ message: "Server đang chạy!" });
});

router.get("/products/all", (req, res) => {
    res.json(products);
});

router.get("/product/:id", (req, res, next) => {
    try {
        const id = parseInt(req.params.id); // "42" → 42
        const product = products.find((p) => p.id === id);

        if (!product) throw new AppError(404, ProductMessages.NOT_FOUND);
        ok(res, product);
    } catch (err) { next(err); }
});

// URL: GET /products?category=phone&minPrice=5000000
// router.get("/products", (req, res) => {
//     const { category, minPrice, maxPrice } = req.query;
//     // req.query = { category: "phone", minPrice: "5000000" }
//     // Lưu ý: tất cả giá trị query đều là string → cần chuyển kiểu

//     let result = [...products];
//     if (category) result = result.filter((p) => p.category === category);
//     if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
//     if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));

//     res.json(result);
// });

router.get("/products", (req, res) => {
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 10;
    const sort  = req.query.sort;
    const order = req.query.order;
    let result = [...products];

    // Lấy dữ liệu theo category
    if (req.query.category)
        result = result.filter((p) => p.category === req.query.category);

    // Sắp xếp: nếu là number thì sort theo number, nếu là string thì compare string
    if (sort) {
        result.sort((a, b) => {
            const valA = a[sort];
            const valB = b[sort];
            let comparison = 0;
            if (typeof valA === "number" && typeof valB === "number") {
                comparison = valA - valB;
            } else {
                comparison = String(valA).localeCompare(String(valB));
            }
            return order === "desc" ? -comparison : comparison;
        });
    }

    const total = result.length;
    const data  = result.slice((page - 1) * limit, page * limit);

    res.json({
        success: true, data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
});








router.get("/categories/:category/products/:id", (req, res) => {
    const { category, id } = req.params;
    console.log(`Category: ${category}, Product ID: ${id}`);
    res.status(201).json("ok");
    // req.params = { category: "phone", id: "42" }
});


// Tạo mới — body được parse tự động nhờ express.json()
// router.post("/product", (req, res) => {
//     const newProduct = { ...req.body };
//     products.push(newProduct);
//     res.status(201).json(newProduct);
// });

// Tạo sản phẩm
router.post("/products", validate(createProductSchema), (req, res, next) => {
    console.log("Validated body:", req.body);
    ok(res, req.body, 201);
});









router.put("/product/:id", (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = products.findIndex((p) => p.id === productId);
    console.log(productIndex)

    if (productIndex === -1) {
        throw new AppError(404, ProductMessages.NOT_FOUND);
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
        throw new AppError(404, ProductMessages.NOT_FOUND);
    }

    products.splice(productIndex, 1);
    res.status(200).json({ message: ProductMessages.DELETED });
});


export default router;
