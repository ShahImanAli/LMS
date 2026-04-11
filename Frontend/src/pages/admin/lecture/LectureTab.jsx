import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useDeleteLectureMutation,
  useEditLectureMutation,
  useGetLectureByIdQuery,
} from "@/features/api/courseApi";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const LectureTab = () => {
  const [title, setTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const navigate = useNavigate();

  const params = useParams();
  const { courseId, lectureId } = params;

  const { data: lectureData } = useGetLectureByIdQuery({ lectureId });

  const lecture = lectureData?.data;

  useEffect(() => {
    if (lecture) {
      setTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo({
        videoUrl: lecture.videoUrl,
        publicId: lecture.publicId,
      });
    }
  }, [lecture]);

  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();

  const [
    deleteLecture,
    {
      data: deleteData,
      isLoading: deleteLoading,
      isSuccess: deleteSuccess,
      error: deleteError,
    },
  ] = useDeleteLectureMutation();

  const removeLectureHandler = async () => {
    try {
      await deleteLecture({
        lectureId,
      });
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete lecture. Please try again.");
    }
  };

  useEffect(() => {
    if (deleteSuccess) {
      toast.success(deleteData?.message || "Lecture deleted successfully!");
      navigate(-1);
    }
    if (deleteError) {
      toast.error(
        deleteError?.data?.message ||
        "Failed to delete lecture. Please try again.",
      );
    }
  }, [deleteSuccess, deleteError]);

  const editLectureHandler = async () => {
    await editLecture({
      lectureTitle: title,
      isPreviewFree: isFree,
      videoInfo: uploadVideoInfo,
      courseId,
      lectureId,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture updated successfully!");
    }
    if (error) {
      toast.error(
        error?.data?.message || "Failed to update lecture. Please try again.",
      );
    }
  }, [isSuccess, error]);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formdata = new FormData();
      formdata.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post("/api/v1/media/upload-video", formdata, {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            setUploadProgress(progress);
          },
        });

        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          toast.success("Video uploaded successfully!");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Failed to upload video. Please try again.");
      } finally {
        setMediaProgress(false);
        setUploadProgress(0);
      }
    }
  };

  return (
    <div className="flex justify-between">
      <Card className="w-full max-w-6xl">
        <CardHeader className="flex justify-between">
          <div className="space-y-1">
            <CardTitle>Lecture Details</CardTitle>
            <CardDescription>Update your lecture details here.</CardDescription>
          </div>
          <div>
            <Button
              onClick={removeLectureHandler}
              disabled={deleteLoading}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Delete Lecture"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="EX: Introduction To JAVASCRIPT"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Video</Label>
            <Input
              type="file"
              accept="video/*"
              placeholder="Upload Video"
              onChange={fileChangeHandler}
              disabled={mediaProgress}
            />
          </div>
          <div className="flex items-center space-x-2 my-2">
            <div className="flex-1 space-y-2">
              <Label>Or YouTube Video Link</Label>
              <Input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={uploadVideoInfo?.videoUrl || ""}
                onChange={(e) => setUploadVideoInfo({ videoUrl: e.target.value, publicId: "" })}
                disabled={mediaProgress}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 my-5">
            <div className="flex items-center space-x-2">
              <Switch
                id="airplane-mode"
                checked={isFree}
                onCheckedChange={(checked) => setIsFree(checked)}
              />
              <Label htmlFor="airplane-mode">Is This Video Free</Label>
            </div>
          </div>

          {mediaProgress && (
            <div className="my-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 mt-1">
                {uploadProgress}% uploaded
              </p>
            </div>
          )}

          <div className="mt-4">
            <Button
              variant="default"
              disabled={btnDisabled || mediaProgress}
              onClick={editLectureHandler}
            >
              {mediaProgress ? "Uploading..." : "Update Lecture"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LectureTab;
