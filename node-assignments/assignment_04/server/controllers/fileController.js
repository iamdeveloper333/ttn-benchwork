const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");

const multer = require("multer");
const FileLog = require("../models/FileLog");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require("dotenv").config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const upload = multer({ storage: multer.memoryStorage() }).single("file");

exports.uploadFile = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return next(err);
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `files/${req.file.originalname}`,
      Body: req.file.buffer,
    };
    try {
      const command = new PutObjectCommand(params);
      await s3.send(command);
      const fileLog = new FileLog({
        uploadedBy: req.userId,
        filePath: params.Key,
        uploadedAt: new Date(),
        downloads: 0,
        downloadedBy: [],
        deleted: false,
      });
      await fileLog.save();
      res.status(201).json({ message: "File uploaded successfully" });
    } catch (error) {
      next(error);
    }
  });
};

exports.deleteFile = async (req, res, next) => {
  const { key } = req.params;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `files/${key}`,
  };
  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    await FileLog.findOneAndUpdate(
      { filePath: `files/${key}` },
      { deleted: true }
    );
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.downloadFile = async (req, res, next) => {
  const { key } = req.params;
  const fileLog = await FileLog.findOne({ filePath: `files/${key}` });
  if (!fileLog || fileLog.deleted) {
    return res
      .status(404)
      .json({ message: "File not found or has been deleted" });
  }
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `files/${key}`,
  };
  try {
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    fileLog.downloads += 1;
    fileLog.downloadedBy.push(req.userId);
    await fileLog.save();
    res.status(200).json({ url });
  } catch (error) {
    next(error);
  }
};

exports.getUploadLogs = async (req, res, next) => {
  try {
    const logs = await FileLog.find();
    res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

exports.listFiles = async (req, res, next) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Prefix: "files/",
  };
  try {
    const command = new ListObjectsV2Command(params);
    const data = await s3.send(command);
    const files = data.Contents.filter(
      (file) => file.Key !== params.Prefix
    ).map((file) => ({
      key: file.Key,
      lastModified: file.LastModified,
      size: file.Size,
    }));

    res.status(200).json(files);
  } catch (error) {
    next(error);
  }
};
