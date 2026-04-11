import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const router = express.Router();

router.route("/upload-video").post(
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded");
    }

    const result = await uploadOnCloudinary(req.file.path);

    if (!result) {
      throw new ApiError(500, "Failed to upload to Cloudinary");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, result, "File uploaded successfully"));
  })
);

export default router;
