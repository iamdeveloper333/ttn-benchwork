import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [logs, setLogs] = useState([]);
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchLogs = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/files/logs`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setLogs(response.data);
    } catch (error) {
      console.error("Fetch logs error:", error);
    }
  }, [storedToken]);

  useEffect(() => {
    if (!storedToken) {
      navigate("/login");
    } else {
      fetchLogs();
    }
  }, [fetchLogs, navigate, storedToken]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadError(null);
    setUploadSuccess(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(`${API_BASE_URL}/api/files/upload`, formData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadSuccess(true);
      fetchLogs();
    } catch (error) {
      setUploadError("Failed to upload file. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
      setTimeout(() => {
        setFile(null);
        setUploadSuccess(false);
      }, 2000);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
        <div
          className="text-xl font-bold hover:cursor-pointer"
          onClick={() => navigate("/")}
        >
          Document Upload App
        </div>
        <button
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Upload Files</h2>
        <form onSubmit={handleUpload} className="flex flex-col space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="py-2 px-4 border rounded"
            required
          />
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded ${
              isUploading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
          {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
          {uploadSuccess && (
            <p className="text-green-500 text-sm">
              File uploaded successfully!
            </p>
          )}
        </form>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">File Upload Logs</h3>
          <table className="table w-full">
            <thead>
              <tr>
                <th>File Path</th>
                <th>Uploaded at</th>
                <th>No. of Downloads</th>
                <th>Downloaded by</th>
                <th>Deleted</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6">No logs to show</td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={index}>
                    <td>{log.filePath}</td>
                    <td>{new Date(log.uploadedAt).toLocaleString()}</td>
                    <td>{log.downloads}</td>
                    <td>{log.downloadedBy.join(", ")}</td>
                    <td>{log.deleted ? "Yes" : "No"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
