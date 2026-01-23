import React from 'react';
import { constructImageUrl } from '../services/api';



export const SoodLogo: React.FC<{ className?: string; logoUrl?: string | null }> = ({ className, logoUrl }) => {
    const absoluteLogoUrl = constructImageUrl(logoUrl);
    if (absoluteLogoUrl) {
        return <img src={absoluteLogoUrl} alt="Logo" className={className} />;
    }
    // Fallback logo if none is provided
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#4ade80" />
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
        </svg>
    );
};
