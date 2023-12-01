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

const createRoom = asyncHandler(async (req, res) => {
  const { title, image, price, category, description, roomNumbers } = req.body;
  try {
    const room = new Room({
      title,
      image,
      user: "65666a047b2465de36288c8c",
      price,
      category,
      description,
      roomNumbers,
    });
    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    console.log(error);
  }
});

const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (room) {
    await Room.deleteOne({ _id: room._id });
    res.json({ message: "Room is removed" });
  } else {
    res.status(404);
    throw new Error("Room not found");
  }
});

const updateRoom = asyncHandler(async (req, res) => {
  const { title, image, price, category, description, roomNumbers } = req.body;
  const room = await Room.findById(req.params.id);
  if (room) {
    room.title = title;
    room.price = price;
    room.description = description;
    room.image = image;
    room.category = category;
    room.roomNumbers = roomNumbers;

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } else {
    res.status(404);
    throw new Error("room not found");
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

export {
  getRoomById,
  getRooms,
  createRoomReview,
  createRoom,
  updateRoom,
  deleteRoom,
};
