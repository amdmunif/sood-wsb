import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { pkbmService } from '../services/pkbmService';
import type { PKBM } from '../services/pkbmService';
import { Footer } from '../components/Footer';

const PKBMListPublic: React.FC = () => {
    const [pkbms, setPkbms] = useState<PKBM[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPkbms = async () => {
            try {
                const data = await pkbmService.getAll();
                setPkbms(data);
            } catch (error) {
                console.error("Failed to fetch PKBMs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPkbms();
    }, []);

    const filteredPkbms = pkbms.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-linear-to-br from-brand-900 via-brand-700 to-indigo-900 font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
                        Daftar PKBM Mitra
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-blue-100 sm:mt-4">
                        Temukan Pusat Kegiatan Belajar Masyarakat terdekat di Wonosobo.
                    </p>
                </div>

                <div className="max-w-xl mx-auto mb-10">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari PKBM berdasarkan nama atau alamat..."
                            className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-md shadow-lg"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <svg className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-white">Loading...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPkbms.map((pkbm) => (
                            <div key={pkbm.id} className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-white">{pkbm.name}</h3>
                                        <span className="bg-blue-500/20 text-blue-200 text-xs px-2 py-1 rounded-md border border-blue-500/30">Aktif</span>
                                    </div>

                                    <p className="text-sm text-blue-200 mb-6 font-mono opacity-80">{pkbm.npsn ? `NPSN: ${pkbm.npsn}` : 'NPSN: -'}</p>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-start text-blue-100">
                                            <svg className="h-5 w-5 text-blue-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-sm leading-relaxed">{pkbm.address}</span>
                                        </div>
                                        <div className="flex items-center text-blue-100">
                                            <svg className="h-5 w-5 text-blue-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-sm">{pkbm.contactPerson?.name || 'Admin'}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        {pkbm.contactPerson?.phone && (
                                            <a
                                                href={`https://wa.me/${pkbm.contactPerson.phone.replace(/^0/, '62').replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 bg-green-600/90 text-white text-center py-2.5 rounded-xl hover:bg-green-500 transition shadow-lg text-sm font-semibold flex items-center justify-center gap-2"
                                            >
                                                <span>WhatsApp</span>
                                            </a>
                                        )}
                                        {pkbm.coords?.lat && pkbm.coords?.lng && (
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${pkbm.coords.lat},${pkbm.coords.lng}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 bg-white/10 border border-white/20 text-white text-center py-2.5 rounded-xl hover:bg-white/20 transition text-sm font-semibold"
                                            >
                                                Lokasi Maps
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-auto">
                <Footer settings={null} /> {/* Pass null or fetch settings if needed for contact info */}
            </div>
        </div >
    );
}

export default PKBMListPublic;
