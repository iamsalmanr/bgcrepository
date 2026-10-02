import React, { useState, useMemo } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserDropdown from '@/Components/UserDropdown';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    FileText, 
    Download, 
    Search, 
    FileDown, 
    Eye, 
    CheckCircle2, 
    ArrowUpRight, 
    ShieldCheck, 
    Filter, 
    LayoutGrid, 
    List,
    FileCheck,
    Phone,
    Mail,
    ChevronRight,
    Users,
    Trophy,
    Building2,
    X
} from 'lucide-react';

export default function ClubForms({ forms = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [previewForm, setPreviewForm] = useState(null);

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    // Helper to resolve asset URLs
    const resolveFileUrl = (path) => {
        if (!path) return '#';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `/storage/${cleanPath}`;
    };

    // Auto-categorize forms based on title
    const categorizedForms = useMemo(() => {
        return (forms || []).map(form => {
            const titleLower = (form.title || '').toLowerCase();
            const descLower = (form.description || '').toLowerCase();
            const combined = `${titleLower} ${descLower}`;

            let category = 'General';
            if (combined.includes('membership') || combined.includes('member') || combined.includes('absentee')) {
                category = 'Membership';
            } else if (combined.includes('tournament') || combined.includes('handicap') || combined.includes('scoring')) {
                category = 'Tournaments';
            } else if (combined.includes('guest') || combined.includes('green fee') || combined.includes('entry')) {
                category = 'Guest & Fees';
            } else if (combined.includes('cart') || combined.includes('locker') || combined.includes('caddy') || combined.includes('facility')) {
                category = 'Facilities';
            }

            return {
                ...form,
                category,
                fileUrl: resolveFileUrl(form.file_path),
                filename: form.file_path ? form.file_path.split('/').pop() : 'document.pdf'
            };
        });
    }, [forms]);

    // Available categories
    const categories = ['All', 'Membership', 'Tournaments', 'Guest & Fees', 'Facilities'];

    // Category counts
    const categoryCounts = useMemo(() => {
        const counts = { All: categorizedForms.length, Membership: 0, Tournaments: 0, 'Guest & Fees': 0, Facilities: 0, General: 0 };
        categorizedForms.forEach(f => {
            if (counts[f.category] !== undefined) counts[f.category]++;
            else counts.General++;
        });
        return counts;
    }, [categorizedForms]);

    // Filtered forms
    const filteredForms = useMemo(() => {
        return categorizedForms.filter(form => {
            const matchesSearch = 
                form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (form.description && form.description.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCategory = 
                selectedCategory === 'All' || form.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [categorizedForms, searchQuery, selectedCategory]);

    // ─────────────────────────────────────────────────────────────
    // 1. MEMBER AUTHENTICATED VIEW
    // ─────────────────────────────────────────────────────────────
    if (user) {
        return (
            <AuthenticatedLayout header="Club Forms">
                <Head title="Club Forms & Documents - Bogura Golf Club" />

                <div className="bg-[#F8F9F8] min-h-screen text-slate-900 pb-16">
                    <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-7">
                        
                        {/* ── TOP HEADER ── */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                                    Club Forms & Download Center
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
                                    <span>Bogura Golf Club &bull; Member Documentation Hub</span>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1 text-[#2B402C] font-semibold">
                                        <span className="w-2 h-2 rounded-full bg-[#3D5A3E]"></span>
                                        {categorizedForms.length} Official Printable Forms
                                    </span>
                                </p>
                            </div>

                            {/* Search Pill */}
                            <div className="flex items-center gap-3">
                                <div className="relative w-full md:w-80 lg:w-96">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search forms, guidelines, permits..."
                                        className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200/80 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] shadow-xs transition-all"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── 4 MILITARY OLIVE STATS CARDS ── */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            
                            {/* Card 1: All Forms */}
                            <button
                                type="button"
                                onClick={() => setSelectedCategory('All')}
                                className={`rounded-[24px] p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                    selectedCategory === 'All'
                                        ? 'bg-[#D4E2D2] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-md scale-[1.02]'
                                        : 'bg-[#D4E2D2] border-[#BFD4BD] hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">All Documents</span>
                                    <div className="w-8 h-8 rounded-full bg-white text-[#1C2C1D] flex items-center justify-center shadow-xs">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-3xl font-black text-slate-900 font-display">{categoryCounts.All}</p>
                                    <span className="text-[11px] font-semibold text-[#243B26] mt-0.5 block">Official Club Forms</span>
                                </div>
                            </button>

                            {/* Card 2: Membership */}
                            <button
                                type="button"
                                onClick={() => setSelectedCategory('Membership')}
                                className={`rounded-[24px] p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                    selectedCategory === 'Membership'
                                        ? 'bg-[#E2E6D5] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-md scale-[1.02]'
                                        : 'bg-[#E2E6D5] border-[#CCD3BD] hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Membership</span>
                                    <div className="w-8 h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs">
                                        <Users className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-3xl font-black text-slate-900 font-display">{categoryCounts.Membership}</p>
                                    <span className="text-[11px] font-semibold text-[#35432B] mt-0.5 block">Admissions & Absentee</span>
                                </div>
                            </button>

                            {/* Card 3: Tournaments */}
                            <button
                                type="button"
                                onClick={() => setSelectedCategory('Tournaments')}
                                className={`rounded-[24px] p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                    selectedCategory === 'Tournaments'
                                        ? 'bg-[#DFE5D4] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-md scale-[1.02]'
                                        : 'bg-[#DFE5D4] border-[#CBD4BD] hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tournaments</span>
                                    <div className="w-8 h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs">
                                        <Trophy className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-3xl font-black text-slate-900 font-display">{categoryCounts.Tournaments}</p>
                                    <span className="text-[11px] font-semibold text-[#2B402C] mt-0.5 block">Handicap & Scoring</span>
                                </div>
                            </button>

                            {/* Card 4: Facilities & Guest */}
                            <button
                                type="button"
                                onClick={() => setSelectedCategory('Guest & Fees')}
                                className={`rounded-[24px] p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                    selectedCategory === 'Guest & Fees'
                                        ? 'bg-[#D8DFD5] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-md scale-[1.02]'
                                        : 'bg-[#D8DFD5] border-[#C5CEC1] hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Guest & Facilities</span>
                                    <div className="w-8 h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-3xl font-black text-slate-900 font-display">{categoryCounts['Guest & Fees'] + categoryCounts.Facilities}</p>
                                    <span className="text-[11px] font-semibold text-[#2B402C] mt-0.5 block">Requisitions & Rates</span>
                                </div>
                            </button>

                        </div>

                        {/* ── CATEGORY PILL TABS BAR ── */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                                        selectedCategory === cat
                                            ? 'bg-slate-900 text-white shadow-xs'
                                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                                    }`}
                                >
                                    <span>{cat}</span>
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        selectedCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {categoryCounts[cat] !== undefined ? categoryCounts[cat] : 0}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* ── FORMS BENTO GRID ── */}
                        {filteredForms.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredForms.map((form) => {
                                    return (
                                        <div
                                            key={form.id}
                                            className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#D4E2D2] text-[#1C2C1D] border border-[#BFD4BD]">
                                                        {form.category}
                                                    </span>

                                                    <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                </div>

                                                <h3 
                                                    onClick={() => setPreviewForm(form)}
                                                    className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#1C2C1D] transition-colors leading-snug cursor-pointer line-clamp-2"
                                                >
                                                    {form.title}
                                                </h3>

                                                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                                                    {form.description || 'Official club form for submission to Bogura Golf Club secretariat.'}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                                {form.file_path ? (
                                                    <a
                                                        href={form.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C2C1D] hover:text-[#2C442E] uppercase tracking-wider"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        <span>Download PDF</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                        Online Form
                                                    </span>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewForm(form)}
                                                    className="w-9 h-9 rounded-full bg-slate-900 text-white shadow-xs flex items-center justify-center hover:scale-105 transition-transform shrink-0"
                                                    title="View Details"
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
                                    <FileText className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">No Forms Found</h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        No forms match the selected category or search keyword.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                                    className="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}

                    </div>
                </div>

                {/* ── FORM DETAIL MODAL ── */}
                {previewForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
                        <div className="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col my-auto">
                            
                            <div className="p-6 sm:p-8 space-y-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#D4E2D2] text-[#1C2C1D] border border-[#BFD4BD]">
                                            {previewForm.category}
                                        </span>
                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 pt-2">
                                            {previewForm.title}
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setPreviewForm(null)}
                                        className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                    {previewForm.description || 'Official club form for membership, tournaments, or club facilities.'}
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
                                    {previewForm.file_path && (
                                        <a
                                            href={previewForm.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-5 py-2.5 rounded-full bg-[#1C2C1D] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-[#2C442E] transition-colors shadow-xs"
                                        >
                                            <Download className="w-4 h-4" />
                                            <span>Download Printable Form (PDF)</span>
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setPreviewForm(null)}
                                        className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors"
                                    >
                                        Close
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
            <Head title="Club Forms & Documents - Bogura Golf Club" />

            <div className="bg-[#fafaf8] min-h-screen pb-20">
                <section className="relative bg-[#0c2417] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-emerald-950">
                    <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-6">
                        <nav aria-label="Breadcrumb" className="inline-flex items-center justify-center flex-wrap gap-x-2 gap-y-1 text-[11px] sm:text-xs font-semibold text-emerald-300/85 uppercase tracking-widest bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-500/30">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                            <span className="text-white font-bold">Club Forms</span>
                        </nav>

                        <div className="space-y-4">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white" style={appleStyle}>
                                Club Forms & Documents
                            </h1>
                            <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl mx-auto">
                                Download official membership applications, tournament guidelines, and facility forms.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 max-w-6xl">
                    <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                        selectedCategory === cat
                                            ? 'bg-[#0c2417] text-white shadow-md'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full md:w-72">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search forms..."
                                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/50"
                            />
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 max-w-6xl">
                    {filteredForms.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredForms.map((form) => (
                                <div key={form.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
                                    <div className="space-y-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                                            {form.category}
                                        </span>
                                        <h3 className="text-lg font-bold text-slate-900 pt-2" style={appleStyle}>
                                            {form.title}
                                        </h3>
                                        <p className="text-xs text-slate-600 line-clamp-3">
                                            {form.description || 'Download official form.'}
                                        </p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        {form.file_path && (
                                            <a
                                                href={form.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 uppercase tracking-wider"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                <span>Download PDF</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-3">
                            <FileText className="w-10 h-10 text-emerald-700 mx-auto" />
                            <h3 className="text-lg font-bold text-slate-900">No Forms Found</h3>
                            <p className="text-xs text-slate-500">No documents match your query.</p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
