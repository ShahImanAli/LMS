import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import Course from "./Course";
import { useGetAllPurchasedCoursesQuery } from "@/features/api/purchaseApi";

function MyLearning() {
  const { data, isLoading, error } = useGetAllPurchasedCoursesQuery();

  const myLearningCourse = data?.purchasedCourses || [];

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-[#020817]">
        <p className="text-red-500">Error loading courses: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto max-w-8xl pt-28 pb-10 px-4 bg-white dark:bg-[#020817]">
      <h1 className="item-center justify-center w-full h-full font-extrabold text-center text-3xl mb-10 text-gray-900 dark:text-gray-100">My Learning</h1>
      <div className="my-5">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearningCourse.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-900 dark:text-gray-300 text-lg">You are not enrolled in any of the course</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myLearningCourse.map((course) => (
              <Course key={course._id} course={course.courseId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLearning;

const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <Skeleton className="w-full h-40 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md mb-3" />
        <div className="px-5 py-4 space-y-3">
          <Skeleton className="h-7 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md mb-1" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse mr-1" />
              <Skeleton className="h-5 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
            </div>
            <Skeleton className="h-5 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
          </div>
          <Skeleton className="h-5 w-1/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md" />
        </div>
      </div>
    ))}
  </div>
);
