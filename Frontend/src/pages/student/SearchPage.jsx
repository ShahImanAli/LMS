import React, { use } from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchCoursesQuery } from "@/features/api/courseApi";
import { useState } from "react";

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
      <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
        Course Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
        Sorry, we couldn't find the course you're looking for.
      </p>
      <Link to="/" className="italic">
        <Button variant="link">Browse All Courses</Button>
      </Link>
    </div>
  );
};

const CourseSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col md:flex-row justify-between border-b border-gray-300 dark:border-gray-700 py-4">
      <div className="h-32 w-full md:w-64">
        <Skeleton className="h-full w-full object-cover bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="flex flex-col gap-2 flex-1 px-4">
        <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700" />
        </div>
        <Skeleton className="h-6 w-20 mt-2 bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="flex flex-col items-end justify-between mt-4 md:mt-0">
        <Skeleton className="h-6 w-12 bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
};

const SearchPage = () => {
  // const isLoading = true;

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const { data, isLoading, isError } = useSearchCoursesQuery({
    searchQuery: query,
    category: selectedCategory,
    sortByPrice: sortByPrice,
  });

  const handleFilterChange = (categories, price) => {
    setSelectedCategory(categories);
    setSortByPrice(price);
  };

  const isEmpty = !isLoading && data?.data?.length === 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 md:p-8 mt-10">
        <div className="my-6">
          <h1 className="font-bold text-2xl md:text-2xl text-gray-900 dark:text-gray-100">{query}</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Search Result For{" "}
            <span className="text-blue-800 dark:text-blue-400 font-bold italic"> {query}</span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row font-bold gap-10">
          <Filter handleFilterChange={handleFilterChange} />
          <div className="flex-1">
            {isLoading ? (
            Array(5)
              .fill(0)
              .map((_, index) => <CourseSkeleton key={index} />)
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            data?.data?.map((course) => <SearchResult key={course._id} course={course} />)
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
