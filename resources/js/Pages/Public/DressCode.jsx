import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    CheckCircle2, 
    XCircle, 
    ShieldCheck, 
    Download, 
    Printer, 
    Eye, 
    X, 
    ZoomIn, 
    Award, 
    Coffee, 
    Compass, 
    ChevronRight, 
    AlertCircle, 
    Sparkles, 
    Shirt, 
    ExternalLink,
    HelpCircle
} from 'lucide-react';

export default function DressCode() {
    const { site_settings } = usePage().props;
    const siteName = site_settings?.site_name || 'Bogura Golf Club';

    const [activeSection, setActiveSection] = useState('all'); // 'all' | 'course-men' | 'course-women' | 'ceremony' | 'restaurant'
    const [posterModalOpen, setPosterModalOpen] = useState(false);

    const posterUrl = '/images/bgc-dress-code.jpg';

    const sections = [
        {
            id: 'course-men',
            title: 'On Golf Course: Gentlemen',
            badge: 'Playing Attire',
            badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            description: 'Proper golfing attire required on all fairways, greens, tees, and driving practice bays.',
            dos: [
                'Polo shirt with collar and sleeves, properly tucked in at all times.',
                'Tailored trousers or tailored knee-length Bermudas with belt.',
                'Soft-spiked regulation golf shoes with proper sports socks.'
            ],
            donts: [
                'Round-neck collarless T-shirts or sleeveless shirts / gym vests.',
                'Shirts with prominent commercial advertisements or loud slogans.',
                'Denim jeans, cargo pants, or drawstring track pants.',
                'Sandals, flip-flops, chappals, or open-toe footwear.',
                'Jogging shorts, athletic skins, swim shorts, or beach wear.',
                'Traditional attire (Thobe, Panjabi, Lungi) on the playing course.'
            ]
        },
        {
            id: 'course-women',
            title: 'On Golf Course: Ladies',
            badge: 'Playing Attire',
            badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            description: 'Tailored athletic golf apparel designed for agility, course safety, and decorum.',
            dos: [
                'Golf shirts with collar and sleeves (or tailored sleeveless golf polo with collar).',
                'Tailored trousers, Capris, Bermudas, or Culottes with belt.',
                'Regulation soft-spiked golf shoes or soft-soled sports shoes.'
            ],
            donts: [
                'T-shirts with commercial advertisements or oversized graphics.',
                'Tank tops, halter tops, low-cut tops, or bare midriff shirts.',
                'Athletic tights, skins, leggings, or cycling shorts as sole outerwear.',
                'Denim jeans of any cut or wash.',
                'Sandals, slippers, flip-flops, or high heels.',
                'Sarees or loose unfastened drapery on the active fairways.'
            ]
        },
        {
            id: 'ceremony',
            title: 'Prize Distribution & Official Ceremonies',
            badge: 'Formal Protocol',
            badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
            description: 'Prescribed ceremonial attire for tournament banquets, award presentations, and club dinners.',
            dos: [
                'Gentlemen: Formal lounge suit, coat & tie, formal blazer with dress trousers and polished dress shoes.',
                'Gentlemen: National formal wear (Bandgala / Prince coat / Formal Sherwani) when designated.',
                'Ladies: Elegant formal sarees, formal salwar kameez, or tailored executive evening wear.'
            ],
            donts: [
                'Casual golf playing attire or sweaty polo shirts immediately after play.',
                'Sneakers, sandals, slippers, or athletic trainers.',
                'Casual jeans, polo t-shirts, or sportswear without jacket/blazer.'
            ]
        },
        {
            id: 'restaurant',
            title: 'Clubhouse Restaurant & Lounge',
            badge: 'Clubhouse Decorum',
            badgeColor: 'bg-slate-900 text-white',
            description: 'Smart casual and dining standards for club lounges, patios, and dining halls.',
            dos: [
                'Smart casual: Collared button-down shirts, clean polos, chinos, and tailored trousers.',
                'Fresh golf attire immediately following an active round.',
                'Traditional smart wear: Crisp clean Panjabi with pyjama or formal saree.'
            ],
            donts: [
                'Sleeveless singlets, gym vests, or unbuttoned shirts.',
                'Distressed, torn, faded, or cut-off jeans.',
                'Bathroom slippers, muddy golf shoes, or dirty footwear.'
            ]
        }
    ];

    const filteredSections = activeSection === 'all' 
        ? sections 
        : sections.filter(s => s.id === activeSection);

    return (
        <PublicLayout>
            <Head title={`Dress Code Guidelines - ${siteName}`} />

            <div className="bg-[#F8F9F8] min-h-screen text-slate-900 pb-20">
                
                {/* ══════════════════════════════════════════════════════
                   HERO HEADER BANNER
                ══════════════════════════════════════════════════════ */}
                <div className="relative bg-gradient-to-b from-[#162417] via-[#1C2C1D] to-[#253926] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-md">
                    {/* Background Graphic Rings */}
                    <div className="absolute inset-0 pointer-events-none opacity-10">
                        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-4 border-amber-300"></div>
                        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full border border-white"></div>
                    </div>

                    <div className="max-w-6xl mx-auto relative z-10 space-y-6">
                        
                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-xs font-semibold text-emerald-200/80">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <span>/</span>
                            <span>Club Etiquette</span>
                            <span>/</span>
                            <span className="text-white">Dress Code</span>
                        </nav>

                        {/* Badges & Titles */}
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-100">
                                <Shirt className="w-3.5 h-3.5 text-amber-300" />
                                <span>Official BGC Regulations &bull; Course & Clubhouse Etiquette</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-display">
                                Club Dress Code & Regulations
                            </h1>

                            <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed font-normal">
                                Bogura Golf Club upholds the cherished traditions of the game. All members, guests, and tournament participants are requested to adhere to our prescribed dress code standards.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setPosterModalOpen(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102"
                            >
                                <Eye className="w-4 h-4" />
                                <span>View Official Poster</span>
                            </button>

                            <a
                                href={posterUrl}
                                download="BGC-Dress-Code.jpg"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all"
                            >
                                <Download className="w-4 h-4 text-amber-300" />
                                <span>Download Poster</span>
                            </a>

                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-colors ml-auto hidden sm:inline-flex"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Print Guide</span>
                            </button>
                        </div>

                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════
                   KEY ATTIRE PILLARS (4 SAGE CARDS)
                ══════════════════════════════════════════════════════ */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                        
                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                            <div className="w-9 h-9 rounded-xl bg-[#D4E2D2] text-[#1C2C1D] flex items-center justify-center mb-3">
                                <Shirt className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Course Men</span>
                                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Collared Polo</p>
                                <span className="text-[11px] text-slate-600 mt-1 block">Tucked in &bull; Soft spikes &bull; Belt</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                            <div className="w-9 h-9 rounded-xl bg-[#E2E6D5] text-[#2C442E] flex items-center justify-center mb-3">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Course Ladies</span>
                                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Tailored Polo</p>
                                <span className="text-[11px] text-slate-600 mt-1 block">Slacks / Bermudas / Culottes</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                                <Award className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Ceremonies</span>
                                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Lounge Suits</p>
                                <span className="text-[11px] text-slate-600 mt-1 block">Blazers &bull; Coat & Tie &bull; Saree</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                                <Coffee className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Clubhouse</span>
                                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Smart Casual</p>
                                <span className="text-[11px] text-slate-600 mt-1 block">Dining &bull; Lounge &bull; Terrace</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                   FILTER TABS & OFFICIAL POSTER PREVIEW CARD
                ══════════════════════════════════════════════════ */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
                    
                    {/* Filter Pills Bar */}
                    <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-xs flex flex-wrap gap-1.5 items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { id: 'all', label: 'All Dress Codes' },
                                { id: 'course-men', label: '⛳ On Course (Men)' },
                                { id: 'course-women', label: '⛳ On Course (Ladies)' },
                                { id: 'ceremony', label: '🏆 Prize Ceremony' },
                                { id: 'restaurant', label: '🍽️ Restaurant & Lounge' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveSection(tab.id)}
                                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                        activeSection === tab.id
                                            ? 'bg-[#1C2C1D] text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => setPosterModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 rounded-xl transition-colors shrink-0"
                        >
                            <ZoomIn className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Enlarge Official Poster</span>
                        </button>
                    </div>

                    {/* ══════════════════════════════════════════════════
                       DOS & DON'TS DETAILED BREAKDOWN
                    ══════════════════════════════════════════════════ */}
                    <div className="space-y-8">
                        {filteredSections.map((sec) => (
                            <div 
                                key={sec.id}
                                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                                    <div>
                                        <div className="flex items-center gap-2.5">
                                            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                                                {sec.title}
                                            </h2>
                                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${sec.badgeColor}`}>
                                                {sec.badge}
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                            {sec.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    {/* ── ACCEPTABLE ATTRIRE (DOS) ── */}
                                    <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/90 space-y-4">
                                        <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm sm:text-base uppercase tracking-wider">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                            <span>Permitted & Appropriate (Dos)</span>
                                        </div>

                                        <ul className="space-y-3">
                                            {sec.dos.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                                                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* ── STRICTLY PROHIBITED (DON'TS) ── */}
                                    <div className="p-5 sm:p-6 rounded-2xl bg-rose-50/60 border border-rose-200/90 space-y-4">
                                        <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm sm:text-base uppercase tracking-wider">
                                            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                                            <span>Strictly Prohibited (Don'ts)</span>
                                        </div>

                                        <ul className="space-y-3">
                                            {sec.donts.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
                                                    <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                                        <XCircle className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ══════════════════════════════════════════════════
                       OFFICIAL POSTER SHOWCASE CARD
                    ══════════════════════════════════════════════════ */}
                    <div className="bg-gradient-to-r from-slate-900 to-[#1C2C1D] text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                        <div className="space-y-4 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-amber-300">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Official Poster Bulletin</span>
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                                Official BGC Dress Code Notice Board Poster
                            </h3>

                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                As published and displayed throughout the Bogura Golf Club premises, Golf Academy, Pro Shop, and Clubhouse entrance. Click to view in full resolution or download a digital copy.
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setPosterModalOpen(true)}
                                    className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                    <span>Inspect Poster Fullscreen</span>
                                </button>

                                <a
                                    href={posterUrl}
                                    download="BGC-Dress-Code.jpg"
                                    className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4 text-amber-400" />
                                    <span>Download JPG</span>
                                </a>
                            </div>
                        </div>

                        {/* Thumbnail of Poster */}
                        <div 
                            onClick={() => setPosterModalOpen(true)}
                            className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 group cursor-pointer w-full max-w-xs shrink-0 hover:scale-102 transition-transform"
                        >
                            <img 
                                src={posterUrl} 
                                alt="Bogura Golf Club Official Dress Code Poster" 
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
                                <ZoomIn className="w-5 h-5 text-emerald-400" />
                                <span>Click to Enlarge</span>
                            </div>
                        </div>
                    </div>

                    {/* ══════════════════════════════════════════════════
                       ENFORCEMENT & MARSHAL NOTICE
                    ══════════════════════════════════════════════════ */}
                    <div className="p-6 rounded-3xl bg-[#E2E6D5] border border-[#CCD3BD] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                                <AlertCircle className="w-4 h-4 text-[#2C442E]" />
                                <span>Course Marshal & Management Discretion</span>
                            </div>
                            <p className="text-xs text-[#2A3F2B]/90 leading-relaxed">
                                Course Marshals, Starter Pavilion officials, and Food & Beverage staff have the full authority to deny access or service to any player or guest who does not meet the prescribed dress code requirements.
                            </p>
                        </div>

                        <Link
                            href="/contact-us"
                            className="px-5 py-2.5 rounded-xl bg-[#1C2C1D] text-white text-xs font-bold hover:bg-[#2C442E] transition-all shrink-0 shadow-xs flex items-center gap-2"
                        >
                            <span>Club Secretariat</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
               POSTER FULLSCREEN LIGHTBOX MODAL
            ══════════════════════════════════════════════════ */}
            {posterModalOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setPosterModalOpen(false)}
                >
                    <div 
                        className="relative max-w-4xl max-h-[92vh] w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <Shirt className="w-4 h-4 text-emerald-400" />
                                <span>Official Bogura Golf Club Dress Code Poster</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={posterUrl}
                                    download="BGC-Dress-Code.jpg"
                                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                                    title="Download image"
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setPosterModalOpen(false)}
                                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Image Body with Scroll */}
                        <div className="p-4 overflow-y-auto flex items-center justify-center bg-slate-950/60 max-h-[80vh]">
                            <img 
                                src={posterUrl} 
                                alt="Bogura Golf Club Dress Code Full Resolution" 
                                className="w-auto max-h-[76vh] object-contain rounded-xl shadow-lg border border-white/10"
                            />
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
