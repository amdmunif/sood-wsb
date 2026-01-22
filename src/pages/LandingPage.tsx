import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { landingService } from '../services/landingService';
import type { LandingSettings } from '../services/landingService';
import { announcementService } from '../services/announcementService';
import type { Announcement } from '../services/announcementService';
import { API_BASE_URL } from '../services/api';

const LandingPage: React.FC = () => {
    const [settings, setSettings] = useState<LandingSettings | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsData, announcementsData] = await Promise.all([
                    landingService.getSettings(),
                    announcementService.getAll()
                ]);
                setSettings(settingsData);
                setAnnouncements(announcementsData.slice(0, 3)); // Only take latest 3
            } catch (error) {
                console.error('Failed to load landing data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const getImageUrl = (path?: string) => {
        if (!path) return '';
        return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <div
                className="relative bg-blue-700 text-white py-24 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
                style={settings?.hero_image_url ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${getImageUrl(settings.hero_image_url)}')` } : {}}
            >
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl tracking-tight">
                        {settings?.hero_title || 'Sekolah Online Orang Dewasa'}
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-200">
                        {settings?.hero_subtitle || 'Pemerintah Kabupaten Wonosobo'}
                    </p>
                    <div className="mt-10">
                        <Link
                            to={settings?.hero_cta_url || '/pkbm'}
                            className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1"
                        >
                            {settings?.hero_cta_text || 'Lihat Daftar PKBM'}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Announcement Section */}
            {announcements.length > 0 && (
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Pengumuman Terbaru</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {announcements.map((ann) => (
                            <div key={ann.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{ann.title}</h3>
                                <p className="text-gray-600 line-clamp-3">{ann.content}</p>
                                <div className="mt-4 text-sm text-gray-500">
                                    {new Date(ann.created_at).toLocaleDateString('id-ID')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* About Section */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Tentang Kami</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            {settings?.about_title || 'Apa itu SOOD?'}
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                            {settings?.about_content || 'Platform pembelajaran online untuk pendidikan kesetaraan di Kabupaten Wonosobo.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tutorial Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Panduan Penggunaan</h2>
                    <div className="flex justify-center space-x-4">
                        {settings?.tutorial_pdf_url && (
                            <a
                                href={getImageUrl(settings.tutorial_pdf_url)}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition"
                            >
                                <span>Download PDF Panduan</span>
                            </a>
                        )}
                        {settings?.tutorial_video_url && (
                            <a
                                href={settings.tutorial_video_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition"
                            >
                                <span>Tonton Video Tutorial</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* App Footer (Simplified) */}
            <footer className="bg-gray-800 text-white py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p>&copy; {new Date().getFullYear()} SOOD Wonosobo. All rights reserved.</p>
                    <p className="mt-2 text-gray-400 text-sm">
                        {settings?.contact_address} | {settings?.contact_email} | {settings?.contact_phone}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
