import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/config";

const Home = () => {
  const [files, setFiles] = useState([]);
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchFiles = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/files/list`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setFiles(response.data);
    } catch (error) {
      console.error("Fetch files error:", error);
    }
  }, [storedToken]);

  useEffect(() => {
    if (!storedToken) {
      navigate("/login");
    } else {
      fetchFiles();
    }
  }, [fetchFiles, navigate, storedToken]);

  const handleFileDownload = async (filePath) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/files/download/${filePath.slice(6)}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const url = response.data.url;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filePath);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleFileDelete = async (filePath) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/files/delete/${filePath.slice(6)}`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      setFiles(files.filter((file) => file.filePath !== filePath));
      fetchFiles();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete file. Please try again later.");
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
      <div className="container mx-auto p-4 pt-20">
        <div className="flex justify-between ">
          <h2 className="text-2xl font-bold mb-4">Files</h2>
          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={() => navigate("/upload")}
          >
            Upload File
          </button>
        </div>

        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">File Path</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {files.map((file, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{file.key}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                    onClick={() => handleFileDownload(file.key)}
                  >
                    Download
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                    onClick={() => handleFileDelete(file.key)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Home;
