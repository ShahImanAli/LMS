import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createCourse,
  searchCourses,
  getAllCourses,
  updateCourse,
  getCourseById,
  createLecture,
  getCourseLectures,
  editLecture,
  getLectureById,
  removeLecture,
  togglePublishCourse,
  deleteCourse,
  getPublishedCourses,
} from "../controllers/course.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createCourse).get(verifyJWT, getAllCourses);

router.route("/search").get(verifyJWT, searchCourses);

router.route("/published-courses").get(getPublishedCourses);

router
  .route("/:courseId")
  .put(verifyJWT, upload.single("courseThumbnail"), updateCourse)
  .get(verifyJWT, getCourseById)
  .delete(verifyJWT, deleteCourse);

router.route("/:courseId/publish").patch(verifyJWT, togglePublishCourse);

router
  .route("/:courseId/lectures")
  .post(verifyJWT, createLecture)
  .get(verifyJWT, getCourseLectures);

router.route("/:courseId/lectures/:lectureId").post(verifyJWT, editLecture);
router
  .route("/lectures/:lectureId")
  .delete(verifyJWT, removeLecture)
  .get(verifyJWT, getLectureById);

export default router;
