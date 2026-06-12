import axios from 'axios';

const baseURL = "http://localhost:8040/api/v1/principalInvestigator";

export interface PIModel {
    id: string; 
    username: string;
    password: string; 
    fullName: string;
    role: 'Admin' | 'PrincipalInvestigator' | 'ResearchMember';
    createdAt: string;
}

export interface PIInputModel {
    id?: string; 
    username: string;
    password: string;
    fullName: string;
    role: 'PrincipalInvestigator';
}


const getToken = (): string => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");
    return `Bearer ${token}`;
};

export const savePrincipalInvestigator = async (pi: PIInputModel): Promise<void> => {
    try {
        await axios.post(`${baseURL}`, pi, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            }
        });
    } catch (err) {
        console.error("Error saving PI:", err);
        throw err;
    }
}

export const getAllPrincipalInvestigators = async (): Promise<PIModel[]> => {
    try {
        const response = await axios.get(`${baseURL}`, {
            headers: { "Authorization": getToken() }
        });
        return response.data;
    } catch (err) {
        console.error("Error fetching PIs:", err);
        throw err;
    }
}

export const updatePrincipalInvestigator = async (piId: string, updatedPI: PIInputModel): Promise<void> => {
    try {
        await axios.patch(`${baseURL}?id=${piId}`, updatedPI, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            },
        });
    } catch (err) {
        console.error("Error updating PI:", err);
        throw err;
    }
}

export const deletePrincipalInvestigator = async (piId: string): Promise<void> => {
    try {
        await axios.delete(`${baseURL}/${piId}`, {
            headers: { "Authorization": getToken() }
        });
    } catch (err) {
        console.error("Error deleting PI:", err);
        throw err;
    }
}