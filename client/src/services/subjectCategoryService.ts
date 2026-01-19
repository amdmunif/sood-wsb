import api from './api';
import type { SubjectCategory } from '../types';

export const getSubjectCategories = async () => {
    const response = await api.get<SubjectCategory[]>('/subject-categories');
    return response.data;
};

export const createSubjectCategory = async (name: string) => {
    const response = await api.post<SubjectCategory>('/subject-categories', { name });
    return response.data;
};

export const updateSubjectCategory = async (id: number, name: string) => {
    const response = await api.put<SubjectCategory>(`/subject-categories/${id}`, { name });
    return response.data;
};

export const deleteSubjectCategory = async (id: number) => {
    const response = await api.delete(`/subject-categories/${id}`);
    return response.data;
};
