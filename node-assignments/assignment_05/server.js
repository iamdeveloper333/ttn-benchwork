const express = require("express");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { getJSONFromS3, uploadPDFToS3 } = require("./s3Client");
const generatePDF = require("./pdfGenerator");

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.post("/generate-upload-pdf", async (req, res) => {
  const { key } = req.body;

  try {
    const userData = await getJSONFromS3(key);
    const pdf = await generatePDF(userData);
    const fileName = `${userData.name}_${uuidv4()}.pdf`;
    await uploadPDFToS3(fileName, pdf);

    res.status(200).json({
      message: "PDF generated and uploaded successfully",
      filePath: `https://node-assignments.s3.ap-south-1.amazonaws.com/files/${fileName}`,
    });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`SERVER IS RUNNING AT PORT ${port}`);
});
