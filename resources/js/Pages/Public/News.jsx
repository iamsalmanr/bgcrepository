import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { 
    Newspaper, 
    ExternalLink, 
    Calendar, 
    Search, 
    RefreshCw, 
    Eye, 
    X, 
    Sparkles, 
    ChevronRight
} from 'lucide-react';

export default function News({ news, sources = [], filters = {}, counts = {}, isAdmin = false, lastSyncedAt = 'Recently' }) {
    const { site_settings } = usePage().props;
    const siteName = site_settings?.site_name || 'Bogura Golf Club';

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedSource, setSelectedSource] = useState(filters.source || 'all');
    const [selectedLang, setSelectedLang] = useState(filters.lang || 'all');
    const [isSyncing, setIsSyncing] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    // Fallback image if remote image fails
    const fallbackCover = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=75';

    // Format date nicely
    const formatDate = (dateString) => {
        if (!dateString) return 'Recent';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Filter submit
    const handleFilter = (source = selectedSource, search = searchQuery, lang = selectedLang) => {
        router.get(
            route('news.public'),
            { 
                source: source === 'all' ? '' : source, 
                search: search.trim(),
                lang: lang === 'all' ? '' : lang,
            },
            { preserveState: true, replace: true }
        );
    };

    // Admin Sync handler
    const handleSync = () => {
        if (isSyncing) return;
        setIsSyncing(true);
        router.post(
            route('news.sync'),
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsSyncing(false)
            }
        );
    };

    // Admin Toggle handler
    const handleToggle = (item) => {
        router.post(
            route('news.toggle', item.id),
            {},
            { preserveScroll: true }
        );
    };

    const items = news?.data || [];
    const featuredItem = items.length > 0 && selectedSource === 'all' && selectedLang === 'all' && !searchQuery ? items[0] : null;
    const regularItems = featuredItem ? items.slice(1) : items;

    // Helper for source badge colors
    const getSourceBadgeColor = (source) => {
        const s = (source || '').toLowerCase();
        if (s.includes('যুগান্তর') || s.includes('jugantor')) return 'bg-rose-900 text-rose-100 border-rose-800';
        if (s.includes('প্রথম আলো') || s.includes('prothom alo')) return 'bg-red-900 text-red-100 border-red-800';
        if (s.includes('ইত্তেফাক') || s.includes('ittefaq')) return 'bg-sky-900 text-sky-100 border-sky-800';
        if (s.includes('বাংলাদেশ প্রতিদিন') || s.includes('bd-pratidin')) return 'bg-teal-900 text-teal-100 border-teal-800';
        if (s.includes('সমকাল') || s.includes('samakal')) return 'bg-indigo-900 text-indigo-100 border-indigo-800';
        if (s.includes('কালের কণ্ঠ') || s.includes('kaler')) return 'bg-orange-900 text-orange-100 border-orange-800';
        if (s.includes('golf house')) return 'bg-emerald-800 text-emerald-100 border-emerald-700';
        if (s.includes('daily star')) return 'bg-blue-900 text-blue-100 border-blue-800';
        if (s.includes('business standard') || s.includes('tbs')) return 'bg-amber-900 text-amber-100 border-amber-800';
        if (s.includes('bss')) return 'bg-purple-900 text-purple-100 border-purple-800';
        return 'bg-slate-800 text-slate-100 border-slate-700';
    };

    return (
        <PublicLayout>
            <Head title={`Bangladesh Golf News - ${siteName}`} />

            <div className="bg-[#FAFBF9] min-h-screen pb-20">
                {/* ── 1. LUXURY EXECUTIVE HERO BANNER ── */}
                <section className="bg-[#152117] text-white pt-5 pb-6 sm:pt-7 sm:pb-7 border-b border-emerald-950/40">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight font-serif flex items-center gap-2.5">
                                    <Newspaper className="w-5 h-5 text-[#D4AF37]" />
                                    <span>Bangladesh Golf News</span>
                                </h1>
                                <p className="text-slate-300 text-xs mt-1 font-medium leading-relaxed max-w-xl">
                                    Curated tournament highlights, player updates, and clubhouse coverage from national press
                                </p>
                            </div>

                            {/* Admin Quick Sync Ribbon */}
                            {isAdmin && (
                                <div className="flex items-center gap-2.5 shrink-0">
                                    <span className="text-[11px] text-slate-300 hidden md:inline">
                                        Synced: {lastSyncedAt}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleSync}
                                        disabled={isSyncing}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                                    >
                                        <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                                        <span>{isSyncing ? 'Syncing...' : 'Sync News'}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ── 2. REFINED FILTER CONTROLS & SEARCH ── */}
                        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
                            {/* Segmented Language Switch (English Only, Premium Glassmorphic) */}
                            <div className="inline-flex p-1 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md shadow-inner w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={() => { setSelectedLang('all'); handleFilter(selectedSource, searchQuery, 'all'); }}
                                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                                        selectedLang === 'all'
                                            ? 'bg-white text-slate-900 shadow-sm font-bold'
                                            : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
                                    }`}
                                >
                                    <span>All News</span>
                                    {counts?.total > 0 && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                                            selectedLang === 'all' ? 'bg-slate-200 text-slate-800' : 'bg-white/10 text-slate-400'
                                        }`}>
                                            {counts.total}
                                        </span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedLang('bn'); handleFilter(selectedSource, searchQuery, 'bn'); }}
                                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                                        selectedLang === 'bn'
                                            ? 'bg-emerald-600 text-white shadow-sm font-bold'
                                            : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
                                    }`}
                                >
                                    <span>Bangla Feed</span>
                                    {counts?.bn > 0 && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                                            selectedLang === 'bn' ? 'bg-emerald-700 text-white' : 'bg-white/10 text-slate-400'
                                        }`}>
                                            {counts.bn}
                                        </span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedLang('en'); handleFilter(selectedSource, searchQuery, 'en'); }}
                                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer ${
                                        selectedLang === 'en'
                                            ? 'bg-white text-slate-900 shadow-sm font-bold'
                                            : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
                                    }`}
                                >
                                    <span>English</span>
                                    {counts?.en > 0 && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                                            selectedLang === 'en' ? 'bg-slate-200 text-slate-800' : 'bg-white/10 text-slate-400'
                                        }`}>
                                            {counts.en}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Sleek Search Input */}
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleFilter(selectedSource, searchQuery, selectedLang); }}
                                className="relative w-full sm:w-72"
                            >
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search news articles..."
                                    className="w-full pl-9 pr-8 py-1.5 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]/60 focus:bg-black/40 transition-all font-medium"
                                />
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => { setSearchQuery(''); handleFilter(selectedSource, '', selectedLang); }}
                                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* Source Filter Pills */}
                        {sources.length > 0 && (
                            <div className="flex items-center gap-1.5 overflow-x-auto w-full pt-3 pb-1 scrollbar-hide">
                                <span className="text-[11px] text-slate-400 font-semibold shrink-0 mr-1">Source:</span>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedSource('all'); handleFilter('all', searchQuery, selectedLang); }}
                                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                                        selectedSource === 'all'
                                            ? 'bg-emerald-700 text-white shadow-xs'
                                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    All Sources
                                </button>
                                {sources.map((src, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => { setSelectedSource(src); handleFilter(src, searchQuery, selectedLang); }}
                                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                                            selectedSource === src
                                                ? 'bg-emerald-700 text-white shadow-xs'
                                                : 'text-slate-300 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {src}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ── 3. MAIN NEWS CONTENT ── */}
                <main className="container mx-auto px-4 sm:px-6 pt-6">
                    {items.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto space-y-3 shadow-xs my-8">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                                <Newspaper className="w-6 h-6" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">No News Found</h3>
                            <p className="text-xs text-slate-500">
                                No articles match your current search query or source filter.
                            </p>
                            <button
                                type="button"
                                onClick={() => { setSearchQuery(''); setSelectedSource('all'); setSelectedLang('all'); handleFilter('all', '', 'all'); }}
                                className="px-4 py-2 rounded-xl bg-[#152117] text-white text-xs font-bold hover:bg-emerald-900 transition-all shadow-xs cursor-pointer"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* ── FEATURED HERO STORY (Compact) ── */}
                            {featuredItem && (
                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 group hover:border-emerald-700/40 transition-all duration-200">
                                    <div className="md:col-span-5 relative overflow-hidden bg-slate-900 h-48 sm:h-56 md:h-auto min-h-[190px]">
                                        <img
                                            src={featuredItem.image_url}
                                            alt={featuredItem.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="eager"
                                            decoding="async"
                                            onError={(e) => { e.currentTarget.src = fallbackCover; }}
                                        />
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-slate-950 font-black text-[9px] tracking-wider uppercase shadow-xs flex items-center gap-1">
                                                <Sparkles className="w-2.5 h-2.5 fill-current" />
                                                Featured
                                            </span>
                                            {featuredItem.language === 'bn' && (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-xs text-emerald-200 border border-emerald-700/60 font-bold text-[9px] uppercase tracking-wider shadow-xs">
                                                    Bangla
                                                </span>
                                            )}
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-xs ${getSourceBadgeColor(featuredItem.source_name)}`}>
                                                {featuredItem.source_name}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="md:col-span-7 p-5 sm:p-6 flex flex-col justify-between space-y-3">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3 text-emerald-600" />
                                                    {formatDate(featuredItem.published_at)}
                                                </span>
                                                <span>•</span>
                                                <span className="text-emerald-700 font-bold">{featuredItem.author || featuredItem.source_name}</span>
                                            </div>

                                            <h2 className={`text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors ${featuredItem.language === 'bn' ? 'font-bangla text-lg sm:text-2xl font-bold leading-snug tracking-normal' : 'text-base sm:text-lg font-black font-serif'}`}>
                                                {featuredItem.title}
                                            </h2>

                                            <p className={`line-clamp-3 ${featuredItem.language === 'bn' ? 'font-bangla text-sm text-slate-600 leading-relaxed' : 'text-slate-600 text-xs leading-relaxed'}`}>
                                                {featuredItem.summary}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedArticle(featuredItem)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-emerald-800 hover:bg-slate-100 transition-all"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>Preview</span>
                                            </button>

                                            <a
                                                href={featuredItem.source_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#152117] hover:bg-emerald-900 active:scale-95 text-white text-xs font-bold transition-all shadow-xs"
                                            >
                                                <span>Read Actual News</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── ARTICLE CARDS GRID ── */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {regularItems.map((item) => (
                                    <article
                                        key={item.id}
                                        className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
                                    >
                                        <div>
                                            {/* Article Image Container */}
                                            <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    loading="lazy"
                                                    decoding="async"
                                                    onError={(e) => { e.currentTarget.src = fallbackCover; }}
                                                />
                                                <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                                                    {item.language === 'bn' && (
                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-xs text-emerald-200 border border-emerald-700/60 font-bold text-[9px] uppercase tracking-wider shadow-xs">
                                                            Bangla
                                                        </span>
                                                    )}
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-xs ${getSourceBadgeColor(item.source_name)}`}>
                                                        {item.source_name}
                                                    </span>
                                                </div>

                                                {/* Hidden / Active Status for Admin */}
                                                {isAdmin && !item.is_active && (
                                                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-rose-600 text-white font-black text-[9px] uppercase tracking-wider shadow-xs">
                                                        Hidden
                                                    </span>
                                                )}
                                            </div>

                                            {/* Article Details */}
                                            <div className="p-4 sm:p-5 space-y-2">
                                                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                                                    <Calendar className="w-3 h-3 text-emerald-600" />
                                                    <span>{formatDate(item.published_at)}</span>
                                                </div>

                                                <h3 className={`text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-3 ${item.language === 'bn' ? 'font-bangla text-base font-bold leading-snug tracking-normal' : 'font-bold text-sm leading-snug'}`}>
                                                    {item.title}
                                                </h3>

                                                <p className={`line-clamp-3 ${item.language === 'bn' ? 'font-bangla text-[13px] text-slate-600 leading-relaxed' : 'text-slate-500 text-xs leading-relaxed'}`}>
                                                    {item.summary}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Card Actions Footer */}
                                        <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedArticle(item)}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-emerald-800 transition-colors py-1"
                                            >
                                                <Eye className="w-3 h-3" />
                                                <span>Preview</span>
                                            </button>

                                            <div className="flex items-center gap-2">
                                                {isAdmin && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggle(item)}
                                                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                                                            item.is_active
                                                                ? 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                                                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                        }`}
                                                        title="Toggle visibility"
                                                    >
                                                        {item.is_active ? 'Hide' : 'Show'}
                                                    </button>
                                                )}

                                                <a
                                                    href={item.source_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#152117] hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-2xs active:scale-95"
                                                >
                                                    <span>Read Actual News</span>
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* ── PAGINATION ── */}
                            {news?.links && news.links.length > 3 && (
                                <div className="flex justify-center pt-6">
                                    <div className="flex flex-wrap gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs">
                                        {news.links.map((link, idx) => {
                                            if (!link.url) {
                                                return (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 bg-slate-50 cursor-not-allowed"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            }
                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => router.get(link.url, {}, { preserveState: true })}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                        link.active
                                                            ? 'bg-[#152117] text-white shadow-xs'
                                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* ── 4. ARTICLE QUICK-READ MODAL (Elevated above all navigation) ── */}
            {selectedArticle && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    {/* Click outside to close backdrop */}
                    <div 
                        className="fixed inset-0 -z-10" 
                        onClick={() => setSelectedArticle(null)} 
                    />

                    <div className="bg-white rounded-t-[28px] sm:rounded-2xl max-w-xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                        {/* Modal Header Media */}
                        <div className="relative h-40 sm:h-52 overflow-hidden bg-slate-900 shrink-0">
                            <img
                                src={selectedArticle.image_url}
                                alt={selectedArticle.title}
                                className="w-full h-full object-cover"
                                loading="eager"
                                decoding="async"
                                onError={(e) => { e.currentTarget.src = fallbackCover; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            
                            <button
                                type="button"
                                onClick={() => setSelectedArticle(null)}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-md"
                                aria-label="Close Preview"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5">
                                {selectedArticle.language === 'bn' && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 backdrop-blur-xs text-emerald-200 border border-emerald-700/60 font-bold text-[9px] uppercase tracking-wider shadow-xs">
                                        Bangla
                                    </span>
                                )}
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border shadow-xs inline-block ${getSourceBadgeColor(selectedArticle.source_name)}`}>
                                    {selectedArticle.source_name}
                                </span>
                            </div>
                        </div>

                        {/* Modal Scrollable Body */}
                        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 flex-1">
                            {/* Meta Info Bar */}
                            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pb-3 border-b border-slate-100">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                                    Published on {formatDate(selectedArticle.published_at)}
                                </span>
                                <span className="text-emerald-800 font-bold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[11px]">
                                    {selectedArticle.source_name}
                                </span>
                            </div>

                            {/* Full Untruncated Headline */}
                            <h2 className={`text-slate-950 ${
                                selectedArticle.language === 'bn' 
                                    ? 'font-bangla text-lg sm:text-2xl font-bold leading-normal' 
                                    : 'font-serif text-lg sm:text-2xl font-black leading-snug'
                            }`}>
                                {selectedArticle.title}
                            </h2>

                            {/* Detailed Content / Multi-paragraph Body */}
                            {selectedArticle.content ? (
                                <div 
                                    className={`space-y-3.5 text-slate-700 ${
                                        selectedArticle.language === 'bn' 
                                            ? 'font-bangla text-[15px] sm:text-base leading-relaxed' 
                                            : 'text-sm sm:text-base leading-relaxed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                                />
                            ) : (
                                <div className={`space-y-3.5 text-slate-700 ${
                                    selectedArticle.language === 'bn' 
                                        ? 'font-bangla text-[15px] sm:text-base leading-relaxed' 
                                        : 'text-sm sm:text-base leading-relaxed'
                                }`}>
                                    <div className="p-4 rounded-xl bg-emerald-50/70 border-l-4 border-emerald-600 text-slate-800 font-medium">
                                        {selectedArticle.summary}
                                    </div>
                                    <p className="text-xs text-slate-500 italic pt-1">
                                        Coverage provided by {selectedArticle.source_name}. Click "Read Actual News" below to view complete media galleries, full tournament scorecards, and live rankings.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Sticky Modal Footer (Prominently Elevated & Visible) */}
                        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2.5 shrink-0 shadow-lg">
                            <button
                                type="button"
                                onClick={() => setSelectedArticle(null)}
                                className="px-4 py-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
                            >
                                Close
                            </button>

                            <a
                                href={selectedArticle.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#152117] hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                            >
                                <span>Read Actual News</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
