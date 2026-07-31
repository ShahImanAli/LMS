import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeInfo, Loader, Loader2, Lock, PlayCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Button } from "@/components/ui/button";
import BuyCourseButton from "@/components/BuyCourseButton";
import { Navigate, useParams } from "react-router-dom";
import { useGetCourseWithPurchaseStatusQuery } from "@/features/api/purchaseApi";
import { useNavigate } from "react-router-dom";

const CourseDetail = () => {

  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;

  const { data, isLoading, isSuccess, error } =
    useGetCourseWithPurchaseStatusQuery(courseId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-muted-foreground">Loading course...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">
          {error?.data?.message || "Failed to load course details"}
        </p>
      </div>
    );
  }

  const { course, purchased } = data || {};

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  }

  const isYouTubeUrl = (url) => {
    return url && (url.includes("youtube.com") || url.includes("youtu.be"));
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  return (
    <div className="mt-15 space-y-10">
      <div className="bg-[#2D2F31] dark:bg-gray-900 text-white">
        <div className="max-w-8xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">{course.courseTitle}</h1>
          <p className="text-base md:text-lg">Course SubTitle</p>
          <p>
            Created By :{" "}
            <span className="text-[#C0C4FC] dark:text-blue-400 underline italic">
              {course.creator?.name}
            </span>{" "}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt?.split("T")[0]}</p>
          </div>
          <p>Student Enrolled : {course?.enrolledStudents.length}</p>
        </div>
      </div>

      {/* description */}

      <div className="max-w-8xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5 relative z-10">
          <h1 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-gray-100">Description</h1>
          <div
            className="text-base md:text-lg wrap-break-word whitespace-normal overflow-wrap-anywhere leading-7 md:leading-8 text-gray-800 dark:text-gray-200 **:bg-transparent! **:text-inherit!"
            dangerouslySetInnerHTML={{ __html: course.description }}
          >

          </div>
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>{course.lectures.length} Lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.lectures.map((lecture, index) => (
                <div key={lecture._id} className="flex items-center gap-2">
                  <span>
                    {lecture.isPreviewFree ? <PlayCircle size={14} /> : <Lock size={14} />}
                  </span>
                  <p>{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        {/* 2nd div */}
        <div className="w-full lg:w-1/3 relative z-0">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full mb-4">
                {course?.lectures?.[0]?.videoUrl && (course?.lectures?.[0]?.isPreviewFree || purchased) ? (
                  <div className="w-full aspect-video rounded-md overflow-hidden bg-black">
                    {isYouTubeUrl(course.lectures[0].videoUrl) ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={getYouTubeEmbedUrl(course.lectures[0].videoUrl)}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    ) : (
                      <video
                        className="w-full h-full"
                        controls
                        preload="metadata"
                        src={course.lectures[0].videoUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                    {course?.courseThumbnail?.url ? (
                      <>
                        <img
                          src={course.courseThumbnail.url}
                          alt={course.courseTitle}
                          className="w-full h-full object-cover"
                        />
                        {!purchased && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="text-center text-white">
                              <Lock size={40} className="mx-auto mb-2" />
                              <p className="text-lg font-semibold">Purchase to get access</p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        {purchased ? "No video available" : "Course preview"}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <h1 className="font-medium text-gray-900 dark:text-gray-100">{course?.lectures?.[0]?.lectureTitle || "Lecture Title"}</h1>
              <Separator className="my-4" />
              <h1 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
                Course Price: ₹{course?.coursePrice || "N/A"}
              </h1>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button className="w-full" onClick={handleContinueCourse}>Continue Course </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
