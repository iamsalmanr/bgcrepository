import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Footer from '@/Components/Footer';
import MobileBottomNav from '@/Components/MobileBottomNav';
import { 
    Menu, X, ChevronDown, ChevronLeft, ChevronRight, 
    Flag, Trophy, Users, FileText, ArrowRight, ArrowUpRight, 
    Bell, Calendar, MapPin, Phone, Mail, Clock, Download, 
    ShieldCheck, Award, Eye, Compass, Sparkles, ExternalLink 
} from 'lucide-react';
import { formatBanglaDigits } from '@/lib/utils';

// Robust asset URL resolver for Laravel storage, public assets & external URLs
const resolveAssetUrl = (path, fallback = '') => {
    if (!path) return fallback;
    const str = String(path).trim();
    if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:')) {
        return str;
    }
    if (str.startsWith('/storage/')) {
        return str;
    }
    if (str.startsWith('storage/')) {
        return `/${str}`;
    }
    if (str.startsWith('/images/') || str.startsWith('/assets/')) {
        return str;
    }
    if (str.startsWith('/')) {
        return str;
    }
    return `/storage/${str}`;
};

// Smooth Fade-In on Scroll Component
const FadeInSection = ({ children, className = '', delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (domRef.current) observer.unobserve(domRef.current);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        const current = domRef.current;
        if (current) observer.observe(current);
        return () => {
            if (current) observer.unobserve(current);
        };
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-700 ease-out transform ${
                isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const MobileMenuItem = ({ item, onItemClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between">
                <a 
                    href={hasChildren ? '#' : (item.url || '#')} 
                    target={item.target} 
                    className="flex-1 py-3 px-4 rounded-xl text-[14px] font-semibold text-slate-800 hover:text-emerald-900 hover:bg-emerald-50/80 active:bg-emerald-100/60 transition-all flex items-center justify-between"
                    onClick={(e) => {
                        if (hasChildren) {
                            e.preventDefault();
                            setIsOpen(!isOpen);
                        } else if (onItemClick) {
                            onItemClick();
                        }
                    }}
                >
                    <span>{item.title}</span>
                    {hasChildren && (
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-800' : ''}`} />
                        </div>
                    )}
                </a>
            </div>
            
            {hasChildren && isOpen && (
                <div className="ml-4 pl-3 my-1 border-l-2 border-emerald-500/60 flex flex-col space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {item.children.map((child, cIdx) => (
                        <a 
                            key={cIdx} 
                            href={child.url || '#'} 
                            target={child.target} 
                            className="py-2 px-3 rounded-lg text-[13px] font-medium text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/60 transition-all"
                            onClick={() => onItemClick && onItemClick()}
                        >
                            {child.title}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

const isBangla = (text) => /[\u0980-\u09FF]/.test(String(text || ''));

export default function Welcome({ 
    auth, 
    heroSlides = [], 
    galleryImages = [], 
    notices = [], 
    forms = [], 
    executiveMembers = [], 
    partners = [], 
    upcomingTournaments = [], 
    quickLinks = [] 
}) {
    const { site_settings, menus } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [showAllTournaments, setShowAllTournaments] = useState(false);
    const [showAllNotices, setShowAllNotices] = useState(false);
    const [gallerySlideIndex, setGallerySlideIndex] = useState(0);

    // Navigation Menus
    const topMenu = menus?.top_bar?.items || [];
    const mobileMenu = menus?.mobile_hamburger?.items || topMenu;

    // Apple-inspired Typography Stack
    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    // Default Hero Slides if none configured
    const slides = useMemo(() => {
        if (heroSlides.length > 0) return heroSlides;
        return [
            {
                id: 1,
                image_path: '/images/hero/hero-1.jpg',
                title: 'Welcome to Bogura Golf Club',
                subtitle: 'A Sanctuary of Natural Splendor, Heritage & Championship Golf in Bogura Cantonment'
            },
            {
                id: 2,
                image_path: '/images/hero/hero-2.jpg',
                title: 'Championship 9-Hole Course',
                subtitle: 'Pristine Greens, Strategic Water Hazards, and Picturesque Fairways Across 52.05 Acres'
            },
            {
                id: 3,
                image_path: '/images/hero/hero-3.jpg',
                title: 'Tradition & Sporting Excellence',
                subtitle: 'Fostering Camaraderie, Elite Tournaments & Warm Hospitality Since 1998'
            }
        ];
    }, [heroSlides]);

    // Automatic slide rotation for Hero
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 6500);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((currentSlide + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
    };

    // Gallery responsive slides and touch handlers
    const [gallerySlidesVisible, setGallerySlidesVisible] = useState(3);
    useEffect(() => {
        const updateSlides = () => {
            if (typeof window !== 'undefined') {
                if (window.innerWidth < 640) setGallerySlidesVisible(1);
                else if (window.innerWidth < 1024) setGallerySlidesVisible(2);
                else setGallerySlidesVisible(3);
            }
        };
        updateSlides();
        window.addEventListener('resize', updateSlides);
        return () => window.removeEventListener('resize', updateSlides);
    }, []);

    const maxGalleryIndex = Math.max(0, galleryImages.length - gallerySlidesVisible);

    const prevGallery = () => {
        setGallerySlideIndex(prev => (prev <= 0 ? maxGalleryIndex : prev - 1));
    };

    const nextGallery = () => {
        setGallerySlideIndex(prev => (prev >= maxGalleryIndex ? 0 : prev + 1));
    };

    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    const handleGalleryTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleGalleryTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleGalleryTouchEnd = () => {
        if (touchStartX.current === null || touchEndX.current === null) return;
        const distance = touchStartX.current - touchEndX.current;
        if (distance > 40) {
            nextGallery();
        } else if (distance < -40) {
            prevGallery();
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    // First 4 members initially
    const displayedMembers = executiveMembers.slice(0, 4);

    // First 3 tournaments initially
    const displayedTournaments = showAllTournaments ? upcomingTournaments : upcomingTournaments.slice(0, 3);

    // First 3 notices initially
    const displayedNotices = showAllNotices ? notices : notices.slice(0, 3);

    // Urgent notices ticker: only notices enabled for homepage marquee (show_on_home)
    const urgentNotices = useMemo(() => {
        return (notices || []).filter(n => Boolean(n.show_on_home) || n.show_on_home === 1 || n.show_on_home === '1');
    }, [notices]);

    // Dynamic ticker: measure available container width vs content width
    const tickerContainerRef = useRef(null);
    const tickerTrackRef = useRef(null);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            if (!tickerContainerRef.current || !tickerTrackRef.current) return;
            const containerWidth = tickerContainerRef.current.clientWidth;
            const contentWidth = tickerTrackRef.current.scrollWidth;
            // Only animate if the text content does not fit inside the container
            setShouldAnimate(contentWidth > containerWidth);
        };

        checkOverflow();
        const t1 = setTimeout(checkOverflow, 60);
        const t2 = setTimeout(checkOverflow, 300);

        let ro;
        if (typeof ResizeObserver !== 'undefined' && tickerContainerRef.current) {
            ro = new ResizeObserver(checkOverflow);
            ro.observe(tickerContainerRef.current);
            if (tickerTrackRef.current) {
                ro.observe(tickerTrackRef.current);
            }
        }

        window.addEventListener('resize', checkOverflow);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            if (ro) ro.disconnect();
            window.removeEventListener('resize', checkOverflow);
        };
    }, [urgentNotices]);

    // Safe Google Map URL resolution with explicit Bogura Golf Club Drop Pin
    const mapEmbedSrc = useMemo(() => {
        const raw = site_settings?.map_url;
        if (!raw || raw.includes('pb=!') || raw.includes('maps/embed')) {
            return "https://maps.google.com/maps?q=Bogura+Golf+Club,+Majhira+Cantonment,+Bogura&t=&z=15&ie=UTF8&iwloc=B&output=embed";
        }
        if (raw.includes('<iframe') && raw.includes('src="')) {
            const match = raw.match(/src="([^"]+)"/);
            if (match) return match[1];
        }
        if (!raw.startsWith('http')) {
            return `https://maps.google.com/maps?q=${encodeURIComponent(raw)}&t=&z=15&ie=UTF8&iwloc=B&output=embed`;
        }
        return raw;
    }, [site_settings?.map_url]);

    return (
        <div 
            className="min-h-screen bg-[#fafaf8] text-slate-800 selection:bg-emerald-700 selection:text-white flex flex-col overflow-x-hidden"
            style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Plus Jakarta Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                letterSpacing: '-0.011em'
            }}
        >
            <Head title="Bogura Golf Club - Premier Golfing Destination in Bangladesh" />

            {/* ── 1. URGENT NOTICE TICKER BAR ── */}
            {urgentNotices.length > 0 && (
                <div className="bg-[#091b12] text-slate-100 text-xs py-2 px-3 sm:py-2.5 sm:px-4 border-b border-emerald-800/40 z-50 shadow-inner">
                    <div className="container mx-auto flex items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 shrink-0 z-10">
                            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-[10px] sm:text-[10.5px] uppercase px-2 py-1 sm:px-2.5 sm:py-1 rounded-full tracking-wider shadow-sm border border-emerald-400/30" title="Official Club Notices">
                                <span className="relative flex items-center justify-center">
                                    <Bell className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
                                    <span className="animate-ping absolute -top-0.5 -right-0.5 inline-flex h-1.5 w-1.5 rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="absolute -top-0.5 -right-0.5 inline-flex h-1.5 w-1.5 rounded-full bg-amber-300"></span>
                                </span>
                                <span className="tracking-widest font-semibold hidden sm:inline">NOTICE</span>
                            </span>
                        </div>

                        <div 
                            ref={tickerContainerRef}
                            className="flex-1 overflow-hidden relative mx-1 sm:mx-2 flex items-center select-none group"
                            style={shouldAnimate ? {
                                maskImage: 'linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)',
                                WebkitMaskImage: 'linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)'
                            } : undefined}
                        >
                            {shouldAnimate ? (
                                <>
                                    <style>{`
                                        @keyframes marqueeNoticeTrack {
                                            0% { transform: translateX(0%); }
                                            100% { transform: translateX(-100%); }
                                        }
                                        .animate-marquee-track {
                                            display: inline-flex;
                                            animation: marqueeNoticeTrack ${Math.max(25, urgentNotices.length * 15)}s linear infinite;
                                            font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                                            will-change: transform;
                                            -webkit-font-smoothing: antialiased;
                                            -moz-osx-font-smoothing: grayscale;
                                        }
                                        .group:hover .animate-marquee-track,
                                        .group:active .animate-marquee-track {
                                            animation-play-state: paused;
                                        }
                                    `}</style>
                                    <div className="flex whitespace-nowrap overflow-hidden w-full">
                                        <div ref={tickerTrackRef} className="animate-marquee-track shrink-0 flex items-center pr-8">
                                            {urgentNotices.map((n, idx) => {
                                                const bangla = isBangla(n.title);
                                                return (
                                                    <Link 
                                                        key={`u1-${n.id || idx}`}
                                                        href={route('notices.public')} 
                                                        className="group/item inline-flex items-center gap-2 mr-8 sm:mr-10 text-slate-100 hover:text-amber-300 transition-colors no-underline"
                                                    >
                                                        <span 
                                                            className={bangla 
                                                                ? "text-[13px] sm:text-[14px] font-medium leading-normal text-slate-100 group-hover/item:text-amber-300 transition-colors font-bangla" 
                                                                : "text-[12px] sm:text-[13px] font-medium tracking-normal text-slate-100 group-hover/item:text-amber-300 transition-colors font-sans"
                                                            }
                                                            style={bangla ? { fontFamily: "'Tiro Bangla', 'Hind Siliguri', 'Noto Sans Bengali', sans-serif" } : undefined}
                                                        >
                                                            {formatBanglaDigits(n.title)}
                                                        </span>
                                                        {n.created_at && (
                                                            <span 
                                                                className="text-[10px] sm:text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 whitespace-nowrap tracking-wide font-sans shadow-2xs"
                                                            >
                                                                {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </span>
                                                        )}
                                                        <span className="text-amber-400/70 select-none ml-4 sm:ml-6 text-[11px]">✦</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                        <div className="animate-marquee-track shrink-0 flex items-center pr-8" aria-hidden="true">
                                            {urgentNotices.map((n, idx) => {
                                                const bangla = isBangla(n.title);
                                                return (
                                                    <Link 
                                                        key={`u2-${n.id || idx}`}
                                                        href={route('notices.public')} 
                                                        className="group/item inline-flex items-center gap-2 mr-8 sm:mr-10 text-slate-100 hover:text-amber-300 transition-colors no-underline"
                                                    >
                                                        <span 
                                                            className={bangla 
                                                                ? "text-[13px] sm:text-[14px] font-medium leading-normal text-slate-100 group-hover/item:text-amber-300 transition-colors font-bangla" 
                                                                : "text-[12px] sm:text-[13px] font-medium tracking-normal text-slate-100 group-hover/item:text-amber-300 transition-colors font-sans"
                                                            }
                                                            style={bangla ? { fontFamily: "'Tiro Bangla', 'Hind Siliguri', 'Noto Sans Bengali', sans-serif" } : undefined}
                                                        >
                                                            {formatBanglaDigits(n.title)}
                                                        </span>
                                                        {n.created_at && (
                                                            <span 
                                                                className="text-[10px] sm:text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 whitespace-nowrap tracking-wide font-sans shadow-2xs"
                                                            >
                                                                {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </span>
                                                        )}
                                                        <span className="text-amber-400/70 select-none ml-4 sm:ml-6 text-[11px]">✦</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div ref={tickerTrackRef} className="flex items-center gap-3 sm:gap-4 overflow-hidden whitespace-nowrap">
                                    {urgentNotices.map((n, idx) => {
                                        const bangla = isBangla(n.title);
                                        return (
                                            <React.Fragment key={`static-${n.id || idx}`}>
                                                <Link 
                                                    href={route('notices.public')} 
                                                    className="group/item inline-flex items-center gap-2 text-slate-100 hover:text-amber-300 transition-colors no-underline"
                                                >
                                                    <span 
                                                        className={bangla 
                                                            ? "text-[13px] sm:text-[14px] font-medium leading-normal text-slate-100 group-hover/item:text-amber-300 transition-colors font-bangla" 
                                                            : "text-[12px] sm:text-[13px] font-medium tracking-normal text-slate-100 group-hover/item:text-amber-300 transition-colors font-sans"
                                                        }
                                                        style={bangla ? { fontFamily: "'Tiro Bangla', 'Hind Siliguri', 'Noto Sans Bengali', sans-serif" } : undefined}
                                                    >
                                                        {formatBanglaDigits(n.title)}
                                                    </span>
                                                    {n.created_at && (
                                                        <span 
                                                            className="text-[10px] sm:text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 whitespace-nowrap tracking-wide font-sans shadow-2xs shrink-0"
                                                        >
                                                            {new Date(n.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    )}
                                                </Link>
                                                {idx < urgentNotices.length - 1 && (
                                                    <span className="text-amber-400/70 select-none text-[11px] shrink-0">✦</span>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <Link 
                            href={route('notices.public')} 
                            className="group/all shrink-0 inline-flex items-center gap-1.5 text-amber-300 hover:text-white font-semibold text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-400/10 hover:bg-emerald-600/30 border border-amber-400/25 hover:border-emerald-400/40 transition-all z-10"
                            title="View All Notices"
                        >
                            <span className="hidden sm:inline">All Notices</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/all:translate-x-0.5 transition-transform text-amber-300" />
                        </Link>
                    </div>
                </div>
            )}

            {/* ── 3. GRAND HERO SECTION (With Floating Navigation on Mobile) ── */}
            <section className="relative w-full min-h-[580px] md:min-h-[640px] lg:min-h-[720px] flex flex-col justify-start items-center overflow-hidden bg-slate-950">
                {/* Background Image (Fills 100% of Hero, perfectly seamless beneath notice bar) */}
                {slides.map((slide, idx) => (
                    <div 
                        key={slide.id || idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            idx === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img 
                            src={resolveAssetUrl(slide.image_path, '/images/hero/hero-1.jpg')} 
                            alt={slide.title || 'Bogura Golf Club'} 
                            className="w-full h-full object-cover object-center"
                            style={{
                                objectPosition: slide.image_position || 'center center'
                            }}
                            onError={(e) => {
                                e.target.src = '/images/hero-bogra-golf.jpg';
                            }}
                        />
                        {/* Subtle Sky Gradient (Keeps Building Bright & Visible in Center) */}
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/40" />
                    </div>
                ))}

                {/* ── 2. NAVIGATION BAR (Floating pill on mobile, full bar on desktop) ── */}
                <div className="w-full relative z-40 pt-3 pb-2 px-3 sm:px-4 lg:pt-0 lg:pb-0 lg:px-0 lg:bg-white lg:shadow-sm">
                    <header className="w-full bg-[#fbfbf9]/95 backdrop-blur-md rounded-full shadow-lg border border-white/30 lg:bg-transparent lg:rounded-none lg:shadow-none lg:border-none">
                        <div className="max-w-[1680px] w-full mx-auto px-3 sm:px-5 lg:px-6">
                            {/* Top Bar Header */}
                            <div className="flex items-center justify-between py-2 md:py-3 gap-2 sm:gap-4 relative">
                                {/* Brand Logo & Name */}
                                <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 hover:opacity-90 transition-opacity z-10">
                                    <ApplicationLogo className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-md shrink-0" />
                                    <div className="text-left">
                                        <h1 
                                            className="font-anton text-lg sm:text-2xl 2xl:text-3xl font-bold uppercase tracking-tight text-slate-950 leading-none whitespace-nowrap" 
                                            style={{ fontFamily: '"Anton", sans-serif', letterSpacing: '-0.02em' }}
                                        >
                                            {site_settings?.site_name || 'BOGURA GOLF CLUB'}
                                        </h1>
                                    </div>
                                </Link>

                                {/* Desktop Navigation Links */}
                                <nav className="hidden xl:flex flex-1 min-w-0 justify-center px-2 2xl:px-4 gap-1.5 2xl:gap-2.5 text-xs font-semibold text-slate-700 whitespace-nowrap overflow-hidden">
                                    {topMenu.length > 0 ? topMenu.map((item, idx) => (
                                        <div key={idx} className="relative group py-1.5">
                                            <a 
                                                href={item.url || '#'} 
                                                target={item.target} 
                                                className="px-2.5 2xl:px-3.5 py-1.5 2xl:py-2 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800 transition-colors tracking-tight flex items-center shadow-2xs h-8.5 2xl:h-9 uppercase text-[10.5px] 2xl:text-[11px] font-semibold"
                                            >
                                                <span>{item.title}</span>
                                                {item.children && item.children.length > 0 && <ChevronDown className="w-3 h-3 ml-1 text-slate-400 shrink-0" />}
                                            </a>
                                            {item.children && item.children.length > 0 && (
                                                <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-xl border border-slate-100 rounded-2xl py-2 min-w-[210px] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {item.children.map((child, cIdx) => (
                                                        <a 
                                                            key={cIdx} 
                                                            href={child.url || '#'} 
                                                            target={child.target} 
                                                            className="block px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                                                        >
                                                            {child.title}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )) : (
                                        <span className="text-slate-400 italic flex items-center h-9 text-xs">No navigation menu items</span>
                                    )}
                                </nav>

                                {/* Auth Action Buttons & Mobile Hamburger - Always Visible on Right */}
                                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5 ml-auto z-10">
                                    {auth?.user ? (
                                        <Link href={route('dashboard')} className="flex items-center group">
                                            <div className="bg-[#1b2a22] text-white px-3 sm:px-4.5 h-8.5 sm:h-9 rounded-full font-semibold text-[11px] sm:text-xs uppercase tracking-wider flex items-center group-hover:bg-emerald-950 transition-colors shadow-sm">
                                                <span className="hidden sm:inline">Dashboard</span>
                                                <span className="sm:hidden">Portal</span>
                                            </div>
                                            <div className="w-2.5 h-1 bg-[#1b2a22] group-hover:bg-emerald-950 transition-colors -mx-1 z-10 relative"></div>
                                            <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 bg-[#1b2a22] text-white rounded-full flex items-center justify-center group-hover:bg-emerald-950 transition-colors shadow-sm">
                                                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5">
                                            <Link 
                                                href={route('login')} 
                                                className="text-slate-700 hover:text-emerald-900 font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-colors px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-slate-100"
                                            >
                                                Log in
                                            </Link>
                                            <Link href={route('register')} className="flex items-center group">
                                                <div className="bg-[#1b2a22] text-white px-3 sm:px-4 xl:px-4.5 h-8.5 sm:h-9 rounded-full font-semibold text-[11px] sm:text-xs uppercase tracking-wider flex items-center group-hover:bg-emerald-950 transition-colors shadow-sm">
                                                    <span className="hidden sm:inline">Register</span>
                                                    <span className="sm:hidden">Join</span>
                                                </div>
                                                <div className="w-2 sm:w-2.5 h-1 bg-[#1b2a22] group-hover:bg-emerald-950 transition-colors -mx-1 z-10 relative"></div>
                                                <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 bg-[#1b2a22] text-white rounded-full flex items-center justify-center group-hover:bg-emerald-950 transition-colors shadow-sm">
                                                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {/* Mobile/Tablet Menu Toggle Button (Visible when full nav is hidden) */}
                                    <button 
                                        className="xl:hidden w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors focus:outline-none shrink-0" 
                                        onClick={() => setIsMobileMenuOpen(true)}
                                        aria-label="Open navigation menu"
                                    >
                                        <Menu size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>
                </div>

                {/* Mobile Drawer Menu (Pure Modal Overlay Sheet - Never Pushes Hero Content) */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex flex-col justify-start p-3.5 sm:p-5 overflow-y-auto animate-in fade-in duration-200 lg:hidden">
                        <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 max-w-md w-full mx-auto space-y-4 my-auto">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2.5">
                                    <ApplicationLogo className="w-9 h-9" />
                                    <span className="font-anton text-lg font-bold text-slate-900 uppercase tracking-tight" style={{ fontFamily: '"Anton", sans-serif', letterSpacing: '-0.025em' }}>
                                        {site_settings?.site_name || 'BOGURA GOLF CLUB'}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Menu Items List (High Contrast Black on White) */}
                            <nav className="flex flex-col space-y-1 max-h-[55vh] overflow-y-auto pr-1">
                                {mobileMenu.map((item, idx) => (
                                    <MobileMenuItem 
                                        key={idx} 
                                        item={item} 
                                        onItemClick={() => setIsMobileMenuOpen(false)} 
                                    />
                                ))}
                            </nav>

                            {/* Bottom Executive Auth Pill */}
                            <div className="pt-3 border-t border-slate-100 mt-2">
                                {auth?.user ? (
                                    <Link 
                                        href={route('dashboard')} 
                                        className="w-full py-3 px-4 rounded-2xl bg-[#0c2417] hover:bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span>Member Dashboard</span>
                                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2.5">
                                        <Link 
                                            href={route('login')} 
                                            className="flex-1 text-center py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs uppercase tracking-wider transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Log in
                                        </Link>
                                        <Link 
                                            href={route('register')} 
                                            className="flex-1 text-center py-2.5 px-3 rounded-xl bg-[#0c2417] hover:bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <span>Register</span>
                                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Hero Foreground Content */}
                <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl pt-8 sm:pt-12 md:pt-14 pb-44 sm:pb-56 lg:pb-64">
                    {/* Compact Modern Title (Apple Style) */}
                    <h2 
                        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15] drop-shadow-xl mb-3"
                        style={appleStyle}
                    >
                        {slides[currentSlide]?.title || 'Welcome To Bogura Golf Club'}
                    </h2>

                    {/* Compact Subtitle */}
                    <p className="text-xs sm:text-sm md:text-base text-slate-100/90 font-normal leading-relaxed max-w-xl mx-auto mb-5 drop-shadow-md">
                        {slides[currentSlide]?.subtitle || 'The Bogura Golf Club, founded in 1998 and inaugurated in 2000, is a stunning 52.05-acre, 9-hole course located beautifully inside Bogura Cantonment.'}
                    </p>

                    {/* Desktop Hero Action Buttons (Hidden on Mobile) */}
                    <div className="hidden sm:flex flex-wrap items-center justify-center gap-3">
                        <a 
                            href="#services" 
                            className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs uppercase tracking-wider shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-emerald-500/40"
                        >
                            <span>Explore Services</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                        <Link 
                            href={route('notices.public')} 
                            className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold text-xs uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5"
                        >
                            <span>Club Notices</span>
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                        </Link>
                    </div>

                    {/* Slide Navigation Dots */}
                    {slides.length > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-4">
                            {slides.map((_, dotIdx) => (
                                <button
                                    key={dotIdx}
                                    onClick={() => setCurrentSlide(dotIdx)}
                                    aria-label={`Go to slide ${dotIdx + 1}`}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        dotIdx === currentSlide 
                                            ? 'w-6 bg-emerald-400 shadow-md' 
                                            : 'w-1.5 bg-white/40 hover:bg-white/70'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Mobile Only: Action Buttons at the Bottom of the Image (Over the Green Lawn) */}
                <div className="sm:hidden absolute bottom-5 left-0 right-0 z-20 px-4 flex items-center justify-center gap-2.5">
                    <a 
                        href="#services" 
                        className="flex-1 max-w-[155px] py-2.5 px-3 rounded-full bg-emerald-700/95 hover:bg-emerald-600 text-white font-semibold text-[11px] uppercase tracking-wider text-center shadow-xl backdrop-blur-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                        <span>Services</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <Link 
                        href={route('notices.public')} 
                        className="flex-1 max-w-[155px] py-2.5 px-3 rounded-full bg-black/45 hover:bg-black/65 text-white border border-white/40 backdrop-blur-md font-semibold text-[11px] uppercase tracking-wider text-center shadow-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                    >
                        <span>Notices</span>
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    </Link>
                </div>


                {/* Left/Right Slider Arrows */}
                {slides.length > 1 && (
                    <>
                        <button 
                            onClick={prevSlide}
                            aria-label="Previous Slide"
                            className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 border border-white/20 text-white items-center justify-center backdrop-blur-sm transition-all hover:scale-110 z-20"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={nextSlide}
                            aria-label="Next Slide"
                            className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 border border-white/20 text-white items-center justify-center backdrop-blur-sm transition-all hover:scale-110 z-20"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}

                {/* Quick Highlights Ribbon */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-emerald-950/90 backdrop-blur-md border-t border-emerald-800/40 text-emerald-100 py-3.5 px-4 hidden sm:block shadow-2xl">
                    <div className="container mx-auto flex items-center justify-around text-xs font-semibold uppercase tracking-wider text-center">
                        <div className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                            <Flag className="w-4 h-4 text-amber-400" />
                            <span>9-Hole</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-emerald-600" />
                        <div className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            <span>Par 36</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-emerald-600" />
                        <div className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                            <Compass className="w-4 h-4 text-amber-400" />
                            <span>52.05 Acre</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-emerald-600" />
                        <div className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                            <Award className="w-4 h-4 text-amber-400" />
                            <span>{new Date().getFullYear() - 2000}+ Years Heritage</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. GOLF SERVICES & TRAINING SHOWCASE (Fade In On Scroll) ── */}
            <FadeInSection>
                <section id="services" className="py-10 sm:py-16 lg:py-28 bg-[#fafaf8] border-b border-slate-200/80">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16 space-y-2 sm:space-y-3">
                            <div className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                <span>{site_settings?.home_service_subtitle || 'Our Services'}</span>
                            </div>
                            <h2 
                                className="text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-950 tracking-tight leading-tight"
                                style={appleStyle}
                            >
                                {site_settings?.home_service_title || (
                                    <>Professional Golf <span className="text-emerald-700">Training</span> & <span className="text-emerald-700">Coaching</span> Services</>
                                )}
                            </h2>
                        </div>

                        {/* 4 Organic Pebble Shaped Service Cards (2-col on mobile, 4-col on desktop) */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-10">
                            
                            {/* 1. Practice Areas */}
                            <div className="group flex flex-col items-center text-center space-y-2.5 sm:space-y-4 lg:space-y-5 transition-all duration-300 hover:-translate-y-1">
                                <div 
                                    className="w-32 h-24 sm:w-44 sm:h-36 lg:w-64 lg:h-52 overflow-hidden shadow-md sm:shadow-lg group-hover:shadow-2xl transition-all duration-700 bg-emerald-950"
                                    style={{
                                        borderRadius: '45% 55% 65% 35% / 40% 45% 55% 60%'
                                    }}
                                >
                                    <img 
                                        src={resolveAssetUrl(site_settings?.home_service_1_image, "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop")} 
                                        alt={site_settings?.home_service_1_title || "Practice Areas"} 
                                        className="w-full h-full min-w-full min-h-full object-cover object-center scale-[1.08] group-hover:scale-[1.18] transition-transform duration-700 ease-out"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop";
                                        }}
                                    />
                                </div>
                                <div className="space-y-1 sm:space-y-2 max-w-xs">
                                    <h3 className="text-sm sm:text-base lg:text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors" style={appleStyle}>
                                        {site_settings?.home_service_1_title || 'Practice Areas'}
                                    </h3>
                                    <p className="text-[11px] sm:text-xs lg:text-sm text-slate-600 leading-snug sm:leading-relaxed font-normal line-clamp-2">
                                        {site_settings?.home_service_1_desc || 'Dedicated spaces to improve swing, accuracy, and performance.'}
                                    </p>
                                    <div className="pt-1">
                                        <Link 
                                            href={route('notices.public')} 
                                            className="inline-block text-[11px] sm:text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-4 decoration-2 decoration-emerald-500/60 hover:decoration-emerald-800 transition-all uppercase tracking-wider"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Golf Training */}
                            <div className="group flex flex-col items-center text-center space-y-2.5 sm:space-y-4 lg:space-y-5 transition-all duration-300 hover:-translate-y-1">
                                <div 
                                    className="w-32 h-24 sm:w-44 sm:h-36 lg:w-64 lg:h-52 overflow-hidden shadow-md sm:shadow-lg group-hover:shadow-2xl transition-all duration-700 bg-emerald-950"
                                    style={{
                                        borderRadius: '60% 40% 35% 65% / 55% 60% 40% 45%'
                                    }}
                                >
                                    <img 
                                        src={resolveAssetUrl(site_settings?.home_service_2_image, "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop")} 
                                        alt={site_settings?.home_service_2_title || "Golf Training"} 
                                        className="w-full h-full min-w-full min-h-full object-cover object-center scale-[1.08] group-hover:scale-[1.18] transition-transform duration-700 ease-out"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop";
                                        }}
                                    />
                                </div>
                                <div className="space-y-1 sm:space-y-2 max-w-xs">
                                    <h3 className="text-sm sm:text-base lg:text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors" style={appleStyle}>
                                        {site_settings?.home_service_2_title || 'Golf Training'}
                                    </h3>
                                    <p className="text-[11px] sm:text-xs lg:text-sm text-slate-600 leading-snug sm:leading-relaxed font-normal line-clamp-2">
                                        {site_settings?.home_service_2_desc || 'Professional coaching designed for skill development at every level.'}
                                    </p>
                                    <div className="pt-1">
                                        <Link 
                                            href={route('notices.public')} 
                                            className="inline-block text-[11px] sm:text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-4 decoration-2 decoration-emerald-500/60 hover:decoration-emerald-800 transition-all uppercase tracking-wider"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Club Amenities */}
                            <div className="group flex flex-col items-center text-center space-y-2.5 sm:space-y-4 lg:space-y-5 transition-all duration-300 hover:-translate-y-1">
                                <div 
                                    className="w-32 h-24 sm:w-44 sm:h-36 lg:w-64 lg:h-52 overflow-hidden shadow-md sm:shadow-lg group-hover:shadow-2xl transition-all duration-700 bg-emerald-950"
                                    style={{
                                        borderRadius: '40% 60% 50% 50% / 50% 45% 55% 50%'
                                    }}
                                >
                                    <img 
                                        src={resolveAssetUrl(site_settings?.home_service_3_image, "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=800&auto=format&fit=crop")} 
                                        alt={site_settings?.home_service_3_title || "Club Amenities"} 
                                        className="w-full h-full min-w-full min-h-full object-cover object-center scale-[1.08] group-hover:scale-[1.18] transition-transform duration-700 ease-out"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=800&auto=format&fit=crop";
                                        }}
                                    />
                                </div>
                                <div className="space-y-1 sm:space-y-2 max-w-xs">
                                    <h3 className="text-sm sm:text-base lg:text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors" style={appleStyle}>
                                        {site_settings?.home_service_3_title || 'Club Amenities'}
                                    </h3>
                                    <p className="text-[11px] sm:text-xs lg:text-sm text-slate-600 leading-snug sm:leading-relaxed font-normal line-clamp-2">
                                        {site_settings?.home_service_3_desc || 'Premium facilities for comfort and relaxation experience.'}
                                    </p>
                                    <div className="pt-1">
                                        <Link 
                                            href={route('notices.public')} 
                                            className="inline-block text-[11px] sm:text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-4 decoration-2 decoration-emerald-500/60 hover:decoration-emerald-800 transition-all uppercase tracking-wider"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Event Facilities */}
                            <div className="group flex flex-col items-center text-center space-y-2.5 sm:space-y-4 lg:space-y-5 transition-all duration-300 hover:-translate-y-1">
                                <div 
                                    className="w-32 h-24 sm:w-44 sm:h-36 lg:w-64 lg:h-52 overflow-hidden shadow-md sm:shadow-lg group-hover:shadow-2xl transition-all duration-700 bg-emerald-950"
                                    style={{
                                        borderRadius: '65% 35% 45% 55% / 45% 55% 45% 55%'
                                    }}
                                >
                                    <img 
                                        src={resolveAssetUrl(site_settings?.home_service_4_image, "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=800&auto=format&fit=crop")} 
                                        alt={site_settings?.home_service_4_title || "Event Facilities"} 
                                        className="w-full h-full min-w-full min-h-full object-cover object-center scale-[1.08] group-hover:scale-[1.18] transition-transform duration-700 ease-out"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=800&auto=format&fit=crop";
                                        }}
                                    />
                                </div>
                                <div className="space-y-1 sm:space-y-2 max-w-xs">
                                    <h3 className="text-sm sm:text-base lg:text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors" style={appleStyle}>
                                        {site_settings?.home_service_4_title || 'Event Facilities'}
                                    </h3>
                                    <p className="text-[11px] sm:text-xs lg:text-sm text-slate-600 leading-snug sm:leading-relaxed font-normal line-clamp-2">
                                        {site_settings?.home_service_4_desc || 'Perfect venues for tournaments and special events hosting.'}
                                    </p>
                                    <div className="pt-1">
                                        <Link 
                                            href={route('notices.public')} 
                                            className="inline-block text-[11px] sm:text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-4 decoration-2 decoration-emerald-500/60 hover:decoration-emerald-800 transition-all uppercase tracking-wider"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </FadeInSection>

            {/* ── 5. ABOUT & HERITAGE SECTION (Fade In On Scroll) ── */}
            <FadeInSection>
                <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                            
                            {/* Left Visual Presentation with Layered Organic Cutouts */}
                            <div className="lg:col-span-5 relative flex items-center justify-center py-6 sm:py-8">
                                <div className="relative w-full max-w-[360px] sm:max-w-[420px]">
                                    {/* Main Tall Organic Oval / Arch Image */}
                                    <div 
                                        className="w-[280px] sm:w-[340px] h-[390px] sm:h-[460px] overflow-hidden shadow-2xl border-4 border-white bg-emerald-900 mx-auto"
                                        style={{
                                            borderRadius: '170px 170px 170px 170px'
                                        }}
                                    >
                                        <img 
                                            src={resolveAssetUrl(site_settings?.home_about_image_main, "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=1000&auto=format&fit=crop")} 
                                            alt={site_settings?.home_about_title || "Bogura Golf Club Members & Culture"} 
                                            className="w-full h-full min-w-full min-h-full object-cover object-center scale-[1.08] hover:scale-115 transition-transform duration-700 ease-out"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1000&auto=format&fit=crop';
                                            }}
                                        />
                                    </div>

                                    {/* Overlapping Bottom-Right Circular Inset */}
                                    <div 
                                        className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 w-40 h-40 sm:w-52 sm:h-52 rounded-full overflow-hidden shadow-2xl border-4 sm:border-8 border-white bg-emerald-950 z-10 transition-transform duration-500 hover:scale-105"
                                    >
                                        <img 
                                            src={resolveAssetUrl(site_settings?.home_about_image_inset, "https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=800&auto=format&fit=crop")} 
                                            alt="Golfing Facilities & Caddy Experience" 
                                            className="w-full h-full min-w-full min-h-full object-cover object-center scale-[1.08] hover:scale-115 transition-transform duration-700 ease-out"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop';
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Editorial Story (Centered on Mobile, Left on Desktop) */}
                            <div className="lg:col-span-7 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                    <span>{site_settings?.home_about_badge || 'About the Club'}</span>
                                </div>

                                <h3 
                                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight"
                                    style={appleStyle}
                                >
                                    {site_settings?.home_about_title || 'Premier 9-Hole Golfing & Facilities in Bogura'}
                                </h3>

                                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal text-center lg:text-left">
                                    {site_settings?.home_about_text_1 || 'Founded in 1998 and inaugurated in 2000, The Bogura Golf Club is a stunning 52.05-acre, 9-hole course located beautifully inside Bogura Cantonment, Majhira, providing well-maintained practice facilities and hospitality services for members, armed forces officers, and invited guests.'}
                                </p>

                                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal text-center lg:text-left">
                                    {site_settings?.home_about_text_2 || 'The 52.05-acre course features a pristine Par 36 layout, tree-lined fairways, manicured greens, and natural hazards. The club regularly organizes seasonal tournaments, corporate golf events, and structured training programs for junior and amateur players.'}
                                </p>

                                {/* Authentic Club Features Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 w-full text-left">
                                    <div className="p-4 rounded-2xl bg-[#f8faf6] border border-slate-200/80 hover:border-emerald-400/60 transition-all duration-300">
                                        <div className="flex items-center gap-2.5 mb-1.5">
                                            <Flag className="w-4 h-4 text-emerald-700 shrink-0" />
                                            <h5 className="font-semibold text-slate-900 text-sm">9-Hole Course</h5>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Par 36 layout across 52.05 acres with pristine greens, practice bunkers, and natural water hazards.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-[#f8faf6] border border-slate-200/80 hover:border-emerald-400/60 transition-all duration-300">
                                        <div className="flex items-center gap-2.5 mb-1.5">
                                            <Trophy className="w-4 h-4 text-emerald-700 shrink-0" />
                                            <h5 className="font-semibold text-slate-900 text-sm">Club Tournaments</h5>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Annual President Cup, Captain Cup, and sponsored corporate golf tournaments.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-[#f8faf6] border border-slate-200/80 hover:border-emerald-400/60 transition-all duration-300">
                                        <div className="flex items-center gap-2.5 mb-1.5">
                                            <Compass className="w-4 h-4 text-emerald-700 shrink-0" />
                                            <h5 className="font-semibold text-slate-900 text-sm">Practice Range</h5>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            Dedicated driving range bays and putting greens for daily training and warm-ups.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-[#f8faf6] border border-slate-200/80 hover:border-emerald-400/60 transition-all duration-300">
                                        <div className="flex items-center gap-2.5 mb-1.5">
                                            <Users className="w-4 h-4 text-emerald-700 shrink-0" />
                                            <h5 className="font-semibold text-slate-900 text-sm">Guest Rooms & Dining</h5>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            On-site guest room accommodations, clubhouse dining, and event hosting spaces.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </FadeInSection>

            {/* ── 6. UPCOMING TOURNAMENTS & EVENTS (Fade In On Scroll) ── */}
            <FadeInSection>
                <section className="py-16 md:py-24 bg-[#f8faf6] border-b border-slate-200/80">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-4 text-center md:text-left">
                            <div className="flex flex-col items-center md:items-start">
                                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider mb-2">
                                    <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Tournament Calendar</span>
                                </div>
                                <h3 
                                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
                                    style={appleStyle}
                                >
                                    Upcoming Tournaments & Matches
                                </h3>
                            </div>
                            <Link 
                                href={route('notices.public')} 
                                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 hover:text-emerald-700 uppercase tracking-wider group"
                            >
                                <span>Tournament Notices</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        {upcomingTournaments.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {displayedTournaments.map((tourn, tIdx) => {
                                        const startDate = tourn.start_date ? new Date(tourn.start_date) : null;
                                        return (
                                            <div 
                                                key={tourn.id || tIdx}
                                                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between space-y-4"
                                            >
                                                <div className="flex items-start gap-4">
                                                    {startDate && (
                                                        <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200">
                                                                {startDate.toLocaleDateString('en-US', { month: 'short' })}
                                                            </span>
                                                            <span className="text-lg font-bold leading-none text-amber-300">
                                                                {startDate.getDate()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900 text-base leading-snug">
                                                            {tourn.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
                                                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>{tourn.venue || tourn.location || 'Bogura Golf Course'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-xs text-slate-600 line-clamp-2 font-normal">
                                                    {tourn.description || 'Official club tournament open for registered members and invited players.'}
                                                </p>

                                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold uppercase">
                                                        {tourn.status || 'Upcoming'}
                                                    </span>
                                                    <Link 
                                                        href={route('notices.public')} 
                                                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-700 flex items-center gap-1 group"
                                                    >
                                                        <span>View Details</span>
                                                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* View More Tournaments Toggle Button */}
                                {upcomingTournaments.length > 3 && (
                                    <div className="text-center mt-10">
                                        <button
                                            onClick={() => setShowAllTournaments(!showAllTournaments)}
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-300 text-slate-800 hover:bg-emerald-800 hover:text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-all duration-300 hover:scale-105"
                                        >
                                            <span>{showAllTournaments ? 'Show Less Tournaments' : `View More Tournaments (${upcomingTournaments.length - 3} More)`}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAllTournaments ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-8 md:p-12 rounded-3xl bg-white border border-slate-200 text-center max-w-xl mx-auto space-y-4 shadow-sm">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-slate-900 text-lg" style={appleStyle}>
                                    Next Tournament Schedule Announcement Soon
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                                    The Executive Tournament Committee is finalizing the upcoming season schedule. Circulars and entry details will be published on the notice board.
                                </p>
                                <Link 
                                    href={route('notices.public')} 
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-800 text-white font-semibold text-xs uppercase tracking-wider shadow-sm hover:bg-emerald-700 transition-colors"
                                >
                                    <span>Check Notice Board</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </FadeInSection>

            {/* ── 7. LATEST NOTICES & CIRCULARS (Fade In On Scroll) ── */}
            <FadeInSection>
                <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-4 text-center md:text-left">
                            <div className="flex flex-col items-center md:items-start">
                                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider mb-2">
                                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                                    <span>Official Circulars</span>
                                </div>
                                <h3 
                                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
                                    style={appleStyle}
                                >
                                    Latest Notices & Announcements
                                </h3>
                            </div>
                            <Link 
                                href={route('notices.public')} 
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-800 hover:bg-emerald-800 hover:text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-105"
                            >
                                <span>View All Notices</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {notices.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {displayedNotices.map((notice, nIdx) => {
                                        const pubDate = notice.created_at ? new Date(notice.created_at) : null;
                                        return (
                                            <div 
                                                key={notice.id || nIdx}
                                                className="p-6 rounded-3xl bg-[#f8faf6] border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between space-y-4"
                                            >
                                                <div className="space-y-2.5">
                                                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                                                        <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                                                            <Calendar className="w-3 h-3" />
                                                            {pubDate ? pubDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Official Notice'}
                                                        </span>
                                                        {notice.file_path && (
                                                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold text-[10px] uppercase">
                                                                Attachment
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h4 className={`font-semibold text-slate-900 text-base leading-snug hover:text-emerald-800 transition-colors ${isBangla(notice.title) ? "font-bangla" : ""}`}>
                                                        {formatBanglaDigits(notice.title)}
                                                    </h4>

                                                    <p className={`text-xs text-slate-600 leading-relaxed line-clamp-3 font-normal ${isBangla(notice.content || notice.description) ? "font-bangla" : ""}`}>
                                                        {formatBanglaDigits(notice.content || notice.description || 'Please refer to the attached official circular for complete information and schedules.')}
                                                    </p>
                                                </div>

                                                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                                                    {notice.file_path ? (
                                                        <a 
                                                            href={resolveAssetUrl(notice.file_path)} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-700"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                            <span>Download Document</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 font-medium">Club Circular</span>
                                                    )}

                                                    <button 
                                                        onClick={() => setSelectedNotice(notice)}
                                                        className="text-xs font-semibold text-slate-700 hover:text-emerald-800 flex items-center gap-1"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        <span>Read</span>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* View More Notices Toggle Button */}
                                {notices.length > 3 && (
                                    <div className="text-center mt-10">
                                        <button
                                            onClick={() => setShowAllNotices(!showAllNotices)}
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-300 text-slate-800 hover:bg-emerald-800 hover:text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-all duration-300 hover:scale-105"
                                        >
                                            <span>{showAllNotices ? 'Show Less Notices' : `View More Notices (${notices.length - 3} More)`}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAllNotices ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-8 rounded-3xl bg-[#f8faf6] border border-slate-200 text-center max-w-md mx-auto">
                                <p className="text-xs sm:text-sm text-slate-500 font-medium">No active circulars at this moment.</p>
                            </div>
                        )}
                    </div>
                </section>
            </FadeInSection>

            {/* ── 8. PHOTO GALLERY PREVIEW (Fade In On Scroll) ── */}
            {galleryImages.length > 0 && (
                <FadeInSection>
                    <section className="py-8 sm:py-12 md:py-20 bg-[#f8faf6] border-b border-slate-200/80 overflow-hidden">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-6 sm:mb-8 gap-3 text-center sm:text-left">
                                <div className="flex flex-col items-center sm:items-start">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1.5">
                                        <span>Club Moments</span>
                                    </div>
                                    <h3 
                                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight"
                                        style={appleStyle}
                                    >
                                        Photo Gallery & Course Memories
                                    </h3>
                                </div>
                                
                                {/* Carousel Controls & Full Gallery CTA */}
                                <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
                                    <div className="flex items-center gap-1.5">
                                        <button 
                                            onClick={prevGallery}
                                            aria-label="Previous gallery photos"
                                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 hover:bg-emerald-800 hover:text-white text-slate-700 shadow-xs flex items-center justify-center transition-all active:scale-95"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={nextGallery}
                                            aria-label="Next gallery photos"
                                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 hover:bg-emerald-800 hover:text-white text-slate-700 shadow-xs flex items-center justify-center transition-all active:scale-95"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <Link 
                                        href={route('gallery.public')} 
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 rounded-full bg-emerald-800 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-xs hover:bg-emerald-700 transition-all active:scale-95"
                                    >
                                        <span>Open Full Gallery</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Gallery Slideshow Track with Touch Swipe */}
                            <div 
                                onTouchStart={handleGalleryTouchStart}
                                onTouchMove={handleGalleryTouchMove}
                                onTouchEnd={handleGalleryTouchEnd}
                                className="relative overflow-hidden py-1 touch-pan-y select-none cursor-grab active:cursor-grabbing"
                            >
                                <div 
                                    className="flex transition-transform duration-500 ease-out"
                                    style={{
                                        transform: `translateX(-${gallerySlideIndex * (100 / gallerySlidesVisible)}%)`
                                    }}
                                >
                                    {galleryImages.map((img, gIdx) => {
                                        const imgSrc = resolveAssetUrl(img.image_path, 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop');
                                        const categoryName = img.folder || img.category || 'General';
                                        
                                        return (
                                            <div 
                                                key={img.id || gIdx}
                                                className="w-full sm:w-1/2 lg:w-1/3 shrink-0 px-2 sm:px-3"
                                            >
                                                <div 
                                                    onClick={() => setSelectedGalleryImage(img)}
                                                    className="group relative h-64 sm:h-72 md:h-80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200/90 hover:border-emerald-500/70 cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-slate-900"
                                                >
                                                    {/* Photo */}
                                                    <img 
                                                        src={imgSrc} 
                                                        alt={img.title || 'Golf Club Photo'} 
                                                        className="w-full h-full min-w-full min-h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                                        onError={(e) => {
                                                             e.target.src = 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop';
                                                        }}
                                                    />

                                                    {/* Gradient Shade */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent transition-opacity duration-300" />

                                                    {/* Top Category Badge */}
                                                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
                                                        <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-white/15 shadow-sm">
                                                            {categoryName}
                                                        </span>
                                                    </div>

                                                    {/* Top-Right Quick Zoom Circle */}
                                                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                                                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/25 hover:bg-emerald-600 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-sm">
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Pagination Indicators */}
                            {galleryImages.length > gallerySlidesVisible && (
                                <div className="flex items-center justify-center gap-1.5 mt-5 sm:mt-6">
                                    {Array.from({ length: maxGalleryIndex + 1 }).map((_, pIdx) => (
                                        <button
                                            key={pIdx}
                                            onClick={() => setGallerySlideIndex(pIdx)}
                                            aria-label={`Go to slide group ${pIdx + 1}`}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                pIdx === gallerySlideIndex 
                                                    ? 'w-6 bg-emerald-700 shadow-xs' 
                                                    : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                                            }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </FadeInSection>
            )}

            {/* ── 9. EXECUTIVE COMMITTEE / LEADERSHIP (Fade In On Scroll) ── */}
            {executiveMembers.length > 0 && (
                <FadeInSection>
                    <section className="py-16 md:py-24 bg-white border-b border-slate-200/80">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-2xl mx-auto mb-14">
                                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider mb-3">
                                    <Users className="w-3.5 h-3.5 text-emerald-700" />
                                    <span>Club Governance</span>
                                </div>
                                <h3 
                                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
                                    style={appleStyle}
                                >
                                    Executive Committee Leadership
                                </h3>
                                <p className="text-sm text-slate-600 mt-2 font-normal">
                                    Guided by seasoned military leadership and dedicated civil members.
                                </p>
                            </div>

                            {/* Displays first 4 members */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {displayedMembers.map((member, mIdx) => {
                                    const memberImgSrc = member.image_path ? resolveAssetUrl(member.image_path) : null;

                                    return (
                                        <div 
                                            key={member.id || mIdx}
                                            className="p-6 rounded-3xl bg-[#f8faf6] border border-slate-200/80 text-center shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center justify-between"
                                        >
                                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-4 ring-4 ring-emerald-100 shadow-md bg-emerald-800 text-white shrink-0 transition-transform duration-500 hover:scale-105 flex items-center justify-center">
                                                {memberImgSrc ? (
                                                    <img 
                                                        src={memberImgSrc} 
                                                        alt={member.name} 
                                                        className="w-full h-full object-cover"
                                                        style={{
                                                            objectPosition: member.image_position || '50% 50%',
                                                            transform: `scale(${member.image_scale ? member.image_scale / 100 : 1})`,
                                                            transformOrigin: member.image_position || '50% 50%',
                                                        }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.parentElement.innerHTML = `<span class="text-2xl font-bold">${member.name ? member.name.charAt(0) : 'B'}</span>`;
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="text-2xl font-bold">
                                                        {member.name ? member.name.charAt(0) : 'B'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug">
                                                    {member.name}
                                                </h4>
                                                {member.designation && (
                                                    <span className="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[11px] uppercase tracking-wider">
                                                        {member.designation}
                                                    </span>
                                                )}
                                                {member.rank && (
                                                    <p className="text-xs text-slate-500 mt-1 font-medium">
                                                        {member.rank}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* View More Members Button - Opens in new tab */}
                            {executiveMembers.length > 4 && (
                                <div className="text-center mt-10">
                                    <a
                                        href="/executive-committee"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-300 text-slate-800 hover:bg-emerald-800 hover:text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-all duration-300 hover:scale-105"
                                    >
                                        <span>View More Members ({executiveMembers.length - 4} More)</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </section>
                </FadeInSection>
            )}

            {/* ── 10. PROFESSIONAL INSTRUCTORS BANNER SECTION (Fade In On Scroll) ── */}
            <FadeInSection>
                <section className="relative w-full bg-[#0c3823] text-white my-16 lg:my-24 overflow-visible">
                    {/* Decorative Vector Course Line Art */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 1200 400" fill="none" stroke="white" strokeWidth="1.5">
                            <path d="M 50 250 Q 150 180 250 220 T 450 150 T 650 280 T 850 120 T 1150 200" strokeDasharray="6 6" />
                            <path d="M 10 320 C 120 280 200 350 350 300 C 500 250 650 340 800 290 C 950 240 1100 320 1200 280" />
                            <circle cx="180" cy="220" r="8" stroke="currentColor" fill="none" />
                            <circle cx="450" cy="150" r="8" stroke="currentColor" fill="none" />
                            <circle cx="850" cy="120" r="8" stroke="currentColor" fill="none" />
                        </svg>
                    </div>

                    <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center min-h-[380px]">
                            
                            {/* Left: Professional Golfer Swing Cutout (Protruding Overlay Transparent PNG) */}
                            <div className="lg:col-span-5 flex justify-center lg:justify-end relative -mt-16 sm:-mt-24 lg:-mt-32 mb-0 z-20 pointer-events-none">
                                <div className="relative w-72 sm:w-88 lg:w-[440px] h-[400px] sm:h-[480px] lg:h-[540px]">
                                    <img 
                                        src="/images/golf-instructor-cutout.png" 
                                        alt="Professional Golf Instructor" 
                                        className="w-full h-full object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
                                    />
                                </div>
                            </div>

                            {/* Right: Editorial Content */}
                            <div className="lg:col-span-7 space-y-5 text-center lg:text-left py-10 lg:py-16">
                                <div className="inline-flex items-center gap-2 text-emerald-300 font-semibold text-xs uppercase tracking-widest">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    <span>INSTRUCTORS & COACHING</span>
                                </div>

                                <h2 
                                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight font-serif"
                                    style={{ fontFamily: 'Georgia, serif' }}
                                >
                                    We Have The Best Instructors To Teach You Golfing.
                                </h2>

                                <p className="text-sm sm:text-base text-emerald-100/85 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                                    Master your swing, short game, and mental strategy under the guidance of seasoned professionals. Customized one-on-one sessions, junior clinics, and group lessons tailored for every skill level.
                                </p>

                                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                    <Link 
                                        href="/contact-us" 
                                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#5c8a32] hover:bg-[#4d7529] text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-xl"
                                    >
                                        <span>CONTACT US</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                    <a 
                                        href="#services" 
                                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-all border border-white/20 backdrop-blur-md"
                                    >
                                        <span>VIEW PROGRAMS</span>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Bottom Right Floating Golf Ball on Grass Patch */}
                    <div className="absolute -bottom-6 right-6 lg:right-12 hidden md:block pointer-events-none z-20">
                        <div className="w-28 h-28 lg:w-32 lg:h-32 overflow-visible">
                            <img 
                                src="/images/golf-ball-turf.png" 
                                alt="Golf Ball" 
                                className="w-full h-full object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </section>
            </FadeInSection>

            {/* ── 11. CLUB FORMS & DOWNLOADS (Fade In On Scroll) ── */}
            {forms.length > 0 && (
                <FadeInSection>
                    <section className="py-16 md:py-24 bg-[#f8faf6] border-b border-slate-200/80">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-4 text-center md:text-left">
                                <div className="flex flex-col items-center md:items-start">
                                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider mb-2">
                                        <Download className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Official Resources</span>
                                    </div>
                                    <h3 
                                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight"
                                        style={appleStyle}
                                    >
                                        Club Forms & Membership Applications
                                    </h3>
                                </div>
                                {forms.length > 3 && (
                                    <Link 
                                        href={route('club-form.public')} 
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-800 hover:bg-emerald-800 hover:text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-105"
                                    >
                                        <span>View All Forms</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                {forms.slice(0, 6).map((form, fIdx) => (
                                    <div 
                                        key={form.id || fIdx}
                                        className={`p-5 rounded-2xl bg-white border border-slate-200 shadow-sm items-center justify-between gap-4 hover:border-emerald-500 hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${
                                            fIdx >= 3 ? 'hidden md:flex' : 'flex'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <h5 className="font-semibold text-slate-900 text-sm truncate">{form.title}</h5>
                                                <span className="text-[11px] text-slate-500 font-medium block">Document / Form</span>
                                            </div>
                                        </div>
                                        <a 
                                            href={resolveAssetUrl(form.file_path)} 
                                            download 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-lg bg-[#f8faf6] border border-slate-200 hover:bg-emerald-800 hover:text-white text-slate-700 shadow-xs transition-all hover:scale-110 shrink-0"
                                            aria-label={`Download ${form.title}`}
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>
                                    </div>
                                ))}
                            </div>

                            {forms.length > 3 && (
                                <div className="text-center mt-10">
                                    <Link 
                                        href={route('club-form.public')} 
                                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-300 text-slate-800 hover:bg-emerald-800 hover:text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-all duration-300 hover:scale-105 ${
                                            forms.length <= 6 ? 'md:hidden' : ''
                                        }`}
                                    >
                                        <span>View All Forms ({forms.length})</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                </FadeInSection>
            )}

            {/* ── 12. PARTNERS & AFFILIATES (Fade In On Scroll) ── */}
            {partners.length > 0 && (
                <FadeInSection>
                    <section className="py-14 bg-white border-b border-slate-200/80">
                        <div className="container mx-auto px-4 text-center">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-8">
                                Proud Corporate Partners & Sponsors
                            </span>
                            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
                                {partners.map((partner, pIdx) => {
                                    const logoSrc = resolveAssetUrl(partner.logo_path);
                                    return (
                                        <div 
                                            key={partner.id || pIdx} 
                                            className="grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100 hover:scale-105 flex items-center justify-center min-w-[100px] h-12"
                                        >
                                            {logoSrc ? (
                                                <img 
                                                    src={logoSrc} 
                                                    alt={partner.name || 'Partner'} 
                                                    className="max-h-10 md:max-h-12 object-contain"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = `<span class="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs uppercase tracking-wide">${partner.name || 'Partner'}</span>`;
                                                    }}
                                                />
                                            ) : (
                                                <span className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs uppercase tracking-wide">
                                                    {partner.name || 'Partner'}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </FadeInSection>
            )}

            {/* ── 13. LOCATION & MAP (Fade In On Scroll) ── */}
            <FadeInSection>
                <section className="py-16 md:py-20 bg-[#f8faf6]">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                            <div className="lg:col-span-5 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
                                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Club Location</span>
                                </div>
                                <h3 
                                    className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
                                    style={appleStyle}
                                >
                                    Plan Your Visit to Bogura Golf Club
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed font-normal text-center lg:text-left">
                                    Located conveniently inside Bogura Cantonment, Majhira, providing a safe, serene, and prestigious golfing environment.
                                </p>

                                <div className="space-y-4 text-sm text-slate-700 font-medium w-full text-left">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-900">Address:</p>
                                            <p className="text-slate-600 font-normal">{site_settings?.address || 'Bogura Cantonment, Majhira, Bogura, Bangladesh'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-900">Phone Contacts:</p>
                                            <p className="text-slate-600 font-normal">{site_settings?.contact_phone || '+88 02 9835105 / Army: 8802'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-900">Email:</p>
                                            <p className="text-slate-600 font-normal">{site_settings?.contact_email || 'info@boguragolfclub.com'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold text-slate-900">Opening Hours:</p>
                                            <p className="text-slate-600 font-normal">Daily: 06:00 AM – 06:30 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Interactive Google Map Container with Prominent Location Pin */}
                            <div className="lg:col-span-7 h-[380px] md:h-[430px] rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-200 bg-slate-100 relative group">
                                {/* Floating Drop-Pin Club Highlight Badge */}
                                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-200/90 flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-md shrink-0">
                                        <MapPin className="w-4 h-4 text-amber-300 animate-bounce" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-900 text-xs leading-none">Bogura Golf Club</h5>
                                        <span className="text-[10px] text-emerald-800 font-semibold mt-0.5 block">📍 Majhira Cantonment</span>
                                    </div>
                                </div>

                                <iframe
                                    title="Bogura Golf Club Location"
                                    src={mapEmbedSrc}
                                    className="w-full h-full border-0 min-h-[380px]"
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                                {/* Direct Google Maps Link Button */}
                                <a 
                                    href="https://maps.google.com/?q=Bogura+Golf+Club,+Majhira+Cantonment,+Bogura" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="absolute bottom-4 right-4 z-10 px-4 py-2.5 rounded-full bg-white/95 hover:bg-emerald-800 hover:text-white text-slate-800 shadow-xl border border-slate-200 backdrop-blur-md text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105"
                                >
                                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Open in Google Maps</span>
                                    <ExternalLink className="w-3 h-3 ml-0.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </FadeInSection>

            {/* ── NOTICE MODAL ── */}
            {selectedNotice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 border border-slate-100">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                                Official Notice
                            </span>
                            <button 
                                onClick={() => setSelectedNotice(null)}
                                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <h3 
                            className={`text-lg sm:text-xl font-bold text-slate-900 ${isBangla(selectedNotice.title) ? "font-bangla" : ""}`} 
                            style={isBangla(selectedNotice.title) ? { fontFamily: "'Tiro Bangla', 'Hind Siliguri', 'Noto Sans Bengali', sans-serif" } : appleStyle}
                        >
                            {formatBanglaDigits(selectedNotice.title)}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                            Published: {selectedNotice.created_at ? new Date(selectedNotice.created_at).toLocaleDateString('en-US', { dateStyle: 'long' }) : ''}
                        </p>
                        <div className={`text-sm text-slate-700 leading-relaxed whitespace-pre-line py-2 max-h-60 overflow-y-auto font-normal ${isBangla(selectedNotice.content || selectedNotice.description) ? "font-bangla text-[15px]" : ""}`}>
                            {formatBanglaDigits(selectedNotice.content || selectedNotice.description)}
                        </div>
                        {selectedNotice.file_path && (
                            <a 
                                href={resolveAssetUrl(selectedNotice.file_path)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full py-3 rounded-xl bg-emerald-800 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download Official Attachment</span>
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* ── GALLERY LIGHTBOX MODAL ── */}
            {selectedGalleryImage && (
                <div 
                    onClick={() => setSelectedGalleryImage(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer animate-in fade-in duration-200"
                >
                    <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center">
                        <button 
                            onClick={() => setSelectedGalleryImage(null)}
                            className="absolute -top-12 right-0 text-white hover:text-amber-400 transition-colors p-2"
                            aria-label="Close Preview"
                        >
                            <X className="w-7 h-7" />
                        </button>
                        <img 
                            src={resolveAssetUrl(selectedGalleryImage.image_path, 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop')} 
                            alt={selectedGalleryImage.title || 'Preview'} 
                            className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/20"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop';
                            }}
                        />
                        {selectedGalleryImage.title && (
                            <p className="text-white text-sm font-semibold mt-4 text-center">
                                {selectedGalleryImage.title}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* ── MOBILE FLOATING BOTTOM NAV & DRAWER ── */}
            <MobileBottomNav isSidebarOpen={isMobileMenuOpen} setIsSidebarOpen={setIsMobileMenuOpen} />

            {/* ── FOOTER ── */}
            <Footer dark={true} />
        </div>
    );
}
