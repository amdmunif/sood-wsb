import api from './api';

export interface UserData {
    id: number;
    name: string;
    email: string;
    role: 'Super Admin' | 'Admin PKBM' | 'Peserta PKBM';
    pkbm_id?: number | null;
    pkbm_name?: string;
    password?: string; // Optional for updates
}

export const userService = {
    getAll: async () => {
        const response = await api.get<UserData[]>('/users.php');
        return response.data;
    },

    create: async (data: Partial<UserData>) => {
        const response = await api.post('/users.php', data);
        return response.data;
    },

    update: async (id: number, data: Partial<UserData>) => {
        const response = await api.put('/users.php', { ...data, id });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/users.php?id=${id}`);
        return response.data;
    }
};
