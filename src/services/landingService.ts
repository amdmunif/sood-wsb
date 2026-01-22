import api from './api';

export interface LandingSettings {
    hero_title: string;
    hero_subtitle: string;
    hero_cta_text: string;
    hero_cta_url: string;
    hero_image_url?: string;
    about_title?: string;
    about_content?: string;
    contact_address?: string;
    contact_email?: string;
    contact_phone?: string;
    logo_url?: string;
    favicon_url?: string;
    tutorial_pdf_url?: string;
    tutorial_video_url?: string;
}

export const landingService = {
    getSettings: async () => {
        const response = await api.get<LandingSettings>('/landing_settings.php');
        return response.data;
    },

    // Method update hanya untuk admin, tapi kita definisikan tipe-nya di sini
    updateSettings: async (formData: FormData) => {
        const response = await api.post('/landing_settings.php', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};
