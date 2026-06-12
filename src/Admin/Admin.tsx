import Table from "react-bootstrap/Table";

import {
  getAllAdmins,
  deleteAdmin,
  updateAdmin,
  saveAdmin,
  AdminModel,
} from "../Service/AdminService";

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
  ShieldLockFill,
  PencilSquare,
  Trash,
  PersonPlusFill,
  Search,
} from "react-bootstrap-icons";

import AdminEdit from "./AdminEdit";
import AdminAdd from "./AdminAdd";

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

export const Admin = () => {
  const [admins, setAdmins] = useState<
    AdminModel[]
  >([]);

  const [showEditForm, setShowEditForm] =
    useState(false);

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [selectedRow, setSelectedRow] =
    useState<AdminModel | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const loadData = async () => {
    try {
      const adminData = await getAllAdmins();

      setAdmins(adminData);
    } catch (error) {
      console.error(
        "Failed to load Admins:",
        error
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Edit
  const handleOnEdit = (
    admin: AdminModel
  ) => {
    setShowEditForm(true);
    setSelectedRow(admin);
  };

  // Delete
  const handleOnDelete = async (
    adminId: string
  ) => {
    if (
      !window.confirm(
        `Are you sure you want to delete Admin ID: ${adminId}?`
      )
    )
      return;

    try {
      await deleteAdmin(adminId);

      loadData();
    } catch (err) {
      console.error("Delete failed", err);

      alert("Delete failed.");
    }
  };

  // Search filter
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      admin.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      admin.role
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
            "linear-gradient(135deg, #dc2626, #7c3aed)",
          color: "white",
        }}
      >
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={8}>
              <h2 className="fw-bold mb-1">
                <ShieldLockFill
                  size={35}
                  className="me-2"
                />
                Admin Management
              </h2>

              <p className="mb-0 opacity-75">
                Manage all system administrators
                and access privileges.
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
                Add Admin
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
              placeholder="Search admin by name, username or role..."
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
                Total Admins
              </h6>

              <h2 className="fw-bold text-danger">
                {admins.length}
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
                <th>Role</th>
                <th>Created At</th>
                <th>Status</th>
                <th className="text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map(
                  (admin, index) => (
                    <tr key={index}>
                      <td className="fw-bold text-secondary px-3">
                        #{admin.id}
                      </td>

                      <td>
                        <div className="fw-semibold">
                          {admin.fullName}
                        </div>
                      </td>

                      <td>
                        <span className="text-muted">
                          @{admin.username}
                        </span>
                      </td>

                      <td>
                        <Badge
                          bg={
                            admin.role === "SUPER_ADMIN"
                              ? "danger"
                              : "primary"
                          }
                          className="px-3 py-2"
                        >
                          {admin.role}
                        </Badge>
                      </td>

                      <td>
                        {formatDate(
                          admin.createdAt
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
                                admin
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
                                admin.id
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
                    colSpan={7}
                    className="text-center py-5 text-muted"
                  >
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <AdminEdit
        show={showEditForm}
        selectedRow={selectedRow}
        handleOnClose={() =>
          setShowEditForm(false)
        }
        updateAdmin={updateAdmin}
        loadData={loadData}
      />

      <AdminAdd
        show={showAddForm}
        handleOnClose={() =>
          setShowAddForm(false)
        }
        saveAdmin={saveAdmin}
        loadData={loadData}
      />
    </div>
  );
};