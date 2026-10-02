import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { 
    Mail, 
    Phone, 
    MapPin, 
    Clock, 
    ChevronRight, 
    ExternalLink, 
    Copy, 
    Check, 
    Building2, 
    Utensils, 
    Bed, 
    Flag, 
    UserCheck, 
    Headphones, 
    PhoneCall,
    Sparkles,
    Shield
} from 'lucide-react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function ContactUs({ directories = [] }) {
    const { site_settings } = usePage().props;
    const [copiedId, setCopiedId] = useState(null);

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    // Helper to get actual map url
    const getMapUrl = () => {
        let url = site_settings?.map_url;
        if (!url) return 'https://maps.google.com/maps?q=Bogura%20Golf%20Club,%20Majhira%20Cantonment,%20Bogura&t=&z=14&ie=UTF8&iwloc=&output=embed';
        
        // If user pasted an iframe code, extract the src
        if (url.includes('<iframe') && url.includes('src="')) {
            const match = url.match(/src="([^"]+)"/);
            if (match) return match[1];
        }
        
        return url;
    };

    const mapUrl = getMapUrl();

    // Helper to select icon for department
    const getDepartmentIcon = (title = '') => {
        const t = title.toLowerCase();
        if (t.includes('email') || t.includes('mail')) return Mail;
        if (t.includes('restaurant') || t.includes('dining') || t.includes('food')) return Utensils;
        if (t.includes('house') || t.includes('room') || t.includes('suite') || t.includes('living')) return Bed;
        if (t.includes('sport') || t.includes('golf') || t.includes('caddy')) return Flag;
        if (t.includes('register') || t.includes('membership') || t.includes('desk')) return UserCheck;
        if (t.includes('reception') || t.includes('operator')) return Headphones;
        if (t.includes('army') || t.includes('exchange')) return Shield;
        return PhoneCall;
    };

    const handleCopy = (text, id) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <PublicLayout>
            <Head title="Contact Us - Bogura Golf Club" />

            {/* ── 1. EXECUTIVE HERO HEADER ── */}
            <div className="relative bg-gradient-to-b from-[#092215] via-[#0c2e1d] to-[#081b11] text-white pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
                {/* Geometric Topo Line Art */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 1200 400" fill="none" stroke="white" strokeWidth="1.5">
                        <path d="M 50 180 Q 300 80 600 240 T 1150 140" strokeDasharray="6 6" />
                        <path d="M 0 280 C 350 200 700 380 1200 260" />
                    </svg>
                </div>

                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                    {/* Breadcrumbs */}
                    <nav aria-label="Breadcrumb" className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 text-[11px] sm:text-xs font-semibold text-emerald-300/85 uppercase tracking-wider mb-4 sm:mb-5">
                        <Link href="/" className="hover:text-white transition-colors shrink-0">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                        <span className="shrink-0 text-emerald-200/90">Club Information</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                        <span className="text-white font-bold shrink-0">Contact Us</span>
                    </nav>

                    {/* Title */}
                    <h1 
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-4"
                        style={appleStyle}
                    >
                        Contact & Department Directory
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg text-emerald-100/85 max-w-2xl mx-auto leading-relaxed font-normal">
                        Reach out to Bogura Golf Club administrative officers, reception desk, tournament committee, guest room reservations, and dining services.
                    </p>

                    {/* Quick Info Ribbon */}
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 text-xs font-semibold text-emerald-200">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-amber-400" />
                            <span>Bogura Cantonment, Majhira</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-emerald-600 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-400" />
                            <span>Daily 06:00 AM – 06:30 PM</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-emerald-600 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-amber-300" />
                            <span>Army Exchange: 7790 / 8802</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 2. MAIN CONTACT DIRECTORY & HEADQUARTERS SECTION ── */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left & Middle: Department Phone & Contact Directory Cards */}
                    <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/90 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900" style={appleStyle}>
                                    Department Direct Inquiries
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Click any contact number or email to copy or initiate a call.
                                </p>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                                {directories.length} Extensions
                            </span>
                        </div>

                        {/* Directory Grid (2 Columns) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {directories.map((dir, idx) => {
                                const Icon = getDepartmentIcon(dir.title);
                                const isCopied = copiedId === (dir.id || idx);

                                return (
                                    <div 
                                        key={dir.id || idx}
                                        className="p-5 rounded-2xl bg-[#f8faf6] border border-slate-200/80 hover:border-emerald-500/60 hover:bg-white transition-all duration-300 hover:shadow-md flex flex-col justify-between group space-y-3"
                                    >
                                        <div className="flex items-start gap-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-900 text-sm leading-snug truncate">
                                                    {dir.title}
                                                </h3>
                                                <div className="text-xs text-slate-600 mt-1 font-medium leading-relaxed whitespace-pre-line select-all">
                                                    {dir.details}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Action Copy Button */}
                                        <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs">
                                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                Official Contact
                                            </span>
                                            <button
                                                onClick={() => handleCopy(dir.details, dir.id || idx)}
                                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                                                title="Copy to clipboard"
                                            >
                                                {isCopied ? (
                                                    <>
                                                        <Check className="w-3 h-3 text-emerald-600" />
                                                        <span className="text-emerald-700">Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3 text-slate-400 group-hover:text-emerald-700" />
                                                        <span>Copy Info</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Club Headquarters Card & Live Google Map */}
                    <div className="lg:col-span-4 space-y-6">
                        
                        {/* Club HQ Information Card */}
                        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/90 space-y-5">
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                <ApplicationLogo className="w-10 h-10" />
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base uppercase leading-none" style={appleStyle}>
                                        {site_settings?.site_name || 'BOGURA GOLF CLUB'}
                                    </h3>
                                    <span className="text-[11px] text-emerald-800 font-semibold mt-1 block uppercase tracking-wider">
                                        Headquarters & Club House
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3.5 text-xs text-slate-700">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-900 block">Address</span>
                                        <span className="text-slate-600 font-normal leading-relaxed">
                                            {site_settings?.address || 'Bogura Cantonment, Majhira, Bogura, Bangladesh'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-900 block">Telephone & Army Exchange</span>
                                        <span className="text-slate-600 font-normal">
                                            {site_settings?.contact_phone || '+88 02 9835105 / Army: 8802, 7790'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-900 block">Email Address</span>
                                        <a 
                                            href={`mailto:${site_settings?.contact_email || 'info@boguragolfclub.com'}`}
                                            className="text-emerald-800 hover:text-emerald-950 font-semibold underline underline-offset-2"
                                        >
                                            {site_settings?.contact_email || 'info@boguragolfclub.com'}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-900 block">Operating Hours</span>
                                        <span className="text-slate-600 font-normal">
                                            Daily: 06:00 AM – 06:30 PM
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Google Map Card */}
                        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 relative group">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-emerald-700" />
                                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                                        Course Location
                                    </span>
                                </div>
                                <a
                                    href="https://maps.google.com/?q=Bogura+Golf+Club,+Majhira+Cantonment,+Bogura"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 uppercase tracking-wider"
                                >
                                    <span>Google Maps</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>

                            <div className="h-64 sm:h-72 w-full relative bg-slate-100">
                                <iframe
                                    title="Bogura Golf Club Map"
                                    src={mapUrl}
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
