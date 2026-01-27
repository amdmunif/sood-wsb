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
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
                        Akses Kelas Online
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-600 sm:mt-4">
                        Cari dan masuk ke kelas online PKBM Anda melalui Google Classroom.
                    </p>
                </div>

                <div className="mb-10 max-w-xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Cari nama PKBM..."
                        className="w-full px-6 py-4 rounded-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent shadow-md transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none text-slate-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {loading && <div className="text-center text-brand-600 text-lg animate-pulse">Memuat data PKBM...</div>}

                {error && (
                    <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600 mb-8">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPkbms.length > 0 ? filteredPkbms.map((pkbm) => (
                            <div key={pkbm.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">{pkbm.name}</h3>
                                    <p className="text-sm text-slate-500 font-light leading-relaxed mb-4">{pkbm.address}</p>
                                </div>
                                <div className="mt-6">
                                    <a
                                        href={pkbm.classroomUrl || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => !pkbm.classroomUrl && e.preventDefault()}
                                        className={`block w-full px-4 py-3 rounded-xl font-semibold text-center transition-all shadow-sm ${pkbm.classroomUrl
                                            ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-200'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                            }`}
                                    >
                                        {pkbm.classroomUrl ? 'Masuk Kelas' : 'Kelas Tidak Tersedia'}
                                    </a>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-slate-500 text-lg">PKBM tidak ditemukan untuk pencarian "{searchTerm}"</p>
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
