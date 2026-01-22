import api from './api';

export interface Student {
    id: number;
    name: string;
    email: string;
    nik?: string;
    nis?: string;
    pkbm_id: number;
    pkbm_name?: string;
    headmaster_name?: string;
    homeroom_teacher_name?: string;
    modules_completed?: number;
    average_score?: number;
}

export const studentService = {
    getAll: async (params?: { pkbm_id?: number }) => {
        let url = '/students.php';
        if (params?.pkbm_id) {
            url += `?pkbm_id=${params.pkbm_id}`;
        }
        const response = await api.get<Student[]>(url);
        return response.data;
    },

    create: async (data: { name: string; email: string; nik?: string; pkbm_id?: number }) => {
        const response = await api.post('/students.php', data);
        return response.data;
    },

    update: async (id: number, data: { name: string; email: string; nik?: string; nis?: string }) => {
        const response = await api.put('/students.php', { ...data, id });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/students.php?id=${id}`);
        return response.data;
    }
};
