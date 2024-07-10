const express = require("express");
const {
  uploadFile,
  deleteFile,
  downloadFile,
  getUploadLogs,
  listFiles,
} = require("../controllers/fileController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/upload", authMiddleware, uploadFile);
router.delete("/delete/:key", authMiddleware, deleteFile);
router.get("/download/:key", authMiddleware, downloadFile);
router.get("/logs", authMiddleware, getUploadLogs);
router.get("/list", authMiddleware, listFiles);

module.exports = router;
