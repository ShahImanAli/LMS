import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };
  return (
    <section
      className="relative flex items-center justify-center min-h-[60vh] sm:min-h-[65vh] bg-linear-to-r from-blue-500 to-indigo-600 dark:from-gray-800 dark:to-gray-800 py-8 sm:py-12 px-4 sm:px-6 text-center transition-colors duration-700"
      aria-label="Hero Section"
    >
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center animate-fade-in">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 mt-4 sm:mt-6 drop-shadow-lg leading-tight px-2">
          Find The Best Courses For Youself
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-6 sm:mb-8 md:mb-10 text-base sm:text-lg md:text-xl lg:text-2xl font-medium px-4">
          Discover, Learn, and Upskill with our wide range of courses
        </p>

        <form
          className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-2xl w-full mx-auto mb-6 sm:mb-8"
          role="search"
          aria-label="Search Courses"
          onSubmit={searchHandler}
        >
          <Input
            className="grow border-none focus-visible:ring-0 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Search Courses"
            aria-label="Search Courses"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            type="submit"
            className="bg-blue-600 dark:bg-blue-700 text-white px-4 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg lg:text-xl rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
            aria-label="Submit Search"
          >
            Search
          </Button>
        </form>

        <Button
          onClick={() => navigate("/course/search")}
          className="bg-white dark:bg-gray-800 text-blue-600 dark:text-white px-6 sm:px-8 md:px-5 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg lg:text-xl rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 shadow-md transition-transform duration-300 hover:scale-105 font-semibold"
          aria-label="Explore Courses"
        >
          Explore Courses
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
