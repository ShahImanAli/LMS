import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/RichTextEditor";
import React from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCourseByIdQuery,
  usePublishCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "@/features/api/courseApi";
import { toast } from "sonner";

const CourseTab = () => {
  const navigate = useNavigate();

  const params = useParams();
  const courseId = params.courseId;

  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const [
    publishCourse,
    {
      data: publishData,
      error: publishError,
      isSuccess: publishIsSuccess,
      isError: publishIsError,
    },
  ] = usePublishCourseMutation();

  const [updateCourse, { data, error, isSuccess, isError, isLoading }] =
    useUpdateCourseMutation();

  const [
    deleteCourse,
    {
      data: deleteData,
      error: deleteError,
      isSuccess: deleteIsSuccess,
      isError: deleteIsError,
      isLoading: deleteIsLoading,
    },
  ] = useDeleteCourseMutation();

  const {
    data: courseByIdData,
    isLoading: courseByIdIsLoading,
  } = useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });

  const [input, setInput] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  useEffect(() => {
    if (courseByIdData) {
      setInput({
        title: courseByIdData.data.courseTitle || "",
        subtitle: courseByIdData.data.subTitle || "",
        description: courseByIdData.data.description || "",
        category: courseByIdData.data.category || "",
        courseLevel: courseByIdData.data.courseLevel || "",
        coursePrice: courseByIdData.data.coursePrice || "",
        courseThumbnail: courseByIdData.data.courseThumbnail || "",
      });
    }
  }, [courseByIdData]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const selectCategoryHandler = (value) => {
    setInput((prev) => ({ ...prev, category: value }));
  };

  const selectCourseLevelHandler = (value) => {
    setInput((prev) => ({ ...prev, courseLevel: value }));
  };

  const selectThumbnailHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput((prev) => ({ ...prev, courseThumbnail: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewThumbnail(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const publishCourseHandler = async (action) => {
    await publishCourse({ courseId, query: action });
  };

  useEffect(() => {
    if (publishIsSuccess) {
      const message = publishData?.data?.isPublished
        ? "Course published successfully"
        : "Course unpublished successfully";
      toast.success(message);
    }
    if (publishIsError) {
      toast.error(
        publishError?.data?.message || "Failed to update course status",
      );
    }
  }, [publishIsSuccess, publishError]);

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.title);
    formData.append("courseDescription", input.description);
    formData.append("category", input.category);
    formData.append("courseSubtitle", input.subtitle);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    if (input.courseThumbnail instanceof File) {
      formData.append("courseThumbnail", input.courseThumbnail);
    }
    await updateCourse({ formData, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course updated successfully");
      navigate("/admin/course");
    }
    if (isError) {
      toast.error(error?.data?.message || "Failed to update course");
    }
  }, [isSuccess, error]);

  const deleteCourseHandler = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this course? This will also delete all lectures and videos.",
      )
    ) {
      await deleteCourse(courseId);
    }
  };

  useEffect(() => {
    if (deleteIsSuccess) {
      toast.success(deleteData?.message || "Course deleted successfully");
      navigate("/admin/course");
    }
    if (deleteIsError) {
      toast.error(deleteError?.data?.message || "Failed to delete course");
    }
  }, [deleteIsSuccess, deleteIsError]);

  if (courseByIdIsLoading)
    return (
      <div className="flex items-center justify-center fixed inset-0">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );

  return (
    <Card>
      <CardHeader className="flex flex-col lg:flex-row lg:justify-between gap-4">
        <div className="flex-1">
          <CardTitle className="text-xl md:text-2xl">Course Details</CardTitle>
          <CardDescription className="mt-1.5">
            Add more details about the course to make it more informative for
            students.
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-center lg:items-end">
          <Button
            variant="outline"
            className="w-full sm:w-auto whitespace-nowrap"
            onClick={() =>
              publishCourseHandler(
                courseByIdData.data.isPublished ? "false" : "true",
              )
            }
            disabled={courseByIdData.data.lectures.length === 0}
          >
            {courseByIdData.data.isPublished
              ? "Unpublish Course"
              : "Publish Course"}
          </Button>
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={deleteCourseHandler}
            disabled={deleteIsLoading}
          >
            {deleteIsLoading ? "Removing..." : "Remove Course"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-4 md:px-6">
        <div className="space-y-5 mt-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Title</Label>
            <Input
              type="text"
              name="title"
              placeholder="Type course name"
              onChange={changeEventHandler}
              value={input.title}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">SubTitle</Label>
            <Input
              type="text"
              name="subtitle"
              placeholder="Type course subtitle"
              onChange={changeEventHandler}
              value={input.subtitle}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select
                value={input.category}
                onValueChange={selectCategoryHandler}
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom">
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    <SelectItem value="web-development">
                      Web Development
                    </SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="nextjs">Next JS</SelectItem>
                    <SelectItem value="javascript">Javascript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="nodejs">Node.js</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                    <SelectItem value="docker">Docker</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Course Level</Label>
              <Select
                value={input.courseLevel}
                onValueChange={selectCourseLevelHandler}
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Select course level" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom">
                  {" "}
                  <SelectGroup>
                    <SelectLabel>Course Levels</SelectLabel>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Price</Label>
              <Input
                type="number"
                name="coursePrice"
                placeholder="Enter price"
                onChange={changeEventHandler}
                value={input.coursePrice}
                className="w-full h-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Course Thumbnail</Label>
            <Input
              type="file"
              name="courseThumbnail"
              accept="image/*"
              className="w-76 h-10 pt-2"
              onChange={selectThumbnailHandler}
            />
            {previewThumbnail && (
              <div className="mt-2">
                <img
                  src={previewThumbnail}
                  alt="thumbnail"
                  className="w-76 rounded-md border border-gray-2000 h-50 object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-x-2 ">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={updateCourseHandler}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Please wait...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
