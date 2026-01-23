import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import type { DashboardStats } from '../../services/dashboardService';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { UsersIcon, AcademicCapIcon, ClipboardDocumentCheckIcon, MegaphoneIcon } from '@heroicons/react/24/outline'; // Importing icons

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PKBMDashboard: React.FC = () => {
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

    if (!stats) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
    );

    const chartData = {
        labels: stats.pkbm_performance.map(p => p.name),
        datasets: [
            {
                label: 'Rata-rata Nilai Siswa',
                data: stats.pkbm_performance.map(p => p.score),
                backgroundColor: 'rgba(59, 130, 246, 0.6)', // Brand Blue generic
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { font: { family: "'Plus Jakarta Sans', sans-serif" } }
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: { ticks: { font: { family: "'Plus Jakarta Sans', sans-serif" } } },
            y: { ticks: { font: { family: "'Plus Jakarta Sans', sans-serif" } } }
        }
    };

    return (
        <div className="space-y-8 font-sans">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard PKBM</h1>
                <p className="text-gray-500 text-sm mt-1">Ringkasan data dan aktivitas terbaru PKBM Anda.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Students Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Siswa</p>
                            <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.total_students}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <UsersIcon className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Users Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total User (Admin/Guru)</p>
                            <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.total_users}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-xl">
                            <AcademicCapIcon className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Grade Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Rata-rata Nilai Unit</p>
                            <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.average_grade.toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-xl">
                            <ClipboardDocumentCheckIcon className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Chart & Recent Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Top 5 Siswa Berprestasi</h3>
                    <Bar options={{ ...chartOptions, indexAxis: 'y' as const }} data={chartData} />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <div className="flex items-center space-x-2 mb-6">
                        <MegaphoneIcon className="h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-bold text-gray-900">Pengumuman Terbaru</h3>
                    </div>

                    <div className="space-y-4">
                        {stats.recent_announcements.map((ann) => (
                            <div key={ann.id} className="group p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-200 cursor-default">
                                <p className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">{ann.title}</p>
                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2 group-hover:bg-blue-400"></span>
                                    {new Date(ann.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        ))}
                        {stats.recent_announcements.length === 0 && (
                            <div className="text-center py-6 text-gray-400">
                                <p>Belum ada pengumuman.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PKBMDashboard;
