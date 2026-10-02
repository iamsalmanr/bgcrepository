import { usePage } from '@inertiajs/react';

export default function ApplicationLogo({ className = '', ...props }) {
    const { site_settings } = usePage().props;
    const logoUrl = site_settings?.logo_path || '/images/bgc-logo.png';

    return (
        <img 
            src={logoUrl} 
            alt={site_settings?.site_name || 'Bogura Golf Club'} 
            {...props} 
            className={`object-contain ${className}`}
        />
    );
}

