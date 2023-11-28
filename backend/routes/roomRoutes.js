import express from "express";

const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";
import {
  getRoomById,
  getRooms,
  updateRoomAvailability,
  createRoomReview,
} from "../controllers/roomControllers.js";

router.route("/").get(getRooms);
router.route("/:id").get(getRoomById);
router.route("/availability/:id").put(updateRoomAvailability);
router.route("/:id/reviews").post(protect, createRoomReview);
export default router;
