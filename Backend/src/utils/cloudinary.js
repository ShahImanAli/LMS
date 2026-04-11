import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Delete the local file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    // Delete the local file on error
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

const deleteFromCloudinary = async (
  publicId,
  options = { resource_type: "image" }
) => {
  try {
    if (!publicId) return null;

    const result = await cloudinary.uploader.destroy(publicId, options);
    return result;
  } catch (error) {
    console.log("Error deleting from Cloudinary:", error);
    throw new ApiError(500, "Failed to delete file from Cloudinary");
  }
};

const deleteVideoFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return result;
  } catch (error) {
    console.log("Error deleting from Cloudinary:", error);
    throw new ApiError(500, "Failed to delete file from Cloudinary");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary, deleteVideoFromCloudinary };
