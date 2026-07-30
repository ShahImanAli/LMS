import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getCourseProgress,
  updateCourseProgress,
  markAsCompleted,
  markAsInCompleted,
  markLectureAsCompleted,
  markLectureAsInCompleted,
} from "../controllers/courseProgress.controller.js";

const router = Router();

router.route("/:courseId").get(verifyJWT, getCourseProgress);
router
  .route("/:courseId/lecture/:lectureId/viewed")
  .post(verifyJWT, updateCourseProgress);
router.route("/:courseId/mark-completed").post(verifyJWT, markAsCompleted);
router.route("/:courseId/mark-incompleted").post(verifyJWT, markAsInCompleted);
router.route("/:courseId/lecture/:lectureId/completed").post(verifyJWT, markLectureAsCompleted);
router.route("/:courseId/lecture/:lectureId/incompleted").post(verifyJWT, markLectureAsInCompleted);

export default router;