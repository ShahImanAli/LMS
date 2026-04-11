import mongoose, { Schema } from "mongoose";

const purchasedCourseSchema = new Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentId: {
      type: String,
      required: false, // Not required initially, set after Stripe session creation
    },
  },
  { timestamps: true }
);

export const PurchasedCourse = mongoose.model(
  "PurchasedCourse",
  purchasedCourseSchema
);
