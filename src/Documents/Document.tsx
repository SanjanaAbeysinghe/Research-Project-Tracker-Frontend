// src/components/DocumentUpload.tsx

import React, { useState } from "react";
import {
  uploadDocument,
  getDocumentById,
  deleteDocument,
} from "../Service/DocumentService";

import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  InputGroup,
  Badge,
} from "react-bootstrap";

import {
  FileEarmarkText,
  Upload,
  Search,
  Trash,
  Download,
  PersonCircle,
} from "react-bootstrap-icons";

interface DocumentModel {
  id: string;
  title: string;
  description: string;
  projectId: string;
  uploadedBy: { id: string; fullName: string };
  uploadedAt: string;
  fileName: string;
  urlOrPath: string;
}

const formatDate = (isoString: string | null | undefined): string => {
  if (!isoString) return "N/A";
  return isoString.split("T")[0];
};

const DocumentUpload: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    uploadedBy: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [searchId, setSearchId] = useState("");
  const [foundDoc, setFoundDoc] = useState<DocumentModel | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const getMimeType = (fileName: string) => {
    if (!fileName) return "application/octet-stream";

    if (fileName.match(/\.(jpeg|jpg)$/i))
      return "image/jpeg";

    if (fileName.match(/\.png$/i))
      return "image/png";

    if (fileName.match(/\.gif$/i))
      return "image/gif";

    if (fileName.match(/\.pdf$/i))
      return "application/pdf";

    return "application/octet-stream";
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!file) {
      return alert("Please select a file!");
    }

    if (!formData.uploadedBy.trim()) {
      return alert("Enter uploader/member ID!");
    }

    setUploading(true);
    setMessage("");

    try {
      const uploadedAt = new Date()
        .toISOString()
        .substring(0, 19);

      await uploadDocument(file, {
        ...formData,
        uploadedAt,
      });

      setMessage("Document uploaded successfully!");

      setFormData({
        title: "",
        description: "",
        projectId: "",
        uploadedBy: "",
      });

      setFile(null);
    } catch (error) {
      console.error(error);
      setMessage("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleFetch = async () => {
    if (!searchId.trim()) {
      return alert("Enter document ID!");
    }

    setLoading(true);
    setFoundDoc(null);
    setMessage("");

    try {
      const doc = await getDocumentById(searchId);
      setFoundDoc(doc);
    } catch (error) {
      console.error(error);
      setMessage("Document not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!searchId.trim()) {
      return alert("Enter document ID!");
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this document?"
      )
    )
      return;

    try {
      await deleteDocument(searchId);

      setMessage("🗑️ Document deleted successfully.");
      setFoundDoc(null);
      setSearchId("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete document.");
    }
  };

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "#f4f7fb",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Card
        className="border-0 shadow-lg rounded-4 mb-4"
        style={{
          background:
            "linear-gradient(135deg, #4f46e5, #3b82f6)",
          color: "white",
        }}
      >
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={8}>
              <h2 className="fw-bold mb-1">
                <FileEarmarkText
                  size={35}
                  className="me-2"
                />
                Project Documents
              </h2>

              <p className="mb-0 opacity-75">
                Upload, search and manage project
                documents
              </p>
            </Col>

            <Col
              md={4}
              className="text-md-end mt-3 mt-md-0"
            >
              <Badge
                bg="light"
                text="dark"
                className="px-4 py-3 rounded-pill fs-6"
              >
                📂 Document Manager
              </Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Alerts */}
      {message && (
        <Alert
          variant={
            message.includes("Unsuccessful")
              ? "danger"
              : "success"
          }
          className="shadow-sm"
        >
          {message}
        </Alert>
      )}

      {/* Upload + Search */}
      <Row className="g-4">
        {/* Upload Section */}
        <Col lg={7}>
          <Card className="border-0 shadow-lg rounded-4 h-100">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-4 text-primary">
                <Upload className="me-2" />
                Upload Document
              </h4>

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Document Title
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="Enter title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Project ID
                      </Form.Label>

                      <Form.Control
                        type="text"
                        name="projectId"
                        placeholder="Enter project ID"
                        value={formData.projectId}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    Uploaded By
                  </Form.Label>

                  <InputGroup>
                    <InputGroup.Text>
                      <PersonCircle />
                    </InputGroup.Text>

                    <Form.Control
                      type="text"
                      name="uploadedBy"
                      placeholder="Enter uploader/member ID"
                      value={formData.uploadedBy}
                      onChange={handleChange}
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    Choose File
                  </Form.Label>

                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    required
                  />

                  {file && (
                    <Form.Text className="text-muted">
                      Selected File : {file.name}
                    </Form.Text>
                  )}
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={uploading}
                  className="rounded-pill px-4 py-2 fw-bold"
                >
                  {uploading ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="me-2" />
                      Upload Document
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Search/Delete Section */}
        <Col lg={5}>
          <Card className="border-0 shadow-lg rounded-4 h-100">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-4 text-success">
                <Search className="me-2" />
                Search Document
              </h4>

              <InputGroup className="mb-4">
                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>

                <Form.Control
                  type="text"
                  placeholder="Enter document ID"
                  value={searchId}
                  onChange={(e) =>
                    setSearchId(e.target.value)
                  }
                />

                <Button
                  variant="success"
                  onClick={handleFetch}
                  disabled={loading}
                >
                  {loading
                    ? "Searching..."
                    : "Search"}
                </Button>
              </InputGroup>

              <Button
                variant="outline-danger"
                className="rounded-pill px-4 mb-4"
                onClick={handleDelete}
              >
                <Trash className="me-2" />
                Delete Document
              </Button>

              {/* Document Details */}
              {foundDoc && (
                <Card className="border-0 shadow-sm rounded-4">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold mb-0">
                        {foundDoc.title}
                      </h5>

                      <Badge bg="primary">
                        #{foundDoc.id}
                      </Badge>
                    </div>

                    <p className="text-muted">
                      {foundDoc.description}
                    </p>

                    <hr />

                    <p>
                      <strong>Project ID:</strong>{" "}
                      {foundDoc.projectId}
                    </p>

                    <p>
                      <strong>Uploaded By:</strong>{" "}
                      {foundDoc.uploadedBy?.fullName ||
                        foundDoc.uploadedBy?.id}
                    </p>

                    <p>
                      <strong>Uploaded Date:</strong>{" "}
                      {formatDate(
                        foundDoc.uploadedAt
                      )}
                    </p>

                    {foundDoc.urlOrPath && (
                      <>
                        <a
                          href={`data:${getMimeType(
                            foundDoc.fileName
                          )};base64,${
                            foundDoc.urlOrPath
                          }`}
                          download={
                            foundDoc.fileName ||
                            "document"
                          }
                          className="btn btn-primary rounded-pill px-4 mb-3"
                        >
                          <Download className="me-2" />
                          Download File
                        </a>

                        {foundDoc.fileName?.match(
                          /\.(jpeg|jpg|png|gif)$/i
                        ) && (
                          <img
                            src={`data:${getMimeType(
                              foundDoc.fileName
                            )};base64,${
                              foundDoc.urlOrPath
                            }`}
                            alt={foundDoc.fileName}
                            style={{
                              width: "100%",
                              borderRadius: "12px",
                              marginTop: "10px",
                            }}
                          />
                        )}

                        {foundDoc.fileName?.match(
                          /\.pdf$/i
                        ) && (
                          <iframe
                            src={`data:application/pdf;base64,${foundDoc.urlOrPath}`}
                            title={foundDoc.fileName}
                            width="100%"
                            height="400px"
                            style={{
                              marginTop: "10px",
                              border:
                                "1px solid #ddd",
                              borderRadius: "10px",
                            }}
                          />
                        )}
                      </>
                    )}
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DocumentUpload;