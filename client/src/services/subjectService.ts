import api from './api';
import type { Subject } from '../types';

export const getSubjects = async () => {
    const response = await api.get<Subject[]>('/subjects');
    return response.data;
};

export const createSubject = async (name: string, category_id?: number) => {
    const response = await api.post<Subject>('/subjects', { name, category_id });
    return response.data;
};

export const updateSubject = async (id: number, name: string, category_id?: number) => {
    const response = await api.put<Subject>(`/subjects/${id}`, { name, category_id });
    return response.data;
};

export const deleteSubject = async (id: number) => {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
};
