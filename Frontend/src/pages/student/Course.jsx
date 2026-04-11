import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

function Course({ course }) {
  if (!course || !course._id) return null;

  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 py-0 gap-0 cursor-pointer border border-gray-200 dark:border-gray-700">
        <div className="relative">
          <img
            src={
              course.courseThumbnail?.url ||
              "https://via.placeholder.com/400x200"
            }
            alt="course"
            className="w-full h-45 object-cover"
          />
        </div>
        <CardContent className="px-5 pb-4 pt-3 space-y-3">
          <h1 className="font-bold text-lg truncate hover:underline text-center text-gray-900 dark:text-gray-100">
            {course.courseTitle}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    course.creator?.photoUrl || "https://github.com/shadcn.png"
                  }
                  alt="shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-sm text-gray-600 dark:text-gray-400">
                {course.creator?.name}
              </h1>
            </div>
            <Badge className="bg-blue-600 dark:bg-blue-700 text-xs text-white rounded-full">
              {course.courseLevel.charAt(0).toUpperCase() +
                course.courseLevel.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">Rs.{course.coursePrice}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default Course;
