import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, TrophyIcon, ClipboardDocumentCheckIcon, ChartBarIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { landingService } from '../services/landingService';
import type { LandingSettings } from '../services/landingService';
import { announcementService } from '../services/announcementService';
import type { Announcement } from '../services/announcementService';
import { constructImageUrl } from '../services/api';

// Placeholder images
const ILLUSTRATION_HERO = "https://illustrations.popsy.co/blue/student-graduation.svg";

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

    const getImageUrl = (path?: string | null) => {
        if (!path) return '';
        return constructImageUrl(path) || '';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-20 pb-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-left"
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-bold mb-6 tracking-wide">
                                🎓 RESMI PEMERINTAH KAB. WONOSOBO
                            </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                                {settings?.hero_title || 'Sekolah Online Orang Dewasa'}
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                                {settings?.hero_subtitle || 'Platform pendidikan kesetaraan modern yang fleksibel dan terjangkau untuk masa depan yang lebih baik.'}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to={settings?.hero_cta_url || '/pkbm'}
                                    className="bg-brand-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    {settings?.hero_cta_text || 'Lihat Daftar PKBM'}
                                </Link>
                                <Link
                                    to="/akses-kelas"
                                    className="bg-white text-slate-700 border border-slate-200 font-bold py-3 px-8 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    Masuk Kelas
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative flex justify-center"
                        >
                            <img
                                src={settings?.hero_image_url ? getImageUrl(settings.hero_image_url) : ILLUSTRATION_HERO}
                                alt="Illustration"
                                className="w-full h-auto max-w-lg drop-shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Decoration Background */}
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-50 z-0"></div>
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 z-0"></div>
            </section>

            {/* Announcement Section */}
            {announcements.length > 0 && (
                <section className="py-20 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">📢 Informasi Terkini</span>
                            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                Pengumuman Terbaru
                            </h2>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {announcements.map((ann, idx) => (
                                <motion.div
                                    key={ann.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className="flex items-center space-x-2 text-sm text-slate-500 mb-4">
                                        <CalendarDaysIcon className="w-4 h-4" />
                                        <span>{new Date(ann.created_at).toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                                        {ann.title}
                                    </h3>
                                    <p className="text-slate-600 line-clamp-3 leading-relaxed text-sm">
                                        {ann.content}
                                    </p>
                                    <div className="mt-4 flex items-center text-brand-600 font-semibold text-sm group-hover:underline">
                                        Baca Selengkapnya <ArrowRightIcon className="w-4 h-4 ml-1" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Benefits / Keunggulan Section (Customized for SOOD) */}
            <section className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">✨ Kenapa SOOD?</span>
                        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Keunggulan Sekolah Online Orang Dewasa
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Fleksibilitas Tinggi',
                                desc: 'Belajar kapan saja dan di mana saja. Sesuaikan waktu belajar dengan kesibukan pekerjaan atau aktivitas harian Anda.',
                                icon: TrophyIcon,
                                color: 'bg-yellow-50 text-yellow-600'
                            },
                            {
                                title: 'Legalitas Terjamin',
                                desc: 'Diselenggarakan bekerja sama dengan Pemerintah Kabupaten Wonosobo dan PKBM resmi yang terdaftar.',
                                icon: ClipboardDocumentCheckIcon,
                                color: 'bg-green-50 text-green-600'
                            },
                            {
                                title: 'Akses Mudah',
                                desc: 'Platform berbasis web yang ringan dan mudah diakses melalui Smartphone maupun Komputer tanpa perlu instalasi rumit.',
                                icon: ChartBarIcon,
                                color: 'bg-blue-50 text-blue-600'
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.color}`}>
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-brand-600 rounded-3xl p-8 md:p-12 text-center shadow-xl relative overflow-hidden">
                        {/* Decorative Circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-sm text-brand-200 font-bold tracking-widest uppercase mb-4">Tentang Kami</h2>
                            <p className="text-3xl leading-snug font-extrabold text-white sm:text-4xl mb-6">
                                {settings?.about_title || 'Apa itu SOOD?'}
                            </p>
                            <p className="text-lg text-brand-50 leading-relaxed">
                                {settings?.about_content || 'Platform pembelajaran online yang dirancang khusus untuk memenuhi kebutuhan pendidikan kesetaraan bagi masyarakat dewasa di Kabupaten Wonosobo, mendukung terciptanya wajib belajar 12 tahun yang merata.'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tutorial Section */}
            {(settings?.tutorial_pdf_url || settings?.tutorial_video_url) && (
                <section className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-10">Panduan Penggunaan</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            {settings?.tutorial_pdf_url && (
                                <a
                                    href={getImageUrl(settings.tutorial_pdf_url)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center space-x-3 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl hover:bg-slate-50 hover:border-brand-300 hover:text-brand-600 transition-all shadow-sm group"
                                >
                                    <svg className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                    <span className="font-semibold">Download PDF Panduan</span>
                                </a>
                            )}
                            {settings?.tutorial_video_url && (
                                <a
                                    href={settings.tutorial_video_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center space-x-3 bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl hover:bg-slate-50 hover:border-brand-300 hover:text-brand-600 transition-all shadow-sm group"
                                >
                                    <svg className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                                    <span className="font-semibold">Tonton Video Tutorial</span>
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Login Section */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto bg-brand-600 rounded-3xl p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                            Siap memulai perjalanan pendidikan Anda?
                        </h2>
                        <p className="text-brand-100 text-lg mb-10 max-w-2xl mx-auto">
                            Daftar sekarang dan raih masa depan yang lebih cerah bersama Sekolah Online Orang Dewasa.
                        </p>
                        <Link
                            to="/login"
                            className="inline-block bg-white text-brand-700 font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:bg-brand-50 transition-all transform hover:-translate-y-1"
                        >
                            Mulai Sekarang
                        </Link>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-white opacity-10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-64 h-64 bg-white opacity-10 rounded-full"></div>
                </div>
            </section>

            <Footer settings={settings} />
        </div>
    );
};

export default LandingPage;
