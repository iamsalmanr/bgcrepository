import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Phone, Mail, MapPin, ChevronUp } from 'lucide-react';

export default function Footer() {
    const { site_settings } = usePage().props;
    const currentYear = new Date().getFullYear();
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const headingStyle = { fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif' };

    return (
        <footer className="relative w-full text-white overflow-hidden select-none">
            {/* Scenic Golf Course Landscape Background */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/images/footer-golf-landscape.png" 
                    alt="Golf Course Landscape" 
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1920&auto=format&fit=crop';
                    }}
                />
                {/* Dark Vignette & Gradient Overlays for High Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/65" />
                <div className="absolute inset-0 bg-emerald-950/40 mix-blend-multiply" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/15">
                    
                    {/* Column 1: Brand & Newsletter (4 cols) */}
                    <div className="lg:col-span-4 space-y-5">
                        <div className="flex items-center gap-3">
                            <ApplicationLogo className="w-9 h-9 shrink-0 drop-shadow-md" />
                            <span className="font-anton text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white leading-none" style={{ fontFamily: '"Anton", sans-serif', letterSpacing: '-0.025em' }}>
                                {site_settings?.site_name || 'BOGURA GOLF CLUB'}
                            </span>
                        </div>

                        <p className="text-sm font-medium text-slate-300 tracking-wide">
                            Elevate Your Golf Experience
                        </p>

                        {/* Newsletter Subscription Form */}
                        <form onSubmit={handleSubscribe} className="pt-2 max-w-sm">
                            {subscribed ? (
                                <div className="p-3 rounded-xl bg-emerald-700/80 border border-emerald-500 text-xs font-bold text-emerald-100">
                                    ✓ Thank you for subscribing to Bogura Golf Club!
                                </div>
                            ) : (
                                <div className="flex items-center rounded-xl bg-white p-1 shadow-2xl border border-white/20">
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter Your Email" 
                                        required
                                        className="flex-1 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 bg-transparent border-0 focus:outline-none focus:ring-0"
                                    />
                                    <button 
                                        type="submit"
                                        className="px-5 py-2.5 rounded-lg bg-[#5b8e31] hover:bg-[#4a7727] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm shrink-0"
                                    >
                                        Subscribe
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Column 2: Quick Links (2.5 cols) */}
                    <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-base font-bold text-white tracking-tight" style={headingStyle}>
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                            <li>
                                <Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li>
                                <a href="/#services" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>Our Services</span>
                                </a>
                            </li>
                            <li>
                                <a href="/executive-committee" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>Executive Committee</span>
                                </a>
                            </li>
                            <li>
                                <Link href={route('notices.public')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>Club Notices</span>
                                </Link>
                            </li>
                            <li>
                                <Link href={route('gallery.public')} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>Photo Gallery</span>
                                </Link>
                            </li>
                            <li>
                                <a href="/news" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>Bangladesh Golf News</span>
                                </a>
                            </li>
                            <li>
                                <a href="/contact-us" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>Contact Us</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Services (2.5 cols) */}
                    <div className="lg:col-span-3 space-y-4">
                        <h4 className="text-base font-bold text-white tracking-tight" style={headingStyle}>
                            Services
                        </h4>
                        <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                            <li>
                                <a href="/#services" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>Golf Coaching & Clinics</span>
                                </a>
                            </li>
                            <li>
                                <a href="/#services" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>Junior Golf Academy</span>
                                </a>
                            </li>
                            <li>
                                <a href="/#services" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>Practice Driving Range</span>
                                </a>
                            </li>
                            <li>
                                <a href="/tournaments/upcoming" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>Tournament Hosting</span>
                                </a>
                            </li>
                            <li>
                                <a href="/guest-room-rent" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                                    <span className="text-emerald-400 font-bold">•</span>
                                    <span>Guest Suites & Hospitality</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Get in Touch (3 cols) */}
                    <div className="lg:col-span-3 space-y-4">
                        <h4 className="text-base font-bold text-white tracking-tight" style={headingStyle}>
                            Get in Touch
                        </h4>
                        <div className="space-y-2.5 text-xs text-slate-300">
                            <div className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{site_settings?.address || 'Bogura Cantonment, Majhira, Bogura, Bangladesh'}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>{site_settings?.contact_phone || '+88 02 9835105 / Army: 8802'}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                                <a href={`mailto:${site_settings?.contact_email || 'info@boguragolfclub.com'}`} className="hover:underline hover:text-emerald-300">
                                    {site_settings?.contact_email || 'info@boguragolfclub.com'}
                                </a>
                            </div>
                        </div>

                        {/* Dynamic Social Icons */}
                        {site_settings?.footer_social_enabled !== '0' && (
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                                {/* Facebook */}
                                {site_settings?.social_facebook_enabled !== '0' && (
                                    <a 
                                        href={site_settings?.social_facebook_url || "https://facebook.com"} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        aria-label="Facebook"
                                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#5b8e31] text-slate-900 hover:text-white flex items-center justify-center transition-all shadow-md hover:scale-110"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                )}

                                {/* Twitter / X */}
                                {site_settings?.social_twitter_enabled !== '0' && (
                                    <a 
                                        href={site_settings?.social_twitter_url || "https://twitter.com"} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        aria-label="Twitter"
                                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#5b8e31] text-slate-900 hover:text-white flex items-center justify-center transition-all shadow-md hover:scale-110"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                        </svg>
                                    </a>
                                )}

                                {/* Instagram */}
                                {site_settings?.social_instagram_enabled !== '0' && (
                                    <a 
                                        href={site_settings?.social_instagram_url || "https://instagram.com"} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        aria-label="Instagram"
                                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#5b8e31] text-slate-900 hover:text-white flex items-center justify-center transition-all shadow-md hover:scale-110"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </a>
                                )}

                                {/* YouTube */}
                                {site_settings?.social_youtube_enabled === '1' && (
                                    <a 
                                        href={site_settings?.social_youtube_url || "https://youtube.com"} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        aria-label="YouTube"
                                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#5b8e31] text-slate-900 hover:text-white flex items-center justify-center transition-all shadow-md hover:scale-110"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                        </svg>
                                    </a>
                                )}

                                {/* LinkedIn */}
                                {site_settings?.social_linkedin_enabled !== '0' && (
                                    <a 
                                        href={site_settings?.social_linkedin_url || "https://linkedin.com"} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        aria-label="LinkedIn"
                                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#5b8e31] text-slate-900 hover:text-white flex items-center justify-center transition-all shadow-md hover:scale-110"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                        </svg>
                                    </a>
                                )}

                                {/* WhatsApp */}
                                {site_settings?.social_whatsapp_enabled === '1' && (
                                    <a 
                                        href={site_settings?.social_whatsapp_url || "https://wa.me/"} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        aria-label="WhatsApp"
                                        className="w-8 h-8 rounded-lg bg-white hover:bg-[#5b8e31] text-slate-900 hover:text-white flex items-center justify-center transition-all shadow-md hover:scale-110"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.98-.276-.1-.476-.15-.677.15-.2.3-.777.98-.953 1.18-.175.2-.351.226-.652.075-.3-.15-1.267-.467-2.414-1.49-1.01-1.006-1.503-2.023-1.654-2.324-.15-.3-.016-.462.134-.612.136-.135.301-.351.452-.527.15-.175.2-.3.301-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.235-.244-.588-.493-.509-.677-.518-.175-.009-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.3-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.227 3.11.15.2 2.12 3.238 5.137 4.542.718.311 1.278.497 1.716.636.721.23 1.378.198 1.897.12.578-.088 1.782-.728 2.033-1.431.25-.702.25-1.304.175-1.43-.075-.126-.276-.201-.577-.352zm-5.464 7.218c-2.106 0-4.168-.567-5.972-1.642l-.428-.255-4.437 1.164 1.185-4.325-.28-.445C1.196 14.28 0.6 12.186 0.6 10.02c0-5.744 4.673-10.417 10.418-10.417 2.784 0 5.4 1.084 7.369 3.053s3.053 4.585 3.053 7.369c0 5.744-4.673 10.417-10.432 10.417z"/>
                                        </svg>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                </div>

                {/* Bottom Bar: Copyright, Terms & Floating Back to Top */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300">
                    <p className="font-normal text-center sm:text-left">
                        © {currentYear} Bogura Golf Club. All Rights Reserved.
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-300">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <span>|</span>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
                    </div>
                </div>
            </div>

            {/* Floating Round Scroll to Top Button (Shifted up on mobile so it doesn't overlap bottom bar) */}
            <button 
                onClick={scrollToTop}
                aria-label="Scroll back to top"
                className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-30 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#0c2e1d] hover:bg-[#071d11] text-emerald-300 border border-emerald-500/40 flex items-center justify-center shadow-2xl transition-all hover:scale-110"
            >
                <ChevronUp className="w-5 h-5 stroke-[2.5]" />
            </button>
        </footer>
    );
}
