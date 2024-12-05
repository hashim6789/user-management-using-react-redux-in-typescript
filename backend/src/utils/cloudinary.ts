import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

// Utility to upload images to Cloudinary
export const uploadImageToCloudinary = (
  fileBuffer: Buffer,
  folder: string = "profile_images"
): Promise<CloudinaryUploadResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as CloudinaryUploadResponse);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Utility to delete images from Cloudinary
export const deleteImageFromCloudinary = (
  publicId: string
): Promise<{ result: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

export default cloudinary;
