import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API = "/api/v1/course-progress/";

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include",
  }),
  tagTypes: ["CourseProgress"],
  endpoints: (builder) => ({
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags: ["CourseProgress"],
    }),
    updateCourseProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}/viewed`,
        method: "POST",
      }),
      invalidatesTags: ["CourseProgress"],
    }),
    markAsCompleted: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/mark-completed`,
        method: "POST",
      }),
      invalidatesTags: ["CourseProgress"],
    }),
    markAsInCompleted: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/mark-incompleted`,
        method: "POST",
      }),
      invalidatesTags: ["CourseProgress"],
    }),
    markLectureAsCompleted: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}/completed`,
        method: "POST",
      }),
      invalidatesTags: ["CourseProgress"],
    }),
    markLectureAsInCompleted: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lecture/${lectureId}/incompleted`,
        method: "POST",
      }),
      invalidatesTags: ["CourseProgress"],
    }),
  }),
});

export const {
  useGetCourseProgressQuery,
  useUpdateCourseProgressMutation,
  useMarkAsCompletedMutation,
  useMarkAsInCompletedMutation,
  useMarkLectureAsCompletedMutation,
  useMarkLectureAsInCompletedMutation,
} = courseProgressApi;
