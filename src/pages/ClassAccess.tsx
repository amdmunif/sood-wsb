import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { pkbmService } from '../services/pkbmService';
import type { PKBM } from '../services/pkbmService';

const ClassAccess: React.FC = () => {
    const [pkbms, setPkbms] = useState<PKBM[]>([]);
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

    const hasClassroom = pkbms.filter(p => p.classroomUrl);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Akses Kelas Online
                    </h1>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                        Masuk ke Google Classroom sesuai PKBM Anda.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {hasClassroom.map((pkbm) => (
                            <div key={pkbm.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 text-center border-t-4 border-yellow-500">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">{pkbm.name}</h3>
                                <a
                                    href={pkbm.classroomUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition"
                                >
                                    Masuk Kelas
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassAccess;
