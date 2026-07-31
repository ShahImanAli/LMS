import { useGetAllPurchasedCoursesQuery, useGetCourseWithPurchaseStatusQuery } from "@/features/api/purchaseApi";
import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export const PurchaseCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { data: purchaseData, isLoading: purchaseLoading, isError: purchaseError } = useGetAllPurchasedCoursesQuery();
  const { data: courseData, isLoading: courseLoading, isError: courseError } = useGetCourseWithPurchaseStatusQuery(courseId);

  if (purchaseLoading || courseLoading) return <div>Loading...</div>;
  if (purchaseError || courseError) return <div>Error...</div>;

  const isPurchased = purchaseData?.purchasedCourses?.some(
    (course) => course.courseId._id === courseId || course.courseId === courseId
  );

  const isCreator = courseData?.course?.creator?._id === user?._id;

  return isPurchased || isCreator ? (
    children
  ) : (
    <Navigate to={`/course-detail/${courseId}`} />
  );
};
