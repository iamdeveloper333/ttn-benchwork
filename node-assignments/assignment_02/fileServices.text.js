const fs = require("fs-extra");
const path = require("path");
const {
  readTextFileAsync,
  readTextFileSync,
  writeToNewFileAsync,
  writeToNewFileSync,
  copyFileAsync,
  copyFileSync,
  readJsonFile,
  writeJsonToExcel,
} = require("./fileServices");

jest.mock("fs-extra");

describe("File Operations", () => {
  const testFilePath = path.join(__dirname, "test.txt");
  const testJsonFilePath = path.join(__dirname, "test.json");
  const testExcelFilePath = path.join(__dirname, "test.xlsx");
  const testContent = "Hello, world!";
  const testJsonData = [
    { name: "Rohit Sharma", role: "Batsman", age: 36 },
    { name: "Virat Kohli", role: "Batsman", age: 35 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("readTextFileAsync reads a file asynchronously", async () => {
    fs.readFile.mockResolvedValue(testContent);
    const data = await readTextFileAsync(testFilePath);
    expect(data).toBe(testContent);
    expect(fs.readFile).toHaveBeenCalledWith(testFilePath, "utf8");
  });

  test("readTextFileSync reads a file synchronously", () => {
    fs.readFileSync.mockReturnValue(testContent);
    const data = readTextFileSync(testFilePath);
    expect(data).toBe(testContent);
    expect(fs.readFileSync).toHaveBeenCalledWith(testFilePath, "utf8");
  });

  test("writeToNewFileAsync writes to a file asynchronously", async () => {
    fs.writeFile.mockResolvedValue();
    await writeToNewFileAsync(testFilePath, testContent);
    expect(fs.writeFile).toHaveBeenCalledWith(
      testFilePath,
      testContent,
      "utf8"
    );
  });

  test("writeToNewFileSync writes to a file synchronously", () => {
    fs.writeFileSync.mockReturnValue();
    writeToNewFileSync(testFilePath, testContent);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      testFilePath,
      testContent,
      "utf8"
    );
  });

  test("copyFileAsync copies a file asynchronously", async () => {
    fs.copy.mockResolvedValue();
    await copyFileAsync(testFilePath, testFilePath);
    expect(fs.copy).toHaveBeenCalledWith(testFilePath, testFilePath);
  });

  test("copyFileSync copies a file synchronously", () => {
    fs.copyFileSync.mockReturnValue();
    copyFileSync(testFilePath, testFilePath);
    expect(fs.copyFileSync).toHaveBeenCalledWith(testFilePath, testFilePath);
  });

  test("readJsonFile reads a JSON file", async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(testJsonData));
    const data = await readJsonFile(testJsonFilePath);
    expect(data).toEqual(testJsonData);
    expect(fs.readFile).toHaveBeenCalledWith(testJsonFilePath, "utf8");
  });

  test("writeJsonToExcel writes JSON data to an Excel file", async () => {
    fs.readFile.mockResolvedValue(JSON.stringify(testJsonData));
    const workbookMock = {
      addWorksheet: jest.fn().mockReturnValue({
        columns: [],
        addRow: jest.fn(),
      }),
      xlsx: {
        writeFile: jest.fn().mockResolvedValue(),
      },
    };
    ExcelJS.Workbook = jest.fn().mockReturnValue(workbookMock);

    await writeJsonToExcel(testJsonFilePath, testExcelFilePath);
    expect(workbookMock.addWorksheet).toHaveBeenCalledWith("Sheet 1");
    expect(workbookMock.xlsx.writeFile).toHaveBeenCalledWith(testExcelFilePath);
  });
});
