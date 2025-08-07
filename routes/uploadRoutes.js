const express = require("express");
const multer = require("multer");
const controller = require("../controllers/uploadController");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/upload", upload.single("image"), controller.upload);
router.post("/upload-multiple", upload.array("images", 50), controller.uploadMany); // limit to 10 files
router.get("/", controller.list);

module.exports = router;
