import api from './api';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'Super Admin' | 'Admin PKBM' | 'Peserta PKBM';
    pkbm_id?: number | null;
    pkbm_name?: string | null;
}

export const authService = {
    login: async (email: string, password: string): Promise<User> => {
        const response = await api.post<User>('/login.php', { email, password });
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post('/logout.php');
    },

    checkSession: async (): Promise<User> => {
        const response = await api.get<User>('/check_session.php');
        return response.data;
    }
};
