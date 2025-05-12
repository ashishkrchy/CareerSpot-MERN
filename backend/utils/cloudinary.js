import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error('Missing Cloudinary configuration');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    if (!filePath) throw new Error('File path is required');
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: options.resource_type || 'auto',
      folder: options.folder,
      ...options,
    });
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const deleteFromCloudinary = async (
  publicId,
  resourceType = 'image'
) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error('Deletion error:', error);
    throw error;
  }
};
