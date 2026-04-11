import moongose, { Schema } from "mongoose";

const lectureProgressSchema = new Schema({
  lectureId: { type: String },
  viewed: { type: Boolean },
});

const courseProgressSchema = new Schema(
  {
    userId: {
      type: String,
    },
    courseId: {
      type: String,
    },
    completed: {
      type: Boolean,
    },
    lectureProgress: [lectureProgressSchema],
  },
  { timestamps: true }
);

export const CourseProgress = moongose.model(
  "CourseProgress",
  courseProgressSchema
);
