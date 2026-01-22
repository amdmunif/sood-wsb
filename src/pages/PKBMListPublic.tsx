import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { pkbmService } from '../services/pkbmService';
import type { PKBM } from '../services/pkbmService';

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
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Daftar PKBM Mitra
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Temukan Pusat Kegiatan Belajar Masyarakat terdekat di Wonosobo.
                    </p>
                </div>

                <div className="max-w-xl mx-auto mb-10">
                    <input
                        type="text"
                        placeholder="Cari PKBM berdasarkan nama atau alamat..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPkbms.map((pkbm) => (
                            <div key={pkbm.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkbm.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{pkbm.npsn ? `NPSN: ${pkbm.npsn}` : ''}</p>

                                    <div className="space-y-3">
                                        <p className="text-gray-600 flex items-start">
                                            <span className="font-semibold mr-2 w-16">Alamat:</span>
                                            <span className="flex-1">{pkbm.address}</span>
                                        </p>
                                        <p className="text-gray-600 flex items-center">
                                            <span className="font-semibold mr-2 w-16">Kontak:</span>
                                            <span>{pkbm.contactPerson?.name}</span>
                                        </p>
                                    </div>

                                    <div className="mt-6 flex space-x-3">
                                        {pkbm.contactPerson?.phone && (
                                            <a
                                                href={`https://wa.me/${pkbm.contactPerson.phone.replace(/^0/, '62').replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 bg-green-500 text-white text-center py-2 rounded-md hover:bg-green-600 transition"
                                            >
                                                WhatsApp
                                            </a>
                                        )}
                                        {pkbm.coords?.lat && pkbm.coords?.lng && (
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${pkbm.coords.lat},${pkbm.coords.lng}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 bg-blue-500 text-white text-center py-2 rounded-md hover:bg-blue-600 transition"
                                            >
                                                Lokasi
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PKBMListPublic;
