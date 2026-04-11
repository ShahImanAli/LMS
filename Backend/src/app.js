import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Cookie parser MUST be loaded early for authentication
app.use(cookieParser());

// Import purchase router BEFORE json middleware for webhook
import purchaseRouter from "./routes/purchase.route.js";

// Webhook route MUST come before express.json() - Stripe needs raw body
app.use("/api/v1/purchase", purchaseRouter);

// configuration for Json data
app.use(express.json({ limit: "16kb" }));

//configuration for url data (matlab jb url sy data aaye gaa)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//yeh public assets folder hai koi bhi access kar sakta hai
app.use(express.static("public"));

//Routes are imported in similar way as below in the end of app.js file

//Routes import
import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.route.js";
import mediaRouter from "./routes/media.route.js";
import courseProgressRouter from "./routes/courseProgress.route.js";

//Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/media", mediaRouter);
app.use("/api/v1/course-progress", courseProgressRouter); 

//Global error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

export { app };
