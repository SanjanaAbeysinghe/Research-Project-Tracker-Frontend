import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { MilestoneModel, MilestoneInputModel } from "../Service/MilestoneService";

interface MilestoneEditProps {
    show: boolean;
    selectedRow: MilestoneModel | null;
    handleOnClose: () => void;
    updateMilestone: (milestoneId: string, updatedMilestone: MilestoneInputModel) => Promise<MilestoneModel>;
    loadData: () => void;
}

const MilestoneEdit = ({
    show,
    selectedRow,
    handleOnClose,
    updateMilestone: updateMilestoneService,
    loadData,
}: MilestoneEditProps) => {
    const [milestone, setMilestone] = useState<MilestoneInputModel | null>(null);

    useEffect(() => {
        if (selectedRow) {
            setMilestone({
                title: selectedRow.title,
                description: selectedRow.description,
                isCompleted: selectedRow.isCompleted,
                dueDate: selectedRow.dueDate ? selectedRow.dueDate.split('T')[0] : '',
                createdBy: selectedRow.createdBy ? { memberId: selectedRow.createdBy.memberId } : { memberId: '' },
                project: selectedRow.project ? { id: selectedRow.project.id } : undefined,
            });
        }
    }, [selectedRow]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (!milestone) return;

        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement; 
            
            setMilestone((prev) => (prev ? { ...prev, [name]: target.checked } : null));
            return;
        } 

        if (name === 'createdBy') {
            setMilestone((prev) => (prev ? { ...prev, createdBy: { memberId: value } } : null));
        } else {
            setMilestone((prev) => (prev ? { ...prev, [name]: value as any } : null));
        }
    };

    const handleOnSaveUpdateData = async () => {
        if (!milestone || !selectedRow) {
            alert("No milestone selected or data is incomplete!");
            return;
        }
        if (!milestone.title || !milestone.dueDate) {
            alert("Title and Due Date are required.");
            return;
        }

        try {
            await updateMilestoneService(selectedRow.id, milestone);
            alert(`Milestone ${selectedRow.id} updated successfully!`);
            loadData();
            handleOnClose();
        } catch (error) {
            console.error("Failed to update milestone:", error);
            alert("Failed to update milestone.");
        }
    };

    if (!milestone) return null;

    return (
        <Modal show={show} onHide={handleOnClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Milestone: {selectedRow?.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Milestone ID:</Form.Label>
                        <Form.Control type="text" name="id" value={selectedRow?.id} readOnly />
                    </Form.Group>
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Project ID:</Form.Label>
                        <Form.Control type="text" name="project" value={selectedRow?.project.id} readOnly />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Title:</Form.Label>
                        <Form.Control type="text" name="title" value={milestone.title} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Description:</Form.Label>
                        <Form.Control as="textarea" name="description" value={milestone.description} onChange={handleChange} />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Due Date:</Form.Label>
                        <Form.Control type="date" name="dueDate" value={milestone.dueDate} onChange={handleChange} required />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Created By Member ID:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="createdBy" 
                            value={milestone.createdBy?.memberId || ''} 
                            onChange={handleChange} 
                            placeholder="e.g., M001"
                        />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Check 
                            type="checkbox"
                            name="isCompleted"
                            label="Completed"
                            checked={milestone.isCompleted}
                            onChange={handleChange}
                        />
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

export default MilestoneEdit;