import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Plus, 
    Pencil, 
    Trash2, 
    Calendar, 
    Search, 
    Sparkles, 
    CheckCircle2, 
    FileText,
    Clock,
    Users
} from 'lucide-react';
import Pagination from '@/Components/Pagination';

export default function Index({ records = { data: [] }, flash }) {
    const { delete: destroy } = useForm();
    const [searchQuery, setSearchQuery] = useState('');

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete flight schedule "${title}"?`)) {
            destroy(route('flight-schedules.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const recordList = records?.data || [];

    const filteredRecords = useMemo(() => {
        if (!searchQuery) return recordList;
        return recordList.filter(r => 
            (r.title || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [recordList, searchQuery]);

    return (
        <AuthenticatedLayout header="Flight Schedules">
            <Head title="Flight Schedules - Bogura Golf Club" />

            <div className="max-w-7xl mx-auto space-y-6 pb-16">
                
                {/* ── 1. SUCCESS FLASH MESSAGE ── */}
                {flash?.message && (
                    <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold">{flash.message}</span>
                        </div>
                    </div>
                )}

                {/* ── 2. EXECUTIVE HERO BANNER ── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
                                <Clock className="w-3.5 h-3.5 text-blue-700" />
                                <span>Tee-off Allotment & Pairings</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                <span>{recordList.length} Scheduled Flights</span>
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={appleStyle}>
                            Flight Schedules & Tee Times
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                            Publish tournament flight groupings, starting tee allocations, reporting times, and PDF draw sheets.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                        <Link
                            href={route('flight-schedules.create')}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0c2417] hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4 text-emerald-300" />
                            <span>Add Flight Schedule</span>
                        </Link>
                    </div>
                </div>

                {/* ── 3. SEARCH TOOLBAR ── */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search flight title or tournament match..."
                            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-600 transition-all font-medium"
                        />
                    </div>
                </div>

                {/* ── 4. EXECUTIVE FLIGHT SCHEDULES TABLE ── */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200/80">
                                <tr>
                                    <th className="px-6 py-4">Flight Allotment Title</th>
                                    <th className="px-6 py-4 text-center">Tee-off Date</th>
                                    <th className="px-6 py-4 text-center">Draw Sheet Document</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredRecords.length > 0 ? (
                                    filteredRecords.map((record) => (
                                        <tr key={record.id} className="hover:bg-emerald-50/30 transition-colors group">
                                            
                                            {/* Flight Title */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3.5">
                                                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center shrink-0">
                                                        <Clock className="w-5 h-5 text-blue-700" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm group-hover:text-emerald-900 transition-colors">
                                                            {record.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-6 py-4 text-center font-medium text-slate-600">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{record.date ? (() => {
                                                        const clean = String(record.date).substring(0, 10).split('-');
                                                        return clean.length === 3 ? `${clean[2]}-${clean[1]}-${clean[0]}` : record.date;
                                                    })() : '—'}</span>
                                                </div>
                                            </td>

                                            {/* Attachment */}
                                            <td className="px-6 py-4 text-center">
                                                {record.file_path ? (
                                                    <a 
                                                        href={`/storage/${record.file_path}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold border border-emerald-200 transition-colors shadow-2xs"
                                                    >
                                                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                                                        <span>View Flight Chart</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-300">—</span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={route('flight-schedules.edit', record.id)}
                                                        className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors"
                                                        title="Edit Flight Schedule"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(record.id, record.title)}
                                                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors"
                                                        title="Delete Schedule"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-400 space-y-2">
                                            <Clock className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                                            <p className="text-sm font-semibold text-slate-600">No flight schedules published yet</p>
                                            <p className="text-xs text-slate-400">Click "Add Flight Schedule" above to post pairings.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {records?.links && (
                    <div className="mt-4">
                        <Pagination links={records.links} />
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
