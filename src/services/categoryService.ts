import api from './api';

export interface SubjectCategory {
    id: number;
    name: string;
    sort_order: number;
}

export const subjectCategoryService = {
    getAll: async () => {
        const response = await api.get<SubjectCategory[]>('/subject_categories.php');
        return response.data;
    },

    create: async (data: Omit<SubjectCategory, 'id'>) => {
        const response = await api.post<SubjectCategory>('/subject_categories.php', data);
        return response.data;
    },

    update: async (id: number, data: Partial<SubjectCategory>) => {
        const response = await api.put<{ message: string }>(`/subject_categories.php`, { ...data, id });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete<{ message: string }>(`/subject_categories.php?id=${id}`);
        return response.data;
    },
};
