import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { PIModel, PIInputModel } from "../Service/PiService";

interface PIEditProps {
    show: boolean;
    selectedRow: PIModel | null;
    handleOnClose: () => void;
    updatePrincipalInvestigator: (piId: string, updatedPI: PIInputModel) => Promise<void>;
    loadData: () => void;
}

const PIEdit = ({
    show,
    selectedRow,
    handleOnClose,
    updatePrincipalInvestigator: updatePIService,
    loadData,
}: PIEditProps) => {
    const [pi, setPI] = useState<PIInputModel | null>(null);

    useEffect(() => {
        if (selectedRow) {
            setPI({
                id: selectedRow.id,
                username: selectedRow.username,
                fullName: selectedRow.fullName,
                role: "PrincipalInvestigator",
                password: '', 
            });
        }
    }, [selectedRow]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (!pi) return;
        setPI((prev) => (prev ? { ...prev, [name]: value as any } : null));
    };

    const handleOnSaveUpdateData = async () => {
        if (!pi || !selectedRow) {
            alert("No PI selected or data is incomplete!");
            return;
        }
        if (!pi.password) {
            alert("Password cannot be empty.");
            return;
        }

        try {
            await updatePIService(selectedRow.id, pi);
            alert(`PI ${selectedRow.id} updated successfully!`);
            loadData();
            handleOnClose();
        } catch (error) {
            console.error("Failed to update PI:", error);
            alert("Failed to update PI.");
        }
    };

    if (!pi) return null;

    return (
        <Modal show={show} onHide={handleOnClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Principal Investigator: {selectedRow?.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>PI ID:</Form.Label>
                        <Form.Control type="text" name="id" value={selectedRow?.id} readOnly />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Full Name:</Form.Label>
                        <Form.Control type="text" name="fullName" value={pi.fullName} onChange={handleChange} required />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control type="text" name="username" value={pi.username} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Password (Required for Update):</Form.Label>
                        <Form.Control type="password" name="password" value={pi.password} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Role:</Form.Label>
                        <Form.Select name="role" value={pi.role} onChange={handleChange}>
                            <option value="PrincipalInvestigator">Principal Investigator</option>
                            <option value="Admin">Admin</option>
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

export default PIEdit;