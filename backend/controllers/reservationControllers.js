import asyncHandler from "../middleware/asyncHandler.js";
import Reservation from "../models/reservationModel.js";
import Payment from "../models/paymentModel.js";

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
    });

    const createdReservation = await reservation.save();
    res.status(201).json(createdReservation);
  }
});

export { addReservationItems };
