import Table from "react-bootstrap/Table";
import {
  getMilestonesByProject,
  deleteMilestone,
  updateMilestone,
  addMilestone,
  MilestoneModel,
} from "../Service/MilestoneService";

import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Badge,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";

import {
  CalendarCheck,
  PencilSquare,
  Trash,
  PlusCircle,
  Search,
} from "react-bootstrap-icons";

import MilestoneEdit from "./MilestoneEdit";
import MilestoneAdd from "./MilestoneAdd";
import { useParams } from "react-router-dom";

const formatDate = (isoString: string | null | undefined): string => {
  if (!isoString) return "N/A";
  return isoString.split("T")[0];
};

export const Milestone = () => {
  const { projectId } = useParams<{ projectId: string }>();

  const [milestones, setMilestones] = useState<MilestoneModel[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<MilestoneModel | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const loadData = useCallback(async () => {
    if (!projectId) return;

    try {
      const milestoneData = await getMilestonesByProject(projectId);
      setMilestones(milestoneData);
    } catch (error) {
      console.error(
        `Failed to load milestones for project ${projectId}:`,
        error
      );
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOnEdit = (milestone: MilestoneModel) => {
    setShowEditForm(true);
    setSelectedRow(milestone);
  };

  const handleOnDelete = async (milestoneId: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete milestone ID: ${milestoneId}?`
      )
    )
      return;

    try {
      await deleteMilestone(milestoneId);
      loadData();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed.");
    }
  };

  const filteredMilestones = milestones.filter((milestone) =>
    milestone.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "#f4f7fb",
        minHeight: "100vh",
      }}
    >
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
                <CalendarCheck size={35} className="me-2" />
                Project Milestones
              </h2>

              <p className="mb-0 opacity-75">
                Manage all milestones for Project ID :
                <strong> {projectId}</strong>
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
                onClick={() => setShowAddForm(true)}
              >
                <PlusCircle className="me-2" />
                Add Milestone
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
              placeholder="Search milestone by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body className="text-center">
              <h6 className="text-muted">Total Milestones</h6>
              <h2 className="fw-bold text-primary">
                {milestones.length}
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
                <th className="py-3 px-3">ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Created By</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMilestones.length > 0 ? (
                filteredMilestones.map((milestone, index) => (
                  <tr key={index}>
                    <td className="fw-bold text-secondary px-3">
                      #{milestone.id}
                    </td>

                    <td>
                      <div className="fw-semibold">
                        {milestone.title}
                      </div>
                    </td>

                    <td
                      style={{
                        maxWidth: "280px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {milestone.description}
                    </td>

                    <td>
                      <span className="text-muted">
                        {formatDate(milestone.dueDate)}
                      </span>
                    </td>

                    <td>
                      <Badge
                        bg={
                          milestone.isCompleted
                            ? "success"
                            : "warning"
                        }
                        className="px-3 py-2"
                      >
                        {milestone.isCompleted
                          ? "Completed"
                          : "Pending"}
                      </Badge>
                    </td>

                    <td>
                      {milestone.createdBy?.fullName ||
                        milestone.createdBy?.memberId ||
                        "N/A"}
                    </td>

                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-pill px-3"
                          onClick={() =>
                            handleOnEdit(milestone)
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
                            handleOnDelete(milestone.id)
                          }
                        >
                          <Trash className="me-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-5 text-muted"
                  >
                    No milestones found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <MilestoneEdit
        show={showEditForm}
        selectedRow={selectedRow}
        handleOnClose={() => setShowEditForm(false)}
        updateMilestone={updateMilestone}
        loadData={loadData}
      />

      <MilestoneAdd
        show={showAddForm}
        projectId={projectId || ""}
        handleOnClose={() => setShowAddForm(false)}
        addMilestone={addMilestone}
        loadData={loadData}
      />
    </div>
  );
};