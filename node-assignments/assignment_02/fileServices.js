const path = require("path");
const {
  readTextFileAsync,
  readTextFileSync,
  writeToNewFileAsync,
  writeToNewFileSync,
  copyFileAsync,
  copyFileSync,
  writeJsonToExcel,
} = require("./helper");

async function fileServices() {
  const filePath = path.join(__dirname, "fileToRead.txt");
  const newFilePath = path.join(__dirname, "newFile.txt");
  const copyFilePath = path.join(__dirname, "copyFile.txt");

  console.log("Async Read:");
  const asyncContent = await readTextFileAsync(filePath);
  console.log(asyncContent);

  console.log("Sync Read:");
  const syncContent = readTextFileSync(filePath);
  console.log(syncContent);

  console.log("Async Write:");
  await writeToNewFileAsync(newFilePath, "This is async content");

  console.log("Sync Write:");
  writeToNewFileSync(newFilePath, "This is sync content");

  console.log("Async Copy:");
  await copyFileAsync(newFilePath, copyFilePath);

  console.log("Sync Copy:");
  copyFileSync(newFilePath, copyFilePath);

  const jsonFilePath = path.join(__dirname, "example.json");
  const excelFilePath = path.join(__dirname, "output.xlsx");
  console.log("Writing JSON to Excel:");
  await writeJsonToExcel(jsonFilePath, excelFilePath);
}

fileServices().catch((err) => console.error(err));
