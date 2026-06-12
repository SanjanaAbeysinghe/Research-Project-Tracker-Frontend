import axios from 'axios';

const baseURL = "http://localhost:8040/api/v1/projects";

export interface ProjectModel {
    id: string;
    title: string;
    summary: string;
    tags: string;
    pi: {
        piId: string;
        name?: string; 
    };
    status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectInputModel {
    title: string;
    summary: string;
    tags: string;
    pi: { piId: string };
    status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    startDate: string;
    endDate: string;
}


// get Token 
const getToken = (): string =>{
    const token = localStorage.getItem("authToken");
    return "Bearer "+token;
};

export const getAllProjectsData = async (): Promise<ProjectModel[]> =>{
    try{
       const response = await axios.get(`${baseURL}`,{
           headers:{
               "Authorization": getToken()
           }
       });

       return response.data;

    }catch(err){
       console.error("Error fetching projects:", err);
       throw err;
    }
}

export const addProjectData = async(project: ProjectInputModel): Promise<ProjectModel> =>{
    try{
        const response = await axios.post(`${baseURL}`, project, {
          headers:{
            "Content-Type": "application/json",
            "Authorization": getToken()
          }
        });
        return response.data;

    }catch(err){
        console.error("Error saving project:", err);
        throw err;
    }
}

export const updateProjectData = async (project: ProjectInputModel, projectId: string): Promise<ProjectModel> =>{
    try {
        const response = await axios.put(`${baseURL}/${projectId}`, project, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": getToken()
            },
        });
        return response.data;
    } catch (err) {
        console.error("Error updating project:", err);
        throw err;
    }
}

export const deleteProjectData = async (projectId: string): Promise<string> =>{ 
    try {
      const response = await axios.delete(`${baseURL}/${projectId}`,{
        headers:{
          "Authorization": getToken()
        }
      }); 
      return response.data;
    } catch (err) {
      console.error("Error deleting project:", err);
      throw err;
    }
}

export const updateProjectStatusData = async (projectId: string, newStatus: ProjectModel['status']): Promise<string> =>{
    try {
      const response = await axios.patch(`${baseURL}/${projectId}/status`, JSON.stringify(newStatus), {
        headers:{
          "Content-Type": "application/json",
          "Authorization": getToken()
        }
      }); 
      return response.data;
    } catch (err) {
      console.error("Error updating project status:", err);
      throw err;
    }
}