import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import Course from "./Course";
import { useGetPublishedCoursesQuery } from "@/features/api/courseApi";

function Courses() {
  const { data, isLoading: isPublishedCoursesLoading } =
    useGetPublishedCoursesQuery();
  const publishedCourses = data?.data || [];

  return (
    <div id="courses" className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-8xl mx-auto text-center p-6">
        <h1 className="font-extrabold text-center text-3xl mb-10 text-gray-900 dark:text-gray-100">
          Our Courses
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {isPublishedCoursesLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : publishedCourses
                .filter((course) => course)
                .map((course) => (
                  <Course key={course._id} course={course} />
                ))}
        </div>
      </div>
    </div>
  );
}

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
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
  );
};
