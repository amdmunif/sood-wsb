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
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden md:flex flex-col z-20">
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <SoodLogo className="w-8 h-8 mr-3 text-brand-600" logoUrl={settings?.logo_url} />
                    <span className="text-xl font-bold tracking-tight text-slate-800">SOOD</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${location.pathname.startsWith(item.path)
                                ? 'bg-brand-50 text-brand-700 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${location.pathname.startsWith(item.path) ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <Link to="/admin/landing" className="flex items-center px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg mb-1 transition-colors">
                        <Cog6ToothIcon className="w-5 h-5 mr-3" />
                        Pengaturan
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
                    <h2 className="text-xl font-bold text-slate-800 tracking-wide">{title}</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-slate-100 p-0.5 border border-slate-200">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.name}&background=0ea5e9&color=fff`}
                                alt="Profile"
                                className="rounded-full h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto bg-slate-50">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
