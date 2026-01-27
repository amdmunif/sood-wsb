import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { landingService } from '../services/landingService';
import type { LandingSettings } from '../services/landingService';
import { constructImageUrl } from '../services/api';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [settings, setSettings] = useState<LandingSettings | null>(null);

    useEffect(() => {
        landingService.getSettings().then(setSettings).catch(console.error);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const logoUrl = settings?.logo_url ? constructImageUrl(settings.logo_url) : null;

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center space-x-3">
                            {logoUrl && (
                                <img src={logoUrl} alt="Logo" className="h-10 w-auto" />
                            )}
                            <span className="text-xl font-bold text-brand-700 tracking-tight">SOOD Wonosobo</span>
                        </Link>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            <Link to="/" className="border-transparent text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-2 rounded-md text-sm font-medium transition-all">
                                Beranda
                            </Link>
                            <Link to="/pkbm" className="border-transparent text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-2 rounded-md text-sm font-medium transition-all">
                                Daftar PKBM
                            </Link>
                            <Link to="/akses-kelas" className="border-transparent text-slate-600 hover:text-brand-600 hover:bg-brand-50 px-3 py-2 rounded-md text-sm font-medium transition-all">
                                Akses Kelas
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-slate-700 text-sm font-medium">Hai, {user.name}</span>
                                {user.role === 'Super Admin' && (
                                    <Link to="/admin" className="text-slate-600 hover:text-brand-600 text-sm font-medium">
                                        Panel Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                                >
                                    Keluar
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-brand-700 transition shadow-md transform hover:scale-105">
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
