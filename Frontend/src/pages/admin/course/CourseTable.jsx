import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { useGetAllCoursesQuery } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";

const CourseTable = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetAllCoursesQuery();

  const courses = data?.data || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Courses</h1>
        <Button
          onClick={() => {
            navigate("/admin/course/create");
          }}
        >
          Create New Course
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 dark:text-red-400 py-8">
          Failed to load courses. Please try again.
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No courses found. Create your first course!
          </p>
          <Button onClick={() => navigate("/admin/course/create")}>
            Create Course
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="font-medium">
                  ${course.coursePrice || 0}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      course.isPublished
                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                    }`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">{course.courseTitle}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/admin/course/${course._id}`)}
                    size="sm"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CourseTable;
