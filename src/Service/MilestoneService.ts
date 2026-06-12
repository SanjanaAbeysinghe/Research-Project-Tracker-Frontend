import axios from 'axios';

const baseURL = "http://localhost:8044/api/v1/milestone";
const getToken = (): string => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No auth token found");
  return `Bearer ${token}`;
};


export interface MilestoneModel {
    id: string;
    title: string;
    description: string;
    dueDate: string; // YYYY-MM-DD
    isCompleted: boolean;
    

    project: { id: string; title?: string }; 
    createdBy: { memberId: string; fullName?: string }; 
}

export interface MilestoneInputModel {
    title: string;
    description: string;
    dueDate: string; // YYYY-MM-DD
    isCompleted: boolean;
    

    project?: { id: string }; 
    createdBy?: { memberId: string }; 
}


export const getMilestonesByProject = async (projectId: string): Promise<MilestoneModel[]> => {
  try {
    const response = await axios.get(`${baseURL}/projects/${projectId}`, {
      headers: {
        "Authorization": getToken() // ✅ send token for auth
      }
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching milestones:", err);
    throw err;
  }
};

export const addMilestone = async (projectId: string, milestone: MilestoneInputModel): Promise<MilestoneModel> => {
    try {
        const response = await axios.post(`${baseURL}/projects/${projectId}`, milestone, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            }
        });
        return response.data;
    } catch (err) {
        console.error("Error adding milestone:", err);
        throw err;
    }
}

export const updateMilestone = async (milestoneId: string, updatedMilestone: MilestoneInputModel): Promise<MilestoneModel> => {
    try {
        const response = await axios.patch(`${baseURL}/${milestoneId}`, updatedMilestone, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            },
        });
        return response.data;
    } catch (err) {
        console.error("Error updating milestone:", err);
        throw err;
    }
}


export const deleteMilestone = async (milestoneId: string): Promise<string> => {
    try {
        const response = await axios.delete(`${baseURL}/${milestoneId}`, {
            headers: { "Authorization": getToken() }
        });
        return response.data;
    } catch (err) {
        console.error("Error deleting milestone:", err);
        throw err;
    }
}