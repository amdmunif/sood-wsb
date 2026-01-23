import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
                            {/* Optional: Add Logo Icon here if available */}
                            <span className="text-xl font-bold text-white tracking-tight">SOOD Wonosobo</span>
                        </Link>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            <Link to="/" className="border-transparent text-blue-100 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-all">
                                Beranda
                            </Link>
                            <Link to="/pkbm" className="border-transparent text-blue-100 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-all">
                                Daftar PKBM
                            </Link>
                            <Link to="/akses-kelas" className="border-transparent text-blue-100 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-all">
                                Akses Kelas
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-blue-100 text-sm font-medium">Hai, {user.name}</span>
                                {user.role === 'Super Admin' && (
                                    <Link to="/admin" className="text-white hover:text-blue-200 text-sm font-medium">
                                        Panel Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-lg backdrop-blur-sm"
                                >
                                    Keluar
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="bg-white text-blue-600 px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-50 transition shadow-lg transform hover:scale-105">
                                Masuk
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
