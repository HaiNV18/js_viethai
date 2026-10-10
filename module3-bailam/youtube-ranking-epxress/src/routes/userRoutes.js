import { Router } from "express";
import { getAllUsersController } from "../controller/userController.js";
import { authorizeMiddleware } from "../middleware/authorizeMiddleware.js";

const router = Router();

// API danh sách User dành riêng cho ADMIN, có /admin đằng trước
router.get(
    "/admin/users",
    authorizeMiddleware(["ADMIN"]), // Check role
    getAllUsersController
);






// API phân quyền. ADMIN có thể chọn ra ADMIN mới
router.put(
    "/admin/users/:id/:newrole",
    authorizeMiddleware(["ADMIN"]),      // Check role
    // ... other middleware and controller
);

export default router;
