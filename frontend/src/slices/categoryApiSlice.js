import { CATEGORIES_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: `${CATEGORIES_URL}/`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApiSlice;
