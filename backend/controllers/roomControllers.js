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

const createRoomReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const room = await Room.findById(req.params.id);

  if (room) {
    const alreadyReviewed = room.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Room already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    room.reviews.push(review);

    room.numReviews = room.reviews.length;

    room.rating =
      room.reviews.reduce((acc, item) => item.rating + acc, 0) /
      room.reviews.length;

    await room.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export { getRoomById, getRooms, updateRoomAvailability, createRoomReview };
