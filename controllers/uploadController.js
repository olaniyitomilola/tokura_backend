const service = require("../services/uploadService");
const { logger } = require('../services/logger');

const upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });
    const url = await service.uploadImage(req.file);
    res.status(201).json({ url, success: true });
  } catch (err) {
    console.error(err)
    logger.error(err, 'Error uploading image:');
    res.status(500).json({ error: err.message || "Upload failed" });
  }
};

const list = async (req, res) => {
  try {
    const urls = await service.listObjects();
    res.json(urls);
  } catch (err) {
    logger.error(err, 'Error listing images:');
    console.error(err)
    res.status(500).json({ error: "Failed to list images" });
  }
};
const uploadMany = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: "No files uploaded" });

    const urls = await service.uploadMultipleImages(req.files);
    res.status(201).json({ urls, success: true });
  } catch (err) {
    console.error(err)
    logger.error(err, 'Error uploading multiple images:');
    res.status(500).json({ error: "Bulk upload failed" });
  }
};


module.exports = {
  upload,
  list, uploadMany
};
