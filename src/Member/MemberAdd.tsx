import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import { MemberModel, MemberInputModel } from "../Service/MemberService";

const getInitialState = (): MemberInputModel => ({
    username: "",
    password: "",
    fullName: "",
 
});

interface MemberAddProps {
    show: boolean;
    handleOnClose: () => void;
    saveResearchMember: (member: MemberInputModel) => Promise<void>;
    loadData: () => void;
}

const MemberAdd = ({
    show,
    handleOnClose,
    saveResearchMember: saveMemberService,
    loadData
}: MemberAddProps) => {
    const [member, setMember] = useState<MemberInputModel>(getInitialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMember((prev) => ({ ...prev, [name]: value as any }));
    };

    const hanldeOnSubmit = async () => {
        if (!member.username || !member.password || !member.fullName ) {
            alert("Please fill in Username, Password and Full Name");
            return;
        }

        try {
            await saveMemberService(member);
            alert("Research Member added successfully!");
            loadData();
            setMember(getInitialState); 
            handleOnClose();
        } catch (error) {
            console.error("Failed to add Member:", error);
            alert("Failed to add Research Member.");
        }
    };

    return (
        <Modal show={show} onHide={handleOnClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Research Member</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate>
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Full Name:</Form.Label>
                        <Form.Control type="text" name="fullName" value={member.fullName} onChange={handleChange} required />
                    </Form.Group>
                    
                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Username:</Form.Label>
                        <Form.Control type="text" name="username" value={member.username} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group as={Col} md="12" className="mb-3">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type="password" name="password" value={member.password} onChange={handleChange} required />
                    </Form.Group>
                    

            

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={handleOnClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={hanldeOnSubmit}>
                    Save Member
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MemberAdd;