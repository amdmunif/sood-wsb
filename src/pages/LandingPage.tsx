import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, ArrowRightIcon, TrophyIcon, ClipboardDocumentCheckIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { landingService } from '../services/landingService';
import type { LandingSettings } from '../services/landingService';
import { constructImageUrl } from '../services/api';

// Placeholder images - in a real app these would be imported assets or from the API
const ILLUSTRATION_HERO = "https://illustrations.popsy.co/blue/student-graduation.svg";
const ILLUSTRATION_DATA = "https://illustrations.popsy.co/blue/data-analysis.svg";
// const ILLUSTRATION_BENEFIT = "https://illustrations.popsy.co/blue/success.svg";

const LandingPage: React.FC = () => {
    const [settings, setSettings] = useState<LandingSettings | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await landingService.getSettings();
                setSettings(data);
            } catch (error) {
                console.error('Failed to load settings', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
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
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-left"
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-brand-100 text-brand-700 text-sm font-bold mb-6 tracking-wide">
                                🎓 ATS | KAB. WONOSOBO
                            </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                                Sistem Informasi Manajemen <br />
                                <span className="text-brand-600">Anak Tidak Sekolah</span> <br />
                                Kab. Wonosobo
                            </h1>

                            {/* Search Box */}
                            <div className="mt-8 bg-white p-2 rounded-2xl shadow-lg border border-slate-100 max-w-lg">
                                <form className="flex item-center">
                                    <div className="relative flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-3 border-none rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 sm:text-sm bg-transparent"
                                            placeholder="NIK / Nama Lengkap / Nomor KK"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-brand-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-700 transition-colors shadow-md ml-2"
                                    >
                                        Cari Data
                                    </button>
                                </form>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Use settings image if available, else placeholder */}
                            <img
                                src={settings?.hero_image_url ? getImageUrl(settings.hero_image_url) : ILLUSTRATION_HERO}
                                alt="Illustration"
                                className="w-full h-auto max-w-lg mx-auto drop-shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Decoration Background */}
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-50 z-0"></div>
                <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 z-0"></div>
            </section>

            {/* Data Source Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">🌐 Sumber Data</span>
                            <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                Sumber data pada sistem aplikasi ATS
                            </h2>
                            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                                Aplikasi ini mengintegrasikan data dari berbagai sumber terpercaya untuk memastikan akurasi dan validitas informasi Anak Tidak Sekolah di Kabupaten Wonosobo. Data dikelola secara real-time dan transparan.
                            </p>
                            <div className="mt-8 grid gap-4">
                                {['Dapodik Kemendikbud', 'Data Kependudukan (Dukcapil)', 'Laporan Masyarakat & Desa'].map((item, idx) => (
                                    <div key={idx} className="flex items-center space-x-3 text-slate-700">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center">
                                            <ArrowRightIcon className="w-4 h-4 text-brand-600" />
                                        </div>
                                        <span className="font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="flex justify-center"
                        >
                            <img
                                src={ILLUSTRATION_DATA}
                                alt="Data Source Illustration"
                                className="w-full max-w-md h-auto"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">✨ Keunggulan</span>
                        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            Lihat tiga keunggulan aplikasi ATS
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Efisiensi Akurat',
                                desc: 'Data yang disajikan akurat dan terverifikasi, memudahkan pengambilan keputusan yang tepat sasaran.',
                                icon: ChartBarIcon,
                                color: 'bg-red-50 text-red-600'
                            },
                            {
                                title: 'Fleksibel Akses',
                                desc: 'Dapat diakses kapan saja dan di mana saja melalui berbagai perangkat (Desktop, Tablet, HP).',
                                icon: TrophyIcon,
                                color: 'bg-yellow-50 text-yellow-600'
                            },
                            {
                                title: 'Kolaboratif',
                                desc: 'Melibatkan berbagai pemangku kepentingan dari tingkat desa hingga kabupaten.',
                                icon: ClipboardDocumentCheckIcon,
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

            {/* Process Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">🔄 Alur Proses</span>
                        <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl px-4">
                            Pengelolaan data <br className="hidden sm:block" />
                            Penanganan pada anak tidak sekolah
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Mobile: Hidden, Desktop: Visible) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
                            {[
                                { title: 'Data Pembanding', icon: '📝' },
                                { title: 'Verifikasi', icon: '🔍' },
                                { title: 'Validasi', icon: '✅' },
                                { title: 'Penanganan', icon: '🤝' },
                                { title: 'Monitoring', icon: '📊' },
                                { title: 'Output', icon: '📄' }
                            ].map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-white border-2 border-brand-100 rounded-full flex items-center justify-center text-2xl shadow-sm mb-4 z-10">
                                        {step.icon}
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-center text-sm">{step.title}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Legal Basis Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold mb-4 uppercase">
                        ⚖️ Dasar Hukum
                    </span>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-12">
                        Dasar Hukum Penanganan <br /> Anak Tidak Sekolah (ATS)
                    </h2>

                    <div className="space-y-4 text-left">
                        {[
                            'Peraturan Bupati Wonosobo Nomor 14 Tahun 2022 tentang Percepatan Penuntasan Anak Tidak Sekolah.',
                            'Peraturan Daerah Kabupaten Wonosobo terkait sistem pendidikan dan wajib belajar.',
                            'Surat Edaran Bupati tentang pendataan anak tidak sekolah di tingkat desa/kelurahan.',
                            'Instruksi Presiden terkait wajib belajar 12 tahun.'
                        ].map((law, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4 hover:border-brand-300 transition-colors">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                                    {idx + 1}
                                </div>
                                <p className="text-slate-700 font-medium">{law}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Login Section */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto bg-brand-600 rounded-3xl p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
                            Siap berkontribusi untuk Pendidikan?
                        </h2>
                        <p className="text-brand-100 text-lg mb-10 max-w-2xl mx-auto">
                            Bergabunglah bersama kami untuk mewujudkan pendidikan yang merata dan berkualitas di Kabupaten Wonosobo.
                        </p>
                        <Link
                            to="/login"
                            className="inline-block bg-white text-brand-700 font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl hover:bg-brand-50 transition-all transform hover:-translate-y-1"
                        >
                            Login Sekarang
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
