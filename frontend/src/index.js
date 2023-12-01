import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";
import store from "./store";
import { Provider } from "react-redux";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import RoomsScreen from "./screens/RoomsScreen";
import RoomDetailsScreen from "./screens/RoomDetailsScreen";
import UserEditScreen from "./screens/admin/UserEditScreen";
import UserListScreen from "./screens/admin/UserListScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ConfirmScreen from "./screens/ConfirmScreen";
import PaymentScreen from "./screens/PaymentScreen";
import CompleteReservationScreen from "./screens/CompleteReservationScreen";
import ReservationScreen from "./screens/ReservationScreen";
import MyReservationsScreen from "./screens/MyReservationsScreen";
import ReservationListScreen from "./screens/admin/ReservationListScreen";
import RoomsListScreen from "./screens/admin/RoomsListScreen";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import AddRoomScreen from "./screens/admin/AddRoomScreen";
import EditRoomScreen from "./screens/admin/EditRoomScreen";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/rooms" element={<RoomsScreen />} />
      <Route path="/rooms/:id" element={<RoomDetailsScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/confirm" element={<ConfirmScreen />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route
          path="/completeReservation"
          element={<CompleteReservationScreen />}
        />
        <Route path="/reservation/:id" element={<ReservationScreen />} />
        <Route path="/myreservations" element={<MyReservationsScreen />} />
      </Route>
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
        <Route path="/admin/reservations" element={<ReservationListScreen />} />
        <Route path="/admin/rooms" element={<RoomsListScreen />} />
        <Route path="/admin/rooms/add" element={<AddRoomScreen />} />
        <Route path="/admin/rooms/:id/edit" element={<EditRoomScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider deferLoading={true}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
