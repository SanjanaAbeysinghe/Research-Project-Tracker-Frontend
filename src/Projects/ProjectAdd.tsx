import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { ProjectModel, ProjectInputModel } from "../Service/ProjectService";


// Helper function for initial state
const getInitialState = (): ProjectInputModel => ({
    title: "",
    summary: "",
    tags: "",
    pi: { piId: "" }, // Start with empty PI ID
    status: "PLANNING", // Default status
    startDate: new Date().toISOString().split('T')[0], // Default to today's date
    endDate: "",
});

interface ProjectAddProps {
    show: boolean;
    handleOnClose: () => void;
    addProjectData: (project: ProjectInputModel) => Promise<ProjectModel>;
    loadData: () => void;
}

const ProjectAdd = ({
    show,
    handleOnClose,
    addProjectData: addProjectService,
    loadData
}: ProjectAddProps) => {
    const [project, setProject] = useState<ProjectInputModel>(getInitialState);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'piId') {
        // ... (rest of the logic remains the same)
        setProject((prev) => ({ ...prev, pi: { piId: value } }));
    } else {
        setProject((prev) => ({ ...prev, [name]: value }));
    }
    };
    const hanldeOnSubmit = async () => {
        // Simple validation
        if (!project.title || !project.summary || !project.pi.piId) {
            alert("Please fill in Title, Summary, and PI ID!");
            return;
        }

        try {
            await addProjectService(project);
            alert("Project added successfully!");
            loadData();
            setProject(getInitialState); // Reset form state
            handleOnClose();
        } catch (error) {
            console.error("Failed to add project:", error);
            alert("Failed to add project.");
        }
    };

    return (
        <Modal show={show} onHide={handleOnClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Title:</Form.Label>
                        <Form.Control type="text" name="title" value={project.title} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Summary:</Form.Label>
                        <Form.Control as="textarea" name="summary" value={project.summary} onChange={handleChange} required />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>PI ID:</Form.Label>
                        <Form.Control type="text" name="piId" value={project.pi.piId} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group as={Col} md="6" className="mb-3">
                        <Form.Label>Tags (Comma Separated):</Form.Label>
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
                <Button variant="primary" onClick={hanldeOnSubmit}>
                    Add Project
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProjectAdd;