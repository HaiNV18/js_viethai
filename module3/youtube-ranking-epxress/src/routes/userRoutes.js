import { Router } from "express";
import { getAllUsersController } from "../controller/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeMiddleware } from "../middleware/authorizeMiddleware.js";

const router = Router();

// API danh sách User dành riêng cho ADMIN, có /admin đằng trước
router.get(
    "/admin/users",
    authMiddleware,                      // Check login
    authorizeMiddleware(["ADMIN"]),      // Check role
    getAllUsersController
);

export default router;
