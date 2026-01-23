import React, { useEffect, useState } from 'react';
import { landingService } from '../services/landingService';
import type { LandingSettings } from '../services/landingService';

const LandingSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<LandingSettings | null>(null);
    const [heroImage, setHeroImage] = useState<File | null>(null);
    const [tutorialDoc, setTutorialDoc] = useState<File | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            const data = await landingService.getSettings();
            setSettings(data);
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        const formData = new FormData();
        Object.entries(settings).forEach(([key, value]) => {
            formData.append(key, value as string);
        });

        if (heroImage) formData.append('hero_image', heroImage);
        if (tutorialDoc) formData.append('tutorial_document', tutorialDoc);

        try {
            await landingService.updateSettings(formData);
            alert('Pengaturan berhasil disimpan');
        } catch (error) {
            alert('Gagal menyimpan pengaturan');
        }
    };

    if (!settings) return <div>Loading...</div>;

    return (
        <div className="text-gray-900">
            <h1 className="text-2xl font-bold mb-6 text-white">Pengaturan Halaman Depan</h1>
            <div className="bg-white/95 backdrop-blur shadow-xl rounded-2xl p-8 max-w-2xl border border-white/20">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Hero Section */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-4">Hero Section</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Judul Hero</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={settings.hero_title}
                                    onChange={e => setSettings({ ...settings, hero_title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Subjudul Hero</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={settings.hero_subtitle}
                                    onChange={e => setSettings({ ...settings, hero_subtitle: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Gambar Hero</label>
                                <input type="file" onChange={e => setHeroImage(e.target.files?.[0] || null)} />
                                {settings.hero_image_url && (
                                    <img src={settings.hero_image_url} alt="Hero" className="mt-2 h-32 object-cover rounded" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-4">Tentang Kami</h3>
                        <div>
                            <label className="block text-sm font-medium">Konten</label>
                            <textarea
                                className="w-full border p-2 rounded" rows={4}
                                value={settings.about_content}
                                onChange={e => setSettings({ ...settings, about_content: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Tutorial Section */}
                    <div className="border-b pb-4">
                        <h3 className="text-lg font-medium mb-4">Panduan Tutorial</h3>
                        <div>
                            <label className="block text-sm font-medium">Video URL (YouTube Embed)</label>
                            <input
                                className="w-full border p-2 rounded"
                                value={settings.tutorial_video_url}
                                onChange={e => setSettings({ ...settings, tutorial_video_url: e.target.value })}
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium">Dokumen Panduan (PDF)</label>
                            <input type="file" accept=".pdf" onChange={e => setTutorialDoc(e.target.files?.[0] || null)} />
                            {settings.tutorial_pdf_url && (
                                <a href={settings.tutorial_pdf_url} target="_blank" rel="noreferrer" className="block mt-2 text-blue-600">
                                    Lihat Dokumen Saat Ini
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-lg font-medium mb-4">Kontak Footer</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={settings.contact_email}
                                    onChange={e => setSettings({ ...settings, contact_email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Telepon / WhatsApp</label>
                                <input
                                    className="w-full border p-2 rounded"
                                    value={settings.contact_phone}
                                    onChange={e => setSettings({ ...settings, contact_phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Alamat</label>
                                <textarea
                                    className="w-full border p-2 rounded"
                                    value={settings.contact_address}
                                    onChange={e => setSettings({ ...settings, contact_address: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LandingSettingsPage;
