import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
import roomRoutes from "./routes/roomRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
const port = process.env.PORT || 5000;
connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log("API is running ");
});