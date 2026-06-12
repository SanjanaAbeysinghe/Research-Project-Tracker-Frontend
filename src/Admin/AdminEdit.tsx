import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { AdminModel, AdminInputModel } from "../Service/AdminService";

interface AdminEditProps {
    show: boolean;
    selectedRow: AdminModel | null;
    handleOnClose: () => void;
    updateAdmin: (adminId: string, updatedAdmin: AdminInputModel) => Promise<void>;
    loadData: () => void;
}

const AdminEdit = ({
    show,
    selectedRow,
    handleOnClose,
    updateAdmin: updateAdminService,
    loadData,
}: AdminEditProps) => {
    const [admin, setAdmin] = useState<AdminInputModel | null>(null);

    useEffect(() => {
        if (selectedRow) {
            setAdmin({
                id: selectedRow.id,
                username: selectedRow.username,
                fullName: selectedRow.fullName,
                role: selectedRow.role,
                // Password set to empty for edit
                password: '', 
            });
        }
    }, [selectedRow]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (!admin) return;
        setAdmin((prev) => (prev ? { ...prev, [name]: value as any } : null));
    };

    const handleOnSaveUpdateData = async () => {
        if (!admin || !selectedRow) {
            alert("No Admin selected or data is incomplete!");
            return;
        }
        if (!admin.password) {
            alert("Password cannot be empty for update.");
            return;
        }

        try {
            await updateAdminService(selectedRow.id, admin);
            alert(`Admin ${selectedRow.id} updated successfully!`);
            loadData();
            handleOnClose();
        } catch (error) {
            console.error("Failed to update Admin:", error);
            alert("Failed to update Admin.");
        }
    };

    if (!admin) return null;

    return (
        <Modal show={show} onHide={handleOnClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Admin User: {selectedRow?.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Admin ID:</Form.Label>
                        <Form.Control type="text" name="id" value={selectedRow?.id} readOnly />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Full Name:</Form.Label>
                        <Form.Control type="text" name="fullName" value={admin.fullName} onChange={handleChange} required />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control type="text" name="username" value={admin.username} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Password (Required for Update):</Form.Label>
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
                <Button variant="success" onClick={handleOnSaveUpdateData}>
                    Update
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AdminEdit;