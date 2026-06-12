import Table from "react-bootstrap/Table";

import {
  getAllResearchMembers,
  deleteResearchMember,
  updateResearchMember,
  saveResearchMember,
  MemberModel,
} from "../Service/MemberService";

import { useEffect, useState } from "react";

import {
  Button,
  Card,
  Row,
  Col,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";

import {
  PeopleFill,
  PencilSquare,
  Trash,
  PersonPlusFill,
  Search,
} from "react-bootstrap-icons";

import MemberEdit from "./MemberEdit";
import MemberAdd from "./MemberAdd";

// Helper to format date
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
    return isoString
      ? isoString.split("T")[0]
      : "N/A";
  }
};

export const Member = () => {
  const [members, setMembers] = useState<
    MemberModel[]
  >([]);

  const [showEditForm, setShowEditForm] =
    useState(false);

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [selectedRow, setSelectedRow] =
    useState<MemberModel | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const loadData = async () => {
    try {
      const memberData =
        await getAllResearchMembers();

      setMembers(memberData);
    } catch (error) {
      console.error(
        "Failed to load Research Members:",
        error
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Edit
  const handleOnEdit = (
    member: MemberModel
  ) => {
    setShowEditForm(true);
    setSelectedRow(member);
  };

  // Delete
  const handleOnDelete = async (
    memberId: string
  ) => {
    if (
      !window.confirm(
        `Are you sure you want to delete Member ID: ${memberId}?`
      )
    )
      return;

    try {
      await deleteResearchMember(memberId);

      loadData();
    } catch (err) {
      console.error("Delete failed", err);

      alert("Delete failed.");
    }
  };

  // Search filter
  const filteredMembers = members.filter(
    (member) =>
      member.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      member.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
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
            "linear-gradient(135deg, #7c3aed, #2563eb)",
          color: "white",
        }}
      >
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={8}>
              <h2 className="fw-bold mb-1">
                <PeopleFill
                  size={35}
                  className="me-2"
                />
                Research Members
              </h2>

              <p className="mb-0 opacity-75">
                Manage all research team
                members in one place.
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
                <PersonPlusFill className="me-2" />
                Add Member
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
              placeholder="Search member by name or username..."
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
                Total Members
              </h6>

              <h2 className="fw-bold text-primary">
                {members.length}
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

                <th>Full Name</th>

                <th>Username</th>

                <th>Joined At</th>

                <th>Status</th>

                <th className="text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map(
                  (member, index) => (
                    <tr key={index}>
                      <td className="fw-bold text-secondary px-3">
                        #{member.id}
                      </td>

                      <td>
                        <div className="fw-semibold">
                          {member.fullName}
                        </div>
                      </td>

                      <td>
                        <span className="text-muted">
                          @{member.username}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          member.joinedAt
                        )}
                      </td>

                      <td>
                        <Badge
                          bg="success"
                          className="px-3 py-2"
                        >
                          Active
                        </Badge>
                      </td>

                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="rounded-pill px-3"
                            onClick={() =>
                              handleOnEdit(
                                member
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
                                member.id
                              )
                            }
                          >
                            <Trash className="me-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-5 text-muted"
                  >
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Edit Modal */}
      <MemberEdit
        show={showEditForm}
        selectedRow={selectedRow}
        handleOnClose={() =>
          setShowEditForm(false)
        }
        updateResearchMember={
          updateResearchMember
        }
        loadData={loadData}
      />

      {/* Add Modal */}
      <MemberAdd
        show={showAddForm}
        handleOnClose={() =>
          setShowAddForm(false)
        }
        saveResearchMember={
          saveResearchMember
        }
        loadData={loadData}
      />
    </div>
  );
};