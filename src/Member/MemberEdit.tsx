import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { MemberModel, MemberInputModel } from "../Service/MemberService";

interface MemberEditProps {
    show: boolean;
    selectedRow: MemberModel | null;
    handleOnClose: () => void;
    updateResearchMember: (memberId: string, updatedMember: MemberInputModel) => Promise<void>;
    loadData: () => void;
}

const MemberEdit = ({
    show,
    selectedRow,
    handleOnClose,
    updateResearchMember: updateMemberService,
    loadData,
}: MemberEditProps) => {
    const [member, setMember] = useState<MemberInputModel | null>(null);

    useEffect(() => {
        if (selectedRow) {
            // Map selectedRow (MemberModel) to MemberInputModel for form state
            setMember({
                id: selectedRow.id,
                username: selectedRow.username,
                fullName: selectedRow.fullName,
                // Password should generally be empty on edit load for security
                password: '', 
            });
        }
    }, [selectedRow]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (!member) return;
        setMember((prev) => (prev ? { ...prev, [name]: value as any } : null));
    };

    const handleOnSaveUpdateData = async () => {
        if (!member || !selectedRow) {
            alert("No Member selected or data is incomplete!");
            return;
        }
        if (!member.password) {
            alert("Password cannot be empty for update.");
            return;
        }

        try {
            await updateMemberService(selectedRow.id, member);
            alert(`Member ${selectedRow.id} updated successfully!`);
            loadData();
            handleOnClose();
        } catch (error) {
            console.error("Failed to update Member:", error);
            alert("Failed to update Member.");
        }
    };

    if (!member) return null;

    return (
        <Modal show={show} onHide={handleOnClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Research Member: {selectedRow?.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Member ID:</Form.Label>
                        <Form.Control type="text" name="id" value={selectedRow?.id} readOnly />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Full Name:</Form.Label>
                        <Form.Control type="text" name="fullName" value={member.fullName} onChange={handleChange} required />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control type="text" name="username" value={member.username} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Password (Required for Update):</Form.Label>
                        <Form.Control type="password" name="password" value={member.password} onChange={handleChange} required />
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

export default MemberEdit;