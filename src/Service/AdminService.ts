import axios from 'axios';

const baseURL = "http://localhost:8040/api/v1/admin";

export interface AdminModel {
    id: string;
    username: string;
    password: string;
    fullName: string;
    role: 'Admin' | 'PrincipalInvestigator' | 'ResearchMember';
    createdAt: string;
}

export interface AdminInputModel {
    id?: string; // Optional
    username: string;
    password: string;
    fullName: string;
    role: 'Admin' | 'PrincipalInvestigator' | 'ResearchMember';
}


const getToken = (): string => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");
    return `Bearer ${token}`;
};

export const saveAdmin = async (admin: AdminInputModel): Promise<void> => {
    try {
        await axios.post(`${baseURL}`, admin, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            }
        });
    } catch (err) {
        console.error("Error saving Admin:", err);
        throw err;
    }
}


export const getAllAdmins = async (): Promise<AdminModel[]> => {
    try {
        const response = await axios.get(`${baseURL}`, {
            headers: { "Authorization": getToken() }
        });
        return response.data;
    } catch (err) {
        console.error("Error fetching Admins:", err);
        throw err;
    }
}


export const updateAdmin = async (adminId: string, updatedAdmin: AdminInputModel): Promise<void> => {
    try {
        await axios.patch(`${baseURL}?id=${adminId}`, updatedAdmin, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            },
        });
    } catch (err) {
        console.error("Error updating Admin:", err);
        throw err;
    }
}


export const deleteAdmin = async (adminId: string): Promise<void> => {
    try {
        await axios.delete(`${baseURL}/${adminId}`, {
            headers: { "Authorization": getToken() }
        });
    } catch (err) {
        console.error("Error deleting Admin:", err);
        throw err;
    }
}