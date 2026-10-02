import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Button } from '@/components/ui/button';
import MiniCalendar from '@/Components/MiniCalendar';
import Footer from '@/Components/Footer';
import MobileBottomNav from '@/Components/MobileBottomNav';
import {
    Menu, X, ArrowUpRight, Bell, Calendar, Newspaper,
    FileText, Shirt, ZoomIn, ZoomOut, RotateCcw, Maximize2,
    Flag, Trophy, MoveHorizontal, Users, MapPin, Phone, Mail, Sparkles, ChevronRight, ChevronDown, Compass, Shield, Sliders, Check, Handshake, Globe, Activity, Eye, BarChart3, Move, Save, Image as ImageIcon, Type
} from 'lucide-react';

// ── CURATED GOOGLE FONTS FOR NAV & BODY ──────────────────────────────
const CURATED_FONTS = [
    {
        name: 'Outfit',
        category: 'sans',
        badge: 'Modern Bold',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Popular', 'Default Navbar']
    },
    {
        name: 'Plus Jakarta Sans',
        category: 'sans',
        badge: 'Clean UI',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Popular', 'Default Body']
    },
    {
        name: 'Inter',
        category: 'sans',
        badge: 'Universal Tech',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Crisp', 'Modern']
    },
    {
        name: 'Cinzel',
        category: 'serif',
        badge: 'Royal Heritage',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Luxury', 'Elite Club']
    },
    {
        name: 'Playfair Display',
        category: 'serif',
        badge: 'Championship Serif',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Editorial', 'Prestige']
    },
    {
        name: 'Montserrat',
        category: 'sans',
        badge: 'Architectural',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Grand', 'Uppercase']
    },
    {
        name: 'Poppins',
        category: 'sans',
        badge: 'Soft Geometric',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Approachable', 'Friendly']
    },
    {
        name: 'Lora',
        category: 'serif',
        badge: 'Literary & Warm',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Warm', 'Editorial']
    },
    {
        name: 'Cormorant Garamond',
        category: 'serif',
        badge: 'Traditional Royal',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Classic', 'Nobility']
    },
    {
        name: 'DM Sans',
        category: 'sans',
        badge: 'Minimalist Clean',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Sleek', 'Contemporary']
    },
    {
        name: 'Bebas Neue',
        category: 'display',
        badge: 'Condensed Headline',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Impact', 'All Caps']
    },
    {
        name: 'Anton',
        category: 'display',
        badge: 'Heavy Display',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Heavyweight', 'Bold']
    },
    {
        name: 'Cinzel Decorative',
        category: 'display',
        badge: 'Majestic Flourish',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Flourish', 'Historic']
    },
    {
        name: 'Raleway',
        category: 'sans',
        badge: 'Airy Sophisticated',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Refined', 'Light Tracking']
    },
    {
        name: 'Merriweather',
        category: 'serif',
        badge: 'Stately Book',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['High Readability', 'Book']
    },
    {
        name: 'Syne',
        category: 'display',
        badge: 'Avant-Garde',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Artistic', 'Trendy']
    },
    {
        name: 'Space Grotesk',
        category: 'sans',
        badge: 'Modern Precision',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Tech', 'Modern']
    },
    {
        name: 'Nunito Sans',
        category: 'sans',
        badge: 'Balanced Soft',
        navbarPreview: 'BOGURA GOLF CLUB',
        bodyPreview: 'Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.',
        tags: ['Soft', 'Reading']
    }
];


// ── CSS RIPPED PAPER PRESETS ──────────────────────────────────────────
const CSS_RIPPED_MODES = {
    css_turbulence: {
        name: 'CSS SVG Fractal Noise (feTurbulence)',
        description: 'Pure CSS fractal distortion producing authentic torn paper fibers',
        type: 'filter'
    },
    css_polygon: {
        name: 'CSS Clip-Path Polygon Shred',
        description: 'CSS geometric polygonal ripped paper jagged teeth',
        type: 'clip'
    },
    css_hybrid: {
        name: 'CSS Hybrid Deckled Layer',
        description: 'Combined CSS filter displacement + 3D paper drop shadow',
        type: 'hybrid'
    }
};

// CSS Polygon Shred Generator
const generateCssPolygonPath = (seed = 1) => {
    const points = [];
    const num = 60;
    for (let i = 0; i <= num; i++) {
        const x = Number(((i / num) * 100).toFixed(2));
        let baseY = 30;
        if (seed === 1) baseY = 20 + (i / num) * 40;
        else if (seed === 2) baseY = 50 - Math.sin((i / num) * Math.PI) * 30;
        else if (seed === 3) baseY = 60 - (i / num) * 35;
        else baseY = 30 + Math.sin((i / num) * Math.PI * 2) * 20;

        const jitter = (Math.sin(i * 3.7 + seed * 5) * 8) + (Math.cos(i * 7.1) * 5);
        const y = Math.max(5, Math.min(95, Math.round(baseY + jitter)));
        points.push(`${x}% ${y}%`);
    }
    return `polygon(0% 0%, 100% 0%, ${points.reverse().join(', ')}, 0% 100%)`;
};

// ── TYPEWRITER HERO TITLE COMPONENT ──────────────────────────────────
function TypewriterHeroTitle({ baseTitle = 'Welcome To Bogura Golf Club' }) {
    const words = useMemo(() => {
        const list = [
            baseTitle || 'Welcome To Bogura Golf Club',
            'A Premier 9-Hole Sanctuary',
            'Where Nature, Sport & Elegance Meet',
            'Pristine Fairways in Bogura Cantonment',
            'Experience Championship Golfing',
            'Home of Prestigious Tournaments'
        ];
        return Array.from(new Set(list.filter(Boolean)));
    }, [baseTitle]);

    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [blink, setBlink] = useState(true);

    // Blinking cursor indicator
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlink(prev => !prev);
        }, 500);
        return () => clearInterval(blinkInterval);
    }, []);

    // Typewriter typing and backspacing loop
    useEffect(() => {
        if (index >= words.length) {
            setIndex(0);
            return;
        }

        const currentWord = words[index];

        if (subIndex === currentWord.length + 1 && !reverse) {
            const pauseTimeout = setTimeout(() => {
                setReverse(true);
            }, 2400); // Wait 2.4s to let reader absorb full title
            return () => clearTimeout(pauseTimeout);
        }

        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex(prev => (prev + 1) % words.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex(prev => prev + (reverse ? -1 : 1));
        }, reverse ? 35 : 75);

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words]);

    const currentText = words[index]?.substring(0, subIndex) || '';

    return (
        <span className="inline-block relative font-serif">
            <span>{currentText}</span>
            <span
                className={`inline-block w-[3px] sm:w-[4px] md:w-[5px] h-[0.85em] bg-yellow-400 align-middle ml-2 sm:ml-3 rounded-xs shadow-[0_0_12px_rgba(250,204,21,0.95)] transition-opacity duration-100 ${
                    blink ? 'opacity-100' : 'opacity-15'
                }`}
            />
        </span>
    );
}

export default function ImmersiveView({
    site_settings,
    menus,
    heroSlides = [],
    galleryImages = [],
    notices = [],
    forms = [],
    executiveMembers = [],
    partners = [],
    upcomingTournaments = [],
    quickLinks = [],
    auth
}) {
    const pageProps = usePage()?.props || {};
    const pageAuth = auth || pageProps.auth;
    const isSuperAdmin = Boolean(pageAuth?.user?.role === 'super_admin' || pageAuth?.user?.is_superadmin === true || pageAuth?.user?.is_superadmin === 1);

    const topMenu = useMemo(() => {
        if (Array.isArray(menus?.top_bar?.items)) return menus.top_bar.items;
        if (Array.isArray(menus?.top_bar)) return menus.top_bar;
        return [];
    }, [menus]);

    const defaultNavItems = useMemo(() => [
        { title: 'HOME', url: '/' },
        {
            title: 'ABOUT US',
            url: '#',
            children: [
                { title: 'Executive Committee', url: '/executive-committee' },
                { title: 'Audit & Finance Committee', url: '/audit-finance-committee' },
                { title: 'Entertainment & Cultural Committee', url: '/entertainment-cultural-committee' },
                { title: 'Grounds & Rules Committee', url: '/grounds-rules-committee' }
            ]
        },
        { title: 'NOTICE BOARD', url: '/notice-board' },
        {
            title: 'MEMBERSHIP',
            url: '#',
            children: [
                { title: 'Applying Procedure', url: '/membership-applying-procedure' },
                { title: 'Fees & Charges', url: '/fees' }
            ]
        },
        {
            title: 'TOURNAMENT & EVENTS',
            url: '#',
            children: [
                { title: 'Live Tournaments', url: '/tournament' },
                { title: 'Upcoming Tournaments', url: '/tournaments_schedule_plan' },
                { title: 'Tournament Results', url: '/tournament-result' }
            ]
        },
        { title: 'GOLF NEWS', url: '/news' },
        { title: 'MEMBERSHIP APPLICATION', url: '/club-form' },
        { title: 'CONTACT US', url: '/contact-us' }
    ], []);

    const displayMenu = topMenu.length > 0 ? topMenu : defaultNavItems;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDressCodeModalOpen, setIsDressCodeModalOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [currentHeroIdx, setCurrentHeroIdx] = useState(0);
    const [activeGalleryIdx, setActiveGalleryIdx] = useState(2);

    const slides = useMemo(() => {
        if (Array.isArray(heroSlides) && heroSlides.length > 0) return heroSlides;
        return [{
            id: 1,
            image_path: '/storage/images/hero-1.jpg',
            image_position: '50% 50%',
            title: 'Welcome to Bogura Golf Club',
            subtitle: 'Established 1990 inside Bogura Cantonment — A Premier 9-Hole Sanctuary'
        }];
    }, [heroSlides]);
    const currentSlide = slides[currentHeroIdx] || slides[0] || {};

    // ── CSS RIPPED PAPER & SECTION BACKGROUND EDIT CONTROLS STATE ──
    const [activeEditorTab, setActiveEditorTab] = useState('hero_align'); // 'hero_align' | 'cuts' | 'backgrounds' | 'fonts'
    const [activeSectionTab, setActiveSectionTab] = useState('all');
    const [sectionConfigs, setSectionConfigs] = useState(() => {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('bgc_section_configs') : null;
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { }
        }
        return {
            all: { mode: 'css_turbulence', freq: 0.035, scale: 25, height: 90, shadow: true, translateX: 0, rotate: 0, bgType: 'color', bgImage: '/storage/images/hero-1.jpg', bgOpacity: 0.85, bgBlur: 0, bgColor: '#121908', gradientOverlay: 'dark_forest' },
            hero: { mode: 'css_turbulence', freq: 0.035, scale: 25, height: 90, shadow: true, translateX: 0, rotate: 0, bgType: 'color', bgImage: '/storage/images/hero-1.jpg', bgOpacity: 0.85, bgBlur: 0, bgColor: '#0f172a', gradientOverlay: 'vignette' },
            gallery: { mode: 'css_turbulence', freq: 0.035, scale: 25, height: 90, shadow: true, translateX: 0, rotate: 0, bgType: 'color', bgImage: '/storage/images/hero-1.jpg', bgOpacity: 0.85, bgBlur: 0, bgColor: '#121908', gradientOverlay: 'dark_forest' },
            footer: { mode: 'css_turbulence', freq: 0.035, scale: 25, height: 90, shadow: true, translateX: 0, rotate: 0, bgType: 'color', bgImage: '/storage/images/hero-1.jpg', bgOpacity: 0.85, bgBlur: 0, bgColor: '#121908', gradientOverlay: 'dark_forest' }
        };
    });

    const currentConfig = sectionConfigs[activeSectionTab] || sectionConfigs.all;

    const updateSectionConfig = (field, val) => {
        setSectionConfigs(prev => {
            const updated = JSON.parse(JSON.stringify(prev));
            if (activeSectionTab === 'all') {
                Object.keys(updated).forEach(k => {
                    updated[k] = { ...updated[k], [field]: val };
                });
            } else {
                updated[activeSectionTab] = {
                    ...(updated[activeSectionTab] || updated.all || {}),
                    [field]: val
                };
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem('bgc_section_configs', JSON.stringify(updated));
            }
            return updated;
        });
    };

    const handleSectionTabSelect = (tabId) => {
        setActiveSectionTab(tabId);
        if (typeof window !== 'undefined') {
            if (tabId === 'hero') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (tabId === 'gallery') {
                const el = document.getElementById('photo-gallery-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else if (tabId === 'footer') {
                const el = document.getElementById('footer-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    const [cssMode, setCssMode] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('bgc_css_mode') || 'css_turbulence' : 'css_turbulence'));
    const [cssNoiseFreq, setCssNoiseFreq] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('bgc_css_freq')) || 0.035 : 0.035));
    const [cssScale, setCssScale] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('bgc_css_scale')) || 25 : 25));
    const [cutHeight, setCutHeight] = useState(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('bgc_cut_height')) || 90 : 90));
    const [isCutEditorOpen, setIsCutEditorOpen] = useState(false);
    const [showPaperShadow, setShowPaperShadow] = useState(true);

    // Frontpage Typography & Font Selection State
    const [navbarFont, setNavbarFont] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('bgc_navbar_font');
            if (saved) return saved;
        }
        return site_settings?.frontpage_navbar_font || 'Anton';
    });

    const [bodyFont, setBodyFont] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('bgc_body_font');
            if (saved) return saved;
        }
        return site_settings?.frontpage_body_font || 'Plus Jakarta Sans';
    });

    const [headingFont, setHeadingFont] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('bgc_heading_font');
            if (saved) return saved;
        }
        return site_settings?.frontpage_heading_font || 'Outfit';
    });

    const [activeFontTarget, setActiveFontTarget] = useState('navbar'); // 'navbar' | 'body' | 'headings'
    const [activeFontCategory, setActiveFontCategory] = useState('all'); // 'all' | 'sans' | 'serif' | 'display'
    const [isSavingFonts, setIsSavingFonts] = useState(false);
    const [saveFontsSuccessMsg, setSaveFontsSuccessMsg] = useState(null);

    const handleNavbarFontChange = (fontName) => {
        setNavbarFont(fontName);
        if (typeof window !== 'undefined') {
            localStorage.setItem('bgc_navbar_font', fontName);
        }
    };

    const handleBodyFontChange = (fontName) => {
        setBodyFont(fontName);
        if (typeof window !== 'undefined') {
            localStorage.setItem('bgc_body_font', fontName);
        }
    };

    const handleHeadingFontChange = (fontName) => {
        setHeadingFont(fontName);
        if (typeof window !== 'undefined') {
            localStorage.setItem('bgc_heading_font', fontName);
        }
    };

    const handleSaveFontsToDb = () => {
        setIsSavingFonts(true);
        router.post(route('settings.update'), {
            frontpage_navbar_font: navbarFont,
            frontpage_body_font: bodyFont,
            frontpage_heading_font: headingFont,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSavingFonts(false);
                setSaveFontsSuccessMsg('Fonts permanently saved to database!');
                setTimeout(() => setSaveFontsSuccessMsg(null), 4000);
            },
            onError: () => {
                setIsSavingFonts(false);
                setSaveFontsSuccessMsg('Saved in local browser session!');
                setTimeout(() => setSaveFontsSuccessMsg(null), 4000);
            }
        });
    };

    const handleResetFonts = () => {
        handleNavbarFontChange('Anton');
        handleBodyFontChange('Plus Jakarta Sans');
        handleHeadingFontChange('Outfit');
    };

    // Hero Background Image Alignment & Scaling for Sys Admin
    const [heroImgPosX, setHeroImgPosX] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('bgc_hero_pos_x');
            if (saved !== null) return Number(saved);
        }
        return 50;
    });
    const [heroImgPosY, setHeroImgPosY] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('bgc_hero_pos_y');
            if (saved !== null) return Number(saved);
        }
        return 50;
    });
    const [heroImgScale, setHeroImgScale] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('bgc_hero_scale');
            if (saved !== null) return Number(saved);
        }
        return 105;
    });
    const [isSavingHeroPos, setIsSavingHeroPos] = useState(false);
    const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);

    useEffect(() => {
        if (currentSlide?.image_position && typeof window !== 'undefined') {
            if (localStorage.getItem('bgc_hero_pos_x') === null || localStorage.getItem('bgc_hero_pos_y') === null) {
                const parts = currentSlide.image_position.split(' ');
                if (parts[0]) setHeroImgPosX(parseInt(parts[0]) || 50);
                if (parts[1]) setHeroImgPosY(parseInt(parts[1]) || 50);
            }
        }
    }, [currentSlide]);

    const handleHeroPosXChange = (val) => {
        const num = Number(val);
        setHeroImgPosX(num);
        if (typeof window !== 'undefined') localStorage.setItem('bgc_hero_pos_x', num);
    };

    const handleHeroPosYChange = (val) => {
        const num = Number(val);
        setHeroImgPosY(num);
        if (typeof window !== 'undefined') localStorage.setItem('bgc_hero_pos_y', num);
    };

    const handleHeroScaleChange = (val) => {
        const num = Number(val);
        setHeroImgScale(num);
        if (typeof window !== 'undefined') localStorage.setItem('bgc_hero_scale', num);
    };

    const handleSaveHeroPosToDb = () => {
        if (!currentSlide?.id) {
            setSaveSuccessMsg('Applied & saved in browser session!');
            setTimeout(() => setSaveSuccessMsg(null), 3500);
            return;
        }
        setIsSavingHeroPos(true);
        router.put(route('hero-slides.position', currentSlide.id), {
            image_position: `${heroImgPosX}% ${heroImgPosY}%`,
            image_position_mobile: `${heroImgPosX}% ${heroImgPosY}%`
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSavingHeroPos(false);
                setSaveSuccessMsg('Position permanently saved to database!');
                setTimeout(() => setSaveSuccessMsg(null), 4000);
            },
            onError: () => {
                setIsSavingHeroPos(false);
                setSaveSuccessMsg('Saved in browser session!');
                setTimeout(() => setSaveSuccessMsg(null), 4000);
            }
        });
    };

    const handleCssModeChange = (key) => {
        updateSectionConfig('mode', key);
        setCssMode(key);
    };

    const handleFreqChange = (val) => {
        updateSectionConfig('freq', val);
        setCssNoiseFreq(val);
    };

    const handleScaleChange = (val) => {
        updateSectionConfig('scale', val);
        setCssScale(val);
    };

    const handleHeightChange = (val) => {
        updateSectionConfig('height', val);
        setCutHeight(val);
    };

    // Pre-calculate CSS polygons
    const poly1 = useMemo(() => generateCssPolygonPath(1), []);
    const poly2 = useMemo(() => generateCssPolygonPath(2), []);
    const poly3 = useMemo(() => generateCssPolygonPath(3), []);
    const poly4 = useMemo(() => generateCssPolygonPath(4), []);



    // Helper to get extended SVG path without boundary or flat edge artifacts
    const getExtendedRippedPath = (seed) => {
        switch (seed) {
            case 1:
                return "M -150,-100 L -150,400 L 1350,400 L 1350,35 C 1180,85 1020,15 860,65 C 700,105 540,25 380,75 C 220,115 60,35 -150,75 Z";
            case 2:
                return "M -150,-100 L -150,400 L 1350,400 L 1350,70 C 1190,25 1030,85 870,35 C 710,80 550,20 390,70 C 230,110 70,30 -150,60 Z";
            case 3:
                return "M -150,-100 L -150,400 L 1350,400 L 1350,45 C 1170,95 1010,35 830,75 C 670,25 490,90 330,40 C 170,85 10,25 -150,70 Z";
            default:
                return "M -150,-100 L -150,400 L 1350,400 L 1350,60 C 1160,20 990,80 810,30 C 640,85 470,25 310,75 C 150,30 -10,80 -150,50 Z";
        }
    };

    useEffect(() => {
        const handleOpenEditor = () => setIsCutEditorOpen(true);
        window.addEventListener('open-cut-editor', handleOpenEditor);
        return () => window.removeEventListener('open-cut-editor', handleOpenEditor);
    }, []);

    // Marquee logic with native smooth touch/swipe + auto-scroll
    const marqueeContainerRef = useRef(null);
    const isUserInteractingRef = useRef(false);

    useEffect(() => {
        const container = marqueeContainerRef.current;
        if (!container) return;

        let animationFrameId;
        let resumeTimeout;

        const autoScroll = () => {
            if (!isUserInteractingRef.current && container) {
                if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
                    container.scrollLeft = 0;
                } else {
                    container.scrollLeft += 0.75;
                }
            }
            animationFrameId = requestAnimationFrame(autoScroll);
        };

        animationFrameId = requestAnimationFrame(autoScroll);

        const handleInteractionStart = () => {
            isUserInteractingRef.current = true;
            if (resumeTimeout) clearTimeout(resumeTimeout);
        };

        const handleInteractionEnd = () => {
            resumeTimeout = setTimeout(() => {
                isUserInteractingRef.current = false;
            }, 1200);
        };

        container.addEventListener('touchstart', handleInteractionStart, { passive: true });
        container.addEventListener('touchend', handleInteractionEnd, { passive: true });
        container.addEventListener('mouseenter', handleInteractionStart);
        container.addEventListener('mouseleave', handleInteractionEnd);
        container.addEventListener('mousedown', handleInteractionStart);
        container.addEventListener('mouseup', handleInteractionEnd);

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (resumeTimeout) clearTimeout(resumeTimeout);
            if (container) {
                container.removeEventListener('touchstart', handleInteractionStart);
                container.removeEventListener('touchend', handleInteractionEnd);
                container.removeEventListener('mouseenter', handleInteractionStart);
                container.removeEventListener('mouseleave', handleInteractionEnd);
                container.removeEventListener('mousedown', handleInteractionStart);
                container.removeEventListener('mouseup', handleInteractionEnd);
            }
        };
    }, [notices]);

    // Helper to render CSS Ripped Edge Section Divider with section-specific or global settings
    const renderCssRippedDivider = (bgColorClass, polyPath, seed = 1, sectionKey = 'hero') => {
        const config = sectionConfigs[sectionKey] || sectionConfigs.all || {
            mode: cssMode,
            freq: cssNoiseFreq,
            scale: cssScale,
            height: cutHeight,
            shadow: showPaperShadow
        };

        const filterStyle = config.shadow !== false
            ? 'url(#css-ripped-paper-filter) drop-shadow(0px 5px 6px rgba(0,0,0,0.18))'
            : 'url(#css-ripped-paper-filter)';

        return (
            <div
                className="relative w-full overflow-hidden leading-none z-20 pointer-events-none -mb-1"
                style={{ height: `${config.height || cutHeight}px` }}
            >
                {config.mode === 'css_polygon' ? (
                    <div
                        className={`w-full h-[calc(100%+4px)] ${bgColorClass}`}
                        style={{ clipPath: polyPath }}
                    />
                ) : (
                    <svg
                        className={`relative block w-[106%] -ml-[3%] h-[380px] overflow-visible ${bgColorClass}`}
                        viewBox="0 0 1200 350"
                        preserveAspectRatio="xMidYMin slice"
                        fill="currentColor"
                        style={{ filter: filterStyle }}
                    >
                        <path d={getExtendedRippedPath(seed)} />
                    </svg>
                )}
            </div>
        );
    };

    return (
        <div
            className="bg-[#FAF8F5] text-slate-800 font-sans min-h-screen relative overflow-x-hidden selection:bg-emerald-800 selection:text-yellow-300"
            style={{
                fontFamily: `"${bodyFont}", var(--font-sans), sans-serif`,
                '--navbar-font': `"${navbarFont}", sans-serif`,
                '--body-font': `"${bodyFont}", sans-serif`,
                '--heading-font': `"${headingFont}", sans-serif`,
            }}
        >

            {/* ── INLINE CSS SVG FILTER FOR RIPPED PAPER TURBULENCE DISPLACEMENT ── */}
            <svg className="hidden">
                <defs>
                    <filter id="css-ripped-paper-filter" x="-25%" y="-25%" width="150%" height="150%">
                        <feTurbulence type="fractalNoise" baseFrequency={cssNoiseFreq} numOctaves="4" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale={cssScale} xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>

            {/* Floating CSS Ripped Paper & Background Options Trigger Button & Modal (Super Admin Only) */}
            {isSuperAdmin && (
                <>
                    <button
                        type="button"
                        onClick={() => setIsCutEditorOpen(true)}
                        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[180] w-11 h-11 rounded-full bg-slate-950/95 hover:bg-slate-900 text-yellow-400 flex items-center justify-center shadow-2xl border-2 border-yellow-400/80 backdrop-blur-xl transition-all hover:scale-110 active:scale-95 group"
                        title="Customize CSS Ripped Paper & Section Background Effects (Super Admin)"
                    >
                        <Sliders className="w-5 h-5 text-yellow-400 animate-pulse" />
                    </button>

                    {/* CUT EDITOR MODAL / DRAWER */}
                    {isCutEditorOpen && (
                        <div
                            className="fixed inset-0 z-[180] bg-black/35 flex items-end sm:items-center justify-end sm:justify-center p-3 sm:p-6 pointer-events-auto transition-opacity"
                            onClick={() => setIsCutEditorOpen(false)}
                        >
                            <div
                                className="bg-white/95 backdrop-blur-md rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200/90 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                                            {activeEditorTab === 'fonts' ? (
                                                <Type className="w-5 h-5" />
                                            ) : activeEditorTab === 'hero_align' ? (
                                                <Move className="w-5 h-5" />
                                            ) : activeEditorTab === 'backgrounds' ? (
                                                <Sparkles className="w-5 h-5" />
                                            ) : (
                                                <Sliders className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-lg text-slate-900 font-['Outfit']">
                                                {activeEditorTab === 'fonts'
                                                    ? 'Frontpage Typography & Fonts'
                                                    : activeEditorTab === 'hero_align'
                                                    ? 'Hero Alignment & Scaling'
                                                    : activeEditorTab === 'backgrounds'
                                                    ? 'Section Background Styling'
                                                    : 'CSS Ripped Paper Options'}
                                            </h3>
                                            <p className="text-xs font-medium text-slate-400">
                                                {activeEditorTab === 'fonts'
                                                    ? 'Select & live preview custom Navbar and Body fonts'
                                                    : activeEditorTab === 'hero_align'
                                                    ? 'Position and scale hero background image'
                                                    : activeEditorTab === 'backgrounds'
                                                    ? 'Atmospheric colors, gradients and custom images'
                                                    : 'Customize pure CSS turbulence & displacement'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsCutEditorOpen(false)}
                                        className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Primary Category Selector Tabs */}
                                <div className="grid grid-cols-4 gap-1 mb-5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setActiveEditorTab('hero_align')}
                                        className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${activeEditorTab === 'hero_align'
                                                ? 'bg-white text-emerald-900 shadow-sm border border-slate-200/80'
                                                : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        <Move className="w-3.5 h-3.5 text-emerald-700" />
                                        <span>🌄 Hero</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveEditorTab('cuts')}
                                        className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${activeEditorTab === 'cuts'
                                                ? 'bg-white text-emerald-900 shadow-sm border border-slate-200/80'
                                                : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                                        <span>✂️ Cuts</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveEditorTab('backgrounds')}
                                        className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${activeEditorTab === 'backgrounds'
                                                ? 'bg-white text-emerald-900 shadow-sm border border-slate-200/80'
                                                : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                                        <span>🖼️ BG</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveEditorTab('fonts')}
                                        className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${activeEditorTab === 'fonts'
                                                ? 'bg-white text-emerald-900 shadow-sm border border-slate-200/80'
                                                : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        <Type className="w-3.5 h-3.5 text-indigo-600" />
                                        <span>🔤 Fonts</span>
                                    </button>
                                </div>

                                {/* Section Selection Tabs (Shown for Cuts and Backgrounds) */}
                                {(activeEditorTab === 'cuts' || activeEditorTab === 'backgrounds') && (
                                    <div className="space-y-2 mb-5">
                                        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                                            Target Section / Separator:
                                        </label>
                                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                                            {[
                                                { id: 'all', label: '🌐 All Sections' },
                                                { id: 'hero', label: '🌄 Hero Bottom' },
                                                { id: 'gallery', label: '📸 Photo Gallery' },
                                                { id: 'footer', label: '⛳ Footer Edge' },
                                            ].map(tab => (
                                                <button
                                                    key={tab.id}
                                                    type="button"
                                                    onClick={() => handleSectionTabSelect(tab.id)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all border ${activeSectionTab === tab.id
                                                            ? 'bg-emerald-800 text-yellow-300 border-emerald-700 shadow-2xs ring-2 ring-emerald-500/20'
                                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                                        }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TAB 0: HERO BACKGROUND IMAGE ALIGNMENT CONTROLS */}
                                {activeEditorTab === 'hero_align' && (
                                    <div className="space-y-4">
                                        {/* Interactive 3x3 Quick Alignment Grid */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 block">
                                                    9-Point Quick Alignment Grid:
                                                </label>
                                                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                                                    X: {heroImgPosX}% | Y: {heroImgPosY}%
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1.5 p-2 bg-slate-100 rounded-2xl border border-slate-200 max-w-xs mx-auto">
                                                {[
                                                    { label: '↖ Top Left', x: 0, y: 0 },
                                                    { label: '⬆ Top Center', x: 50, y: 0 },
                                                    { label: '↗ Top Right', x: 100, y: 0 },
                                                    { label: '⬅ Center Left', x: 0, y: 50 },
                                                    { label: '🎯 Center', x: 50, y: 50 },
                                                    { label: '➡ Center Right', x: 100, y: 50 },
                                                    { label: '↙ Bottom Left', x: 0, y: 100 },
                                                    { label: '⬇ Bottom Center', x: 50, y: 100 },
                                                    { label: '↘ Bottom Right', x: 100, y: 100 },
                                                ].map((pt, i) => {
                                                    const isCurrent = Math.abs(heroImgPosX - pt.x) < 8 && Math.abs(heroImgPosY - pt.y) < 8;
                                                    return (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            onClick={() => {
                                                                handleHeroPosXChange(pt.x);
                                                                handleHeroPosYChange(pt.y);
                                                            }}
                                                            className={`py-2 px-1 rounded-xl text-[10px] font-black border transition-all text-center ${isCurrent
                                                                    ? 'bg-emerald-800 text-yellow-300 border-emerald-700 shadow-md ring-2 ring-emerald-500/20'
                                                                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                                                }`}
                                                        >
                                                            {pt.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Vertical Alignment (Y-Axis) */}
                                        <div className="space-y-2 pt-2 border-t border-slate-100">
                                            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                                                <span>↕️ Vertical Alignment (Y-Axis / Height):</span>
                                                <span className="text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                                                    {heroImgPosY}% {heroImgPosY < 35 ? '(Top / Roof Focus)' : heroImgPosY > 65 ? '(Bottom Ground)' : '(Center)'}
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="1"
                                                value={heroImgPosY}
                                                onChange={e => handleHeroPosYChange(e.target.value)}
                                                className="w-full accent-emerald-800 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
                                            />
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {[
                                                    { label: 'Top Roof (0%)', val: 0 },
                                                    { label: 'Upper (25%)', val: 25 },
                                                    { label: 'Center (50%)', val: 50 },
                                                    { label: 'Lower (75%)', val: 75 },
                                                    { label: 'Bottom (100%)', val: 100 },
                                                ].map(p => (
                                                    <button
                                                        key={p.val}
                                                        type="button"
                                                        onClick={() => handleHeroPosYChange(p.val)}
                                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${heroImgPosY === p.val
                                                                ? 'bg-emerald-800 text-yellow-300 border-emerald-700 shadow-2xs'
                                                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                                            }`}
                                                    >
                                                        {p.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Horizontal Alignment (X-Axis) */}
                                        <div className="space-y-2 pt-2 border-t border-slate-100">
                                            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                                                <span>↔️ Horizontal Alignment (X-Axis / Width):</span>
                                                <span className="text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                                                    {heroImgPosX}% {heroImgPosX < 35 ? '(Left)' : heroImgPosX > 65 ? '(Right)' : '(Center)'}
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="1"
                                                value={heroImgPosX}
                                                onChange={e => handleHeroPosXChange(e.target.value)}
                                                className="w-full accent-emerald-800 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
                                            />
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                {[
                                                    { label: 'Left (0%)', val: 0 },
                                                    { label: 'Center Left (25%)', val: 25 },
                                                    { label: 'Center (50%)', val: 50 },
                                                    { label: 'Center Right (75%)', val: 75 },
                                                    { label: 'Right (100%)', val: 100 },
                                                ].map(p => (
                                                    <button
                                                        key={p.val}
                                                        type="button"
                                                        onClick={() => handleHeroPosXChange(p.val)}
                                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${heroImgPosX === p.val
                                                                ? 'bg-emerald-800 text-yellow-300 border-emerald-700 shadow-2xs'
                                                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                                            }`}
                                                    >
                                                        {p.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Zoom & Scale */}
                                        <div className="space-y-2 pt-2 border-t border-slate-100">
                                            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                                                <span>🔍 Image Zoom / Scale:</span>
                                                <span className="text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                                                    {heroImgScale}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="100"
                                                max="160"
                                                step="1"
                                                value={heroImgScale}
                                                onChange={e => handleHeroScaleChange(e.target.value)}
                                                className="w-full accent-emerald-800 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
                                            />
                                            <div className="flex items-center gap-1.5">
                                                {[
                                                    { label: 'Fit (100%)', val: 100 },
                                                    { label: 'Default (105%)', val: 105 },
                                                    { label: 'Medium (115%)', val: 115 },
                                                    { label: 'Zoomed (130%)', val: 130 },
                                                ].map(p => (
                                                    <button
                                                        key={p.val}
                                                        type="button"
                                                        onClick={() => handleHeroScaleChange(p.val)}
                                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${heroImgScale === p.val
                                                                ? 'bg-emerald-800 text-yellow-300 border-emerald-700 shadow-2xs'
                                                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                                            }`}
                                                    >
                                                        {p.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Buttons: Save & Reset */}
                                        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                                            {saveSuccessMsg && (
                                                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                                                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                                                    <span>{saveSuccessMsg}</span>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleSaveHeroPosToDb}
                                                    disabled={isSavingHeroPos}
                                                    className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                                                >
                                                    <Save className="w-3.5 h-3.5" />
                                                    <span>{isSavingHeroPos ? 'Saving...' : '💾 Save to DB'}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        handleHeroPosXChange(50);
                                                        handleHeroPosYChange(50);
                                                        handleHeroScaleChange(105);
                                                    }}
                                                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-all"
                                                >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                    <span>↺ Reset Center</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 1: RIPPED PAPER CUT CONTROLS */}
                                {activeEditorTab === 'cuts' && (
                                    <div className="space-y-4">
                                        {/* 1. CSS Mode Selector */}
                                        <div className="space-y-3 mb-4">
                                            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                                                Select CSS Ripped Technique ({activeSectionTab === 'all' ? 'Global' : activeSectionTab.toUpperCase()}):
                                            </label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {Object.entries(CSS_RIPPED_MODES).map(([key, mode]) => {
                                                    const isSelected = (currentConfig.mode || cssMode) === key;
                                                    return (
                                                        <button
                                                            key={key}
                                                            type="button"
                                                            onClick={() => handleCssModeChange(key)}
                                                            className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${isSelected
                                                                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-extrabold'
                                                                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700 font-semibold'
                                                                }`}
                                                        >
                                                            <div>
                                                                <div className="text-xs font-black">{mode.name}</div>
                                                                <div className="text-[11px] font-normal text-slate-500">{mode.description}</div>
                                                            </div>
                                                            {isSelected && <Check className="w-4 h-4 text-emerald-700 shrink-0" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* 2. Frequency Slider */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                                <span>CSS Noise Frequency (`feTurbulence`):</span>
                                                <span className="text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">{currentConfig.freq ?? cssNoiseFreq}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.005"
                                                max="0.08"
                                                step="0.005"
                                                value={currentConfig.freq ?? cssNoiseFreq}
                                                onChange={e => handleFreqChange(Number(e.target.value))}
                                                className="w-full accent-emerald-800 h-2 bg-slate-200 rounded-lg cursor-pointer"
                                            />
                                            <div className="flex justify-between text-[10px] text-slate-600 font-medium">
                                                <span>Fine Fibers (0.01)</span>
                                                <span>Standard (0.035)</span>
                                                <span>Coarse Rip (0.08)</span>
                                            </div>
                                        </div>

                                        {/* 3. Displacement Scale */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                                <span>CSS Displacement Scale:</span>
                                                <span className="text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">{currentConfig.scale ?? cssScale}px</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="5"
                                                max="50"
                                                step="1"
                                                value={currentConfig.scale ?? cssScale}
                                                onChange={e => handleScaleChange(Number(e.target.value))}
                                                className="w-full accent-emerald-800 h-2 bg-slate-200 rounded-lg cursor-pointer"
                                            />
                                            <div className="flex justify-between text-[10px] text-slate-600 font-medium">
                                                <span>Shallow (10px)</span>
                                                <span>Medium (25px)</span>
                                                <span>Deep Rip (50px)</span>
                                            </div>
                                        </div>

                                        {/* 4. Section Cut Height */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                                <span>Section Cut Height / Depth:</span>
                                                <span className="text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">{currentConfig.height ?? cutHeight}px</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="40"
                                                max="160"
                                                step="5"
                                                value={currentConfig.height ?? cutHeight}
                                                onChange={e => handleHeightChange(Number(e.target.value))}
                                                className="w-full accent-emerald-800 h-2 bg-slate-200 rounded-lg cursor-pointer"
                                            />
                                        </div>

                                        {/* 5. Horizontal Shift Slider */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                                <span>Move Horizontally (`translateX`):</span>
                                                <span className="text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">{currentConfig.translateX ?? 0}px</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="-200"
                                                max="200"
                                                step="5"
                                                value={currentConfig.translateX ?? 0}
                                                onChange={e => updateSectionConfig('translateX', Number(e.target.value))}
                                                className="w-full accent-emerald-800 h-2 bg-slate-200 rounded-lg cursor-pointer"
                                            />
                                            <div className="flex justify-between text-[10px] text-slate-600 font-medium">
                                                <span>Left (-200px)</span>
                                                <span>Center (0px)</span>
                                                <span>Right (+200px)</span>
                                            </div>
                                        </div>

                                        {/* 6. Angle / Tilt Rotation Slider */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                                <span>Angle / Tilt (`rotate`):</span>
                                                <span className="text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">{currentConfig.rotate ?? 0}°</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="-5"
                                                max="5"
                                                step="0.5"
                                                value={currentConfig.rotate ?? 0}
                                                onChange={e => updateSectionConfig('rotate', Number(e.target.value))}
                                                className="w-full accent-emerald-800 h-2 bg-slate-200 rounded-lg cursor-pointer"
                                            />
                                            <div className="flex justify-between text-[10px] text-slate-600 font-medium">
                                                <span>Tilt Left (-5°)</span>
                                                <span>Flat (0°)</span>
                                                <span>Tilt Right (+5°)</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB 2: SECTION BACKGROUND CONTROLS */}
                                {activeEditorTab === 'backgrounds' && (
                                    <div className="space-y-4">
                                        {/* Background Type Toggle */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                                                Background Style ({activeSectionTab === 'all' ? 'GLOBAL' : activeSectionTab.toUpperCase()}):
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => updateSectionConfig('bgType', 'color')}
                                                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${currentConfig.bgType !== 'image'
                                                            ? 'bg-emerald-800 text-yellow-300 border-emerald-700 shadow-xs'
                                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                                        }`}
                                                >
                                                    🎨 Solid Dark Color
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => updateSectionConfig('bgType', 'image')}
                                                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${currentConfig.bgType === 'image'
                                                            ? 'bg-emerald-800 text-yellow-300 border-emerald-700 shadow-xs'
                                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                                        }`}
                                                >
                                                    🖼️ Custom Image
                                                </button>
                                            </div>
                                        </div>

                                        {/* Custom Image Controls */}
                                        {currentConfig.bgType === 'image' && (
                                            <div className="space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                                <div>
                                                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                                                        Custom Image URL or Path:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={currentConfig.bgImage || ''}
                                                        placeholder="/storage/images/hero-1.jpg or https://..."
                                                        onChange={e => updateSectionConfig('bgImage', e.target.value)}
                                                        className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 font-mono"
                                                    />
                                                </div>

                                                {/* Preset Image Selection */}
                                                <div>
                                                    <label className="text-[11px] font-bold text-slate-500 block mb-1">
                                                        Quick Presets:
                                                    </label>
                                                    <div className="flex gap-2">
                                                        {[
                                                            { label: '🌄 Golf 1', src: '/storage/images/hero-1.jpg' },
                                                            { label: '⛳ Green 2', src: '/storage/images/hero-2.jpg' },
                                                            { label: '📸 Gallery 3', src: '/storage/gallery-images/gallery-1.jpg' },
                                                        ].map(preset => (
                                                            <button
                                                                key={preset.src}
                                                                type="button"
                                                                onClick={() => updateSectionConfig('bgImage', preset.src)}
                                                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${currentConfig.bgImage === preset.src
                                                                        ? 'bg-emerald-800 text-white border-emerald-800'
                                                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                                                    }`}
                                                            >
                                                                {preset.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Image Opacity */}
                                                <div className="space-y-1 pt-1">
                                                    <div className="flex justify-between text-xs font-bold text-slate-700">
                                                        <span>Image Opacity:</span>
                                                        <span className="text-emerald-800 font-mono">{Math.round((currentConfig.bgOpacity ?? 0.85) * 100)}%</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0.1"
                                                        max="1"
                                                        step="0.05"
                                                        value={currentConfig.bgOpacity ?? 0.85}
                                                        onChange={e => updateSectionConfig('bgOpacity', Number(e.target.value))}
                                                        className="w-full accent-emerald-800 h-2 bg-slate-200 rounded-lg cursor-pointer"
                                                    />
                                                </div>

                                                {/* Image Blur */}
                                                <div className="space-y-1 pt-1">
                                                    <div className="flex justify-between text-xs font-bold text-slate-700">
                                                        <span>Backdrop Blur:</span>
                                                        <span className="text-emerald-800 font-mono">{currentConfig.bgBlur ?? 0}px</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="20"
                                                        step="1"
                                                        value={currentConfig.bgBlur ?? 0}
                                                        onChange={e => updateSectionConfig('bgBlur', Number(e.target.value))}
                                                        className="w-full accent-emerald-800 h-2 bg-slate-200 rounded-lg cursor-pointer"
                                                    />
                                                </div>

                                                {/* Gradient Overlay Style */}
                                                <div className="space-y-1 pt-1">
                                                    <label className="text-[11px] font-bold text-slate-600 block">
                                                        Atmospheric Gradient Overlay:
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-1.5">
                                                        {[
                                                            { id: 'dark_forest', label: '🌲 Dark Forest' },
                                                            { id: 'vignette', label: '🎬 Vignette' },
                                                            { id: 'top_fade', label: '⬇️ Top Fade' },
                                                            { id: 'none', label: '🚫 None (Raw)' },
                                                        ].map(overlay => (
                                                            <button
                                                                key={overlay.id}
                                                                type="button"
                                                                onClick={() => updateSectionConfig('gradientOverlay', overlay.id)}
                                                                className={`py-1.5 px-2 rounded-lg text-[10px] font-extrabold border transition-all ${(currentConfig.gradientOverlay || 'dark_forest') === overlay.id
                                                                        ? 'bg-emerald-800 text-yellow-300 border-emerald-700'
                                                                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                                                                    }`}
                                                            >
                                                                {overlay.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Solid Color Presets */}
                                        {currentConfig.bgType !== 'image' && (
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-slate-600 block">
                                                    Select Section Color:
                                                </label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {[
                                                        { name: '🌲 Dark Olive', hex: '#121908' },
                                                        { name: '🌃 Midnight Blue', hex: '#0B132B' },
                                                        { name: '☕ Espresso', hex: '#1C1917' },
                                                        { name: '📜 Vintage Cream', hex: '#FAF8F5' },
                                                    ].map(color => (
                                                        <button
                                                            key={color.hex}
                                                            type="button"
                                                            onClick={() => updateSectionConfig('bgColor', color.hex)}
                                                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${(currentConfig.bgColor || '#121908') === color.hex
                                                                    ? 'border-emerald-600 ring-2 ring-emerald-500/20 font-bold'
                                                                    : 'border-slate-200 hover:bg-slate-50'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" style={{ backgroundColor: color.hex }} />
                                                                <span className="text-xs">{color.name}</span>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 3: FRONTPAGE TYPOGRAPHY & FONT SELECTION */}
                                {activeEditorTab === 'fonts' && (
                                    <div className="space-y-4">
                                        {/* Target Switcher: Navbar Font vs Body Font vs Headings */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                                                Select Target Typography:
                                            </label>
                                            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveFontTarget('navbar')}
                                                    className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${activeFontTarget === 'navbar'
                                                            ? 'bg-emerald-800 text-yellow-300 shadow-sm border border-emerald-700'
                                                            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
                                                        }`}
                                                >
                                                    <Compass className="w-3.5 h-3.5" />
                                                    <span>🧭 Navbar</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveFontTarget('body')}
                                                    className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${activeFontTarget === 'body'
                                                            ? 'bg-emerald-800 text-yellow-300 shadow-sm border border-emerald-700'
                                                            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
                                                        }`}
                                                >
                                                    <FileText className="w-3.5 h-3.5" />
                                                    <span>📝 Body</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveFontTarget('headings')}
                                                    className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${activeFontTarget === 'headings'
                                                            ? 'bg-emerald-800 text-yellow-300 shadow-sm border border-emerald-700'
                                                            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
                                                        }`}
                                                >
                                                    <Type className="w-3.5 h-3.5" />
                                                    <span>🏷️ Titles</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Current Active Target Details Banner */}
                                        <div className="p-3 bg-gradient-to-r from-emerald-950 to-slate-900 text-white rounded-2xl border border-emerald-800/40 shadow-sm flex items-center justify-between">
                                            <div>
                                                <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                                                    Target: {activeFontTarget === 'navbar' ? 'Top Navigation Bar & Menus' : activeFontTarget === 'body' ? 'Main Body & Paragraphs' : 'Section Titles & Headings'}
                                                </div>
                                                <div className="text-sm font-black text-white flex items-center gap-2 mt-0.5" style={{ fontFamily: activeFontTarget === 'navbar' ? navbarFont : activeFontTarget === 'body' ? bodyFont : headingFont }}>
                                                    <span>Active:</span>
                                                    <span className="text-yellow-400 font-extrabold underline decoration-yellow-400/50 underline-offset-4">
                                                        {activeFontTarget === 'navbar' ? navbarFont : activeFontTarget === 'body' ? bodyFont : headingFont}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                                                    Live
                                                </span>
                                            </div>
                                        </div>

                                        {/* Category Filter Pills */}
                                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                                            {[
                                                { id: 'all', label: '🌐 All Styles' },
                                                { id: 'sans', label: '🅰️ Sans-Serif' },
                                                { id: 'serif', label: '🖋️ Luxury Serif' },
                                                { id: 'display', label: '⚡ Bold Display' },
                                            ].map(cat => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setActiveFontCategory(cat.id)}
                                                    className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${activeFontCategory === cat.id
                                                            ? 'bg-slate-900 text-yellow-300 border-slate-900 shadow-2xs'
                                                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                                                        }`}
                                                >
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Font Cards Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                                            {CURATED_FONTS
                                                .filter(f => activeFontCategory === 'all' || f.category === activeFontCategory)
                                                .map(font => {
                                                    const currentSelected = activeFontTarget === 'navbar'
                                                        ? navbarFont === font.name
                                                        : activeFontTarget === 'body'
                                                        ? bodyFont === font.name
                                                        : headingFont === font.name;

                                                    return (
                                                        <button
                                                            key={font.name}
                                                            type="button"
                                                            onClick={() => {
                                                                if (activeFontTarget === 'navbar') handleNavbarFontChange(font.name);
                                                                else if (activeFontTarget === 'body') handleBodyFontChange(font.name);
                                                                else handleHeadingFontChange(font.name);
                                                            }}
                                                            className={`p-2.5 rounded-2xl border text-left transition-all relative group flex flex-col justify-between ${currentSelected
                                                                    ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/30 shadow-xs'
                                                                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between mb-1 w-full">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-xs font-black text-slate-900">{font.name}</span>
                                                                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
                                                                        {font.badge}
                                                                    </span>
                                                                </div>
                                                                {currentSelected && (
                                                                    <span className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
                                                                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Live Text Preview in that font */}
                                                            <div
                                                                className="w-full text-slate-800 bg-slate-50/70 group-hover:bg-slate-50 rounded-xl p-1.5 border border-slate-100 transition-colors"
                                                                style={{ fontFamily: `"${font.name}", sans-serif` }}
                                                            >
                                                                {activeFontTarget === 'navbar' ? (
                                                                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-900 truncate">
                                                                        BOGURA GOLF • HOME • ABOUT
                                                                    </div>
                                                                ) : activeFontTarget === 'body' ? (
                                                                    <div className="text-[10px] font-medium text-slate-700 line-clamp-2 leading-tight">
                                                                        Bogura Golf Club offers an exquisite 9-hole sanctuary in Bogura Cantonment.
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-[11px] font-black text-slate-900 truncate">
                                                                        Experience Championship Golf
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                        </div>

                                        {/* Live Paired Preview Box */}
                                        <div className="p-3 bg-slate-100/90 rounded-2xl border border-slate-200 space-y-2">
                                            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                                                <span>Combined Live Preview</span>
                                                <span className="text-emerald-700 font-mono font-bold">Navbar + Body</span>
                                            </div>
                                            
                                            {/* Mini Navbar Mockup */}
                                            <div
                                                className="bg-white rounded-xl p-2 border border-slate-200 shadow-2xs flex items-center justify-between"
                                                style={{ fontFamily: `"${navbarFont}", sans-serif` }}
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-4 h-4 rounded-full bg-emerald-800 text-yellow-300 font-black text-[8px] flex items-center justify-center">
                                                        B
                                                    </div>
                                                    <span className="font-black text-[11px] text-slate-950 uppercase tracking-wider">
                                                        {site_settings?.site_name || 'BOGURA GOLF CLUB'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600 uppercase">
                                                    <span className="text-emerald-800">Home</span>
                                                    <span>About</span>
                                                    <span>Tournaments</span>
                                                </div>
                                            </div>

                                            {/* Mini Body Mockup */}
                                            <div
                                                className="bg-white rounded-xl p-2 border border-slate-200 shadow-2xs"
                                                style={{ fontFamily: `"${bodyFont}", sans-serif` }}
                                            >
                                                <h4
                                                    className="text-[11px] font-black text-slate-900 mb-0.5"
                                                    style={{ fontFamily: `"${headingFont}", sans-serif` }}
                                                >
                                                    A Premier 9-Hole Sanctuary in Bogura Cantonment
                                                </h4>
                                                <p className="text-[10px] text-slate-600 leading-relaxed font-normal">
                                                    Offering world-class golfing facilities, prestigious championships, and natural beauty.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons: Save to DB & Reset */}
                                        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                                            {saveFontsSuccessMsg && (
                                                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                                                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                                                    <span>{saveFontsSuccessMsg}</span>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={handleSaveFontsToDb}
                                                    disabled={isSavingFonts}
                                                    className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                                                >
                                                    <Save className="w-3.5 h-3.5" />
                                                    <span>{isSavingFonts ? 'Saving...' : '💾 Save Fonts to DB'}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleResetFonts}
                                                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-all"
                                                >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                    <span>↺ Reset Defaults</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setIsCutEditorOpen(false)}
                                    className="w-full py-3.5 mt-4 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md transition-all"
                                >
                                    Apply Settings
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}


            {/* ── TOP STICKY NAVIGATION BAR ── */}
            <div className={`sticky top-0 z-50 transition-all duration-300 ${isMobileMenuOpen ? 'pt-2 pb-2 px-3 lg:pt-0 lg:pb-0 lg:px-0 bg-[#FAF8F5]/80 backdrop-blur-md' : 'pt-3 pb-3 px-4 lg:pt-0 lg:pb-0 lg:px-0 bg-[#FAF8F5]/80 backdrop-blur-md'}`}>
                <header className={`shadow-lg lg:shadow-sm lg:border-none w-full ${isMobileMenuOpen
                    ? 'bg-[#fbfbf9] rounded-[2rem] lg:bg-white lg:rounded-none'
                    : 'bg-[#fbfbf9] rounded-full lg:bg-white lg:rounded-none'
                    }`}
                >
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="flex items-center justify-between py-2 md:py-3 relative">
                            {/* Logo & Title - Left/Center */}
                            <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0 hover:opacity-90 transition-opacity">
                                <ApplicationLogo className="w-10 h-10 md:w-14 md:h-14" />
                                <div className="absolute left-1/2 -translate-x-1/2 md:static md:transform-none text-center md:text-left w-max">
                                    <h1
                                        className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-normal tracking-wide text-slate-800 uppercase leading-none"
                                        style={{ fontFamily: `"${navbarFont || 'Anton'}", sans-serif`, paddingTop: '4px' }}
                                    >
                                        {site_settings?.site_name || 'BOGURA GOLF CLUB'}
                                    </h1>
                                </div>
                            </Link>

                            {/* Desktop Menu Links - Center */}
                            <nav className="hidden lg:flex flex-1 justify-center px-4 gap-2 xl:gap-3 text-xs font-bold text-slate-700 whitespace-nowrap scrollbar-hide">
                                {displayMenu.length > 0 ? displayMenu.map((item, idx) => (
                                    <div key={idx} className="relative group py-2">
                                        <a
                                            href={item.url || '#'}
                                            target={item.target}
                                            className="px-3 xl:px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-military-800 transition-colors tracking-tight flex items-center shadow-sm h-10 uppercase"
                                        >
                                            {item.title}
                                            {item.children && item.children.length > 0 && <ChevronDown className="w-3 h-3 ml-1" />}
                                        </a>
                                        {item.children && item.children.length > 0 && (
                                            <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-lg border border-slate-100 rounded-2xl py-2 min-w-[200px] z-50 overflow-hidden">
                                                {item.children.map((child, cIdx) => (
                                                    <a
                                                        key={cIdx}
                                                        href={child.url || '#'}
                                                        target={child.target}
                                                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-military-600"
                                                    >
                                                        {child.title}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )) : (
                                    <span className="text-slate-400 italic flex items-center h-10">No menu assigned to Top Bar</span>
                                )}
                            </nav>

                            {/* Desktop Auth Buttons - Right */}
                            <div className="hidden lg:flex shrink-0">
                                {auth?.user ? (
                                    <Link href={route('dashboard')} className="flex items-center group">
                                        <div className="bg-[#1f2328] text-white px-5 xl:px-6 h-10 rounded-full font-medium text-sm flex items-center group-hover:bg-black transition-colors shadow-sm">
                                            Dashboard
                                        </div>
                                        <div className="w-3 h-1.5 bg-[#1f2328] group-hover:bg-black transition-colors -mx-1.5 z-10 relative"></div>
                                        <div className="w-10 h-10 bg-[#1f2328] text-white rounded-full flex items-center justify-center group-hover:bg-black transition-colors shadow-sm">
                                            <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-3 xl:gap-5">
                                        <Link href={route('login')} className="text-slate-600 hover:text-military-600 font-bold text-sm tracking-tight transition-colors">Log in</Link>
                                        <Link href={route('register')} className="flex items-center group">
                                            <div className="bg-[#1f2328] text-white px-5 xl:px-6 h-10 rounded-full font-medium text-sm flex items-center group-hover:bg-black transition-colors shadow-sm">
                                                Register
                                            </div>
                                            <div className="w-3 h-1.5 bg-[#1f2328] group-hover:bg-black transition-colors -mx-1.5 z-10 relative"></div>
                                            <div className="w-10 h-10 bg-[#1f2328] text-white rounded-full flex items-center justify-center group-hover:bg-black transition-colors shadow-sm">
                                                <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                                            </div>
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                className="lg:hidden ml-auto p-2 text-military-800 hover:text-military-600 focus:outline-none"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>

                        {/* Mobile Menu Dropdown */}
                        {isMobileMenuOpen && (
                            <div className="lg:hidden bg-[#fbfbf9] border-t border-slate-100 rounded-b-[2rem] px-4 py-4 absolute top-[100%] left-0 right-0 shadow-lg">
                                <div className="flex flex-col gap-2 mb-4 border-b border-slate-100 pb-4">
                                    {auth?.user ? (
                                        <Link href={route('dashboard')}>
                                            <Button variant="outline" className="w-full border-military-600 text-military-700">Dashboard</Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link href={route('login')}>
                                                <Button variant="ghost" className="w-full text-slate-600">Log in</Button>
                                            </Link>
                                            <Link href={route('register')}>
                                                <Button className="w-full bg-military-600 text-white">Register</Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                                <nav className="flex flex-col gap-1">
                                    {displayMenu.map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={item.url || '#'}
                                            className="px-4 py-2.5 rounded-xl hover:bg-slate-100 text-slate-800 font-bold text-sm"
                                        >
                                            {item.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        )}
                    </div>
                </header>
            </div>

            {/* Notice Ticker Bar (Classic Olive Theme) */}
            {notices && notices.length > 0 && (
                <div className="bg-gradient-to-r from-[#171e0b] via-[#253112] to-[#171e0b] border-y border-[#3b4c1e] py-2 overflow-hidden flex items-center relative z-40 shadow-inner">
                    <div className="container mx-auto px-4 flex items-center gap-3 md:gap-4">
                        <div className="flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/40 px-3 py-1 rounded-full text-[11px] sm:text-xs font-extrabold tracking-wider uppercase shrink-0 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                            </span>
                            <Bell className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Notice</span>
                        </div>

                        <div
                            className="flex-1 overflow-x-auto scrollbar-hide flex items-center touch-pan-x cursor-grab active:cursor-grabbing py-1 select-none"
                            ref={marqueeContainerRef}
                        >
                            <div className="inline-flex items-center text-slate-100 font-medium text-xs sm:text-sm whitespace-nowrap shrink-0 pr-8">
                                {notices.map((n, idx) => (
                                    <span key={n.id || idx} className="inline-flex items-center shrink-0">
                                        {n.url ? (
                                            <a href={n.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-slate-100 hover:text-yellow-300 hover:underline transition-colors font-semibold">
                                                <span className="font-bangla">{n.title}</span>
                                                <ArrowUpRight className="w-3.5 h-3.5 text-yellow-400 opacity-90" />
                                            </a>
                                        ) : (
                                            <span className="font-medium text-slate-200 font-bangla">{n.title}</span>
                                        )}
                                        {idx < notices.length - 1 && (
                                            <span className="mx-4 text-yellow-400/80 font-bold text-base">•</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Link
                            href={route('notices.public')}
                            className="bg-military-700/50 hover:bg-military-700 text-yellow-400 border border-military-600/50 p-1.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
                            title="All Notices"
                        >
                            <span className="hidden sm:inline">ALL NOTICES</span>
                            <ArrowUpRight className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        </Link>
                    </div>
                </div>
            )}

            {/* ── 1. CINEMATIC IMMERSIVE HERO SECTION ── */}
            <div className="relative w-full min-h-[85vh] flex flex-col justify-between bg-slate-950 overflow-hidden">
                {/* Background Image / Slider */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                        src={currentSlide.image_path ? (currentSlide.image_path.startsWith('/') || currentSlide.image_path.startsWith('http') ? currentSlide.image_path : `/storage/${currentSlide.image_path}`) : '/storage/images/hero-1.jpg'}
                        alt="Bogura Golf Club"
                        className="w-full h-full object-cover opacity-85 transition-all duration-300"
                        style={{
                            objectPosition: `${heroImgPosX}% ${heroImgPosY}%`,
                            transform: `scale(${heroImgScale / 100})`
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-slate-950/20 to-slate-950/40 z-1" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/15 to-slate-950/50 z-1" />
                </div>

                {/* Hero Center Content (Centered Text & Centered CTAs) */}
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col items-center justify-center text-center max-w-4xl my-auto">


                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.15] drop-shadow-2xl mb-6 text-center min-h-[2.4em] sm:min-h-[2.2em] flex items-center justify-center">
                        <TypewriterHeroTitle baseTitle={currentSlide.title || 'Welcome To Bogura Golf Club'} />
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-100 font-normal max-w-2xl leading-relaxed drop-shadow-md mb-8 text-center mx-auto">
                        {currentSlide.subtitle || 'Experience 3,222 yards of pristine fairways, lush greens, and military precision nestled inside Bogura Cantonment.'}
                    </p>

                    <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-lg mx-auto">
                        <a
                            href="#course-overview"
                            className="flex-1 sm:flex-initial justify-center bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm px-4 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 sm:gap-2 border border-emerald-500/50 whitespace-nowrap"
                        >
                            <Compass className="w-4 h-4 text-yellow-300 shrink-0" />
                            <span>Explore Course</span>
                        </a>

                        {pageAuth?.user ? (
                            <Link
                                href={route('dashboard')}
                                className="flex-1 sm:flex-initial justify-center bg-white/15 hover:bg-white/25 text-white backdrop-blur-md font-bold text-xs sm:text-sm px-4 sm:px-7 py-3 sm:py-3.5 rounded-full border border-white/35 shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 sm:gap-2 group whitespace-nowrap"
                            >
                                <Users className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform shrink-0" />
                                <span>Dashboard</span>
                            </Link>
                        ) : (
                            <Link
                                href={route('login')}
                                className="flex-1 sm:flex-initial justify-center bg-white/15 hover:bg-white/25 text-white backdrop-blur-md font-bold text-xs sm:text-sm px-4 sm:px-7 py-3 sm:py-3.5 rounded-full border border-white/35 shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 sm:gap-2 group whitespace-nowrap"
                            >
                                <Users className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform shrink-0" />
                                <span>Member Access</span>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentHeroIdx(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${currentHeroIdx === idx ? 'w-8 bg-yellow-400' : 'w-2 bg-white/40 hover:bg-white/70'}`}
                            />
                        ))}
                    </div>

                    <span className="text-xs font-semibold text-slate-300/80 hidden sm:block">
                        Scroll down to discover resort facilities
                    </span>
                </div>

                {/* ── CSS RIPPED DIVIDER 1 ── */}
                <div className="absolute bottom-0 left-0 right-0 w-full z-20 pointer-events-none">
                    {renderCssRippedDivider('text-[#FAF8F5]', poly1, 1)}
                </div>
            </div>

            {/* ── 2. COURSE OVERVIEW & STATS SECTION ── */}
            <section id="course-overview" className="relative bg-[#FAF8F5] py-20 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-800 bg-emerald-100/80 px-4 py-1.5 rounded-full border border-emerald-200 inline-block mb-3">
                            Resort Specifications
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight">
                            See What Is In Our Club
                        </h2>
                        <div className="w-20 h-1 bg-emerald-700 mx-auto mt-4 rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { icon: Flag, value: '9', label: 'HOLES' },
                            { icon: Trophy, value: '36', label: 'PARS' },
                            { icon: MoveHorizontal, value: '3,222', label: 'YARDS' },
                            { icon: Users, value: '1,109', label: 'MEMBERS' }
                        ].map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.07)] hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200/60 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-yellow-300 transition-colors shadow-sm">
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-serif group-hover:text-emerald-800 transition-colors">
                                        {stat.value}
                                    </h3>
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                                        {stat.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── CSS RIPPED DIVIDER 2 ── */}
            <div className="relative w-full z-20 pointer-events-none bg-[#FAF8F5] -mb-1">
                {renderCssRippedDivider('text-[#121908]', poly2, 2)}
            </div>

            {/* ── 3. IMMERSIVE DARK FOREST MEDIA SHOWCASE (CLASSIC INTERACTIVE ACCORDION STYLE) ── */}
            <section
                id="photo-gallery-section"
                className="relative text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-all duration-300"
                style={{
                    backgroundColor: (sectionConfigs.gallery?.bgColor || sectionConfigs.all?.bgColor) || '#121908'
                }}
            >
                {/* Background Image Layer */}
                {((sectionConfigs.gallery?.bgType || sectionConfigs.all?.bgType) === 'image') && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={sectionConfigs.gallery?.bgImage || sectionConfigs.all?.bgImage || '/storage/images/hero-1.jpg'}
                            alt="Section Background"
                            className="w-full h-full object-cover transition-all duration-300"
                            style={{
                                opacity: sectionConfigs.gallery?.bgOpacity ?? sectionConfigs.all?.bgOpacity ?? 0.85,
                                filter: `blur(${sectionConfigs.gallery?.bgBlur ?? sectionConfigs.all?.bgBlur ?? 0}px)`
                            }}
                        />
                        {(sectionConfigs.gallery?.gradientOverlay || sectionConfigs.all?.gradientOverlay || 'dark_forest') === 'dark_forest' && (
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121908] via-[#121908]/70 to-[#121908]/90 z-1" />
                        )}
                        {(sectionConfigs.gallery?.gradientOverlay || sectionConfigs.all?.gradientOverlay) === 'vignette' && (
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/85 z-1" />
                        )}
                        {(sectionConfigs.gallery?.gradientOverlay || sectionConfigs.all?.gradientOverlay) === 'gradient_top' && (
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent z-1" />
                        )}
                    </div>
                )}

                <div className="absolute top-40 right-1/4 w-[450px] h-[450px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Header bar */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-2.5 shadow-sm">
                                <Sparkles className="w-3.5 h-3.5" />
                                Media Showcase
                            </span>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-['Outfit']">
                                Photo Gallery
                            </h2>
                        </div>
                        <Link
                            href={route('gallery.public')}
                            className="text-xs sm:text-sm font-black text-slate-950 bg-yellow-400 hover:bg-yellow-300 px-5 py-2.5 rounded-full transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-2 group shrink-0 w-fit"
                        >
                            <span>Explore All</span>
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>

                    {/* Mobile Horizontal Carousel View */}
                    <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-3 -mx-2 px-2 relative z-10">
                        {galleryImages.length > 0 ? galleryImages.slice(0, 6).map((img) => {
                            const imgSrc = img.image_path ? (img.image_path.startsWith('/') || img.image_path.startsWith('http') ? img.image_path : `/storage/${img.image_path}`) : '/storage/images/gallery-1.jpg';
                            const titleText = img.title && !img.title.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? img.title : 'Bogura Golf Club';
                            return (
                                <div
                                    key={img.id}
                                    className="snap-center shrink-0 w-[82vw] max-w-[300px] h-[360px] rounded-3xl overflow-hidden relative shadow-2xl border border-white/15 group cursor-pointer"
                                    onClick={() => router.visit(route('gallery.public'))}
                                >
                                    <img
                                        src={imgSrc}
                                        alt={titleText}
                                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f05]/95 via-[#0a0f05]/30 to-transparent" />

                                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-yellow-400 text-[10px] font-black uppercase tracking-wider border border-white/15 shadow-md flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        <span>Golf Club</span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end">
                                        <h3 className="text-white font-extrabold text-base sm:text-lg line-clamp-2 leading-snug drop-shadow-md mb-2">
                                            {titleText}
                                        </h3>
                                        <span className="inline-flex items-center gap-1.5 text-yellow-300 text-xs font-bold hover:text-white transition-colors">
                                            View Gallery <ArrowUpRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="w-full h-44 flex items-center justify-center bg-white/5 rounded-2xl text-slate-400 font-medium text-sm border border-white/10">
                                No gallery images available
                            </div>
                        )}
                    </div>

                    {/* Desktop Center-Focal Magazine Accordion Gallery */}
                    <div
                        className="hidden md:flex items-center justify-center gap-3 lg:gap-4 w-full h-[460px] lg:h-[500px] relative z-10 px-2"
                        onMouseLeave={() => {
                            const centerIdx = galleryImages.length > 0 ? Math.min(1, Math.floor(galleryImages.length / 2)) : 0;
                            setActiveGalleryIdx(centerIdx);
                        }}
                    >
                        {galleryImages.length > 0 ? galleryImages.slice(0, 4).map((img, idx) => {
                            const isActive = activeGalleryIdx === idx;
                            const imgSrc = img.image_path ? (img.image_path.startsWith('/') || img.image_path.startsWith('http') ? img.image_path : `/storage/${img.image_path}`) : '/storage/images/gallery-1.jpg';
                            const titleText = img.title && !img.title.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? img.title : 'Bogura Golf Club';

                            return (
                                <div
                                    key={img.id || idx}
                                    className={`group relative transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer overflow-hidden rounded-[2.25rem] bg-slate-950 h-full border ${isActive
                                        ? 'flex-[3.2] lg:flex-[3.5] border-yellow-400 shadow-[0_0_35px_rgba(234,179,8,0.35)] ring-1 ring-yellow-400/50 z-20'
                                        : 'flex-1 border-white/30 hover:border-yellow-400/70 shadow-xl opacity-90 hover:opacity-100 z-10'
                                        }`}
                                    onMouseEnter={() => setActiveGalleryIdx(idx)}
                                    onClick={() => setActiveGalleryIdx(idx)}
                                >
                                    {/* Image background */}
                                    <img
                                        src={imgSrc}
                                        alt={titleText}
                                        className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out ${isActive ? 'scale-105' : 'scale-100 group-hover:scale-110'
                                            }`}
                                    />

                                    {/* Active Gradient Overlay vs Inactive Dark Bookmark Overlay */}
                                    <div className={`absolute inset-0 transition-all duration-500 ${isActive
                                        ? 'bg-gradient-to-t from-[#0a0f05]/95 via-[#0a0f05]/30 to-transparent opacity-90'
                                        : 'bg-[#0a0f05]/75 group-hover:bg-[#0a0f05]/45 opacity-100'
                                        }`} />

                                    {/* INACTIVE CARD: Vertical Magazine Bookmark Tag */}
                                    {!isActive && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-between p-6 pointer-events-none z-10 transition-all duration-500 group-hover:opacity-90">
                                            <div className="w-10 h-10 rounded-2xl bg-yellow-400/15 text-yellow-400 flex items-center justify-center shadow-sm">
                                                <Sparkles className="w-4 h-4" />
                                            </div>

                                            <div className="flex flex-col items-center gap-3 my-auto">
                                                <span className="text-yellow-400 text-[11px] font-black uppercase tracking-widest [writing-mode:vertical-lr] rotate-180 drop-shadow-md">
                                                    0{idx + 1} • {titleText}
                                                </span>
                                            </div>

                                            <div className="w-8 h-8 rounded-full bg-black/40 text-yellow-400 flex items-center justify-center">
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    )}

                                    {/* ACTIVE CARD: Top Glass Badge */}
                                    <div className={`absolute top-5 left-5 transition-all duration-500 z-10 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                                        }`}>
                                        <div className="px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-yellow-400 text-xs font-black uppercase tracking-wider border border-white/15 shadow-xl flex items-center gap-2">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span>Bogura Golf Club</span>
                                        </div>
                                    </div>

                                    {/* ACTIVE CARD: Bottom Content Bar */}
                                    <div className={`absolute bottom-0 left-0 right-0 p-6 lg:p-7 flex items-end justify-between gap-4 transition-all duration-500 z-10 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                                        }`}>
                                        <div className="min-w-0">
                                            <h3 className="text-white font-black text-xl lg:text-2xl truncate drop-shadow-lg tracking-tight font-['Outfit']">
                                                {titleText}
                                            </h3>
                                            <p className="text-yellow-400 text-xs font-extrabold uppercase tracking-widest mt-1 drop-shadow-sm flex items-center gap-1.5">
                                                <span>Media Showcase</span>
                                                <span>•</span>
                                                <span className="text-slate-300 font-medium">Click to explore full album</span>
                                            </p>
                                        </div>

                                        <Link
                                            href={route('gallery.public')}
                                            className="w-12 h-12 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 flex items-center justify-center shrink-0 shadow-2xl transition-all duration-300 hover:scale-110"
                                        >
                                            <ArrowUpRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-3xl text-slate-400">
                                <p className="font-medium">No gallery images available</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ── CSS RIPPED DIVIDER 3 ── */}
            <div className="relative w-full z-20 pointer-events-none bg-[#121908] -mb-1">
                {renderCssRippedDivider('text-[#F4F1EA]', poly3, 1)}
            </div>

            {/* ── 4. RESORT INFORMATION & SIDEBAR GRID SECTION ── */}
            <section className="relative bg-[#F4F1EA] py-20 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-7xl">

                    {/* Quick Action Shortcuts Grid Banner */}
                    {quickLinks && quickLinks.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6 mb-10">
                            {quickLinks.map((item, idx) => {
                                const CardContent = (
                                    <div className="bg-white hover:bg-slate-50/90 p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 flex flex-row sm:flex-col items-center justify-between gap-3 text-left sm:text-center group cursor-pointer h-full">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-emerald-50 border border-emerald-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                            {item.image_path ? (
                                                <img src={`/storage/${item.image_path}`} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-800" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 sm:mb-2">
                                            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                                                {item.title}
                                            </h3>
                                        </div>

                                        <div className="w-auto sm:w-full shrink-0">
                                            <span className="bg-emerald-950 hover:bg-emerald-900 text-yellow-400 font-black text-xs px-3.5 py-2 sm:py-2.5 rounded-2xl shadow-md flex items-center justify-center gap-1.5 transition-all group-hover:scale-105 active:scale-95">
                                                <span>{item.button_text || 'Click Here'}</span>
                                                <ArrowUpRight className="w-3.5 h-3.5 text-yellow-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                );

                                return item.url ? (
                                    <a key={item.id || idx} href={item.url} className="block w-full">
                                        {CardContent}
                                    </a>
                                ) : (
                                    <div key={item.id || idx} className="block w-full">
                                        {CardContent}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Main Left Column (65%) */}
                        <div className="lg:w-[65%] space-y-8">

                            {/* Executive Committee Card */}
                            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.03)]">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                                    <div>
                                        <span className="text-xs font-black uppercase tracking-widest text-emerald-800 block mb-1">
                                            Leadership
                                        </span>
                                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 font-['Outfit']">
                                            Executive Committee
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href="/executive-committee"
                                            className="w-9 h-9 sm:w-auto sm:h-auto rounded-full bg-emerald-50 hover:bg-emerald-800 text-emerald-800 hover:text-white sm:px-3.5 sm:py-1.5 transition-all border border-emerald-200/60 flex items-center justify-center gap-1 shadow-2xs"
                                        >
                                            <span className="hidden sm:inline text-xs font-black">View All</span>
                                            <ArrowUpRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Mobile View: First 3 members + View All Action Card */}
                                <div className="grid grid-cols-1 sm:hidden gap-3.5">
                                    {executiveMembers.slice(0, 3).map((member, idx) => (
                                        <div key={idx} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 flex flex-col items-center gap-3 text-center group">
                                            <div className="w-16 h-16 shrink-0 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xl flex items-center justify-center shadow-inner overflow-hidden border-2 border-white mx-auto">
                                                {member.image_path ? (
                                                    <img 
                                                        src={`/storage/${member.image_path}`} 
                                                        alt={member.name} 
                                                        className="w-full h-full object-cover" 
                                                        style={{
                                                            objectPosition: member.image_position || '50% 50%',
                                                            transform: `scale(${member.image_scale ? member.image_scale / 100 : 1})`,
                                                            transformOrigin: member.image_position || '50% 50%',
                                                        }}
                                                    />
                                                ) : (
                                                    member.name?.charAt(0) || 'E'
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 w-full">
                                                <h4 className="font-extrabold text-xs text-slate-900 leading-snug break-words">
                                                    {member.name}
                                                </h4>
                                                <p className="text-[11px] font-bold text-emerald-700 mt-0.5">
                                                    {member.designation}
                                                </p>
                                                <p className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">
                                                    {member.committee}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    <Link
                                        href="/executive-committee"
                                        className="w-full py-3.5 px-4 bg-emerald-950 hover:bg-emerald-900 text-yellow-400 rounded-2xl font-black text-xs text-center flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 mt-1"
                                    >
                                        <span>View All Committee Members ({executiveMembers.length > 0 ? executiveMembers.length : 6})</span>
                                        <ArrowUpRight className="w-4 h-4 text-yellow-400" />
                                    </Link>
                                </div>

                                {/* Desktop View: 6 Grid Members */}
                                <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {executiveMembers.slice(0, 6).map((member, idx) => (
                                        <div key={idx} className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60 hover:border-emerald-300 transition-all text-center group">
                                            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xl flex items-center justify-center mb-3 shadow-inner overflow-hidden border-2 border-white">
                                                {member.image_path ? (
                                                    <img 
                                                        src={`/storage/${member.image_path}`} 
                                                        alt={member.name} 
                                                        className="w-full h-full object-cover" 
                                                        style={{
                                                            objectPosition: member.image_position || '50% 50%',
                                                            transform: `scale(${member.image_scale ? member.image_scale / 100 : 1})`,
                                                            transformOrigin: member.image_position || '50% 50%',
                                                        }}
                                                    />
                                                ) : (
                                                    member.name?.charAt(0) || 'E'
                                                )}
                                            </div>
                                            <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug break-words">
                                                {member.name}
                                            </h4>
                                            <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                                                {member.designation}
                                            </p>
                                            <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
                                                {member.committee}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Download Club Forms Card */}
                            {forms && forms.length > 0 && (
                                <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-emerald-900">
                                            <div>
                                                <span className="text-xs font-black uppercase tracking-widest text-yellow-400 block mb-1">
                                                    Official Documents
                                                </span>
                                                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white font-['Outfit']">
                                                    Download Club Forms
                                                </h3>
                                            </div>
                                            <FileText className="w-6 h-6 text-yellow-400" />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {forms.map(form => (
                                                <a
                                                    key={form.id}
                                                    href={`/storage/${form.file_path}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    download
                                                    className="bg-emerald-900/60 hover:bg-emerald-800/80 p-4 rounded-2xl border border-emerald-700/60 flex items-center justify-between gap-3 group transition-all"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-300 flex items-center justify-center shrink-0">
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                        <span className="font-extrabold text-xs text-slate-100 group-hover:text-white truncate">
                                                            {form.title}
                                                        </span>
                                                    </div>
                                                    <ArrowUpRight className="w-4 h-4 text-yellow-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Upcoming Tournament Box */}
                            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.03)]">
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="w-2 h-7 bg-gradient-to-b from-emerald-600 to-emerald-800 rounded-full"></div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 font-['Outfit']">
                                        <Trophy className="w-5 h-5 text-emerald-800" />
                                        Upcoming Tournament
                                    </h3>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-center">
                                    {upcomingTournaments && upcomingTournaments.length > 0 ? (
                                        <div className="space-y-3 text-left">
                                            {upcomingTournaments.map(t => (
                                                <div key={t.id} className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                                                    <span className="font-extrabold text-xs text-slate-800">{t.title}</span>
                                                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">{t.status || 'Upcoming'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-slate-500 text-xs font-semibold">No upcoming tournaments listed currently.</p>
                                    )}
                                </div>
                            </div>

                            {/* Dress Code Card (Moved to Left Column to utilize space) */}
                            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.07)] transition-all duration-300">
                                <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-yellow-400 flex items-center justify-center shadow-sm">
                                            <Shirt className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">Dress Code</h3>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Course & Club Attire Rules</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setZoomLevel(1);
                                            setIsDressCodeModalOpen(true);
                                        }}
                                        className="w-9 h-9 sm:w-auto sm:h-auto rounded-full bg-emerald-800 hover:bg-emerald-900 text-white sm:px-4 sm:py-2 transition-all flex items-center justify-center gap-1.5 shadow-md group"
                                    >
                                        <span className="hidden sm:inline text-xs font-black">Full Inspection</span>
                                        <ArrowUpRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                    <div
                                        className="relative cursor-pointer group p-3 bg-gradient-to-b from-slate-50 to-slate-100/70 rounded-2xl border border-slate-200/50 shadow-inner flex flex-col items-center justify-center overflow-hidden"
                                        onClick={() => {
                                            setZoomLevel(1);
                                            setIsDressCodeModalOpen(true);
                                        }}
                                    >
                                        <div className="w-full bg-white rounded-xl shadow-md border border-slate-200/40 overflow-hidden relative max-h-[380px]">
                                            <img
                                                src="/storage/images/dress-code.jpg"
                                                alt="Bogura Golf Club Dress Code"
                                                className="w-full h-auto object-contain block group-hover:scale-[1.02] transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                                                <span className="bg-white/95 backdrop-blur-md text-emerald-900 text-xs px-4 py-2 rounded-full font-extrabold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-2">
                                                    <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                                                    <span>Click to Zoom</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-extrabold text-slate-900 text-base font-['Outfit']">Required Standards</h4>
                                        <div className="space-y-2.5">
                                            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-3">
                                                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                                <span className="text-xs font-bold text-slate-800">Collared T-Shirts & Tailored Trousers / Shorts</span>
                                            </div>
                                            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-3">
                                                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                                <span className="text-xs font-bold text-slate-800">Soft Spiked Golf Shoes Mandatory</span>
                                            </div>
                                            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center gap-3">
                                                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                                <span className="text-xs font-bold text-slate-800">Formal Lounge Attire for Evening Ceremonies</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Course Specifications & Facilities Card */}
                            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.03)] space-y-5">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                    <div>
                                        <span className="text-xs font-black uppercase tracking-widest text-emerald-800 block mb-1">
                                            Resort Highlights
                                        </span>
                                        <h3 className="text-2xl font-serif font-bold text-slate-900 font-['Outfit']">
                                            Course Specs & Amenities
                                        </h3>
                                    </div>
                                    <Flag className="w-6 h-6 text-emerald-800" />
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-center">
                                        <span className="text-2xl font-black text-emerald-800 font-serif block">3,222</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Yards</span>
                                    </div>
                                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-center">
                                        <span className="text-2xl font-black text-emerald-800 font-serif block">9 / 18</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Holes Track</span>
                                    </div>
                                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-center">
                                        <span className="text-2xl font-black text-emerald-800 font-serif block">Par 72</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Championship</span>
                                    </div>
                                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-center">
                                        <span className="text-2xl font-black text-emerald-800 font-serif block">1990</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Established</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                    <div className="flex items-center gap-3 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100/80">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-800 text-yellow-400 flex items-center justify-center shrink-0 shadow-sm">
                                            <Flag className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-xs text-slate-900">Driving Range</h4>
                                            <p className="text-[10px] text-slate-500 font-medium">Practice Bay & Turf</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100/80">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-800 text-yellow-400 flex items-center justify-center shrink-0 shadow-sm">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-xs text-slate-900">VIP Clubhouse</h4>
                                            <p className="text-[10px] text-slate-500 font-medium">Lounge & Dining</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100/80">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-800 text-yellow-400 flex items-center justify-center shrink-0 shadow-sm">
                                            <Trophy className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-xs text-slate-900">Tournament Arena</h4>
                                            <p className="text-[10px] text-slate-500 font-medium">Pro Golf Events</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Sidebar Right Column (35%) */}
                        <aside className="lg:w-[35%] space-y-6">

                            {/* Latest Notices Bulletins */}
                            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.03)]">
                                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-sm">
                                            <Bell className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight font-['Outfit']">Notice</h3>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Latest Bulletins</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('notices.public')}
                                        className="w-9 h-9 sm:w-auto sm:h-auto rounded-full bg-emerald-50 hover:bg-emerald-800 text-emerald-800 hover:text-white sm:px-3.5 sm:py-1.5 transition-all border border-emerald-200/60 flex items-center justify-center gap-1 shadow-2xs"
                                    >
                                        <span className="hidden sm:inline text-xs font-black">View All</span>
                                        <ArrowUpRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                                    </Link>
                                </div>

                                <div className="space-y-2.5">
                                    {notices.slice(0, 3).map(notice => (
                                        <div key={notice.id} className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                                            <h4 className="font-extrabold text-xs text-slate-800 leading-snug line-clamp-2 font-bangla">
                                                {notice.title}
                                            </h4>
                                            <span className="text-[10px] font-bold text-slate-400 mt-1 block">
                                                {new Date(notice.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* News & Updates Card */}
                            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.03)]">
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-sm">
                                        <Newspaper className="w-5 h-5 text-emerald-800" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight font-['Outfit']">News & Updates</h3>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Club Highlights</p>
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <div className="group/item bg-slate-50/80 hover:bg-emerald-50/60 p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-200/80 transition-all duration-300">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 font-extrabold text-[9px] uppercase tracking-wider border border-emerald-500/20">
                                                Payment
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400">Official</span>
                                        </div>
                                        <h4 className="font-extrabold text-slate-800 text-xs leading-snug mb-1.5 group-hover/item:text-emerald-900 transition-colors">
                                            Bill Payment Account Information
                                        </h4>
                                        <a href="#" className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 hover:text-emerald-900 transition-colors">
                                            Read Details <ArrowUpRight className="w-3 h-3" />
                                        </a>
                                    </div>

                                    <div className="group/item bg-slate-50/80 hover:bg-emerald-50/60 p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-200/80 transition-all duration-300">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 font-extrabold text-[9px] uppercase tracking-wider border border-amber-500/20">
                                                Maintenance
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400">Notice</span>
                                        </div>
                                        <h4 className="font-extrabold text-slate-800 text-xs leading-snug group-hover/item:text-emerald-900 transition-colors">
                                            Course maintenance scheduled for next Monday.
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            {/* Events MiniCalendar Card */}
                            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.03)] overflow-hidden">
                                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 flex items-center justify-center shadow-sm">
                                            <Calendar className="w-5 h-5 text-emerald-800" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight font-['Outfit']">Events</h3>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Club Schedule</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('tournaments.upcoming.public')}
                                        className="w-9 h-9 sm:w-auto sm:h-auto rounded-full bg-emerald-50 hover:bg-emerald-800 text-slate-900 hover:text-white sm:px-3.5 sm:py-1.5 transition-all border border-emerald-200/60 flex items-center justify-center gap-1 shadow-2xs"
                                    >
                                        <span className="hidden sm:inline text-xs font-black">View All</span>
                                        <ArrowUpRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                                    </Link>
                                </div>

                                <MiniCalendar events={upcomingTournaments} />
                            </div>

                            {/* Club Information & Contact Card */}
                            <div className="bg-[#121908] text-white p-6 rounded-3xl shadow-xl border border-emerald-900/60 space-y-4">
                                <div className="flex items-center gap-3 pb-3 border-b border-emerald-900/80">
                                    <MapPin className="w-5 h-5 text-yellow-400" />
                                    <div>
                                        <h4 className="font-extrabold text-sm text-white">Bogura Cantonment</h4>
                                        <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Bogura 5800, Bangladesh</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-xs text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 text-yellow-400" />
                                        <span>+880 1769-666333</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-yellow-400" />
                                        <span>info@bgcbd.com</span>
                                    </div>
                                </div>
                            </div>

                            {/* Google Map Location Card */}
                            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.03)] overflow-hidden space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-sm">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight font-['Outfit']">Location Map</h3>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bogura Cantonment</p>
                                        </div>
                                    </div>
                                    <a
                                        href="https://maps.google.com/?q=Bogura+Golf+Club+Cantonment"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-9 h-9 sm:w-auto sm:h-auto rounded-full bg-emerald-50 hover:bg-emerald-800 text-emerald-800 hover:text-white sm:px-3.5 sm:py-1.5 transition-all border border-emerald-200/60 flex items-center justify-center gap-1 shadow-2xs"
                                    >
                                        <span className="hidden sm:inline text-xs font-black">Directions</span>
                                        <ArrowUpRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
                                    </a>
                                </div>

                                <div className="w-full h-52 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative group">
                                    <iframe
                                        title="Bogura Golf Club Location Map"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14500.5!2d89.37!3d24.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDUxJzAwLjAiTiA4OcKwMjInMTIuMCJF!5e0!3m2!1sen!2sbd!4v1600000000000!5m2!1sen!2sbd"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Live Website Analytics & Visitor Stats Card */}
                            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-[0_8px_25px_rgba(0,0,0,0.03)] space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-sm">
                                            <BarChart3 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight font-['Outfit']">Website Analytics</h3>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live Visitor Traffic</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200/60">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span>Live</span>
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                                            <Eye className="w-3.5 h-3.5 text-emerald-700" />
                                            <span>Total Hits</span>
                                        </div>
                                        <span className="text-lg font-black text-slate-900 font-serif block">148,920+</span>
                                    </div>

                                    <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
                                            <Activity className="w-3.5 h-3.5 text-emerald-700" />
                                            <span>Online Now</span>
                                        </div>
                                        <span className="text-lg font-black text-emerald-800 font-serif block">28 Active</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center justify-between text-xs">
                                        <span className="font-extrabold text-slate-700">Monthly Visitors</span>
                                        <span className="font-black text-emerald-900">14,350+ / Mo</span>
                                    </div>
                                    <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs">
                                        <span className="font-extrabold text-slate-700">Member Portal Hits</span>
                                        <span className="font-black text-slate-900">3,890 / Mo</span>
                                    </div>
                                </div>
                            </div>

                        </aside>
                    </div>

                    {/* Our Partners Auto Sliding Section */}
                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.03)] overflow-hidden mt-6">
                        <style>{`
                            @keyframes partnerMarquee {
                                0% { transform: translateX(0%); }
                                100% { transform: translateX(-50%); }
                            }
                            .animate-partner-marquee-immersive {
                                display: flex;
                                width: max-content;
                                animation: partnerMarquee 22s linear infinite;
                            }
                            .animate-partner-marquee-immersive:hover {
                                animation-play-state: paused;
                            }
                        `}</style>

                        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 flex items-center justify-center shadow-sm">
                                    <Handshake className="w-5 h-5 text-emerald-800" />
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">Our Partners</h3>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Valued Sponsors & Collaborators</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[10px] font-black uppercase tracking-widest hidden sm:inline-block">
                                AUTO SLIDING
                            </span>
                        </div>

                        {partners && partners.length > 0 ? (
                            <div className="relative w-full overflow-hidden py-2 select-none">
                                <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                                <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                                <div className="animate-partner-marquee-immersive items-center gap-6 sm:gap-8">
                                    {[...partners, ...partners, ...partners].map((partner, idx) => {
                                        const CardComponent = partner.url ? 'a' : 'div';
                                        const extraProps = partner.url ? { href: partner.url, target: '_blank', rel: 'noopener noreferrer' } : {};

                                        return (
                                            <CardComponent
                                                key={`${partner.id}-${idx}`}
                                                {...extraProps}
                                                className="group flex items-center justify-center px-6 py-3.5 bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-md transition-all duration-300 shrink-0 h-20 min-w-[150px] max-w-[180px]"
                                            >
                                                {partner.logo_path ? (
                                                    <img
                                                        src={`/storage/${partner.logo_path}`}
                                                        alt={partner.name}
                                                        className="max-h-12 w-auto object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                                    />
                                                ) : (
                                                    <span className="font-black text-slate-700 group-hover:text-emerald-800 text-xs text-center truncate">
                                                        {partner.name}
                                                    </span>
                                                )}
                                            </CardComponent>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-slate-50 rounded-2xl text-center text-slate-400 text-xs font-medium">
                                No partners listed currently.
                            </div>
                        )}
                    </div>

                    {/* Other Clubs Links Section */}
                    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.03)] overflow-hidden mt-8">
                        <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 flex items-center justify-center shadow-sm">
                                <Globe className="w-5 h-5 text-emerald-800" />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">Other Clubs Links</h3>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Affiliated Golf Clubs</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {[
                                { name: "Army Golf Club", url: "http://182.160.104.235/" },
                                { name: "Bhatiary Golf & Country Club", url: "http://bhatiarygolfclubbd.com/default.aspx" },
                                { name: "Bogra Golf Club", url: "http://bgf-bd.org/UserControls/test" },
                                { name: "Chengi Golf and Country Club", url: "https://www.facebook.com/KurmitolaGolfClubKGC/" },
                                { name: "Ghatail Golf Club", url: "http://www.ggc.com.bd/" },
                                { name: "Jessore Golf Club", url: "http://bgf-bd.org/UserControls/test" },
                                { name: "Kurmitola Golf Club", url: "http://kgc-bd.com/" },
                                { name: "Mainamati Golf Club", url: "http://bgf-bd.org/UserControls/test" },
                                { name: "Ordnance Factory Golf Club", url: "http://bgf-bd.org/UserControls/test" },
                                { name: "Rangpur Golf Club", url: "https://rangpurgolfcountryclub.com/" },
                                { name: "Savar Golf Club", url: "http://sgc.com.bd/index.php" },
                                { name: "Shaheen Golf and Country Club", url: "http://shaheengolf-bd.com/home.php" },
                            ].map((club, idx) => (
                                <a key={idx} href={club.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/80 border border-slate-200/70 hover:border-emerald-300 transition-all duration-300">
                                    <span className="font-extrabold text-slate-700 group-hover:text-emerald-900 text-xs truncate">{club.name}</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-1.5" />
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* ── CSS RIPPED DIVIDER 4 ── */}
            <div className="relative w-full z-20 pointer-events-none bg-[#F4F1EA] -mb-1">
                {renderCssRippedDivider('text-[#121908]', poly4, 2)}
            </div>

            {/* ── 5. RESORT FOOTER ── */}
            <div
                id="footer-section"
                className="relative overflow-hidden transition-all duration-300"
                style={{
                    backgroundColor: (sectionConfigs.footer?.bgColor || sectionConfigs.all?.bgColor) || '#121908'
                }}
            >
                {/* Background Image Layer */}
                {((sectionConfigs.footer?.bgType || sectionConfigs.all?.bgType) === 'image') && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={sectionConfigs.footer?.bgImage || sectionConfigs.all?.bgImage || '/storage/images/hero-1.jpg'}
                            alt="Footer Background"
                            className="w-full h-full object-cover transition-all duration-300"
                            style={{
                                opacity: sectionConfigs.footer?.bgOpacity ?? sectionConfigs.all?.bgOpacity ?? 0.85,
                                filter: `blur(${sectionConfigs.footer?.bgBlur ?? sectionConfigs.all?.bgBlur ?? 0}px)`
                            }}
                        />
                        {(sectionConfigs.footer?.gradientOverlay || sectionConfigs.all?.gradientOverlay || 'dark_forest') === 'dark_forest' && (
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121908] via-[#121908]/70 to-[#121908]/90 z-1" />
                        )}
                        {(sectionConfigs.footer?.gradientOverlay || sectionConfigs.all?.gradientOverlay) === 'vignette' && (
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/85 z-1" />
                        )}
                        {(sectionConfigs.footer?.gradientOverlay || sectionConfigs.all?.gradientOverlay) === 'gradient_top' && (
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent z-1" />
                        )}
                    </div>
                )}
                <div className="relative z-10">
                    <Footer dark={true} transparent={true} />
                </div>
            </div>

            {/* DRESS CODE ZOOMABLE MODAL */}
            {isDressCodeModalOpen && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
                    onClick={() => setIsDressCodeModalOpen(false)}
                >
                    <div
                        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center px-5 py-3.5 border-b border-slate-200 bg-white z-10">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center">
                                    <Shirt className="w-4 h-4" />
                                </div>
                                <h3 className="font-extrabold text-base md:text-lg text-slate-900 font-['Outfit']">
                                    Bogura Golf Club Dress Code
                                </h3>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                                    <button
                                        type="button"
                                        onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.25))}
                                        disabled={zoomLevel <= 0.6}
                                        className="p-1.5 hover:bg-white text-slate-700 disabled:opacity-40 rounded-lg transition-all"
                                        title="Zoom Out"
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </button>

                                    <span className="text-xs font-bold text-slate-700 min-w-[48px] text-center select-none">
                                        {Math.round(zoomLevel * 100)}%
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                                        disabled={zoomLevel >= 3}
                                        className="p-1.5 hover:bg-white text-slate-700 disabled:opacity-40 rounded-lg transition-all"
                                        title="Zoom In"
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setZoomLevel(1)}
                                        className="p-1.5 hover:bg-white text-slate-600 rounded-lg transition-all border-l border-slate-200 ml-0.5"
                                        title="Reset Zoom"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => setIsDressCodeModalOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors ml-1"
                                    title="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div
                            className="overflow-auto p-4 flex justify-center items-start bg-slate-950 flex-1 relative min-h-[450px]"
                            onWheel={(e) => {
                                if (e.deltaY < 0) {
                                    setZoomLevel(prev => Math.min(3, prev + 0.15));
                                } else {
                                    setZoomLevel(prev => Math.max(0.6, prev - 0.15));
                                }
                            }}
                        >
                            <img
                                src="/storage/images/dress-code.jpg"
                                alt="Bogura Golf Club Dress Code"
                                onClick={() => setZoomLevel(prev => (prev === 1 ? 1.8 : 1))}
                                style={{
                                    transform: `scale(${zoomLevel})`,
                                    transformOrigin: 'top center',
                                    transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)'
                                }}
                                className="max-w-full h-auto object-contain shadow-2xl rounded-lg cursor-zoom-in active:cursor-grabbing transition-transform select-none my-2"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Bottom Navigation & Slide-over Sidebar */}
            <MobileBottomNav isSidebarOpen={isMobileMenuOpen} setIsSidebarOpen={setIsMobileMenuOpen} />
        </div>
    );
}
