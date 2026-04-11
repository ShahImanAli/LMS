import { PurchasedCourse } from "../models/purchasedCourse.model.js";
import Stripe from "stripe";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SETUP_KEY);

const createCheckoutSession = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id;

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const newPurchasedCourse = await PurchasedCourse.create({
    courseId,
    userId,
    amount: course.coursePrice,
    status: "pending",
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "pkr",
          product_data: {
            name: course.courseTitle,
            images: [course.courseThumbnail?.url],
          },
          unit_amount: course.coursePrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/course-progress/${courseId}`,
    cancel_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/course-detail/${courseId}`,
    metadata: {
      courseId: courseId,
      userId: userId.toString(),
    },
    shipping_address_collection: {
      allowed_countries: ["PK"],
    },
  });

  if (!session.url) {
    throw new ApiError(400, "Error while creating session");
  }

  newPurchasedCourse.paymentId = session.id;
  await newPurchasedCourse.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { url: session.url },
        "Checkout session created successfully"
      )
    );
});

const stripeWebhook = asyncHandler(async (req, res) => {
  let event;

  try {
    const signature = req.headers["stripe-signature"];
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

    event = stripe.webhooks.constructEvent(req.body, signature, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("check session complete is called");

    try {
      const session = event.data.object;

      const purchase = await PurchasedCourse.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";

      // Make all lectures visible by setting `isPreviewFree` to true
      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      // Update user's enrolledCourses
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } }, // Add course ID to enrolledCourses
        { new: true }
      );

      // Update course to add user ID to enrolledStudents
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
        { new: true }
      );
    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).send();
});

const getCourseWithPurchaseStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.params;

  if (!courseId) {
    throw new ApiError(400, "Course ID is required");
  }

  const course = await Course.findById(courseId)
    .populate({
      path: "creator",
    })
    .populate({ path: "lectures" });

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const purchased = await PurchasedCourse.findOne({ userId, courseId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { course, purchased: !!purchased },
        "Course retrieved successfully"
      )
    );
});

const getallPurchasedCourses = asyncHandler(async (req, res) => {
  const purchasedCourses = await PurchasedCourse.find({
    userId: req.user._id,
    status: "completed",
  }).populate({
    path: "courseId",
    populate: {
      path: "creator",
      select: "name photoUrl",
    },
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { purchasedCourses: purchasedCourses || [] },
        "All purchased courses retrieved successfully"
      )
    );
});

const getAllInstructorSales = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;

  const courses = await Course.find({ creator: instructorId }).select("_id");
  const courseIds = courses.map((course) => course._id);

  const purchasedCourses = await PurchasedCourse.find({
    courseId: { $in: courseIds },
    status: "completed",
  }).populate("courseId");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { purchasedCourses: purchasedCourses || [] },
        "Instructor sales retrieved successfully"
      )
    );
});
export {
  stripeWebhook,
  createCheckoutSession,
  getCourseWithPurchaseStatus,
  getallPurchasedCourses,
  getAllInstructorSales,
};
