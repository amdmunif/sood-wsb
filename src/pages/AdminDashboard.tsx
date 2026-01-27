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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
    );

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: { family: "'Plus Jakarta Sans', sans-serif" },
                    color: '#1e293b' // slate-800
                }
            },
        },
        scales: {
            x: {
                ticks: {
                    font: { family: "'Plus Jakarta Sans', sans-serif" },
                    color: '#64748b' // slate-500
                },
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            },
            y: {
                ticks: {
                    font: { family: "'Plus Jakarta Sans', sans-serif" },
                    color: '#64748b' // slate-500
                },
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            }
        }
    };

    const chartData = {
        labels: stats.pkbm_performance.map(p => p.name),
        datasets: [
            {
                label: 'Rata-rata Nilai Siswa',
                data: stats.pkbm_performance.map(p => p.score),
                backgroundColor: 'rgba(14, 165, 233, 0.6)', // sky-500
                borderColor: 'rgba(14, 165, 233, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-8 font-sans">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Overview Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Status sistem dan ringkasan akademik <span className="text-brand-600 font-semibold">Kabupaten Wonosobo</span>.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* PKBM Count */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-brand-50 rounded-xl group-hover:bg-brand-100 transition-colors">
                            <BuildingLibraryIcon className="h-6 w-6 text-brand-600" />
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold bg-green-50 text-green-600 rounded-full border border-green-200">
                            Mitra Aktif
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">UNIT PKBM</p>
                    <p className="text-3xl font-extrabold text-slate-800 mt-1">{stats.total_pkbm || 19}</p>
                </div>

                {/* Student Count */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                            <div className="h-6 w-6 text-green-600 flex items-center justify-center font-bold">W</div>
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-600 rounded-full border border-blue-200">
                            Peserta Aktif
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">WARGA BELAJAR</p>
                    <p className="text-3xl font-extrabold text-slate-800 mt-1">{stats.total_students}</p>
                </div>

                {/* Performance Index */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-50 rounded-xl group-hover:bg-orange-100 transition-colors">
                            <UsersIcon className="h-6 w-6 text-orange-500" />
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold bg-orange-50 text-orange-600 rounded-full border border-orange-200">
                            Target 80+
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">INDEKS PRESTASI</p>
                    <p className="text-3xl font-extrabold text-slate-800 mt-1">{stats.average_grade.toFixed(1)}</p>
                </div>

                {/* Total Account */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-cyan-50 rounded-xl group-hover:bg-cyan-100 transition-colors">
                            <UserGroupIcon className="h-6 w-6 text-cyan-600" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">TOTAL AKUN</p>
                    <p className="text-3xl font-extrabold text-slate-800 mt-1">{stats.total_users}</p>
                </div>
            </div>

            {/* Visualisasi Capaian */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Performa PKBM Tertinggi</h3>
                    <Bar options={chartOptions} data={chartData} />
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg h-fit">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="p-2 bg-green-500 rounded-full">
                            <MegaphoneIcon className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Pengumuman Terbaru</h3>
                    </div>

                    <div className="space-y-6">
                        {stats.recent_announcements.map((ann) => (
                            <div key={ann.id} className="group cursor-pointer">
                                <p className="font-bold text-slate-700 group-hover:text-brand-600 transition-colors mb-1">{ann.title}</p>
                                <div className="flex items-center text-xs text-green-600 font-semibold uppercase tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                    {new Date(ann.created_at).toLocaleDateString()}
                                </div>
                                <div className="mt-3 h-px bg-slate-100"></div>
                            </div>
                        ))}
                        {stats.recent_announcements.length === 0 && (
                            <div className="text-center py-6 text-slate-400">
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
