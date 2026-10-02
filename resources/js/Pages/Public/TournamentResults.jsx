import React, { useState, useMemo } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { FileText, Trophy, Search, Download, ChevronRight, X, Calendar, Award } from 'lucide-react';

export default function TournamentResults({ results = [] }) {
    const [searchQuery, setSearchQuery] = useState('');

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    const resolveAssetUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `/storage/${cleanPath}`;
    };

    const filteredResults = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return results;
        return results.filter(r => 
            (r.name && r.name.toLowerCase().includes(q)) ||
            (r.sponsored_by && r.sponsored_by.toLowerCase().includes(q)) ||
            (r.date && r.date.toLowerCase().includes(q))
        );
    }, [results, searchQuery]);

    return (
        <PublicLayout>
            <Head title="Tournament Results - Bogura Golf Club" />

            {/* Hero Header */}
            <div className="relative bg-gradient-to-b from-[#092215] via-[#0c2e1d] to-[#081b11] text-white pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                    {/* Breadcrumbs */}
                    <nav aria-label="Breadcrumb" className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1 text-[11px] sm:text-xs font-semibold text-emerald-300/85 uppercase tracking-wider mb-4 sm:mb-5">
                        <Link href="/" className="hover:text-white transition-colors shrink-0">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                        <span className="shrink-0 text-emerald-200/90">Tournaments & Events</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                        <span className="text-white font-bold shrink-0">Tournament Results</span>
                    </nav>

                    <h1 
                        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-4"
                        style={appleStyle}
                    >
                        Official Tournament Results
                    </h1>

                    <p className="text-sm sm:text-base text-emerald-100/85 max-w-2xl mx-auto leading-relaxed font-normal">
                        Certified match scores, leaderboard standings, and official tournament result documents published by the Bogura Golf Club Tournament Committee.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20 pb-24">
                <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border border-slate-200/90 space-y-6">
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-emerald-700" />
                            <h2 className="text-lg font-bold text-slate-900" style={appleStyle}>
                                Published Result Sheets ({filteredResults.length})
                            </h2>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or sponsor..."
                                className="w-full pl-10 pr-9 py-2 rounded-2xl bg-slate-100/90 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:bg-white transition-all placeholder:text-slate-400"
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
                    </div>

                    {filteredResults.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead>
                                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                        <th scope="col" className="px-5 py-3.5 text-left rounded-l-xl">S/L</th>
                                        <th scope="col" className="px-5 py-3.5 text-left">Tournament Name</th>
                                        <th scope="col" className="px-5 py-3.5 text-left">Sponsored By</th>
                                        <th scope="col" className="px-5 py-3.5 text-left">Date</th>
                                        <th scope="col" className="px-5 py-3.5 text-right rounded-r-xl">Official Sheet</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100 text-xs">
                                    {filteredResults.map((record, index) => (
                                        <tr key={record.id || index} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-5 py-4 whitespace-nowrap text-slate-400 font-semibold">{index + 1}</td>
                                            <td className="px-5 py-4 whitespace-nowrap font-bold text-slate-900">{record.name || '-'}</td>
                                            <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-600">
                                                {record.sponsored_by ? (
                                                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[11px]">
                                                        {record.sponsored_by}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-500">{record.date || '-'}</td>
                                            <td className="px-5 py-4 whitespace-nowrap text-right">
                                                {record.file_path ? (
                                                    <a 
                                                        href={resolveAssetUrl(record.file_path)} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0c2417] hover:bg-emerald-950 text-white rounded-full transition-colors text-[11px] font-semibold uppercase tracking-wider shadow-sm"
                                                    >
                                                        <Download className="w-3.5 h-3.5 text-emerald-300" />
                                                        <span>Download</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">Unavailable</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16 space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                                <Trophy className="w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800" style={appleStyle}>No Results Found</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">No tournament result documents match your filter. Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
