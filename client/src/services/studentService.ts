import api from './api';
import type { Student } from '../types';

export const getStudents = async () => {
    const response = await api.get<Student[]>('/students');
    return response.data;
};

export const createStudent = async (data: any) => {
    const response = await api.post<Student>('/students', data);
    return response.data;
};

export const updateStudent = async (id: number, data: any) => {
    const response = await api.put<Student>(`/students/${id}`, data);
    return response.data;
};

export const deleteStudent = async (id: number) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
};
