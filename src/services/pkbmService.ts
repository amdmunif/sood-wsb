import api from './api';

export interface PKBM {
    id: number;
    name: string;
    npsn: string;
    email: string;
    address: string;
    classroomUrl?: string;
    headmaster_name?: string;
    homeroom_teacher_name?: string;
    coords: {
        lat: number | null;
        lng: number | null;
    };
    contactPerson: {
        name: string;
        phone: string;
    };
}

export const pkbmService = {
    getAll: async () => {
        const response = await api.get<PKBM[]>('/pkbm.php');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<PKBM>(`/pkbm.php?id=${id}`);
        return response.data;
    },

    create: async (data: Partial<PKBM> & { admin_email?: string, admin_password?: string, admin_name?: string }) => {
        const response = await api.post('/pkbm.php', data);
        return response.data;
    },

    update: async (id: number, data: Partial<PKBM>) => {
        const response = await api.put('/pkbm.php', { ...data, id });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/pkbm.php?id=${id}`);
        return response.data;
    }
};
