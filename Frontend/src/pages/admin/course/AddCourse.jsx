import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { toast } from "sonner";

const AddCourse = () => {

  const[courseTitle,setCourseTitle] = useState("");
  const[courseCategory,setCourseCategory] = useState("");

  const[createCourse, {isLoading , isSuccess }] = useCreateCourseMutation();

  const navigate = useNavigate();

  const createCourseHandler = async () => {
    await createCourse({courseTitle, category: courseCategory});
  }

  useEffect(() => {
    if(isSuccess){
      toast.success("Course created successfully!");
      navigate("/admin/course");
    }
  }, [isSuccess]); 

  const getSelectedCategory = (value) => {
    setCourseCategory(value);

  }

  return (
    <div className="flex-1 p-6 mx-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Create a New Course</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Fill in the details below to add a new course.
        </p>
      </div>

      <div className="space-y-6 max-w-md">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Type course name"
            name="courseTitle"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent position="popper" side="bottom">
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem value="web-development">Web Development</SelectItem>
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

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler} className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Creating...
              </>
            ) : (
              "Create Course"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
