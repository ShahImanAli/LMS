import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "/api/v1/courses/";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({ baseUrl: COURSE_API, credentials: "include" }),
  tagTypes: ["Course"],
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "/",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Course"],
    }),
    getPublishedCourses: builder.query({
      query: () => ({
        url: "published-courses",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    updateCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Course"],
    }),
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/${courseId}/lectures`,
        method: "POST",
        body: { lectureTitle },
      }),
      invalidatesTags: ["Course"],
    }),

    searchCourses: builder.query({
      query: ({ searchQuery, category, sortByPrice }) => {
        // Build query string
        let queryString = `/search?query=${encodeURIComponent(searchQuery)}`;

        // Append category (send as multiple params for array parsing)
        if (category && category.length > 0) {
          category.forEach((cat) => {
            queryString += `&category=${encodeURIComponent(cat)}`;
          });
        }

        // Append sortByPrice if available
        if (sortByPrice) {
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
        }

        return {
          url: queryString,
          method: "GET",
        };
      },
    }),

    getCourseLectures: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/lectures`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    editLecture: builder.mutation({
      query: ({
        lectureTitle,
        isPreviewFree,
        videoInfo,
        courseId,
        lectureId,
      }) => ({
        url: `/${courseId}/lectures/${lectureId}`,
        method: "POST",
        body: { lectureTitle, isPreviewFree, videoInfo },
      }),
      invalidatesTags: ["Course"],
    }),
    deleteLecture: builder.mutation({
      query: ({ lectureId }) => ({
        url: `lectures/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
    getLectureById: builder.query({
      query: ({ lectureId }) => ({
        url: `lectures/${lectureId}`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    publishCourse: builder.mutation({
      query: ({ courseId, query }) => ({
        url: `/${courseId}/publish?publish=${query}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Course"],
    }),
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useUpdateCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLecturesQuery,
  useEditLectureMutation,
  useDeleteLectureMutation,
  useGetLectureByIdQuery,
  usePublishCourseMutation,
  useDeleteCourseMutation,
  useGetPublishedCoursesQuery,
  useSearchCoursesQuery,
} = courseApi;
