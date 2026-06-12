import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { PIModel, PIInputModel } from "../Service/PiService";

const getInitialState = (): PIInputModel => ({
    username: "",
    password: "",
    fullName: "",
    role: "PrincipalInvestigator", 
});

interface PIAddProps {
    show: boolean;
    handleOnClose: () => void;
    savePrincipalInvestigator: (pi: PIInputModel) => Promise<void>;
    loadData: () => void;
}

const PIAdd = ({
    show,
    handleOnClose,
    savePrincipalInvestigator: savePIService,
    loadData
}: PIAddProps) => {
    const [pi, setPI] = useState<PIInputModel>(getInitialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPI((prev) => ({ ...prev, [name]: value as any }));
    };

    const hanldeOnSubmit = async () => {
        if (!pi.username || !pi.password || !pi.fullName) {
            alert("Please fill in Username, Password, and Full Name!");
            return;
        }

        try {
            await savePIService(pi);
            alert("Principal Investigator added successfully!");
            loadData();
            setPI(getInitialState); 
            handleOnClose();
        } catch (error) {
            console.error("Failed to add PI:", error);
            alert("Failed to add Principal Investigator.");
        }
    };

    return (
        <Modal show={show} onHide={handleOnClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Principal Investigator</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Full Name:</Form.Label>
                        <Form.Control type="text" name="fullName" value={pi.fullName} onChange={handleChange} required />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control type="text" name="username" value={pi.username} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Password:</Form.Label>
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
                <Button variant="primary" onClick={hanldeOnSubmit}>
                    Save PI
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PIAdd;