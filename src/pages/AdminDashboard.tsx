import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStats } from '../services/dashboardService';
import {
    UsersIcon,
    BuildingLibraryIcon,
    UserGroupIcon,
    MegaphoneIcon
} from '@heroicons/react/24/outline'; // Importing icons
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

    if (!stats) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
    );

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: { family: "'Plus Jakarta Sans', sans-serif" },
                    color: '#e0e7ff'
                }
            },
        },
        scales: {
            x: {
                ticks: {
                    font: { family: "'Plus Jakarta Sans', sans-serif" },
                    color: '#e0e7ff'
                },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            y: {
                ticks: {
                    font: { family: "'Plus Jakarta Sans', sans-serif" },
                    color: '#e0e7ff'
                },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    };

    const chartData = {
        labels: stats.pkbm_performance.map(p => p.name),
        datasets: [
            {
                label: 'Rata-rata Nilai Siswa',
                data: stats.pkbm_performance.map(p => p.score),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-8 font-sans">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Overview Dashboard</h1>
                <p className="text-blue-200 text-sm mt-1">Status sistem dan ringkasan akademik <span className="text-white font-semibold">Kabupaten Wonosobo</span>.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* PKBM Count */}
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-200 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <BuildingLibraryIcon className="h-6 w-6 text-blue-300" />
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
                            Mitra Aktif
                        </span>
                    </div>
                    <p className="text-blue-200 text-sm font-medium">UNIT PKBM</p>
                    <p className="text-3xl font-extrabold text-white mt-1">{stats.total_pkbm || 19}</p>
                </div>

                {/* Student Count */}
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-200 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-500/20 rounded-xl">
                            <div className="h-6 w-6 text-green-300 flex items-center justify-center font-bold">W</div>
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                            Peserta Aktif
                        </span>
                    </div>
                    <p className="text-blue-200 text-sm font-medium">WARGA BELAJAR</p>
                    <p className="text-3xl font-extrabold text-white mt-1">{stats.total_students}</p>
                </div>

                {/* Performance Index */}
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-200 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-500/20 rounded-xl">
                            <UsersIcon className="h-6 w-6 text-orange-300" />
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold bg-orange-500/20 text-orange-300 rounded-full border border-orange-500/30">
                            Target 80+
                        </span>
                    </div>
                    <p className="text-blue-200 text-sm font-medium">INDEKS PRESTASI</p>
                    <p className="text-3xl font-extrabold text-white mt-1">{stats.average_grade.toFixed(1)}</p>
                </div>

                {/* Total Account */}
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-200 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-cyan-500/20 rounded-xl">
                            <UserGroupIcon className="h-6 w-6 text-cyan-300" />
                        </div>
                    </div>
                    <p className="text-blue-200 text-sm font-medium">TOTAL AKUN</p>
                    <p className="text-3xl font-extrabold text-white mt-1">{stats.total_users}</p>
                </div>
            </div>

            {/* Visualisasi Capaian */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6">Performa PKBM Tertinggi</h3>
                    <Bar options={chartOptions} data={chartData} />
                </div>

                <div className="bg-[#172554]/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl h-fit">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="p-2 bg-green-500 rounded-full">
                            <MegaphoneIcon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Pengumuman Terbaru</h3>
                    </div>

                    <div className="space-y-6">
                        {stats.recent_announcements.map((ann) => (
                            <div key={ann.id} className="group cursor-pointer">
                                <p className="font-bold text-white group-hover:text-blue-300 transition-colors mb-1">{ann.title}</p>
                                <div className="flex items-center text-xs text-green-400 font-semibold uppercase tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                    {new Date(ann.created_at).toLocaleDateString()}
                                </div>
                                <div className="mt-3 h-px bg-white/10"></div>
                            </div>
                        ))}
                        {stats.recent_announcements.length === 0 && (
                            <div className="text-center py-6 text-blue-300/50">
                                <p>Belum ada pengumuman.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
