import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/pkbm', label: 'Manajemen PKBM' },
        { path: '/admin/users', label: 'Manajemen Pengguna' },
        { path: '/admin/categories', label: 'Kategori Mapel' },
        { path: '/admin/subjects', label: 'Mata Pelajaran' },
        { path: '/admin/announcements', label: 'Pengumuman' },
        { path: '/admin/landing', label: 'Pengaturan Web' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-800">SOOD Admin</h1>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block px-4 py-2 rounded-md transition-colors ${location.pathname.startsWith(item.path)
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
