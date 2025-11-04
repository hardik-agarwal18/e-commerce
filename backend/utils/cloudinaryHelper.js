import cloudinary from "../config/cloudinary.js";

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - The public_id of the image to delete
 * @returns {Promise} - Result of the deletion
 */
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - The Cloudinary image URL
 * @returns {string|null} - The public_id or null if not found
 */
export const extractPublicIdFromUrl = (url) => {
  try {
    // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/ecommerce-products/image_name.jpg
    const parts = url.split("/");
    const uploadIndex = parts.indexOf("upload");
    if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
      // Get folder/filename and remove extension
      const pathWithExtension = parts.slice(uploadIndex + 2).join("/");
      return pathWithExtension.replace(/\.[^/.]+$/, "");
    }
    return null;
  } catch (error) {
    console.error("Error extracting public_id:", error);
    return null;
  }
};
