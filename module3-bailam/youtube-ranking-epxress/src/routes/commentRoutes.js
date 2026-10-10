import { Router } from "express";
import { getMyCommentsController } from "../controller/commentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/comments/my-comments", authMiddleware, getMyCommentsController);

export default router;
