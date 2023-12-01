import express from "express";

const router = express.Router();
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getRoomById,
  getRooms,
  createRoomReview,
  createRoom,
  deleteRoom,
  updateRoom,
} from "../controllers/roomControllers.js";

router.route("/").get(getRooms).post(createRoom);
router
  .route("/:id")
  .get(getRoomById)
  .delete(protect, admin, deleteRoom)
  .put(protect, admin, updateRoom);
router.route("/:id/reviews").post(protect, createRoomReview);
export default router;
