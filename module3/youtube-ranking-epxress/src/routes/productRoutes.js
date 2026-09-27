// src/routes/productRoutes.ts
import { Router } from "express";
import {ok} from "../error/ApiResponse.js";
import AppError from "../error/AppError.js";
import ProductMessages from "../error/message.js";

import paginationSchema from "../schemas/paginationSchema.js";
import createProductSchema from "../schemas/productSchema.js";
import searchProductSchema from "../schemas/searchProductSchema.js";
import { validate } from "../middleware/validate.js";

import { getAllProducts, getProduct } from "../models/productModel.js";

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

router.get("/products/all", async (req, res) => {
    try {
        const listProducts = await getAllProducts();

        res.status(200).json({
            success: true,
            data: listProducts
        });
    } catch (error) {
        console.error("Lỗi lấy products:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách sản phẩm"
        });
    }
});

router.get("/product/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id); // "42" → 42
        const product = await getProduct(id);

        if (!product) throw new AppError(404, ProductMessages.NOT_FOUND);
        ok(res, product);
    } catch (error) {
        console.error("Lỗi lấy products:", error);

        res.status(500).json({
            success: false,
            message: "Không thể lấy danh sách sản phẩm"
        });
    }
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

const productQuerySchema = paginationSchema.concat(searchProductSchema);

router.get("/products", async (req, res) => {
  try {
    // stripUnknown: true loại bỏ các query params thừa
    const query = await productQuerySchema.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
    });

    // Yup tự động ép kiểu (ép số cho page, limit, minPrice, maxPrice và gán default)
    const { page, limit, sort, order, category, minPrice, maxPrice } = query;

    let result = [...products];

    if (category) {
        result = result.filter((p) => p.category === category);
    }

    if (minPrice !== undefined) {
        result = result.filter((p) => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
        result = result.filter((p) => p.price <= maxPrice);
    }

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
    const data = result.slice((page - 1) * limit, page * limit);

    return res.json({
            success: true,
            data,
            meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
            success: false,
            errors: error.errors,
            });
        }
        return res.status(500).json({ success: false, message: "Server error" });
    }
});





// router.get("/categories/:category/products/:id", async (req, res, next) => {
//     try {
//         const { category, id } = req.params;

//         const product = await getProductByCategory(category, id);

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Không tìm thấy sản phẩm"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: product
//         });

//     } catch (error) {
//         next(error);
//     }
// });

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
