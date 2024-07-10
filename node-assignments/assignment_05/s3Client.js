const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
require("dotenv").config();
const stream = require("stream");
const { promisify } = require("util");

const s3Client = new S3Client({ region: process.env.AWS_REGION });

async function getJSONFromS3(key) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });
  const response = await s3Client.send(command);

  const pipeline = promisify(stream.pipeline);
  let jsonData = "";

  await pipeline(response.Body, async function* (source) {
    for await (const chunk of source) {
      jsonData += chunk.toString();
    }
  });

  return JSON.parse(jsonData);
}

async function uploadPDFToS3(key, pdf) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `files/${key}`,
    Body: pdf,
    ContentType: "application/pdf",
  });
  await s3Client.send(command);
}

module.exports = {
  getJSONFromS3,
  uploadPDFToS3,
};
