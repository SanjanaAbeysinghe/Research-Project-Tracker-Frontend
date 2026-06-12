import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { AdminModel, AdminInputModel } from "../Service/AdminService";

const getInitialState = (): AdminInputModel => ({
    username: "",
    password: "",
    fullName: "",
    // Default new Admin role
    role: "Admin", 
});

interface AdminAddProps {
    show: boolean;
    handleOnClose: () => void;
    saveAdmin: (admin: AdminInputModel) => Promise<void>;
    loadData: () => void;
}

const AdminAdd = ({
    show,
    handleOnClose,
    saveAdmin: saveAdminService,
    loadData
}: AdminAddProps) => {
    const [admin, setAdmin] = useState<AdminInputModel>(getInitialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAdmin((prev) => ({ ...prev, [name]: value as any }));
    };

    const hanldeOnSubmit = async () => {
        if (!admin.username || !admin.password || !admin.fullName) {
            alert("Please fill in Username, Password, and Full Name!");
            return;
        }

        try {
            await saveAdminService(admin);
            alert("Admin added successfully!");
            loadData();
            setAdmin(getInitialState); 
            handleOnClose();
        } catch (error) {
            console.error("Failed to add Admin:", error);
            alert("Failed to add Admin.");
        }
    };

    return (
        <Modal show={show} onHide={handleOnClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Admin User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Full Name:</Form.Label>
                        <Form.Control type="text" name="fullName" value={admin.fullName} onChange={handleChange} required />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control type="text" name="username" value={admin.username} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type="password" name="password" value={admin.password} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Role:</Form.Label>
                        <Form.Select name="role" value={admin.role} onChange={handleChange}>
                            <option value="Admin">Admin</option>
                            <option value="PrincipalInvestigator">Principal Investigator</option>
                            <option value="ResearchMember">Research Member</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleOnClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={hanldeOnSubmit}>
                    Save Admin
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdminAdd;