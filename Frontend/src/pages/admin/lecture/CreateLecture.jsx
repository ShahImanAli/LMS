import React from "react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useCreateLectureMutation,
  useGetCourseLecturesQuery,
} from "@/features/api/courseApi";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");

  const param = useParams();
  const courseId = param.courseId;

  const navigate = useNavigate();

  const [createLecture, { data, isLoading, error, isSuccess }] =
    useCreateLectureMutation();

  const {
    data: lecturesData,
    isLoading: islecturesLoading,
    isError: isLecturesError,
  } = useGetCourseLecturesQuery(courseId);

  const handleCreateLecture = async () => {
    try {
      await createLecture({ lectureTitle, courseId });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture created successfully");
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to create lecture");
    }
  }, [isSuccess, error, data, navigate, courseId]);

  return (
    <div className="flex-1 p-6 mx-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Create a New Lecture</h1>
        <p className="text-sm text-gray-600">
          Fill in the details below to add a new lecture.
        </p>
      </div>

      <div className="space-y-6 ">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            type="text"
            placeholder="Type lecture name"
            name="lectureTitle"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>

          <Button
            disabled={isLoading}
            onClick={handleCreateLecture}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                Creating...
              </>
            ) : (
              "Create Lecture"
            )}
          </Button>
        </div>

        <div className="mt-10">
          {islecturesLoading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="animate-spin h-4 w-4" />
              Loading Lectures...
            </div>
          ) : isLecturesError ? (
            <div className="flex items-center gap-2 text-gray-600">
              Failed to load lectures.
            </div>
          ) : lecturesData?.data?.length === 0 ? (
            <div className="flex items-center gap-2 text-gray-600">
              No lectures available.
            </div>
          ) : (
            lecturesData?.data?.map((lecture, index) => (
              <Lecture key={lecture._id} lecture={lecture} index={index} courseId={courseId} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;