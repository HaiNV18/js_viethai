import express from "express";
import { getApartmentDetail } from "../controller/apartmentController.js";

const router = express.Router();

// GET /apartment/detail/:idApart
router.get("/apartment/detail/:idApart", getApartmentDetail);

export default router;
