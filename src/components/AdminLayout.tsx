import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SoodLogo } from './SoodLogo';
import api from '../services/api';
import {
    HomeIcon,
    BuildingLibraryIcon,
    UserGroupIcon,
    AcademicCapIcon,
    DocumentTextIcon,
    ChartBarIcon,
    MegaphoneIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const AdminLayout: React.FC = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [settings, setSettings] = useState<any>(null); // Type 'any' for now or import LandingSettings

    // Fetch logo logic
    useEffect(() => {
        // Assuming we have a service to get settings, or use api directly.
        // For now, standard pattern:
        api.get('/settings').then((res: any) => setSettings(res.data)).catch(() => { });
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Calculate Dynamic Title similar to legacy AdminLayout
    const getTitle = (pathname: string): string => {
        const parts = pathname.split('/').filter(p => p && p !== 'admin');
        if (parts.length === 0) return 'Dashboard';

        const customTitles: { [key: string]: string } = {
            'dashboard': 'Dashboard',
            'pkbm': 'Manajemen PKBM',
            'users': 'Manajemen Pengguna',
            'students': 'Manajemen Peserta', // Maps to students
            'announcements': 'Manajemen Pengumuman',
            'landing': 'Pengaturan Website', // Maps to 'settings' in legacy, but I use 'landing' route
            'categories': 'Kategori Mapel',
            'subjects': 'Mata Pelajaran'
        };

        const firstPart = parts[0];
        return customTitles[firstPart] || firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
    };

    const title = getTitle(location.pathname);

    // Legacy Menu Items matching sood-lama exactly where possible
    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
        { path: '/admin/pkbm', label: 'Data Sekolah', icon: BuildingLibraryIcon }, // Legacy name: Data Sekolah
        { path: '/admin/users', label: 'Manajemen User', icon: UserGroupIcon },
        { path: '/admin/students', label: 'Manajemen Siswa', icon: AcademicCapIcon }, // Added route for students if not exists
        { path: '/admin/subjects', label: 'Kurikulum', icon: DocumentTextIcon }, // Broader term for subjects
        { path: '/admin/reports', label: 'Laporan', icon: ChartBarIcon }, // Placeholder if not exists
        { path: '/admin/announcements', label: 'Pengumuman', icon: MegaphoneIcon },
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-brand-900 to-indigo-950 flex font-sans text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 flex-shrink-0 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-white/20">
                    <SoodLogo className="w-8 h-8 mr-3" logoUrl={settings?.logo_url} />
                    <span className="text-xl font-bold tracking-tight">SOOD</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${location.pathname.startsWith(item.path)
                                ? 'bg-white/20 text-white font-semibold shadow-inner border border-white/10'
                                : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${location.pathname.startsWith(item.path) ? 'text-white' : 'text-blue-300 group-hover:text-white'}`} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/20 bg-black/10">
                    <Link to="/admin/landing" className="flex items-center px-4 py-3 text-blue-200 hover:text-white hover:bg-white/5 rounded-lg mb-1">
                        <Cog6ToothIcon className="w-5 h-5 mr-3" />
                        Pengaturan
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-red-300 hover:bg-red-500/20 hover:text-red-100 rounded-lg transition-colors"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-white tracking-wide">{title}</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-white">{user?.name}</p>
                            <p className="text-xs text-blue-200 capitalize">{user?.role}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-linear-to-tr from-green-400 to-blue-500 p-[2px]">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.name}&background=0D8ABC&color=fff`}
                                alt="Profile"
                                className="rounded-full h-full w-full object-cover border-2 border-transparent"
                            />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
