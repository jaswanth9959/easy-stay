import { apiSlice } from "./apiSlice";
import { RESERVATIONS_URL } from "../constants";

export const reservationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createReservation: builder.mutation({
      query: (reservation) => ({
        url: RESERVATIONS_URL,
        method: "POST",
        body: reservation,
      }),
    }),
  }),
});

export const { useCreateReservationMutation } = reservationApiSlice;
