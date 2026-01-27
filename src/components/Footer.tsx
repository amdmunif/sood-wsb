import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import type { LandingSettings } from '../services/landingService';

export const Footer: React.FC<{ settings: LandingSettings | null }> = ({ settings }) => (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-slate-900 font-bold text-lg mb-6">Beberapa Instansi Pemerintahan dan Perangkat Daerah tergabung dalam layanan ini</h2>
                <div className="flex justify-center gap-6 items-center flex-wrap">
                    {/* Placeholder for Logos - You can replace these with actual images/components if available */}
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-xs text-slate-500">Logo 1</div>
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-xs text-slate-500">Logo 2</div>
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-xs text-slate-500">Logo 3</div>
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-xs text-slate-500">Logo 4</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-slate-200">
                <div>
                    <h3 className="font-bold text-slate-900 mb-4">Dinas Pendidikan Kab. Wonosobo</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Jl. Mayjend. Bambang Sugeng No.3, Mendolo, Bumireso, Kec. Wonosobo, Kabupaten Wonosobo, Jawa Tengah 56317
                    </p>
                    <div className="flex mt-4 space-x-2 text-slate-400">
                        <PhoneIcon className="w-4 h-4" /> <span>(0286) 321xxx</span>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-slate-900 mb-4">Layanan</h3>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li><Link to="/pkbm" className="hover:text-brand-600">Daftar PKBM / SKB</Link></li>
                        <li><Link to="/" className="hover:text-brand-600">Info Syarat & Ketentuan</Link></li>
                        <li><Link to="/" className="hover:text-brand-600">Panduan</Link></li>
                        <li><Link to="/" className="hover:text-brand-600">FAQ</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-slate-900 mb-4">Link Terkait</h3>
                    <ul className="space-y-2 text-sm text-slate-500">
                        <li><a href="#" className="hover:text-brand-600">Portal Pemerintah Kab. Wonosobo</a></li>
                        <li><a href="#" className="hover:text-brand-600">Dinas Pendidikan dan Kebudayaan</a></li>
                        <li><a href="#" className="hover:text-brand-600">Kemendikbud</a></li>
                    </ul>
                </div>
            </div>

            {(settings?.contact_address || settings?.contact_email || settings?.contact_phone) && (
                <div className="mb-8 pb-8 border-b border-slate-200 hidden"> {/* Hidden because we hardcoded the footer above based on request, but keeping logic just in case */}
                    <div className="flex flex-col items-center text-center">
                        <h3 className="font-bold text-lg mb-6 text-brand-600 uppercase tracking-widest text-sm">Kontak Kami</h3>
                        <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-y-4 gap-x-8">
                            {settings.contact_address && (
                                <p className="flex items-center justify-center gap-3 text-slate-600 hover:text-brand-600 transition-colors">
                                    <MapPinIcon className="w-5 h-5 flex-shrink-0 text-brand-500" />
                                    <span>{settings.contact_address}</span>
                                </p>
                            )}
                            {settings.contact_email && (
                                <a href={`mailto:${settings.contact_email}`} className="flex items-center justify-center gap-3 text-slate-600 hover:text-brand-600 transition-colors">
                                    <EnvelopeIcon className="w-5 h-5 flex-shrink-0 text-brand-500" />
                                    <span>{settings.contact_email}</span>
                                </a>
                            )}
                            {settings.contact_phone && (
                                <a href={`tel:${settings.contact_phone}`} className="flex items-center justify-center gap-3 text-slate-600 hover:text-brand-600 transition-colors">
                                    <PhoneIcon className="w-5 h-5 flex-shrink-0 text-brand-500" />
                                    <span>{settings.contact_phone}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center text-sm text-slate-400 pt-8 border-t border-slate-200">
                <p>&copy; {new Date().getFullYear()} Pemerintah Kabupaten Wonosobo. All rights reserved.</p>
                <p className="mt-1 flex items-center justify-center gap-1">
                    Developed by <a href="https://www.instagram.com/munifahmad" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline font-medium">Ahmad Munif</a>
                </p>
            </div>
        </div>
    </footer>
);
