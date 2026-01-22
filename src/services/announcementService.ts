import api from './api';

export interface Announcement {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

export const announcementService = {
    getAll: async () => {
        const response = await api.get<Announcement[]>('/announcements.php');
        return response.data;
    }
};
