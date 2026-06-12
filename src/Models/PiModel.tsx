// PI Model Structure
export interface PIModel {
    id: string; // piId
    username: string;
    password: string;
    fullName: string;
    role: 'PrincipalInvestigator';
    createdAt: string; // LocalDateTime
}