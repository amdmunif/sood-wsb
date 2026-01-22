import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStats } from '../services/dashboardService';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div>Loading dashboard...</div>;

    const chartData = {
        labels: stats.pkbm_performance.map(p => p.name),
        datasets: [
            {
                label: 'Rata-rata Nilai Siswa',
                data: stats.pkbm_performance.map(p => p.score),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
        ],
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Super Admin</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-sm">Total PKBM</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.total_pkbm}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-sm">Total Siswa</p>
                    <p className="text-3xl font-bold text-green-600">{stats.total_students}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-sm">Total User</p>
                    <p className="text-3xl font-bold text-purple-600">{stats.total_users}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-sm">Rata-rata Nilai</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.average_grade.toFixed(2)}</p>
                </div>
            </div>

            {/* Performance Chart & Recent Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold mb-4">Performa PKBM Tertinggi</h3>
                    <Bar options={{ responsive: true }} data={chartData} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold mb-4">Pengumuman Terbaru</h3>
                    <div className="space-y-4">
                        {stats.recent_announcements.map((ann) => (
                            <div key={ann.id} className="border-b pb-2 last:border-0">
                                <p className="font-semibold text-gray-800">{ann.title}</p>
                                <p className="text-xs text-gray-500">{new Date(ann.created_at).toLocaleDateString()}</p>
                            </div>
                        ))}
                        {stats.recent_announcements.length === 0 && <p className="text-gray-500">Belum ada pengumuman.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
