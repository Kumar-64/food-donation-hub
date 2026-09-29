const fs = require("fs");
const path = require("path");
const { cloudinary } = require("../config/cloudinary");

async function storeImage(file) {
  if (!file) {
    return "";
  }

  const cloudinaryEnabled = Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

  if (cloudinaryEnabled) {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "foodbridge" },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      );
      stream.end(file.buffer);
    });
    return uploadResult.secure_url;
  }

  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.originalname}`.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, file.buffer);
  return `/uploads/${fileName}`;
}

module.exports = {
  storeImage
};
