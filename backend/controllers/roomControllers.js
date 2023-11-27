import asyncHandler from "../middleware/asyncHandler.js";

import Room from "../models/roomModel.js";
import Category from "../models/categoryModel.js";

const getRooms = asyncHandler(async (req, res) => {
  const rooms = await Room.find({});
  res.json(rooms);
});

const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate("category", "name");

  if (room) {
    res.json(room);
  } else {
    res.status(404);
    throw new Error("Room not found");
  }
});

const updateRoomAvailability = asyncHandler(async (req, res) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
});

export { getRoomById, getRooms, updateRoomAvailability };
