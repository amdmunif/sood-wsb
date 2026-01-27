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
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-bold tracking-tight text-brand-700">Admin PKBM</h1>
                    {user?.pkbm_name && (
                        <p className="text-sm text-slate-500 mt-1">{user.pkbm_name}</p>
                    )}
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname.startsWith(item.path)
                                ? 'bg-brand-50 text-brand-700 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                    >
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default PKBMLayout;
