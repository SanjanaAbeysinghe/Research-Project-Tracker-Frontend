import axios from 'axios';

const baseURL = "http://localhost:8044/api/v1/researchMember";


export interface MemberModel {
    id: string;
    username: string;
    password: string;
    fullName: string;
    joinedAt: string;
}


export interface MemberInputModel {
    id?: string;
    username: string;
    password: string;
    fullName: string;
}



const getToken = (): string => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No auth token found");
    return `Bearer ${token}`;
};


export const saveResearchMember = async (member: MemberInputModel): Promise<void> => {
    try {
        await axios.post(`${baseURL}`, member, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            }
        });
    } catch (err) {
        console.error("Error saving Member:", err);
        throw err;
    }
}


export const getAllResearchMembers = async (): Promise<MemberModel[]> => {
    try {
        const response = await axios.get(`${baseURL}`, {
            headers: { "Authorization": getToken() }
        });
        return response.data;
    } catch (err) {
        console.error("Error fetching Members:", err);
        throw err;
    }
}


export const updateResearchMember = async (memberId: string, updatedMember: MemberInputModel): Promise<void> => {
    try {
        
        await axios.patch(`${baseURL}?id=${memberId}`, updatedMember, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            },
        });
    } catch (err) {
        console.error("Error updating Member:", err);
        throw err;
    }
}


export const deleteResearchMember = async (memberId: string): Promise<void> => {
    try {
        await axios.delete(`${baseURL}/${memberId}`, {
            headers: { "Authorization": getToken() }
        });
    } catch (err) {
        console.error("Error deleting Member:", err);
        throw err;
    }
}