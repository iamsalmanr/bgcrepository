import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PublicLayout from '@/Layouts/PublicLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserDropdown from '@/Components/UserDropdown';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Image as ImageIcon, 
    X, 
    ChevronLeft, 
    ChevronRight, 
    Download, 
    Maximize2, 
    Sparkles, 
    Calendar,
    ChevronRight as BreadcrumbChevron,
    Search,
    Filter,
    Grid,
    LayoutGrid,
    Eye,
    Compass,
    Trophy,
    Building2,
    Layers,
    Share2,
    Activity,
    Flag,
    Award
} from 'lucide-react';

export default function Gallery({ galleryImages = [], mediaImages = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [selectedIdx, setSelectedIdx] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [layoutMode, setLayoutMode] = useState('bento'); // 'bento' or 'grid'
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent background scrolling when lightbox is open
    useEffect(() => {
        if (selectedIdx !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedIdx]);

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    // Helper to resolve asset URLs
    const resolveAssetUrl = (path, fallback = 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop') => {
        if (!path) return fallback;
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `/storage/${cleanPath}`;
    };

    // Normalize media items
    const normalizedMedia = useMemo(() => (mediaImages || []).map(media => {
        const dateObj = media.created_at ? new Date(media.created_at) : new Date();
        const monthStr = dateObj.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        const folderTag = media.folder || 'General';
        return {
            id: `media-${media.id}`,
            image_path: media.file_path,
            title: media.name || 'Bogura Golf Club Memory',
            category: folderTag,
            folder: folderTag,
            dateLabel: monthStr,
            year: String(dateObj.getFullYear())
        };
    }), [mediaImages]);

    // Normalize gallery images with folder title
    const normalizedGallery = useMemo(() => (galleryImages || []).map(img => {
        const folderTag = img.folder || img.category || 'General';
        const dateObj = img.created_at ? new Date(img.created_at) : new Date();
        const monthStr = dateObj.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        return {
            id: `gallery-${img.id}`,
            image_path: img.image_path,
            title: img.title || 'Bogura Golf Club',
            category: folderTag,
            folder: folderTag,
            dateLabel: monthStr,
            year: String(dateObj.getFullYear())
        };
    }), [galleryImages]);

    // Combine all images
    const allImages = useMemo(() => [...normalizedGallery, ...normalizedMedia], [normalizedGallery, normalizedMedia]);

    // Extract Dynamic Categories based on Folder Titles
    const categories = useMemo(() => {
        const setOfFolders = new Set();
        allImages.forEach(img => {
            if (img.category && img.category !== 'All') {
                setOfFolders.add(img.category);
            }
        });
        const dynamicList = [{ label: 'All Photos', value: 'All', icon: Sparkles }];
        Array.from(setOfFolders).sort().forEach(f => {
            dynamicList.push({
                label: f,
                value: f,
                icon: f.toLowerCase().includes('tournament') ? Trophy : 
                      f.toLowerCase().includes('course') ? Compass : 
                      f.toLowerCase().includes('club') ? Building2 : Layers
            });
        });
        return dynamicList;
    }, [allImages]);

    // Filtered Images
    const filteredImages = useMemo(() => {
        return allImages.filter(img => {
            const matchesFilter = activeFilter === 'All' || img.category === activeFilter;
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q || 
                (img.title && img.title.toLowerCase().includes(q)) ||
                (img.category && img.category.toLowerCase().includes(q));

            return matchesFilter && matchesSearch;
        });
    }, [allImages, activeFilter, searchQuery]);

    // Lightbox navigation keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedIdx === null) return;
            if (e.key === 'Escape') setSelectedIdx(null);
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'ArrowRight') handleNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIdx, filteredImages]);

    const handlePrev = () => {
        if (selectedIdx === null || filteredImages.length === 0) return;
        setSelectedIdx((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1));
    };

    const handleNext = () => {
        if (selectedIdx === null || filteredImages.length === 0) return;
        setSelectedIdx((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0));
    };

    const currentImage = selectedIdx !== null ? filteredImages[selectedIdx] : null;

    // ─────────────────────────────────────────────────────────────
    // RENDER MAIN GALLERY CONTENT
    // ─────────────────────────────────────────────────────────────
    const galleryContent = (
        <div className="space-y-6 sm:space-y-8">
            {/* ── 1. STATS BENTO METRICS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                <div className="bg-[#D4E2D2] rounded-2xl sm:rounded-[22px] p-3.5 sm:p-4 border border-[#BFD4BD] flex flex-col justify-between shadow-xs">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block truncate">
                        Total Photos
                    </span>
                    <div className="mt-2 sm:mt-3">
                        <p className="text-xl sm:text-3xl font-black text-slate-900 font-display">
                            {allImages.length}
                        </p>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-[#2B402C] mt-0.5 block truncate">
                            Curated High-Res Memories
                        </span>
                    </div>
                </div>

                <div className="bg-[#E2E6D5] rounded-2xl sm:rounded-[22px] p-3.5 sm:p-4 border border-[#CCD3BD] flex flex-col justify-between shadow-xs">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block truncate">
                        Albums & Categories
                    </span>
                    <div className="mt-2 sm:mt-3">
                        <p className="text-xl sm:text-3xl font-black text-slate-900 font-display">
                            {Math.max(1, categories.length - 1)}
                        </p>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-[#2B402C] mt-0.5 block truncate">
                            Organized Collections
                        </span>
                    </div>
                </div>

                <div className="bg-[#DFE5D4] rounded-2xl sm:rounded-[22px] p-3.5 sm:p-4 border border-[#CBD4BD] flex flex-col justify-between shadow-xs">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block truncate">
                        Course Views
                    </span>
                    <div className="mt-2 sm:mt-3">
                        <p className="text-xl sm:text-3xl font-black text-slate-900 font-display">
                            9 Holes
                        </p>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-[#2B402C] mt-0.5 block truncate">
                            Bermuda Greens & Lakes
                        </span>
                    </div>
                </div>

                <div className="bg-[#D8DFD5] rounded-2xl sm:rounded-[22px] p-3.5 sm:p-4 border border-[#C5CEC1] flex flex-col justify-between shadow-xs">
                    <span className="text-[10px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block truncate">
                        Tournaments
                    </span>
                    <div className="mt-2 sm:mt-3">
                        <p className="text-xl sm:text-3xl font-black text-slate-900 font-display">
                            Presidents Cup
                        </p>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-[#2B402C] mt-0.5 block truncate">
                            Championship Rounds
                        </span>
                    </div>
                </div>
            </div>

            {/* ── 2. FILTER & SEARCH CONTROL TOOLBAR ── */}
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeFilter === cat.value;
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setActiveFilter(cat.value)}
                                className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                                    isActive
                                        ? 'bg-[#1C2C1D] text-white shadow-xs'
                                        : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                                }`}
                            >
                                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                                <span>{cat.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Search & Layout Toggle */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="relative flex-1 md:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search photos..."
                            className="w-full pl-10 pr-9 py-2 rounded-full bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1C2C1D]/20 focus:bg-white transition-all placeholder:text-slate-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center p-1 bg-slate-100/80 rounded-full border border-slate-200/80 shrink-0">
                        <button
                            onClick={() => setLayoutMode('bento')}
                            className={`p-1.5 rounded-full transition-all ${
                                layoutMode === 'bento' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
                            }`}
                            title="Bento Collage View"
                            aria-label="Bento layout"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setLayoutMode('grid')}
                            className={`p-1.5 rounded-full transition-all ${
                                layoutMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500 hover:text-slate-800'
                            }`}
                            title="Uniform Grid View"
                            aria-label="Grid layout"
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── 3. IMAGE GALLERY GRID ── */}
            {filteredImages.length > 0 ? (
                <div className={
                    layoutMode === 'bento'
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-[240px] sm:auto-rows-[280px]"
                        : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                }>
                    {filteredImages.map((img, idx) => {
                        const isLarge = layoutMode === 'bento' && (idx % 7 === 0 || idx % 7 === 4);
                        return (
                            <div
                                key={img.id || idx}
                                onClick={() => setSelectedIdx(idx)}
                                className={`group relative overflow-hidden rounded-[24px] sm:rounded-[28px] bg-slate-900 cursor-pointer border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 ${
                                    isLarge ? 'sm:col-span-2 sm:row-span-2' : 'col-span-1 row-span-1'
                                }`}
                            >
                                <img
                                    src={resolveAssetUrl(img.image_path)}
                                    alt={img.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 will-change-transform"
                                />

                                {/* Subtle Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                                {/* Category Tag */}
                                <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-10">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white backdrop-blur-md border border-white/20">
                                        {img.category}
                                    </span>
                                </div>

                                {/* Zoom Icon Overlay on Hover */}
                                <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center">
                                        <Maximize2 className="w-4 h-4" />
                                    </div>
                                </div>

                                {/* Bottom Title & Date */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 z-10 text-white">
                                    <h3 className="text-sm sm:text-base font-bold font-display line-clamp-1 group-hover:text-amber-300 transition-colors">
                                        {img.title && !img.title.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? img.title : img.category}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-1">
                                        <span>{img.dateLabel || 'Bogura Golf Club'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-[28px] p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#D4E2D2] text-[#1C2C1D] mx-auto flex items-center justify-center">
                        <ImageIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 font-display">No Photos Found</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                            There are no photos matching "{searchQuery || activeFilter}". Try selecting another category or clearing your search.
                        </p>
                    </div>
                    <button
                        onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
                        className="px-6 py-2.5 rounded-full bg-[#1C2C1D] text-white font-bold text-xs uppercase tracking-wider shadow-xs hover:bg-[#2C442E] transition-colors"
                    >
                        View All Photos ({allImages.length})
                    </button>
                </div>
            )}

        </div>
    );

    // ─────────────────────────────────────────────────────────────
    // 4. PORTAL-MOUNTED CINEMATIC LIGHTBOX (Elevated above all layout elements)
    // ─────────────────────────────────────────────────────────────
    const lightboxModal = isMounted && currentImage && typeof document !== 'undefined' ? createPortal(
        <div 
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none"
            style={{ 
                paddingTop: 'max(1.25rem, env(safe-area-inset-top, 24px))',
                paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 24px))'
            }}
            onClick={() => setSelectedIdx(null)}
        >
            {/* Lightbox Header with high-contrast prominent controls */}
            <div className="flex items-center justify-between text-white relative z-20 pb-2" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs font-bold text-slate-300 bg-white/15 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md shadow-sm">
                        {selectedIdx + 1} / {filteredImages.length}
                    </span>
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-widest hidden sm:inline px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40">
                        {currentImage.category}
                    </span>
                </div>

                {/* Controls Bar */}
                <div className="flex items-center gap-2">
                    <a
                        href={resolveAssetUrl(currentImage.image_path)}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-white/15 hover:bg-emerald-700 text-white transition-all border border-white/25 shadow-sm active:scale-95 cursor-pointer flex items-center justify-center"
                        title="Download Photo"
                        aria-label="Download Photo"
                    >
                        <Download className="w-4 h-4" />
                    </a>

                    <button
                        type="button"
                        onClick={() => setSelectedIdx(null)}
                        className="px-4 py-2 rounded-full bg-white/25 hover:bg-rose-600 active:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/40 shadow-xl flex items-center gap-1.5 cursor-pointer backdrop-blur-md active:scale-95"
                        title="Close (Esc)"
                        aria-label="Close image preview"
                    >
                        <X className="w-4 h-4 text-white" strokeWidth={2.5} />
                        <span>Close</span>
                    </button>
                </div>
            </div>

            {/* Lightbox Main Stage */}
            <div className="relative flex-1 flex items-center justify-center my-auto py-2" onClick={e => e.stopPropagation()}>
                {/* Prev Button */}
                <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-6 z-30 p-3 sm:p-3.5 rounded-full bg-black/60 text-white hover:bg-emerald-700 transition-all border border-white/20 shadow-2xl backdrop-blur-md hover:scale-105 active:scale-95 cursor-pointer"
                    title="Previous (Left Arrow)"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Displayed Image */}
                <div className="relative max-w-full max-h-[72vh] flex items-center justify-center">
                    <img 
                        src={resolveAssetUrl(currentImage.image_path)} 
                        alt={currentImage.title || "Gallery Photo"} 
                        className="max-w-full max-h-[72vh] object-contain rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-300 border border-white/10"
                    />
                </div>

                {/* Next Button */}
                <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-2 sm:right-6 z-30 p-3 sm:p-3.5 rounded-full bg-black/60 text-white hover:bg-emerald-700 transition-all border border-white/20 shadow-2xl backdrop-blur-md hover:scale-105 active:scale-95 cursor-pointer"
                    title="Next (Right Arrow)"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            {/* Lightbox Bottom Caption */}
            <div className="text-center text-white max-w-xl mx-auto pt-2 pb-1 relative z-20 space-y-1" onClick={e => e.stopPropagation()}>
                <h3 className="text-sm sm:text-lg font-bold tracking-tight text-white drop-shadow-md px-2 truncate">
                    {currentImage.title && !currentImage.title.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? currentImage.title : currentImage.category}
                </h3>
                <p className="text-[11px] sm:text-xs text-emerald-300/80 font-medium">
                    {currentImage.dateLabel ? `${currentImage.dateLabel} • Bogura Golf Club` : 'Bogura Cantonment, Majhira'}
                </p>
            </div>
        </div>,
        document.body
    ) : null;

    // ─────────────────────────────────────────────────────────────
    // AUTHENTICATED DASHBOARD WRAPPER
    // ─────────────────────────────────────────────────────────────
    if (user) {
        return (
            <AuthenticatedLayout header="Photo Gallery">
                <Head title="Photo Gallery & Course Memories - Bogura Golf Club" />

                <div className="bg-[#F8F9F8] min-h-screen text-slate-900 pb-16">
                    <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 sm:space-y-7">
                        
                        {/* ── TOP HEADER ── */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                                    Photo Gallery & Course Memories
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
                                    <span>Bogura Golf Club &bull; High-Resolution Visual Archives</span>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1 text-[#2B402C] font-semibold">
                                        <span className="w-2 h-2 rounded-full bg-[#3D5A3E]"></span>
                                        {allImages.length} Curated Photos
                                    </span>
                                </p>
                            </div>
                        </div>

                        {galleryContent}
                    </div>
                </div>

                {lightboxModal}
            </AuthenticatedLayout>
        );
    }

    // ─────────────────────────────────────────────────────────────
    // PUBLIC GUEST WRAPPER
    // ─────────────────────────────────────────────────────────────
    return (
        <PublicLayout>
            <Head title="Photo Gallery & Course Memories - Bogura Golf Club" />

            {/* Public Hero */}
            <div className="relative bg-gradient-to-b from-[#092215] via-[#0c2e1d] to-[#081b11] text-white pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden">
                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                    <nav aria-label="Breadcrumb" className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 text-[11px] sm:text-xs font-semibold text-emerald-300/85 uppercase tracking-wider mb-4">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <BreadcrumbChevron className="w-3.5 h-3.5 opacity-50" />
                        <span className="text-white font-bold">Photo Gallery</span>
                    </nav>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-3 font-display">
                        Course Memories & Photo Gallery
                    </h1>
                    <p className="text-sm sm:text-base text-emerald-100/85 max-w-2xl mx-auto leading-relaxed">
                        A visual journey through Bogura Golf Club’s lush 9-hole fairways, championship tournaments, and club events.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-16">
                {galleryContent}
            </div>

            {lightboxModal}
        </PublicLayout>
    );
}
