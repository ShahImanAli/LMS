import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { PurchasedCourse } from "../models/purchasedCourse.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
  deleteVideoFromCloudinary,
} from "../utils/cloudinary.js";

const createCourse = asyncHandler(async (req, res) => {
  const { courseTitle, category } = req.body;

  if ([courseTitle, category].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const course = await Course.create({
    courseTitle,
    category,
    creator: req.user._id,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course created successfully"));
});

const searchCourses = asyncHandler(async (req, res) => {
  let { query = "", category = [], sortByPrice = "" } = req.query;

  if (typeof category === "string") {
    category = [category];
  }

  let searchCriteria = { isPublished: true };

  if (query && query.trim() !== "") {
    searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };
  }

  if (category.length > 0) {
    searchCriteria.category = { $in: category };
  }

  const sortCriteria = {};
  if (sortByPrice === "low") {
    sortCriteria.coursePrice = 1;
  } else if (sortByPrice === "high") {
    sortCriteria.coursePrice = -1;
  }

  const courses = await Course.find(searchCriteria)
    .populate({ path: "creator", select: "name photoUrl" })
    .sort(sortCriteria);

  res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses searched successfully"));
});

const getAllCourses = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const courses = await Course.find({ creator: userId });

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses fetched successfully"));
});

const updateCourse = asyncHandler(async (req, res) => {
  const {
    courseTitle,
    courseSubtitle,
    courseDescription,
    courseLevel,
    coursePrice,
    category,
  } = req.body;

  const thumbnail = req.file;
  const courseId = req.params.courseId;

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  course.courseTitle = courseTitle;
  course.subTitle = courseSubtitle;
  course.description = courseDescription;
  course.courseLevel = courseLevel;
  course.coursePrice = coursePrice;
  course.category = category;

  if (thumbnail) {
    if (course.courseThumbnail?.public_id) {
      await deleteFromCloudinary(course.courseThumbnail.public_id);
    }

    const uploaded = await uploadOnCloudinary(thumbnail.path);

    if (uploaded) {
      course.courseThumbnail = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }
  }

  await course.save();

  res
    .status(200)
    .json(new ApiResponse(200, course, "Course updated successfully"));
});

const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, course, "Course fetched successfully"));
});

const createLecture = asyncHandler(async (req, res) => {
  const { lectureTitle } = req.body;
  const { courseId } = req.params;

  if (!lectureTitle?.trim()) {
    throw new ApiError(400, "Lecture title is required");
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const lecture = await Lecture.create({
    lectureTitle,
  });

  if (course) {
    course.lectures.push(lecture._id);
    await course.save();
  }

  res
    .status(200)
    .json(new ApiResponse(200, lecture, "Lecture created successfully"));
});

const getCourseLectures = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  const course = await Course.findById(courseId).populate("lectures");

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Check if user has purchased the course or is the creator
  const purchased = await PurchasedCourse.findOne({ userId, courseId, status: "completed" });
  const isCreator = course.creator.toString() === userId.toString();

  // Convert all lectures to plain objects for consistent serialization
  const lectures = course.lectures.map((lecture) => {
    const lectureObj = lecture.toObject();
    // Strip videoUrl from non-preview lectures if user has not purchased and is not the creator
    if (!purchased && !isCreator && !lectureObj.isPreviewFree) {
      lectureObj.videoUrl = undefined;
      lectureObj.publicId = undefined;
    }
    return lectureObj;
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        lectures,
        "Course lectures fetched successfully"
      )
    );
});

const editLecture = asyncHandler(async (req, res) => {
  const { lectureTitle, isPreviewFree, videoInfo } = req.body;
  const { courseId, lectureId } = req.params;

  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  if (lectureTitle) {
    lecture.lectureTitle = lectureTitle;
  }

  if (isPreviewFree !== undefined && isPreviewFree !== null) {
    lecture.isPreviewFree = isPreviewFree;
  }
  if (videoInfo?.videoUrl) {
    lecture.videoUrl = videoInfo.videoUrl;
  }
  if (videoInfo?.publicId) {
    lecture.publicId = videoInfo.publicId;
  }

  await lecture.save();

  const course = await Course.findById(courseId);
  if (course && !course.lectures.includes(lecture._id)) {
    course.lectures.push(lecture._id);
    await course.save();
  }

  res
    .status(200)
    .json(new ApiResponse(200, lecture, "Lecture updated successfully"));
});

const removeLecture = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;

  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  await Lecture.findByIdAndDelete(lectureId);

  if (lecture.publicId) {
    await deleteVideoFromCloudinary(lecture.publicId);
  }

  await Course.updateOne(
    { lectures: lectureId },
    { $pull: { lectures: lectureId } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, lecture, "Lecture deleted successfully"));
});

const getLectureById = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;
  const userId = req.user._id;

  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  // Convert to plain object for consistent serialization
  const lectureObj = lecture.toObject();

  // Find the course that contains this lecture
  const course = await Course.findOne({ lectures: lectureId });

  if (course) {
    const isCreator = course.creator.toString() === userId.toString();
    const purchased = await PurchasedCourse.findOne({ userId, courseId: course._id, status: "completed" });

    // If user has not purchased, is not the creator, and lecture is not a preview, strip video URL
    if (!purchased && !isCreator && !lectureObj.isPreviewFree) {
      lectureObj.videoUrl = undefined;
      lectureObj.publicId = undefined;
    }
  }

  res
    .status(200)
    .json(new ApiResponse(200, lectureObj, "Lecture fetched successfully"));
});

const togglePublishCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { publish } = req.query;

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  course.isPublished = publish === "true";

  await course.save();

  res
    .status(200)
    .json(new ApiResponse(200, course, "Course published successfully"));
});

const deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId).populate("lectures");

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  if (course.courseThumbnail?.public_id) {
    await deleteFromCloudinary(course.courseThumbnail.public_id);
  }

  for (const lecture of course.lectures) {
    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }
    await Lecture.findByIdAndDelete(lecture._id);
  }

  await Course.findByIdAndDelete(courseId);

  res
    .status(200)
    .json(
      new ApiResponse(200, null, "Course and lectures deleted successfully")
    );
});

const getPublishedCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ isPublished: true }).populate({
    path: "creator",
    select: "name photoUrl",
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, courses, "Published courses fetched successfully")
    );
});

export {
  createCourse,
  searchCourses,
  getAllCourses,
  updateCourse,
  getCourseById,
  createLecture,
  getCourseLectures,
  editLecture,
  removeLecture,
  getLectureById,
  togglePublishCourse,
  deleteCourse,
  getPublishedCourses,
};
