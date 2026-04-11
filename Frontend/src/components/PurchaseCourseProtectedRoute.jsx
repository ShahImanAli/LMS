import { useGetAllPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import React from "react";
import { Navigate, useParams } from "react-router-dom";

export const PurchaseCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();
  const { data, isLoading, isError } = useGetAllPurchasedCoursesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  return data?.purchasedCourses?.some(
    (course) => course.courseId._id === courseId || course.courseId === courseId
  ) ? (
    children
  ) : (
    <Navigate to={`/course-detail/${courseId}`} />
  );
};
