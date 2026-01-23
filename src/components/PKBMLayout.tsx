import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PKBMLayout: React.FC = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin-pkbm/dashboard', label: 'Dashboard' },
        { path: '/admin-pkbm/students', label: 'Peserta Didik' },
        { path: '/admin-pkbm/grades', label: 'Input Nilai' },
        { path: '/admin-pkbm/reports', label: 'Laporan' },
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-brand-900 to-indigo-950 flex font-sans text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-white/20">
                    <h1 className="text-xl font-bold tracking-tight">Admin PKBM</h1>
                    {user?.pkbm_name && (
                        <p className="text-sm text-blue-200 mt-1">{user.pkbm_name}</p>
                    )}
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname.startsWith(item.path)
                                ? 'bg-white/20 text-white font-semibold shadow-inner'
                                : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/20">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-300 hover:bg-red-500/20 hover:text-red-100 rounded-lg transition-colors"
                    >
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default PKBMLayout;
