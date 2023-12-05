import express from "express";
const router = express.Router();
import {
  addReservationItems,
  getReservationById,
  getMyReservations,
  getReservations,
  updateReservationToPaid,
  updateReservationToCheckedIn,
  updateReservationToCheckedOut,
  updateReservationToCanceled,
} from "../controllers/reservationControllers.js";

import { protect, admin } from "../middleware/authMiddleware.js";
router
  .route("/")
  .post(protect, addReservationItems)
  .get(protect, admin, getReservations);
router.route("/mine").get(protect, getMyReservations);
router.route("/:id/pay").put(protect, updateReservationToPaid);
router.route("/:id/cancel").put(protect, updateReservationToCanceled);
router.route("/:id").get(protect, getReservationById);
router
  .route("/:id/checkedIn")
  .put(protect, admin, updateReservationToCheckedIn);
router
  .route("/:id/checkedOut")
  .put(protect, admin, updateReservationToCheckedOut);
export default router;
