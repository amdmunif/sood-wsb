import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { landingService } from '../services/landingService';
import type { LandingSettings } from '../services/landingService';
import { announcementService } from '../services/announcementService';
import type { Announcement } from '../services/announcementService';
import { constructImageUrl } from '../services/api';
import { Footer } from '../components/Footer';

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

    const getImageUrl = (path?: string | null) => {
        if (!path) return '';
        return constructImageUrl(path) || '';
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-brand-900 to-indigo-950 flex flex-col font-sans">
            <Navbar />

            {/* Hero Section */}
            <div
                className="relative bg-transparent text-white py-32 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
                style={settings?.hero_image_url ? { backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.7)), url('${getImageUrl(settings.hero_image_url)}')` } : {}}
            >
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-sm font-semibold mb-6 backdrop-blur-sm">
                        Resmi Pemerintah Kabupaten Wonosobo
                    </span>
                    <h1 className="text-5xl font-extrabold sm:text-6xl md:text-7xl tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                        {settings?.hero_title || 'Sekolah Online Orang Dewasa'}
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100 font-light">
                        {settings?.hero_subtitle || 'Platform pendidikan kesetaraan modern yang fleksibel dan terjangkau untuk masa depan yang lebih baik.'}
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link
                            to={settings?.hero_cta_url || '/pkbm'}
                            className="inline-block bg-white text-blue-900 font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:bg-blue-50 transition-all transform hover:-translate-y-1"
                        >
                            {settings?.hero_cta_text || 'Lihat Daftar PKBM'}
                        </Link>
                        <Link
                            to="/akses-kelas"
                            className="inline-block bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold py-4 px-8 rounded-full hover:bg-white/20 transition-all"
                        >
                            Masuk Kelas
                        </Link>
                    </div>
                </div>
            </div>

            {/* Announcement Section */}
            {announcements.length > 0 && (
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
                    <h2 className="text-3xl font-extrabold text-white mb-8 text-center">Pengumuman Terbaru</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {announcements.map((ann) => (
                            <div key={ann.id} className="bg-black/20 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/10 hover:bg-black/30 transition-all group">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">{ann.title}</h3>
                                <p className="text-blue-100/80 line-clamp-3 text-sm">{ann.content}</p>
                                <div className="mt-4 text-xs text-blue-300 font-mono">
                                    {new Date(ann.created_at).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* About Section */}
            <div className="py-20 bg-black/20 backdrop-blur-sm border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-sm text-blue-300 font-bold tracking-widest uppercase mb-2">Tentang Kami</h2>
                        <p className="text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl mb-6">
                            {settings?.about_title || 'Apa itu SOOD?'}
                        </p>
                        <p className="max-w-3xl text-lg text-blue-100/90 mx-auto leading-relaxed">
                            {settings?.about_content || 'Platform pembelajaran online untuk pendidikan kesetaraan di Kabupaten Wonosobo.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tutorial Section */}
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-extrabold text-white mb-10">Panduan Penggunaan</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        {settings?.tutorial_pdf_url && (
                            <a
                                href={getImageUrl(settings.tutorial_pdf_url)}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center space-x-3 bg-white/5 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl hover:bg-white/15 transition-all group"
                            >
                                <svg className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                <span className="font-semibold">Download PDF Panduan</span>
                            </a>
                        )}
                        {settings?.tutorial_video_url && (
                            <a
                                href={settings.tutorial_video_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center space-x-3 bg-white/5 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl hover:bg-white/15 transition-all group"
                            >
                                <svg className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                <span className="font-semibold">Tonton Video Tutorial</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* App Footer */}
            <Footer settings={settings} />
        </div>
    );
};

export default LandingPage;
