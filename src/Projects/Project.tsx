import Table from "react-bootstrap/Table";

import {
  getAllProjectsData,
  deleteProjectData,
  updateProjectData,
  addProjectData,
  updateProjectStatusData,
  ProjectModel,
} from "../Service/ProjectService";

import { useEffect, useState } from "react";

import {
  Button,
  Dropdown,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";

import {
  FolderFill,
  PencilSquare,
  Trash,
  PlusCircle,
  Search,
  FlagFill,
  CalendarCheck,
} from "react-bootstrap-icons";

import ProjectEdit from "./ProjectEdit";
import ProjectAdd from "./ProjectAdd";

import { useNavigate } from "react-router-dom";

// Helper function
const formatDate = (
  isoString: string | null | undefined
): string => {
  if (!isoString) return "N/A";

  try {
    const date = new Date(isoString);

    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } catch {
    return isoString.split("T")[0];
  }
};

export const Project = () => {
  const [projects, setProjects] = useState<
    ProjectModel[]
  >([]);

  const [showEditForm, setShowEditForm] =
    useState(false);

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [selectedRow, setSelectedRow] =
    useState<ProjectModel | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const projectData =
        await getAllProjectsData();

      setProjects(projectData);
    } catch (error) {
      console.error(
        "Failed to load projects:",
        error
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Edit
  const handleOnEdit = (
    project: ProjectModel
  ) => {
    setShowEditForm(true);
    setSelectedRow(project);
  };

  // Delete
  const handleOnDelete = async (
    projectId: string
  ) => {
    if (
      !window.confirm(
        `Are you sure you want to delete project ID: ${projectId}?`
      )
    )
      return;

    try {
      await deleteProjectData(projectId);

      loadData();
    } catch (err) {
      console.error("Delete failed", err);

      alert("Delete failed.");
    }
  };

  // Status Update
  const handleStatusUpdate = async (
    projectId: string,
    newStatus: ProjectModel["status"]
  ) => {
    try {
      await updateProjectStatusData(
        projectId,
        newStatus
      );

      loadData();
    } catch (err) {
      console.error(
        "Status update failed",
        err
      );

      alert("Status update failed.");
    }
  };

  // Navigate milestones
  const handleMilestoneNavigate = (
    projectId: string
  ) => {
    navigate(`/milestone/${projectId}`);
  };

  // Search filter
  const filteredProjects = projects.filter(
    (project) =>
      project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      project.summary
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      project.tags
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Status dropdown
  const StatusDropdown = ({
    project,
  }: {
    project: ProjectModel;
  }) => (
    <Dropdown>
      <Dropdown.Toggle
        variant={
          project.status === "COMPLETED"
            ? "success"
            : project.status ===
              "IN_PROGRESS"
            ? "warning"
            : project.status ===
              "CANCELLED"
            ? "danger"
            : "info"
        }
        size="sm"
        className="rounded-pill fw-semibold"
      >
        {project.status}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {(
          [
            "PLANNING",
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELLED",
          ] as ProjectModel["status"][]
        ).map((status) => (
          <Dropdown.Item
            key={status}
            onClick={() =>
              handleStatusUpdate(
                project.id,
                status
              )
            }
            disabled={
              project.status === status
            }
          >
            Set to {status}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );

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
            "linear-gradient(135deg, #0f172a, #2563eb)",
          color: "white",
        }}
      >
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={8}>
              <h2 className="fw-bold mb-1">
                <FolderFill
                  size={35}
                  className="me-2"
                />
                Research Projects
              </h2>

              <p className="mb-0 opacity-75">
                Manage all research
                projects, milestones and
                statuses in one dashboard.
              </p>
            </Col>

            <Col
              md={4}
              className="text-md-end mt-3 mt-md-0"
            >
              <Button
                variant="light"
                size="lg"
                className="fw-bold rounded-pill px-4"
                onClick={() =>
                  setShowAddForm(true)
                }
              >
                <PlusCircle className="me-2" />
                Add Project
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>


      <Row className="mb-4">
        <Col md={8}>
          <InputGroup className="shadow-sm">
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>

            <Form.Control
              type="text"
              placeholder="Search projects by title, summary or tags..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />
          </InputGroup>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body className="text-center">
              <h6 className="text-muted">
                Total Projects
              </h6>

              <h2 className="fw-bold text-primary">
                {projects.length}
              </h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-lg rounded-4">
        <Card.Body className="p-0">
          <Table
            hover
            responsive
            className="align-middle mb-0"
          >
            <thead
              style={{
                background: "#111827",
                color: "white",
              }}
            >
              <tr>
                <th className="py-3 px-3">
                  ID
                </th>

                <th>Title</th>
                <th>Summary</th>
                <th>PI Name</th>
                <th>Tags</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Created At</th>
                <th className="text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.length >
              0 ? (
                filteredProjects.map(
                  (project, index) => (
                    <tr key={index}>
                      <td className="fw-bold text-secondary px-3">
                        #{project.id}
                      </td>

                      <td>
                        <div className="fw-semibold">
                          {project.title}
                        </div>
                      </td>

                      <td
                        style={{
                          maxWidth: "250px",
                          overflow:
                            "hidden",
                          textOverflow:
                            "ellipsis",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {project.summary}
                      </td>

                      <td>
                        {project.pi
                          ?.name ||
                          project.pi
                            ?.piId ||
                          "N/A"}
                      </td>

                      <td>
                        <Badge bg="secondary">
                          {project.tags}
                        </Badge>
                      </td>

                      <td>
                        <StatusDropdown
                          project={project}
                        />
                      </td>

                      <td>
                        {formatDate(
                          project.startDate
                        )}
                      </td>

                      <td>
                        {formatDate(
                          project.endDate
                        )}
                      </td>

                      <td>
                        {formatDate(
                          project.createdAt
                        )}
                      </td>

                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="rounded-pill px-3"
                            onClick={() =>
                              handleOnEdit(
                                project
                              )
                            }
                          >
                            <PencilSquare className="me-1" />
                            Edit
                          </Button>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="rounded-pill px-3"
                            onClick={() =>
                              handleOnDelete(
                                project.id
                              )
                            }
                          >
                            <Trash className="me-1" />
                            Delete
                          </Button>

                          <Button
                            variant="outline-info"
                            size="sm"
                            className="rounded-pill px-3"
                            onClick={() =>
                              handleMilestoneNavigate(
                                project.id
                              )
                            }
                          >
                            <CalendarCheck className="me-1" />
                            Milestones
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-5 text-muted"
                  >
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

  
      <ProjectEdit
        show={showEditForm}
        selectedRow={selectedRow}
        handleOnClose={() =>
          setShowEditForm(false)
        }
        updateProjectData={
          updateProjectData
        }
        loadData={loadData}
      />

      <ProjectAdd
        show={showAddForm}
        handleOnClose={() =>
          setShowAddForm(false)
        }
        addProjectData={addProjectData}
        loadData={loadData}
      />
    </div>
  );
};