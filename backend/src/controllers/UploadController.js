export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Cloudinary automatically provides the secure URL
    const imageUrl = req.file.path; // This is the Cloudinary URL

    res.json({
      success: true,
      image_url: imageUrl,
      public_id: req.file.filename, // Cloudinary public_id for deletion if needed
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    });
  }
};
