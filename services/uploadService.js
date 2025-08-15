const { PutObjectCommand, ListObjectsV2Command, DeleteBucketCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const {s3} = require("../utils/r2");

const uploadImage = async (file) => {
  const stream = fs.createReadStream(file.path);
  const key = `uploads/${Date.now()}-${file.originalname}`;

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: stream,
      ContentType: file.mimetype,
    });

    await s3.send(command);
    return `${process.env.PUBLIC_URL}/${key}`;
  } catch (error) {
    throw new Error("Failed to upload image: " + error.message);
  } finally {
    try {
      fs.unlinkSync(file.path);
    } catch (err) {
      console.warn("Failed to delete temp file:", err.message);
    }
  }
};

const listObjects = async () => {
  const command = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME,
  });

  try {
    const { Contents } = await s3.send(command);
    if (!Contents) return [];

    return Contents.map(obj => `${process.env.PUBLIC_S3_URL}/${obj.Key}`);
  } catch (err) {
    console.error("Failed to list public URLs:", err);
    return [];
  }
};


const uploadMultipleImages = async (files) => {
  const uploadedUrls = [];

  for (const file of files) {
    const stream = fs.createReadStream(file.path);
    const key = `uploads/${Date.now()}-${file.originalname}`;

    try {
      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: stream,
        ContentType: file.mimetype,
      });

      await s3.send(command);
      uploadedUrls.push(`${process.env.PUBLIC_S3_URL}/${key}`);
    } catch (error) {
      console.error("Failed to upload:", file.originalname, error.message);
    } finally {
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.warn("Failed to delete temp file:", err.message);
      }
    }
  }

  return uploadedUrls;
};

const deleteImage = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,  // key is the path inside the bucket like 'uploads/12345-image.jpg'
    });

    await s3.send(command);
    return true;
  } catch (error) {
    console.error("Failed to delete image:", key, error.message);
    throw new Error("Failed to delete image");
  }
};

module.exports = {
  uploadImage,
  listObjects, uploadMultipleImages, deleteImage
};
