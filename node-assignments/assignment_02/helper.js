const fs = require("fs-extra");
const ExcelJS = require("exceljs");
const path = require("path");

async function readTextFileAsync(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.error(`Error reading file asynchronously: ${err}`);
    throw err;
  }
}

function readTextFileSync(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data;
  } catch (err) {
    console.error(`Error reading file synchronously: ${err}`);
    throw err;
  }
}

async function writeToNewFileAsync(filePath, content) {
  try {
    await fs.writeFile(filePath, content, "utf8");
    console.log(`File "${filePath}" has been written asynchronously.`);
  } catch (err) {
    console.error(`Error writing to file asynchronously: ${err}`);
    throw err;
  }
}

function writeToNewFileSync(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`File "${filePath}" has been written synchronously.`);
  } catch (err) {
    console.error(`Error writing to file synchronously: ${err}`);
    throw err;
  }
}

async function copyFileAsync(sourcePath, destinationPath) {
  try {
    await fs.copy(sourcePath, destinationPath);
    console.log(
      `File "${sourcePath}" has been copied to "${destinationPath}" asynchronously.`
    );
  } catch (err) {
    console.error(`Error copying file asynchronously: ${err}`);
    throw err;
  }
}

function copyFileSync(sourcePath, destinationPath) {
  try {
    fs.copyFileSync(sourcePath, destinationPath);
    console.log(
      `File "${sourcePath}" has been copied to "${destinationPath}" synchronously.`
    );
  } catch (err) {
    console.error(`Error copying file synchronously: ${err}`);
    throw err;
  }
}

async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading JSON file: ${err}`);
    throw err;
  }
}

async function writeJsonToExcel(jsonFilePath, excelFilePath) {
  try {
    const jsonData = await readJsonFile(jsonFilePath);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    worksheet.columns = Object.keys(jsonData[0]).map((key) => ({
      header: key,
      key: key,
      width: 15,
    }));

    jsonData.forEach((obj) => {
      worksheet.addRow(obj);
    });

    await workbook.xlsx.writeFile(excelFilePath);
    console.log(`Excel file "${excelFilePath}" has been written successfully.`);
  } catch (err) {
    console.error(`Error writing JSON to Excel: ${err}`);
    throw err;
  }
}

module.exports = {
  readTextFileAsync,
  readTextFileSync,
  writeToNewFileAsync,
  writeToNewFileSync,
  copyFileAsync,
  copyFileSync,
  readJsonFile,
  writeJsonToExcel,
};
