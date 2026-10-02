import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 relative bg-gray-950 font-sans selection:bg-black selection:text-white overflow-hidden">
            {/* Background image with soft dark blur overlay */}
            <img 
                src="/images/hero-bogra-golf.jpg" 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-60 scale-105" 
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-10" />

            <div className="relative z-20 w-full max-w-md">
                {/* Inspiration-style White Card */}
                <div className="w-full bg-white shadow-2xl rounded-[32px] p-8 sm:p-10 border border-gray-100">
                    {children}
                </div>
            </div>
        </div>
    );
}




