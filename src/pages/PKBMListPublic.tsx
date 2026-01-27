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
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
                        Daftar PKBM Mitra
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-600 sm:mt-4">
                        Temukan Pusat Kegiatan Belajar Masyarakat terdekat di Wonosobo.
                    </p>
                </div>

                <div className="max-w-xl mx-auto mb-10">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari PKBM berdasarkan nama atau alamat..."
                            className="w-full px-6 py-4 rounded-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent shadow-md transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <svg className="h-6 w-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-brand-600 text-lg animate-pulse">Loading...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPkbms.map((pkbm) => (
                            <div key={pkbm.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{pkbm.name}</h3>
                                        <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md border border-green-200 font-semibold">Aktif</span>
                                    </div>

                                    <p className="text-sm text-slate-500 mb-6 font-mono bg-slate-50 inline-block px-2 py-1 rounded border border-slate-100">{pkbm.npsn ? `NPSN: ${pkbm.npsn}` : 'NPSN: -'}</p>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-start text-slate-600">
                                            <svg className="h-5 w-5 text-brand-400 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-sm leading-relaxed">{pkbm.address}</span>
                                        </div>
                                        <div className="flex items-center text-slate-600">
                                            <svg className="h-5 w-5 text-brand-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                                                className="flex-1 bg-green-600 text-white text-center py-2.5 rounded-xl hover:bg-green-700 transition shadow-sm text-sm font-semibold flex items-center justify-center gap-2"
                                            >
                                                <span>WhatsApp</span>
                                            </a>
                                        )}
                                        {pkbm.coords?.lat && pkbm.coords?.lng && (
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${pkbm.coords.lat},${pkbm.coords.lng}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 bg-white border border-slate-200 text-slate-700 text-center py-2.5 rounded-xl hover:bg-slate-50 hover:border-brand-300 hover:text-brand-600 transition text-sm font-semibold"
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
