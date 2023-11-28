import express from "express";
const router = express.Router();
import { addReservationItems } from "../controllers/reservationControllers.js";

import { protect } from "../middleware/authMiddleware.js";
router.route("/").post(protect, addReservationItems);
export default router;
