import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const param = useParams();
  const courseId = param.courseId;
  const lectureId = param.lectureId;

  return (
    <div className="flex-1 mx-10">
      <div className="flex items-center gap-2 mb-5">
        <Link to={`/admin/course/${courseId}/lecture`}>
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft size={20} />
          </Button>
        </Link>

        <h1 className="font-bold text-xl">Update Your Lecture</h1>
      </div>
      
      <LectureTab/>
    </div>
  );
};

export default EditLecture;
