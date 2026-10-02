import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Search, Calendar, FileText, Download, 
    ExternalLink, Eye, X, Filter, ChevronRight, 
    ShieldAlert, Award, Compass, Bell, ArrowUpRight,
    Trophy, Flag, ShieldCheck, Activity, Plus
} from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserDropdown from '@/Components/UserDropdown';
import { formatBanglaDigits } from '@/lib/utils';

// Asset resolver
const resolveAssetUrl = (path) => {
    if (!path) return '';
    const str = String(path).trim();
    if (str.startsWith('http://') || str.startsWith('https://')) return str;
    if (str.startsWith('/storage/')) return str;
    if (str.startsWith('storage/')) return `/${str}`;
    if (str.startsWith('/images/') || str.startsWith('/assets/')) return str;
    if (str.startsWith('/')) return str;
    return `/storage/${str}`;
};

const isBangla = (text) => /[\u0980-\u09FF]/.test(String(text || ''));

export default function NoticeBoard({ notices = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [activeNotice, setActiveNotice] = useState(null);

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    const formatDateDDMMYYYY = (dateStr) => {
        if (!dateStr) return '—';
        const clean = String(dateStr).substring(0, 10).split('-');
        if (clean.length === 3) return `${clean[2]}-${clean[1]}-${clean[0]}`;
        return dateStr;
    };

    // Filter categories
    const categories = ['ALL', 'TOURNAMENTS', 'MEMBERSHIP', 'COURSE MAINTENANCE', 'ADMINISTRATION'];

    const getNoticeCategory = (notice) => {
        if (notice.category) return notice.category.toUpperCase();
        const title = (notice.title || '').toLowerCase();
        const content = (notice.content || notice.description || '').toLowerCase();
        if (title.includes('cup') || title.includes('tournament') || title.includes('match') || title.includes('flight')) {
            return 'TOURNAMENTS';
        }
        if (title.includes('member') || title.includes('card') || title.includes('renewal') || title.includes('handicap')) {
            return 'MEMBERSHIP';
        }
        if (title.includes('aeration') || title.includes('maintenance') || title.includes('green') || title.includes('course')) {
            return 'COURSE MAINTENANCE';
        }
        return 'ADMINISTRATION';
    };

    // Calculate category counts
    const categoryCounts = useMemo(() => {
        const counts = { ALL: notices.length, TOURNAMENTS: 0, MEMBERSHIP: 0, 'COURSE MAINTENANCE': 0, ADMINISTRATION: 0 };
        notices.forEach(n => {
            const cat = getNoticeCategory(n);
            if (counts[cat] !== undefined) counts[cat]++;
            else counts.ADMINISTRATION++;
        });
        return counts;
    }, [notices]);

    // Filtered notices list
    const filteredNotices = useMemo(() => {
        return notices.filter(notice => {
            const matchesSearch = 
                (notice.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (notice.content || notice.description || '').toLowerCase().includes(searchQuery.toLowerCase());
            
            if (!matchesSearch) return false;
            if (selectedCategory === 'ALL') return true;

            const category = getNoticeCategory(notice);
            return category === selectedCategory;
        });
    }, [notices, searchQuery, selectedCategory]);

    // ─────────────────────────────────────────────────────────────
    // 1. MEMBER AUTHENTICATED VIEW
    // ─────────────────────────────────────────────────────────────
    if (user) {
        return (
            <AuthenticatedLayout header="Notice Board">
                <Head title="Notice Board & Circulars - Bogura Golf Club" />

                <div className="bg-[#F8F9F8] min-h-screen text-slate-900 pb-16">
                    <div className="max-w-[1520px] mx-auto px-3.5 sm:px-6 lg:px-8 pt-3 sm:pt-6 space-y-3 sm:space-y-6">
                        
                        {/* ── TOP HEADER ── */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
                            <div>
                                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                                    Notice Board & Official Bulletins
                                </h1>
                                <p className="text-[11px] sm:text-sm text-slate-500 font-medium mt-0.5 sm:mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                                    <span>Bogura Golf Club &bull; Member Bulletin Portal</span>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1 text-[#2B402C] font-semibold">
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#3D5A3E]"></span>
                                        {notices.length} Published Notices
                                    </span>
                                </p>
                            </div>

                            {/* Search Pill */}
                            <div className="flex items-center gap-3">
                                <div className="relative w-full md:w-80 lg:w-96">
                                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search circulars or topics..."
                                        className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-1.5 sm:py-2.5 rounded-full bg-white border border-slate-200/80 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] shadow-xs transition-all"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── 4 COMPACT STATS CARDS (Bento Row - Compact on Mobile) ── */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                            
                            {/* Card 1: All Notices */}
                            <button
                                type="button"
                                onClick={() => setSelectedCategory('ALL')}
                                className={`rounded-xl sm:rounded-[24px] p-2.5 sm:p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                    selectedCategory === 'ALL'
                                        ? 'bg-[#D4E2D2] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-sm sm:shadow-md scale-[1.01]'
                                        : 'bg-[#D4E2D2] border-[#BFD4BD] hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-1 w-full">
                                    <div className="min-w-0">
                                        <span className="text-[9px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider truncate block leading-tight">All Circulars</span>
                                        <p className="text-lg sm:text-3xl font-black text-slate-900 font-display leading-none mt-0.5 sm:mt-2">{categoryCounts.ALL}</p>
                                    </div>
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-[#1C2C1D] flex items-center justify-center shadow-xs shrink-0 ml-1">
                                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                                <span className="hidden sm:block text-[11px] font-semibold text-[#243B26] mt-1.5 truncate">Official Bulletins</span>
                            </button>

                            {/* Card 2: Tournaments */}
                            <button
                                type="button"
                                onClick={() => setSelectedCategory('TOURNAMENTS')}
                                className={`rounded-xl sm:rounded-[24px] p-2.5 sm:p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                    selectedCategory === 'TOURNAMENTS'
                                        ? 'bg-[#E2E6D5] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-sm sm:shadow-md scale-[1.01]'
                                        : 'bg-[#E2E6D5] border-[#CCD3BD] hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-1 w-full">
                                    <div className="min-w-0">
                                        <span className="text-[9px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider truncate block leading-tight">Tournaments</span>
                                        <p className="text-lg sm:text-3xl font-black text-slate-900 font-display leading-none mt-0.5 sm:mt-2">{categoryCounts.TOURNAMENTS}</p>
                                    </div>
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs shrink-0 ml-1">
                                        <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                                <span className="hidden sm:block text-[11px] font-semibold text-[#35432B] mt-1.5 truncate">Match Circulars</span>
                            </button>

                            {/* Card 3: Course Maintenance */}
                            <button
                                type="button"
                                onClick={() => setSelectedCategory('COURSE MAINTENANCE')}
                                className={`rounded-xl sm:rounded-[24px] p-2.5 sm:p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                    selectedCategory === 'COURSE MAINTENANCE'
                                        ? 'bg-[#DFE5D4] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-sm sm:shadow-md scale-[1.01]'
                                        : 'bg-[#DFE5D4] border-[#CBD4BD] hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-1 w-full">
                                    <div className="min-w-0">
                                        <span className="text-[9px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider truncate block leading-tight">Course Status</span>
                                        <p className="text-lg sm:text-3xl font-black text-slate-900 font-display leading-none mt-0.5 sm:mt-2">{categoryCounts['COURSE MAINTENANCE']}</p>
                                    </div>
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs shrink-0 ml-1">
                                        <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                                <span className="hidden sm:block text-[11px] font-semibold text-[#2B402C] mt-1.5 truncate">Grounds & Aeration</span>
                            </button>

                            {/* Card 4: Membership & Admin */}
                            <button
                                type="button"
                                onClick={() => setSelectedCategory('ADMINISTRATION')}
                                className={`rounded-xl sm:rounded-[24px] p-2.5 sm:p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                    selectedCategory === 'ADMINISTRATION'
                                        ? 'bg-[#D8DFD5] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-sm sm:shadow-md scale-[1.01]'
                                        : 'bg-[#D8DFD5] border-[#C5CEC1] hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-1 w-full">
                                    <div className="min-w-0">
                                        <span className="text-[9px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider truncate block leading-tight">Administration</span>
                                        <p className="text-lg sm:text-3xl font-black text-slate-900 font-display leading-none mt-0.5 sm:mt-2">{categoryCounts.ADMINISTRATION + categoryCounts.MEMBERSHIP}</p>
                                    </div>
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs shrink-0 ml-1">
                                        <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                                <span className="hidden sm:block text-[11px] font-semibold text-[#2B3B2C] mt-1.5 truncate">Governance & Notices</span>
                            </button>

                        </div>

                        {/* ── CATEGORY PILL TABS BAR (Horizontal Scrollbar Hidden on Mobile) ── */}
                        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 scrollbar-hide no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
                                        selectedCategory === cat
                                            ? 'bg-slate-900 text-white shadow-xs'
                                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                                    }`}
                                >
                                    <span>{cat}</span>
                                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-bold ${
                                        selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {categoryCounts[cat] !== undefined ? categoryCounts[cat] : 0}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* ── NOTICES BENTO GRID ── */}
                        {filteredNotices.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredNotices.map((notice) => {
                                    const pubDate = notice.created_at ? new Date(notice.created_at) : null;
                                    const category = getNoticeCategory(notice);
                                    const fileUrl = resolveAssetUrl(notice.file_path);
                                    const isPdf = fileUrl.toLowerCase().endsWith('.pdf');

                                    return (
                                        <div
                                            key={notice.id}
                                            className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#D4E2D2] text-[#1C2C1D] border border-[#BFD4BD]">
                                                        {category}
                                                    </span>

                                                    {pubDate && (
                                                        <span className="text-[11px] font-bold text-slate-500">
                                                            {formatDateDDMMYYYY(notice.created_at)}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 
                                                    onClick={() => setActiveNotice(notice)}
                                                    className={`text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#1C2C1D] transition-colors leading-snug cursor-pointer line-clamp-2 ${isBangla(notice.title) ? 'font-bangla' : ''}`}
                                                >
                                                    {formatBanglaDigits(notice.title)}
                                                </h3>

                                                <p className={`text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal ${isBangla(notice.content || notice.description) ? 'font-bangla text-[13.5px]' : ''}`}>
                                                    {formatBanglaDigits(notice.content || notice.description || 'Official club communication issued under Bogura Golf Club authority.')}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                                {notice.file_path ? (
                                                    <a
                                                        href={fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C2C1D] hover:text-[#2C442E] uppercase tracking-wider"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        <span>{isPdf ? 'Download PDF' : 'Attached File'}</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                        Club Bulletin
                                                    </span>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => setActiveNotice(notice)}
                                                    className="w-9 h-9 rounded-full bg-slate-900 text-white shadow-xs flex items-center justify-center hover:scale-105 transition-transform shrink-0"
                                                    title="View Full Notice"
                                                >
                                                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[28px] border border-slate-200/80 p-12 text-center max-w-xl mx-auto space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#D4E2D2] text-[#1C2C1D] flex items-center justify-center mx-auto shadow-xs">
                                    <Bell className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">No Circulars Found</h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        No notices match the selected category or search filter.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
                                    className="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}

                    </div>
                </div>

                {/* ── NOTICE DETAIL & IN-PAGE DOCUMENT/PDF VIEWER MODAL (MEMBER VIEW) ── */}
                {activeNotice && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-150">
                        <div className="bg-white rounded-[32px] max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col my-auto">
                            
                            <div className="p-5 sm:p-8 space-y-5">
                                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D4E2D2] text-[#1C2C1D] border border-[#BFD4BD]">
                                                {getNoticeCategory(activeNotice)}
                                            </span>
                                            {activeNotice.created_at && (
                                                <span className="text-xs text-slate-500 font-semibold">
                                                    {formatDateDDMMYYYY(activeNotice.created_at)}
                                                </span>
                                            )}
                                            {activeNotice.file_path && (
                                                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black uppercase tracking-wider">
                                                    {activeNotice.file_path.split('.').pop().toUpperCase()} Document
                                                </span>
                                            )}
                                        </div>
                                        <h2 
                                            className={`text-xl sm:text-2xl font-bold text-slate-900 pt-1 ${isBangla(activeNotice?.title) ? "font-bangla" : ""}`} 
                                            style={isBangla(activeNotice?.title) ? { fontFamily: "'Tiro Bangla', 'Hind Siliguri', 'Noto Sans Bengali', sans-serif" } : appleStyle}
                                        >
                                            {formatBanglaDigits(activeNotice.title)}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setActiveNotice(null)}
                                        className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {activeNotice.content && (
                                    <div className={`p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line ${isBangla(activeNotice?.content) ? "font-bangla text-[15px]" : ""}`}>
                                        {formatBanglaDigits(activeNotice.content)}
                                    </div>
                                )}

                                {/* Direct Document / PDF In-Modal Viewer */}
                                {activeNotice.file_path && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-[#1C2C1D]" />
                                                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                                                    Document Preview
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={resolveAssetUrl(activeNotice.file_path)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    <span>Open Full</span>
                                                </a>
                                                <a
                                                    href={resolveAssetUrl(activeNotice.file_path)}
                                                    download
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1C2C1D] text-white hover:bg-[#2C442E] text-xs font-bold transition-colors shadow-xs"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    <span>Download</span>
                                                </a>
                                            </div>
                                        </div>

                                        {activeNotice.file_path.toLowerCase().endsWith('.pdf') ? (
                                            <div className="w-full h-[55vh] sm:h-[65vh] rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100">
                                                <iframe
                                                    src={`${resolveAssetUrl(activeNotice.file_path)}#toolbar=1&navpanes=0`}
                                                    className="w-full h-full border-0"
                                                    title="Circular PDF"
                                                />
                                            </div>
                                        ) : activeNotice.file_path.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/) ? (
                                            <div className="max-h-[55vh] sm:h-[65vh] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 flex items-center justify-center p-2">
                                                <img
                                                    src={resolveAssetUrl(activeNotice.file_path)}
                                                    alt={activeNotice.title}
                                                    className="max-h-full max-w-full object-contain rounded-xl shadow-sm"
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="w-full h-[50vh] rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100">
                                                    <iframe
                                                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}${resolveAssetUrl(activeNotice.file_path)}` : resolveAssetUrl(activeNotice.file_path))}&embedded=true`}
                                                        className="w-full h-full border-0"
                                                        title="Circular Word Document"
                                                    />
                                                </div>
                                                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
                                                    <span>Document preview rendered via viewer. You can also download the file directly.</span>
                                                    <a
                                                        href={resolveAssetUrl(activeNotice.file_path)}
                                                        download
                                                        className="font-bold underline ml-2 shrink-0"
                                                    >
                                                        Download
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
                                    <button
                                        onClick={() => setActiveNotice(null)}
                                        className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors"
                                    >
                                        Close Viewer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AuthenticatedLayout>
        );
    }

    // ─────────────────────────────────────────────────────────────
    // 2. GUEST PUBLIC VIEW
    // ─────────────────────────────────────────────────────────────
    return (
        <PublicLayout>
            <Head title="Notice Board & Official Circulars - Bogura Golf Club" />

            <div className="relative bg-[#0c2417] text-white py-14 md:py-20 overflow-hidden border-b border-emerald-950">
                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold uppercase tracking-wider mb-4 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Official Communications</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-4" style={appleStyle}>
                        Notice Board & Circulars
                    </h1>

                    <p className="text-sm sm:text-base text-emerald-100/80 font-normal leading-relaxed max-w-2xl mx-auto">
                        Official tournament fixtures, handicap updates, course maintenance schedules, and club administrative announcements.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                    selectedCategory === category
                                        ? 'bg-[#0c2417] text-white shadow-md'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notices..."
                            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-[#fafaf8] min-h-[500px] py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    {filteredNotices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredNotices.map((notice) => {
                                const pubDate = notice.created_at ? new Date(notice.created_at) : null;
                                const category = getNoticeCategory(notice);
                                const fileUrl = resolveAssetUrl(notice.file_path);

                                return (
                                    <div
                                        key={notice.id}
                                        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                                                    {category}
                                                </span>
                                                {pubDate && (
                                                    <span className="text-slate-400 font-medium">
                                                        {pubDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                )}
                                            </div>

                                            <h3 
                                                onClick={() => setActiveNotice(notice)}
                                                className={`text-lg font-bold text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer ${isBangla(notice.title) ? 'font-bangla' : ''}`}
                                                style={isBangla(notice.title) ? undefined : appleStyle}
                                            >
                                                {formatBanglaDigits(notice.title)}
                                            </h3>

                                            <p className={`text-xs text-slate-600 line-clamp-3 leading-relaxed ${isBangla(notice.content || notice.description) ? 'font-bangla text-[13.5px]' : ''}`}>
                                                {formatBanglaDigits(notice.content || notice.description || 'No detailed content provided.')}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                            {notice.file_path ? (
                                                <a
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 uppercase tracking-wider"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    <span>Attachment</span>
                                                </a>
                                            ) : (
                                                <span className="text-xs font-medium text-slate-400">Club Notice</span>
                                            )}

                                            <button
                                                onClick={() => setActiveNotice(notice)}
                                                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0c2417] hover:text-white text-slate-800 text-xs font-semibold uppercase tracking-wider transition-all"
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-3">
                            <Bell className="w-10 h-10 text-emerald-700 mx-auto" />
                            <h3 className="text-lg font-bold text-slate-900">No Notices Found</h3>
                            <p className="text-xs text-slate-500">No circulars match your current filter.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── PUBLIC VIEW IN-PAGE DOCUMENT/PDF VIEWER MODAL ── */}
            {activeNotice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-5 sm:p-8 space-y-5">
                        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                                        {getNoticeCategory(activeNotice)}
                                    </span>
                                    {activeNotice.created_at && (
                                        <span className="text-xs text-slate-500 font-semibold">
                                            {formatDateDDMMYYYY(activeNotice.created_at)}
                                        </span>
                                    )}
                                    {activeNotice.file_path && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black uppercase tracking-wider">
                                            {activeNotice.file_path.split('.').pop().toUpperCase()} Document
                                        </span>
                                    )}
                                </div>
                                <h2 
                                    className={`text-xl sm:text-2xl font-bold text-slate-900 mt-2 ${isBangla(activeNotice?.title) ? "font-bangla" : ""}`} 
                                    style={isBangla(activeNotice?.title) ? { fontFamily: "'Tiro Bangla', 'Hind Siliguri', 'Noto Sans Bengali', sans-serif" } : appleStyle}
                                >
                                    {formatBanglaDigits(activeNotice.title)}
                                </h2>
                            </div>
                            <button
                                onClick={() => setActiveNotice(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {activeNotice.content && (
                            <div className={`text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line p-4 rounded-2xl bg-slate-50 border border-slate-100 ${isBangla(activeNotice?.content) ? "font-bangla text-[15px]" : ""}`}>
                                {formatBanglaDigits(activeNotice.content)}
                            </div>
                        )}

                        {/* Document In-Modal Viewer */}
                        {activeNotice.file_path && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                                        Document Preview
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={resolveAssetUrl(activeNotice.file_path)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                                        >
                                            Open Full
                                        </a>
                                        <a
                                            href={resolveAssetUrl(activeNotice.file_path)}
                                            download
                                            className="px-3 py-1 rounded-xl bg-[#0c2417] text-white hover:bg-emerald-950 text-xs font-bold transition-colors"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </div>

                                {activeNotice.file_path.toLowerCase().endsWith('.pdf') ? (
                                    <div className="w-full h-[55vh] sm:h-[65vh] rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100">
                                        <iframe
                                            src={`${resolveAssetUrl(activeNotice.file_path)}#toolbar=1&navpanes=0`}
                                            className="w-full h-full border-0"
                                            title="Circular PDF"
                                        />
                                    </div>
                                ) : activeNotice.file_path.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/) ? (
                                    <div className="max-h-[55vh] sm:h-[65vh] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 flex items-center justify-center p-2">
                                        <img
                                            src={resolveAssetUrl(activeNotice.file_path)}
                                            alt={activeNotice.title}
                                            className="max-h-full max-w-full object-contain rounded-xl shadow-sm"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="w-full h-[50vh] rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100">
                                            <iframe
                                                src={`https://docs.google.com/viewer?url=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}${resolveAssetUrl(activeNotice.file_path)}` : resolveAssetUrl(activeNotice.file_path))}&embedded=true`}
                                                className="w-full h-full border-0"
                                                title="Circular Word Document"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setActiveNotice(null)}
                                className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs uppercase tracking-wider transition-colors"
                            >
                                Close Viewer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
