import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";

const getCourseProgress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.params;

  const courseProgress = await CourseProgress.findOne({
    userId,
    courseId,
  });

  const courseDetails = await Course.findById(courseId).populate("lectures");

  if (!courseDetails) {
    throw new ApiError(404, "Course not found");
  }

  if (!courseProgress) {
    return res.status(200).json({
      data: {
        progress: [],
        completed: false,
        courseDetails,
      },
      message: "Unable to retrieve course progress ",
    });
  }

  return res.status(200).json({
    data: {
      progress: courseProgress.lectureProgress,
      completed: courseProgress.completed,
      courseDetails,
    },
    message: "Course progress retrieved successfully",
  });
});

const updateCourseProgress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId, lectureId } = req.params;

  let courseProgress = await CourseProgress.findOne({
    userId,
    courseId,
  });

  if (!courseProgress) {
    courseProgress = new CourseProgress({
      userId,
      courseId,
      completed: false,
      lectureProgress: [],
    });
  }

  const lectureProgressIndex = courseProgress.lectureProgress.findIndex(
    (lp) => lp.lectureId === lectureId
  );

  if (lectureProgressIndex !== -1) {
    courseProgress.lectureProgress[lectureProgressIndex].viewed = true;
  } else {
    courseProgress.lectureProgress.push({
      lectureId,
      viewed: true,
    });
  }

  await courseProgress.save();

  return res.status(200).json({
    data: {
      progress: courseProgress.lectureProgress,
      completed: courseProgress.completed,
    },
    message: "Course progress updated successfully",
  });
});

const markAsCompleted = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  let courseProgress = await CourseProgress.findOne({ courseId, userId });

  if (!courseProgress) {
    courseProgress = new CourseProgress({
      userId,
      courseId,
      completed: true,
      lectureProgress: [],
    });
  }

  courseProgress.completed = true;
  await courseProgress.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Course marked as completed successfully")
    );
});

const markAsInCompleted = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  let courseProgress = await CourseProgress.findOne({ courseId, userId });

  if (!courseProgress) {
    throw new ApiError(404, "Course progress not found");
  }

  courseProgress.completed = false;
  await courseProgress.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Course marked as incomplete successfully")
    );
});

const markLectureAsCompleted = asyncHandler(async (req, res) => {
  const { courseId, lectureId } = req.params;
  const userId = req.user._id;

  let courseProgress = await CourseProgress.findOne({ courseId, userId });

  if (!courseProgress) {
    courseProgress = new CourseProgress({
      userId,
      courseId,
      completed: false,
      lectureProgress: [],
    });
  }

  const lectureProgressIndex = courseProgress.lectureProgress.findIndex(
    (lp) => lp.lectureId === lectureId
  );

  if (lectureProgressIndex !== -1) {
    courseProgress.lectureProgress[lectureProgressIndex].completed = true;
  } else {
    courseProgress.lectureProgress.push({
      lectureId,
      viewed: false,
      completed: true,
    });
  }

  await courseProgress.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, courseProgress.lectureProgress, "Lecture marked as completed successfully")
    );
});

const markLectureAsInCompleted = asyncHandler(async (req, res) => {
  const { courseId, lectureId } = req.params;
  const userId = req.user._id;

  let courseProgress = await CourseProgress.findOne({ courseId, userId });

  if (!courseProgress) {
    throw new ApiError(404, "Course progress not found");
  }

  const lectureProgressIndex = courseProgress.lectureProgress.findIndex(
    (lp) => lp.lectureId === lectureId
  );

  if (lectureProgressIndex !== -1) {
    courseProgress.lectureProgress[lectureProgressIndex].completed = false;
  } else {
    throw new ApiError(404, "Lecture progress not found");
  }

  await courseProgress.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, courseProgress.lectureProgress, "Lecture marked as incomplete successfully")
    );
});

export {
  getCourseProgress,
  updateCourseProgress,
  markAsCompleted,
  markAsInCompleted,
  markLectureAsCompleted,
  markLectureAsInCompleted,
};
