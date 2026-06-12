import Table from 'react-bootstrap/Table';
import { getAllPrincipalInvestigators, deletePrincipalInvestigator, updatePrincipalInvestigator, savePrincipalInvestigator, PIModel} from "../Service/PiService";
import { useEffect, useState } from 'react';
import {Button} from "react-bootstrap";
import PIEdit from './PiEdit';
import PIAdd from './PiAdd';

const formatDate = (isoString: string | null | undefined): string => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
        return isoString.split('T')[0];
    }
};

export const PrincipalInvestigator = ()=> {
    const tblHeaders : string [] = [
        "ID",
        "Full Name",
        "Username",
        "Role",
        "Created At",
        "Options",
    ];

    const [ pis,setPIs ] = useState<PIModel []>([])
    const [ showEditForm, setShowEditForm] = useState(false);
    const [ showAddForm, setShowAddForm] = useState(false);
    const [ selectedRow, setSelectedRow] = useState<PIModel | null>(null);

    const loadData = async () => {
        try {
            const piData = await getAllPrincipalInvestigators();
            setPIs(piData);
        } catch(error) {
            console.error("Failed to load Principal Investigators:", error);
        }
    };

    useEffect(()=>{
        loadData();
    },[]) 
    
    // handle edit form
    const handleOnEdit = (pi: PIModel) =>{
        setShowEditForm(true);
        setSelectedRow(pi);
    }

    // handle delete
    const handleOnDelete = async (piId: string)=>{
        if (!window.confirm(`Are you sure you want to delete PI ID: ${piId}?`)) return;
        try{
            await deletePrincipalInvestigator(piId);
            alert("Principal Investigator deleted successfully.");
            loadData();  
        }catch(err){
            console.error("Delete failed",err);
            alert("Delete failed.");
        }
    }

    return(
        <div className="container mt-5" style={{ maxWidth: "95%" }}>
  
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-primary" style={{ fontWeight: 700 }}>🔬 Principal Investigator Portal</h1>
                <Button
                    variant='primary'
                    onClick={()=> setShowAddForm(true)}
                    style={{ fontWeight: 'bold', padding: '10px 25px', boxShadow: '0px 5px 15px rgba(0,0,0,0.3)' }}
                >
                    + Add PI
                </Button>
            </div>

            
            <div className="shadow-lg rounded-4 overflow-auto" style={{ background: '#ffffff', padding: '20px' }}>
                <Table striped bordered hover responsive className="mb-0 align-middle">
                    <thead className="table-dark">
                        <tr>
                            {tblHeaders.map((headings,index)=> (
                                <th key={index} className="text-center">{headings}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                    {pis.map((pi,index) =>(
                        <tr key={index}>
                            <td className="text-center">{pi.id}</td>
                            <td>{pi.fullName}</td>
                            <td>{pi.username}</td>
                            <td>{pi.role}</td>
                            <td>{formatDate(pi.createdAt)}</td>
                            <td className="text-center">
                                <div className="d-flex flex-column gap-2">
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={()=> handleOnEdit(pi)}
                                        style={{ fontWeight: 600 }}
                                    >
                                         Update
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={()=> handleOnDelete(pi.id)}
                                        style={{ fontWeight: 600 }}
                                    >
                                         Delete
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>

            <PIEdit
                show = {showEditForm}
                selectedRow={selectedRow}
                handleOnClose={()=> setShowEditForm(false)}
                updatePrincipalInvestigator={updatePrincipalInvestigator}
                loadData={loadData}
            />

            <PIAdd
                show = {showAddForm}
                handleOnClose={()=> setShowAddForm(false)}
                savePrincipalInvestigator={savePrincipalInvestigator}
                loadData={loadData}
            />
        </div>
    );
}