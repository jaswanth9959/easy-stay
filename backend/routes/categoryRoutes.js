import express from "express";

const router = express.Router();
import { getCategories } from "../controllers/categoryControllers.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").get(protect, admin, getCategories);

export default router;
