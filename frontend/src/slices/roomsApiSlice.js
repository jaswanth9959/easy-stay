import { ROOMS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const roomsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query({
      query: () => ({
        url: ROOMS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getRoomDetails: builder.query({
      query: (roomId) => ({
        url: `${ROOMS_URL}/${roomId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createRoom: builder.mutation({
      query: (data) => ({
        url: `${ROOMS_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Room"],
    }),
    updateRoom: builder.mutation({
      query: (data) => ({
        url: `${ROOMS_URL}/${data.roomId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Room"],
    }),
    uploadRoomImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: "POST",
        body: data,
      }),
    }),
    deleteRoom: builder.mutation({
      query: (roomId) => ({
        url: `${ROOMS_URL}/${roomId}`,
        method: "DELETE",
      }),
      providesTags: ["Room"],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${ROOMS_URL}/${data.roomId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Room"],
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomDetailsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useUploadRoomImageMutation,
  useDeleteRoomMutation,
  useCreateReviewMutation,
} = roomsApiSlice;
