export interface ProjectModel {
    id: string;
    title: string;
    summary: string;
    tags: string;
    pi: {
        piId: string;
        name: string;
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