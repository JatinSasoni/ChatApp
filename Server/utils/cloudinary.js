import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";

configDotenv();

//CLOUDINARY SETUP
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload file to Cloudinary
export const uploadToCloudinary = async (file, folder) => {
  try {
    if (!file) return null;
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: folder,
    });

    return uploadResponse.secure_url;
  } catch (error) {
    console.error(`Cloudinary Upload Error (${folder}):`, error);
    return null;
  }
};
export default cloudinary;
