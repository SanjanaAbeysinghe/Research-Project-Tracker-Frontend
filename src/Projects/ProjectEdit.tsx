import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { ProjectModel, ProjectInputModel} from "../Service/ProjectService";

interface ProjectEditProps {
    show: boolean;
    selectedRow: ProjectModel | null;
    handleOnClose: () => void;
    updateProjectData: (project: ProjectInputModel, projectId: string) => Promise<ProjectModel>;
    loadData: () => void;
}

const ProjectEdit = ({
    show,
    selectedRow,
    handleOnClose,
    updateProjectData: updateProjectService,
    loadData,
}: ProjectEditProps) => {
    const [project, setProject] = useState<ProjectInputModel | null>(null);

    useEffect(() => {
    if (selectedRow) {
        const piIdValue = selectedRow.pi ? selectedRow.pi.piId : ""; 

        setProject({
            title: selectedRow.title,
            summary: selectedRow.summary,
            tags: selectedRow.tags,
            
            pi: { piId: piIdValue }, 
            
            status: selectedRow.status,
            startDate: selectedRow.startDate ? selectedRow.startDate.split('T')[0] : '', 
            endDate: selectedRow.endDate ? selectedRow.endDate.split('T')[0] : '',
        });
    }
}, [selectedRow]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (!project) return;

        if (name === 'piId') {
            setProject((prev) => (prev ? { ...prev, pi: { piId: value } } : null));
        } else {
            setProject((prev) => (prev ? { ...prev, [name]: value as any } : null));
        }
    };

    const handleOnSaveUpdateData = async () => {
        if (!project || !selectedRow) {
            alert("No project selected or data is incomplete!");
            return;
        }

        try {
            await updateProjectService(project, selectedRow.id);
            alert(`Project ${selectedRow.id} updated successfully!`);
            loadData();
            handleOnClose();
        } catch (error) {
            console.error("Failed to update project:", error);
            alert("Failed to update project.");
        }
    };

    if (!project) return null;

    return (
        <Modal show={show} onHide={handleOnClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Project: {selectedRow?.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Project ID:</Form.Label>
                        <Form.Control type="text" name="id" value={selectedRow?.id} readOnly />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Title:</Form.Label>
                        <Form.Control type="text" name="title" value={project.title} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Summary:</Form.Label>
                        <Form.Control as="textarea" name="summary" value={project.summary} onChange={handleChange} />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>PI ID:</Form.Label>
                        <Form.Control type="text" name="piId" value={project.pi.piId} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Tags:</Form.Label>
                        <Form.Control type="text" name="tags" value={project.tags} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Start Date:</Form.Label>
                        <Form.Control type="date" name="startDate" value={project.startDate} onChange={handleChange} />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>End Date:</Form.Label>
                        <Form.Control type="date" name="endDate" value={project.endDate} onChange={handleChange} />
                    </Form.Group>

                    <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Status:</Form.Label>
                        <Form.Select name="status" value={project.status} onChange={handleChange}>
                            <option value="PLANNING">PLANNING</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
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

export default ProjectEdit;