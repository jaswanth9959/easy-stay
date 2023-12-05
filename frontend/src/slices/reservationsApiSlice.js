import { apiSlice } from "./apiSlice";
import { RESERVATIONS_URL, PAYPAL_URL } from "../constants";

export const reservationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createReservation: builder.mutation({
      query: (reservation) => ({
        url: RESERVATIONS_URL,
        method: "POST",
        body: reservation,
      }),
    }),
    getReservationDetails: builder.query({
      query: (id) => ({
        url: `${RESERVATIONS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getReservations: builder.query({
      query: () => ({
        url: RESERVATIONS_URL,
      }),
      keepUnusedDataFor: 5,
    }),

    getMyReservations: builder.query({
      query: () => ({
        url: `${RESERVATIONS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),
    payReservation: builder.mutation({
      query: ({ id, details }) => ({
        url: `${RESERVATIONS_URL}/${id}/pay`,
        method: "PUT",
        body: details,
      }),
    }),
    cancelReservation: builder.mutation({
      query: (id) => ({
        url: `${RESERVATIONS_URL}/${id}/cancel`,
        method: "PUT",
      }),
    }),
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    checkInReservation: builder.mutation({
      query: (Id) => ({
        url: `${RESERVATIONS_URL}/${Id}/checkedIn`,
        method: "PUT",
      }),
    }),
    checkOutReservation: builder.mutation({
      query: (Id) => ({
        url: `${RESERVATIONS_URL}/${Id}/checkedOut`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useCreateReservationMutation,
  useGetReservationDetailsQuery,
  useGetMyReservationsQuery,
  useCheckInReservationMutation,
  useGetReservationsQuery,
  useCheckOutReservationMutation,
  useGetPaypalClientIdQuery,
  useCancelReservationMutation,
  usePayReservationMutation,
} = reservationApiSlice;
