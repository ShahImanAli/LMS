import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const PURCHASE_API = "/api/v1/purchase/";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({ baseUrl: PURCHASE_API, credentials: "include" }),
  tagTypes: ["Purchase"],
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: `checkout/create-checkout-session`,
        method: "POST",
        body: { courseId },
      }),
      transformResponse: (response) => {
        return response?.data || response;
      },
    }),
    getCourseWithPurchaseStatus: builder.query({
      query: (courseId) => ({
        url: `course/${courseId}/details-with-status`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response?.data || response;
      },
    }),
    getAllPurchasedCourses: builder.query({
      query: () => ({
        url: `purchased-courses`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response?.data || response;
      },
    }),
    getAllInstructorSales: builder.query({
      query: () => ({
        url: `sales`,
        method: "GET",
      }),
      transformResponse: (response) => {
        return response?.data || response;
      },
    }),
  }),
});

export const { useCreateCheckoutSessionMutation, useGetAllPurchasedCoursesQuery, useGetAllInstructorSalesQuery, useGetCourseWithPurchaseStatusQuery } = purchaseApi;
