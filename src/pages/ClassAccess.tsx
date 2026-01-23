import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { pkbmService, type PKBM } from '../services/pkbmService';
import { Footer } from '../components/Footer';

const ClassAccess: React.FC = () => {
    const [pkbms, setPkbms] = useState<PKBM[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        pkbmService.getAll()
            .then(setPkbms)
            .catch(() => setError('Gagal memuat data PKBM'))
            .finally(() => setLoading(false));
    }, []);

    const filteredPkbms = pkbms.filter(pkbm =>
        pkbm.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-linear-to-br from-brand-900 via-brand-700 to-indigo-900 font-sans flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
                        Akses Kelas Online
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-blue-100 sm:mt-4 opacity-90">
                        Cari dan masuk ke kelas online PKBM Anda melalui Google Classroom.
                    </p>
                </div>

                <div className="mb-10 max-w-xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Cari nama PKBM..."
                        className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-md shadow-lg transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-blue-300">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {loading && <div className="text-center text-white text-lg animate-pulse">Memuat data PKBM...</div>}

                {error && (
                    <div className="max-w-md mx-auto bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center text-red-200 mb-8 backdrop-blur-sm">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPkbms.length > 0 ? filteredPkbms.map((pkbm) => (
                            <div key={pkbm.id} className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 flex flex-col justify-between hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{pkbm.name}</h3>
                                    <p className="text-sm text-blue-200 font-light leading-relaxed mb-4">{pkbm.address}</p>
                                </div>
                                <div className="mt-6">
                                    <a
                                        href={pkbm.classroomUrl || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => !pkbm.classroomUrl && e.preventDefault()}
                                        className={`block w-full px-4 py-3 rounded-xl font-semibold text-center transition-all shadow-lg ${pkbm.classroomUrl
                                            ? 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
                                            : 'bg-gray-500/30 text-gray-400 cursor-not-allowed border border-white/5'
                                            }`}
                                    >
                                        {pkbm.classroomUrl ? 'Masuk Kelas' : 'Kelas Tidak Tersedia'}
                                    </a>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-blue-200 text-lg">PKBM tidak ditemukan untuk pencarian "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer settings={null} />
        </div>
    );
};

export default ClassAccess;
