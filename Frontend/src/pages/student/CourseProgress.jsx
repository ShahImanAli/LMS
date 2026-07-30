import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PlayCircle, ArrowLeft, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useGetCourseProgressQuery,
  useUpdateCourseProgressMutation,
  useMarkAsCompletedMutation,
  useMarkAsInCompletedMutation,
  useMarkLectureAsCompletedMutation,
  useMarkLectureAsInCompletedMutation,
} from "@/features/api/courseProgressApi";

const CourseProgress = () => {
  const [currentLecture, setCurrentLecture] = useState(null);

  const navigate = useNavigate();

  const params = useParams();

  const courseId = params.courseId;

  const [updateCourseProgress] = useUpdateCourseProgressMutation();

  const [markAsCompleted] = useMarkAsCompletedMutation();

  const [markAsInCompleted] = useMarkAsInCompletedMutation();

  const [markLectureAsCompleted, { isLoading: isMarkingCompleted }] =
    useMarkLectureAsCompletedMutation();

  const [markLectureAsInCompleted, { isLoading: isMarkingInCompleted }] =
    useMarkLectureAsInCompletedMutation();

  const {
    data: courseProgress,
    isLoading,
    isError,
  } = useGetCourseProgressQuery(courseId);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading course progress...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-red-500">Unable to load course progress.</p>
      </div>
    );
  }

  const { courseDetails, progress, completed } = courseProgress?.data || {};

  const { courseTitle } = courseDetails;

  const totalLectures = courseDetails?.lectures?.length || 0;

  const initializeLecture =
    courseDetails?.lectures && courseDetails.lectures.length > 0
      ? courseDetails.lectures[0]
      : null;

  const selectedLecture = currentLecture || initializeLecture;

  const activeLectureId = (
    currentLecture?._id || initializeLecture?._id
  )?.toString();

  const viewedLectureIds = new Set(
    (progress || [])
      .filter((item) => item.viewed)
      .map((item) =>
        item.lectureId?.toString ? item.lectureId.toString() : item.lectureId,
      ),
  );

  const completedLectureIds = new Set(
    (progress || [])
      .filter((item) => item.completed)
      .map((item) =>
        item.lectureId?.toString ? item.lectureId.toString() : item.lectureId,
      ),
  );

  const completedCount = completedLectureIds.size;

  const handleLectureSelect = (lecture) => {
    setCurrentLecture(lecture);
  };

  const handleLectureProgress = async (lectureId) => {
    if (!lectureId) return;
    try {
      await updateCourseProgress({ courseId, lectureId });
    } catch (error) {
      console.error("Error updating course progress:", error);
    }
  };

  const isMarking = isMarkingCompleted || isMarkingInCompleted;

  const handleLectureCompletionToggle = async (lectureId, e) => {
    if (e) e.stopPropagation();
    if (!courseId || !lectureId || isMarking) return;

    const isCurrentlyCompleted = completedLectureIds.has(lectureId?.toString());

    try {
      if (isCurrentlyCompleted) {
        await markLectureAsInCompleted({ courseId, lectureId }).unwrap();
        toast.success("Lecture marked as incomplete.");
        // If course was completed, unmark it since a lecture is now incomplete
        if (completed) {
          await markAsInCompleted(courseId).unwrap();
        }
      } else {
        await markLectureAsCompleted({ courseId, lectureId }).unwrap();
        toast.success("Lecture marked as complete.");
        // Check if all lectures are now completed
        if (completedCount + 1 >= totalLectures && totalLectures > 0) {
          await markAsCompleted(courseId).unwrap();
          toast.success("All lectures completed! Course marked as complete.");
        }
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "Unable to update lecture completion status.",
      );
      console.error("Error updating lecture completion:", error);
    }
  };

  const isYouTubeUrl = (url) => {
    return url && (url.includes("youtube.com") || url.includes("youtu.be"));
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 mt-20">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Course Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl text-gray-900 dark:text-gray-100">
            {courseTitle}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Continue your learning journey
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {completedCount} / {totalLectures} lectures completed
          </Badge>
          {completed && (
            <Badge className="text-sm bg-green-600 dark:bg-green-700">
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Course Completed
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Video Section */}
        <div className="flex-1 space-y-4">
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardContent className="p-0">
              <div className="aspect-video bg-black dark:bg-gray-950 rounded-t-lg overflow-hidden rounded-lg ">
                {isYouTubeUrl(selectedLecture?.videoUrl) ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYouTubeEmbedUrl(selectedLecture?.videoUrl)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    onLoad={() => handleLectureProgress(selectedLecture?._id)}
                  ></iframe>
                ) : (
                  <video
                    src={selectedLecture?.videoUrl || ""}
                    onPlay={() => handleLectureProgress(selectedLecture?._id)}
                    className="w-full h-full"
                    controls
                    controlsList="nodownload"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <PlayCircle className="h-5 w-5 text-primary" />
                  <Badge variant="secondary">
                    Lecture
                    {(courseDetails?.lectures?.findIndex(
                      (l) => l._id === selectedLecture?._id,
                    ) ?? 0) + 1}
                  </Badge>
                </div>

                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  {selectedLecture?.lectureTitle || "Untitled lecture"}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lecture Sidebar */}
        <div className="lg:w-96 space-y-4">
          <Card className="border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-150 overflow-y-auto">
              {courseDetails?.lectures?.map((lecture) => {
                const isViewed = viewedLectureIds.has(lecture?._id?.toString());
                const isActive = lecture?._id?.toString() === activeLectureId;
                const isLectureCompleted = completedLectureIds.has(
                  lecture?._id?.toString(),
                );

                return (
                  <div
                    key={lecture._id}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                      isActive ? "bg-accent" : ""
                    }`}
                    onClick={() => handleLectureSelect(lecture)}
                  >
                    {isViewed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                    ) : (
                      <PlayCircle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm line-clamp-2 text-gray-900 dark:text-gray-100">
                          {lecture.lectureTitle}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          {isLectureCompleted ? (
                            <Badge
                              variant="default"
                              className="cursor-pointer hover:bg-primary/80 transition-colors"
                              onClick={(e) => handleLectureCompletionToggle(lecture._id, e)}
                            >
                              Completed
                            </Badge>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              disabled={isMarking}
                              onClick={(e) =>
                                handleLectureCompletionToggle(lecture._id, e)
                              }
                            >
                              {isMarking ? "..." : "Complete"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;