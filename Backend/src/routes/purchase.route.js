import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createCheckoutSession,
  getallPurchasedCourses,
  getCourseWithPurchaseStatus,
  stripeWebhook,
  getAllInstructorSales,
} from "../controllers/coursePurchased.controller.js";
import express from "express";

const router = Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

router.post(
  "/checkout/create-checkout-session",
  express.json(),
  verifyJWT,
  createCheckoutSession
);

router
  .route("/course/:courseId/details-with-status")
  .get(verifyJWT, getCourseWithPurchaseStatus);

router.route("/purchased-courses").get(verifyJWT, getallPurchasedCourses);
router.route("/sales").get(verifyJWT, getAllInstructorSales);

export default router;
