import asyncHandler from "../middleware/asyncHandler.js";
import Reservation from "../models/reservationModel.js";
import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";
import Room from "../models/roomModel.js";
import moment from "moment";

function getDatesInRange(startDate, endDate) {
  const dateArray = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray.map((date) => date.toISOString());
}

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
        roomNumber: reservationItems[0].roomNumber,
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
    reservation.status = "Checked-In";
    // const currDate = Date.now();
    // reservation.checkedInAt = new Intl.DateTimeFormat("en-US", {
    //   timeZone: "America/New_York",
    // }).format(currDate);

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
    reservation.status = "Completed";
    // const currDate = Date.now();
    // reservation.checkedOutAt = new Intl.DateTimeFormat("en-US", {
    //   timeZone: "America/Chicago",
    // }).format(currDate);

    const updatedreservation = await reservation.save();

    res.json(updatedreservation);
  } else {
    res.status(404);
    throw new Error("Reservation not found");
  }
});

const updateReservationToCanceled = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  if (reservation) {
    reservation.status = "Canceled";
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
    // const currDate = Date.now();
    // payment.paidAt = new Intl.DateTimeFormat("en-US", {
    //   timeZone: "America/Chicago",
    // }).format(currDate);
    payment.paidAt = Date.now();
    payment.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer?.email_address,
    };
    const updatedPayment = await payment.save();
    const allDates = getDatesInRange(ress.fromDate, ress.toDate);
    try {
      await Room.updateOne(
        { "roomNumbers._id": ress.selectedRooms[0] },
        {
          $push: {
            "roomNumbers.$.unavailableDates": allDates,
          },
        }
      );
      res.status(200).json("Room status has been updated.");
    } catch (error) {
      res.status(404);
      throw new Error(" not found");
    }

    const room = Room.findById(ress.reservationItems[0].room);

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
  updateReservationToCanceled,
};
