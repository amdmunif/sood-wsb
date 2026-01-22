import api from './api';

export interface SubjectModule {
    id: number;
    name: string;
}

export interface Subject {
    id: number;
    name: string;
    sort_order: number;
    category_id: number | null;
    category_name?: string;
    category_sort_order?: number;
    modules: SubjectModule[];
}

export const subjectService = {
    getAll: async () => {
        const response = await api.get<Subject[]>('/subjects.php');
        return response.data;
    },

    create: async (data: Omit<Subject, 'id' | 'modules' | 'category_name' | 'category_sort_order'>) => {
        const response = await api.post<Subject>('/subjects.php', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Subject>) => {
        const response = await api.put<{ message: string }>(`/subjects.php`, { ...data, id });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete<{ message: string }>(`/subjects.php?id=${id}`);
        return response.data;
    },
};
