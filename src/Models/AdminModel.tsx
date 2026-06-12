// Admin Model Structure
export interface AdminModel {
    id: string; // adminId
    username: string;
    password: string; 
    fullName: string;
    role: 'Admin' | 'PrincipalInvestigator' | 'ResearchMember'; 
    createdAt: string; // LocalDateTime
}