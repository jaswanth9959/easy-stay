import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
const CompleteReservationScreen = () => {
  const cart = useSelector((state) => state.cart);
  console.log(cart.cartItems);
  return <div>CompleteReservationScreen</div>;
};

export default CompleteReservationScreen;
