import express from "express";
import { getUserDetail } from "../controller/userController.js";

const router = express.Router();

// GET /user/detail/:idUser
router.get("/user/detail/:idUser", getUserDetail);

export default router;
