import express from "express";
const router = express.Router();
import {
  getRoomById,
  getRooms,
  updateRoomAvailability,
} from "../controllers/roomControllers.js";

router.route("/").get(getRooms);
router.route("/:id").get(getRoomById);
router.route("/availability/:id").put(updateRoomAvailability);

export default router;
