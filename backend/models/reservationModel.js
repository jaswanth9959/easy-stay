import mongoose from "mongoose";

const reservationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    paymentID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Payment",
    },
    reservationItems: [
      {
        title: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        roomNumber: { type: String, required: true },
        room: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Room",
        },
      },
    ],
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    numOfDays: { type: Number, required: true },
    selectedRooms: {
      type: Array,
    },
    roomsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isCheckedIn: {
      type: Boolean,
      required: true,
      default: false,
    },
    checkedInAt: {
      type: Date,
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
    },
    isCheckedOut: {
      type: Boolean,
      required: true,
      default: false,
    },
    checkedOutAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
