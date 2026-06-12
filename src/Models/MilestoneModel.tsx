// Milestone Model Structure
export interface MilestoneModel {
    id: string; // milestoneId
    title: string;
    description: string;
    dueDate: string; // LocalDate
    isCompleted: boolean;
    

    project: { projectId: string; title: string }; 
    createdBy: { memberId: string; fullName: string }; 
}

// Input Model for creation/update
export interface MilestoneInputModel {
    title: string;
    description: string;
    dueDate: string;
    isCompleted: boolean;
    createdBy?: { memberId: string }; 
}