export const uploadImage = (req, res) => {
  const imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;
  res.json({
    success: true,
    image_url: imageUrl,
  });
};
