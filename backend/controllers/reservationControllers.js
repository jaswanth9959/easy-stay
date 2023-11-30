import asyncHandler from "../middleware/asyncHandler.js";
import Reservation from "../models/reservationModel.js";
import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";

const addReservationItems = asyncHandler(async (req, res) => {
  const { reservationItems, paymentMethod, roomsPrice, taxPrice, totalPrice } =
    req.body;
  if (reservationItems && reservationItems.length === 0) {
    res.status(400);
    throw new Error("No reservation items");
  } else {
    const payment = new Payment({
      totalPrice,
      paymentMethod,
    });
    const createdPayment = await payment.save();
    const modifiedReservation = [
      {
        title: reservationItems[0].title,
        image: reservationItems[0].image,
        price: reservationItems[0].price,
        selectedRooms: reservationItems[0].selectedRooms,
      },
    ];
    const reservation = new Reservation({
      reservationItems: modifiedReservation.map((x) => ({
        ...x,
        room: reservationItems[0]._id,
      })),
      user: req.user._id,
      paymentID: createdPayment._id,
      roomsPrice,
      taxPrice,
      fromDate: reservationItems[0].fromDate,
      toDate: reservationItems[0].toDate,
      numOfDays: reservationItems[0].numOfDays,
      selectedRooms: reservationItems[0].selectedRooms,
    });

    const createdReservation = await reservation.save();
    res.status(201).json(createdReservation);
  }
});

const getReservationById = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id).populate(
    "paymentID",
    "totalPrice paymentMethod paymentResult isPaid paidAt"
  );

  const user = await User.findById(reservation.user);

  if (reservation) {
    res.json({ reservation, user });
  } else {
    res.status(404);
    throw new Error("Reservation not found");
  }
});

const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id });
  res.json(reservations);
});

const updateReservationToCheckedIn = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (reservation) {
    reservation.isCheckedIn = true;
    reservation.checkedInAt = Date.now();

    const updatedreservation = await reservation.save();

    res.json(updatedreservation);
  } else {
    res.status(404);
    throw new Error("Reservation not found");
  }
});

const updateReservationToCheckedOut = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (reservation) {
    reservation.isCheckedOut = true;
    reservation.checkedOutAt = Date.now();

    const updatedreservation = await reservation.save();

    res.json(updatedreservation);
  } else {
    res.status(404);
    throw new Error("Reservation not found");
  }
});

const updateReservationToPaid = asyncHandler(async (req, res) => {
  const ress = await Reservation.findById(req.params.id);
  const payment = await Payment.findById(ress.paymentID);
  if (payment) {
    payment.isPaid = true;
    payment.paidAt = Date.now();
    payment.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address,
    };
    const updatedPayment = await payment.save();

    const reservation = await Reservation.findById(req.params.id).populate(
      "paymentID",
      "totalPrice paymentMethod paymentResult isPaid paidAt"
    );

    const user = await User.findById(reservation.user);

    res.json({ reservation, user });
  } else {
    res.status(404);
    throw new Error("Reservation not found");
  }
});

const getReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({}).populate("user", "id name");
  res.json(reservations);
});
export {
  addReservationItems,
  getReservationById,
  getMyReservations,
  getReservations,
  updateReservationToPaid,
  updateReservationToCheckedIn,
  updateReservationToCheckedOut,
};
