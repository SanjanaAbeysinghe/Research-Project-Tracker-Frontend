
import axios from "axios";

const BASE_URL = "http://localhost:8040/api/v1/document";

const getToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No auth token found");
  return `Bearer ${token}`;
};

//  Upload document
export const uploadDocument = async (file, data) => {
  try {
    const token = getToken();

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("file", file);
    formData.append("projectId", data.projectId);
    formData.append("uploadedBy", data.uploadedBy);
    if (data.uploadedAt) formData.append("uploadedAt", data.uploadedAt);

    const response = await axios.post(`${BASE_URL}`, formData, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};

//  Get document by ID
export const getDocumentById = async (docId) => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/${docId}`, {
    headers: { Authorization: token },
  });
  return response.data;
};

//  Delete document
export const deleteDocument = async (docId) => {
  const token = getToken();
  await axios.delete(`${BASE_URL}/${docId}`, {
    headers: { Authorization: token },
  });
};