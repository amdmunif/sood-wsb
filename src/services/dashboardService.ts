import api from './api';

export interface DashboardStats {
    total_pkbm: number;
    total_students: number;
    total_users: number;
    average_grade: number;
    pkbm_performance: { name: string; score: number }[];
    recent_announcements: { id: number; title: string; created_at: string }[];
}

export const dashboardService = {
    getStats: async () => {
        const response = await api.get<DashboardStats>('/dashboard_stats.php');
        return response.data;
    }
};
