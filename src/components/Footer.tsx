import React from 'react';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import type { LandingSettings } from '../services/landingService';

export const Footer: React.FC<{ settings: LandingSettings | null }> = ({ settings }) => (
    <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {(settings?.contact_address || settings?.contact_email || settings?.contact_phone) && (
                <div className="mb-8 pb-8 border-b border-white/10">
                    <div className="flex flex-col items-center text-center">
                        <h3 className="font-bold text-lg mb-6 text-blue-200 uppercase tracking-widest text-sm">Kontak Kami</h3>
                        <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-y-4 gap-x-8">
                            {settings.contact_address && (
                                <p className="flex items-center justify-center gap-3 text-blue-100/80 hover:text-white transition-colors">
                                    <MapPinIcon className="w-5 h-5 flex-shrink-0 text-blue-400" />
                                    <span>{settings.contact_address}</span>
                                </p>
                            )}
                            {settings.contact_email && (
                                <a href={`mailto:${settings.contact_email}`} className="flex items-center justify-center gap-3 text-blue-100/80 hover:text-white transition-colors">
                                    <EnvelopeIcon className="w-5 h-5 flex-shrink-0 text-blue-400" />
                                    <span>{settings.contact_email}</span>
                                </a>
                            )}
                            {settings.contact_phone && (
                                <a href={`tel:${settings.contact_phone}`} className="flex items-center justify-center gap-3 text-blue-100/80 hover:text-white transition-colors">
                                    <PhoneIcon className="w-5 h-5 flex-shrink-0 text-blue-400" />
                                    <span>{settings.contact_phone}</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center text-sm text-blue-200/60">
                <p>&copy; {new Date().getFullYear()} Pemerintah Kabupaten Wonosobo. All rights reserved.</p>
                <p className="mt-2">
                    by <a href="https://www.instagram.com/munifahmad" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Ahmad Munif</a>
                </p>
            </div>
        </div>
    </footer>
);
