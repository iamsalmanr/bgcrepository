import React, { useState, useMemo, useEffect } from 'react';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Plus, 
    Trash2, 
    Edit2, 
    Check, 
    X, 
    Bell, 
    ExternalLink, 
    Search, 
    Filter, 
    Sparkles, 
    Megaphone, 
    Calendar, 
    CheckCircle2, 
    Layers, 
    Globe,
    Eye,
    Tag,
    FileText,
    AlignLeft
} from 'lucide-react';
import Modal from '@/Components/Modal';
import { formatBanglaDigits } from '@/lib/utils';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function NoticesIndex({ auth, notices = [] }) {
    const { flash } = usePage().props;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [previewNotice, setPreviewNotice] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState('all'); // 'all', 'active', 'marquee', 'hidden'
    const [categoryFilter, setCategoryFilter] = useState('all');

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    const categoriesList = [
        'Tournaments',
        'Course & Grounds',
        'Membership',
        'Clubhouse & Dining',
        'General Announcements',
        'Rules & Handicap',
        'Executive Committee'
    ];

    const formatDateDDMMYYYY = (dateStr) => {
        if (!dateStr) return '—';
        const clean = String(dateStr).substring(0, 10).split('-');
        if (clean.length === 3) return `${clean[2]}-${clean[1]}-${clean[0]}`;
        return dateStr;
    };

    const isBangla = (text) => /[\u0980-\u09FF]/.test(String(text || ''));

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        category: 'General Announcements',
        url: '',
        file: null,
        remove_file: false,
        content: '',
        is_active: true,
        show_on_home: false,
    });

    // Check URL parameters for direct modal triggers (e.g. from Dashboard)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'new') {
            openAddModal();
        } else if (urlParams.get('edit')) {
            const idToEdit = parseInt(urlParams.get('edit'));
            const target = notices.find(n => n.id === idToEdit);
            if (target) {
                openEditModal(target);
            }
        }
    }, [notices]);

    const openAddModal = () => {
        clearErrors();
        reset();
        setEditingNotice(null);
        setData({
            title: '',
            category: 'General Announcements',
            url: '',
            file: null,
            remove_file: false,
            content: '',
            is_active: true,
            show_on_home: true,
        });
        setIsAddModalOpen(true);
    };

    const openEditModal = (notice) => {
        clearErrors();
        setEditingNotice(notice);
        setData({
            title: notice.title,
            category: notice.category || 'General Announcements',
            url: notice.url || '',
            file: null,
            remove_file: false,
            content: notice.content || '',
            is_active: Boolean(notice.is_active),
            show_on_home: Boolean(notice.show_on_home),
        });
        setIsAddModalOpen(true);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setEditingNotice(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingNotice) {
            router.post(route('notices.update', editingNotice.id), {
                _method: 'PUT',
                title: data.title,
                category: data.category,
                url: data.url,
                content: data.content,
                file: data.file,
                remove_file: data.remove_file ? 1 : 0,
                is_active: data.is_active ? 1 : 0,
                show_on_home: data.show_on_home ? 1 : 0,
            }, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('notices.store'), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
            destroy(route('notices.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    // Quick toggle active / marquee directly
    const handleQuickToggle = (notice, field) => {
        router.put(route('notices.update', notice.id), {
            title: notice.title,
            category: notice.category || 'General Announcements',
            url: notice.url || '',
            content: notice.content || '',
            is_active: field === 'is_active' ? !notice.is_active : notice.is_active,
            show_on_home: field === 'show_on_home' ? !notice.show_on_home : notice.show_on_home,
        }, {
            preserveScroll: true,
        });
    };

    // Filter notices based on search, tab, and category
    const filteredNotices = useMemo(() => {
        return notices.filter(n => {
            const matchesSearch = 
                (n.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (n.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (n.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (n.url || '').toLowerCase().includes(searchQuery.toLowerCase());

            const matchesTab = 
                filterTab === 'all' ? true :
                filterTab === 'active' ? n.is_active :
                filterTab === 'marquee' ? n.show_on_home :
                !n.is_active;

            const matchesCategory = 
                categoryFilter === 'all' ? true :
                (n.category || 'General Announcements') === categoryFilter;

            return matchesSearch && matchesTab && matchesCategory;
        });
    }, [notices, searchQuery, filterTab, categoryFilter]);

    const activeCount = useMemo(() => notices.filter(n => n.is_active).length, [notices]);
    const marqueeCount = useMemo(() => notices.filter(n => n.show_on_home).length, [notices]);

    return (
        <AuthenticatedLayout header="Notices & Circulars">
            <Head title="Notice Management - Bogura Golf Club" />

            <div className="max-w-7xl mx-auto space-y-6 pb-16">
                
                {/* ── 1. SUCCESS FLASH MESSAGE ── */}
                {flash?.success && (
                    <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span className="text-xs sm:text-sm font-semibold">{flash.success}</span>
                        </div>
                    </div>
                )}

                {/* ── 2. EXECUTIVE HERO BANNER ── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                                <Bell className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Official Circulars & Broadcasts</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                <span>{notices.length} Total Circulars</span>
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={appleStyle}>
                            Club Announcements & Circulars
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                            Publish tournament circulars, AGM announcements, course maintenance advisories, and live homepage marquee tickers.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
                        <Link
                            href="/notice-board"
                            target="_blank"
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-200 transition-all active:scale-95"
                        >
                            <span>Public Notice Board</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        </Link>
                        <button
                            onClick={openAddModal}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0c2417] hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4 text-emerald-300" />
                            <span>Publish Notice</span>
                        </button>
                    </div>
                </div>

                {/* ── 3. SEARCH & STATUS FILTER TOOLBAR ── */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    {/* Live Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by title, description, or category..."
                            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-600 transition-all font-medium"
                        />
                    </div>

                    {/* Status Filter Pills */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                        <button
                            onClick={() => setFilterTab('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                filterTab === 'all' 
                                    ? 'bg-white text-slate-900 shadow-xs' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            All ({notices.length})
                        </button>
                        <button
                            onClick={() => setFilterTab('active')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                filterTab === 'active' 
                                    ? 'bg-emerald-800 text-white shadow-xs' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Active ({activeCount})
                        </button>
                        <button
                            onClick={() => setFilterTab('marquee')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                                filterTab === 'marquee' 
                                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-xs' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Megaphone className="w-3 h-3" />
                            <span>Marquee ({marqueeCount})</span>
                        </button>
                        <button
                            onClick={() => setFilterTab('hidden')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                filterTab === 'hidden' 
                                    ? 'bg-slate-700 text-white shadow-xs' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Drafts ({notices.length - activeCount})
                        </button>
                    </div>
                </div>

                {/* ── 4. MODERN EXECUTIVE NOTICES TABLE ── */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs whitespace-nowrap">
                            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200/80">
                                <tr>
                                    <th className="px-6 py-4">Notice Title & Details</th>
                                    <th className="px-6 py-4 text-center">Category</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Home Marquee</th>
                                    <th className="px-6 py-4 text-center">Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredNotices.length > 0 ? (
                                    filteredNotices.map((notice) => {
                                        const pubDate = notice.created_at ? new Date(notice.created_at) : null;

                                        return (
                                            <tr key={notice.id} className="hover:bg-emerald-50/30 transition-colors group">
                                                
                                                {/* Notice Title, Description & URL */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3.5">
                                                        <div 
                                                            onClick={() => setPreviewNotice(notice)}
                                                            className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs cursor-pointer hover:bg-emerald-100"
                                                        >
                                                            <Bell className="w-5 h-5" />
                                                        </div>
                                                        <div className="min-w-0 max-w-md space-y-1">
                                                            <p 
                                                                onClick={() => setPreviewNotice(notice)}
                                                                className={`font-bold text-slate-900 text-sm group-hover:text-emerald-900 transition-colors truncate cursor-pointer hover:underline ${isBangla(notice.title) ? 'font-bangla text-[15px]' : ''}`} 
                                                                title={notice.title}
                                                            >
                                                                {formatBanglaDigits(notice.title)}
                                                            </p>
                                                            {notice.content ? (
                                                                <p className={`text-[11px] text-slate-500 line-clamp-1 font-normal ${isBangla(notice.content) ? 'font-bangla' : ''}`}>
                                                                    {formatBanglaDigits(notice.content)}
                                                                </p>
                                                            ) : null}
                                                            
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                {notice.file_path && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setPreviewNotice(notice)}
                                                                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-900 font-extrabold text-[10px] border border-blue-200 hover:bg-blue-100 transition-colors shadow-2xs"
                                                                    >
                                                                        <FileText className="w-3 h-3 text-blue-700" />
                                                                        <span>{notice.file_path.split('.').pop().toUpperCase()} Attachment</span>
                                                                    </button>
                                                                )}
                                                                {notice.url && (
                                                                    <a 
                                                                        href={notice.url} 
                                                                        target="_blank" 
                                                                        rel="noreferrer" 
                                                                        className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-1"
                                                                    >
                                                                        <Globe className="w-3 h-3" />
                                                                        <span className="truncate max-w-[180px]">{notice.url}</span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Category Pill */}
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 text-[11px] font-bold uppercase tracking-wider border border-emerald-200">
                                                        <Tag className="w-3 h-3 text-emerald-700" />
                                                        <span>{notice.category || 'General'}</span>
                                                    </span>
                                                </td>

                                                {/* Status Badge */}
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleQuickToggle(notice, 'is_active')}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                                                            notice.is_active 
                                                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200 hover:bg-emerald-200' 
                                                                : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                                                        }`}
                                                        title="Click to toggle active status"
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${notice.is_active ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                                                        <span>{notice.is_active ? 'Active' : 'Hidden'}</span>
                                                    </button>
                                                </td>

                                                {/* Home Marquee Ticker */}
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => handleQuickToggle(notice, 'show_on_home')}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                                                            notice.show_on_home
                                                                ? 'bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200'
                                                                : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'
                                                        }`}
                                                        title="Click to toggle homepage marquee"
                                                    >
                                                        <Megaphone className={`w-3.5 h-3.5 ${notice.show_on_home ? 'text-amber-700' : 'text-slate-300'}`} />
                                                        <span>{notice.show_on_home ? 'Live' : 'Off'}</span>
                                                    </button>
                                                </td>

                                                {/* Published Date */}
                                                <td className="px-6 py-4 text-center text-slate-600 font-semibold">
                                                    {formatDateDDMMYYYY(notice.created_at)}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => setPreviewNotice(notice)}
                                                            className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-200 transition-colors"
                                                            title="Preview Notice"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => openEditModal(notice)}
                                                            className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors"
                                                            title="Edit Notice"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(notice.id, notice.title)}
                                                            className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors"
                                                            title="Delete Notice"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-400 space-y-2">
                                            <Bell className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                                            <p className="text-sm font-semibold text-slate-600">No notices found</p>
                                            <p className="text-xs text-slate-400">Click "Publish Notice" above to post a new announcement.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* ── 5. EXECUTIVE ADD / EDIT NOTICE MODAL (WITH CATEGORY & DETAILS) ── */}
            <Modal show={isAddModalOpen} onClose={closeModal} maxWidth="4xl">
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                    
                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center font-bold">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-extrabold text-slate-900" style={appleStyle}>
                                    {editingNotice ? 'Edit Circular / Announcement' : 'Publish New Circular'}
                                </h3>
                                <p className="text-xs text-slate-500 font-normal mt-0.5">
                                    Set notice headline, category pill, detailed description, and broadcast channels.
                                </p>
                            </div>
                        </div>
                        <button 
                            type="button" 
                            onClick={closeModal} 
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                        {/* Title & Category Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2">
                                <InputLabel htmlFor="notice_title" value="Notice Title & Headline" />
                                <TextInput
                                    id="notice_title"
                                    type="text"
                                    value={data.title}
                                    className="mt-1.5 block w-full rounded-2xl border-slate-200 text-sm focus:border-emerald-600 focus:ring-emerald-600 font-semibold text-slate-900"
                                    placeholder="e.g. President Cup 2026 Flight Allotment & Reporting Time"
                                    onChange={(e) => setData('title', e.target.value)}
                                    autoFocus
                                    required
                                />
                                <InputError message={errors.title} className="mt-1.5" />
                            </div>

                            <div>
                                <InputLabel htmlFor="notice_category" value="Notice Category Pill" />
                                <select
                                    id="notice_category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="mt-1.5 block w-full rounded-2xl border-slate-200 bg-white text-sm focus:border-emerald-600 focus:ring-emerald-600 py-2.5 px-3.5 font-semibold text-slate-800"
                                >
                                    {categoriesList.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <InputError message={errors.category} className="mt-1.5" />
                            </div>
                        </div>

                        {/* Description / Content Textarea */}
                        <div>
                            <InputLabel htmlFor="notice_content" value="Detailed Notice Description / Body" />
                            <textarea
                                id="notice_content"
                                rows={4}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="mt-1.5 block w-full rounded-2xl border-slate-200 text-sm focus:border-emerald-600 focus:ring-emerald-600 text-slate-800"
                                placeholder="Write the full notice announcement, reporting instructions, guidelines, or details..."
                            />
                            <InputError message={errors.content} className="mt-1.5" />
                        </div>

                        {/* File Upload & URL Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* File / PDF Attachment Upload */}
                            <div className="space-y-1.5">
                                <InputLabel value="Upload Circular PDF, Document, or Image" />
                                
                                {editingNotice?.file_path && !data.remove_file ? (
                                    <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                                                <FileText className="w-5 h-5 text-blue-700" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-blue-950 truncate">
                                                    {editingNotice.file_path.split('/').pop()}
                                                </p>
                                                <p className="text-[10px] text-blue-700 uppercase font-semibold">
                                                    Attached Document
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <a
                                                href={`/storage/${editingNotice.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200 transition-colors"
                                            >
                                                View
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => setData('remove_file', true)}
                                                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="flex flex-col items-center justify-center w-full px-4 py-3.5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50/80 hover:bg-emerald-50/30 cursor-pointer transition-colors group">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <FileText className="w-6 h-6 text-slate-400 group-hover:text-emerald-700 mb-1 transition-colors" />
                                                <p className="text-xs font-bold text-slate-700 group-hover:text-emerald-900">
                                                    {data.file ? data.file.name : 'Click to select PDF, Word Doc, or Image'}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-0.5">
                                                    PDF, DOC, DOCX, JPG, PNG &bull; Opens in viewer
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        setData('file', e.target.files[0]);
                                                        setData('remove_file', false);
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                        {data.file && (
                                            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200">
                                                <span className="truncate max-w-xs">{data.file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('file', null)}
                                                    className="text-rose-600 hover:text-rose-800 font-bold ml-2"
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <InputError message={errors.file} className="mt-1.5" />
                            </div>

                            {/* Optional URL */}
                            <div className="space-y-1.5">
                                <InputLabel htmlFor="notice_url" value="Associated Web Link / External URL (Optional)" />
                                <TextInput
                                    id="notice_url"
                                    type="url"
                                    value={data.url}
                                    className="mt-1.5 block w-full rounded-2xl border-slate-200 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                                    placeholder="https://bgcbd.com/tournaments or external URL"
                                    onChange={(e) => setData('url', e.target.value)}
                                />
                                <p className="text-[11px] text-slate-400 mt-1">If provided, members can click the notice to navigate directly to this link.</p>
                                <InputError message={errors.url} className="mt-1.5" />
                            </div>
                        </div>

                        {/* Executive Toggles Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Executive Toggle 1: Active Status */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-slate-900 block">Active Status</span>
                                    <span className="text-[11px] text-slate-500 block">Visible on the public notice board</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
                                </label>
                            </div>

                            {/* Executive Toggle 2: Show on Marquee */}
                            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                                        <Megaphone className="w-3.5 h-3.5 text-amber-700" />
                                        <span>Show on Home Page Marquee</span>
                                    </span>
                                    <span className="text-[11px] text-amber-800/80 block">Displays in the live scrolling announcement marquee</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.show_on_home}
                                        onChange={(e) => setData('show_on_home', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 rounded-2xl bg-[#0c2417] hover:bg-emerald-950 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            <Check className="w-4 h-4 text-emerald-300" />
                            <span>{editingNotice ? 'Update Notice' : 'Publish Notice'}</span>
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── 6. DIRECT DOCUMENT / PDF IN-MODAL VIEWER ── */}
            <Modal show={previewNotice !== null} onClose={() => setPreviewNotice(null)} maxWidth="3xl">
                {previewNotice && (
                    <div className="p-5 sm:p-7 space-y-5">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-4 gap-4">
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold uppercase tracking-wider">
                                        {previewNotice.category || 'General'}
                                    </span>
                                    <span className="text-xs text-slate-500 font-semibold">
                                        {formatDateDDMMYYYY(previewNotice.created_at)}
                                    </span>
                                    {previewNotice.file_path && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black uppercase tracking-wider">
                                            {previewNotice.file_path.split('.').pop().toUpperCase()} Attachment
                                        </span>
                                    )}
                                </div>
                                <h3 
                                    className={`text-xl sm:text-2xl font-bold text-slate-900 leading-snug mt-2 ${isBangla(previewNotice.title) ? 'font-bangla' : ''}`} 
                                    style={isBangla(previewNotice.title) ? { fontFamily: "'Tiro Bangla', 'Hind Siliguri', 'Noto Sans Bengali', sans-serif" } : appleStyle}
                                >
                                    {formatBanglaDigits(previewNotice.title)}
                                </h3>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setPreviewNotice(null)} 
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100 hover:bg-slate-200 shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Written Notice Body */}
                        {previewNotice.content && (
                            <div className={`p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal ${isBangla(previewNotice.content) ? 'font-bangla text-[15px]' : ''}`}>
                                {formatBanglaDigits(previewNotice.content)}
                            </div>
                        )}

                        {/* In-Modal Direct File / PDF Viewer */}
                        {previewNotice.file_path ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-emerald-800" />
                                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                            Document Preview
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={`/storage/${previewNotice.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            <span>Open Full</span>
                                        </a>
                                        <a
                                            href={`/storage/${previewNotice.file_path}`}
                                            download
                                            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#1C2C1D] text-white hover:bg-[#2C442E] text-xs font-bold transition-colors"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>Download</span>
                                        </a>
                                    </div>
                                </div>

                                {/* PDF Viewer */}
                                {previewNotice.file_path.toLowerCase().endsWith('.pdf') ? (
                                    <div className="w-full h-[60vh] sm:h-[65vh] rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100">
                                        <iframe
                                            src={`/storage/${previewNotice.file_path}#toolbar=1&navpanes=0`}
                                            className="w-full h-full border-0"
                                            title="Notice PDF Document"
                                        />
                                    </div>
                                ) : previewNotice.file_path.toLowerCase().match(/\.(jpg|jpeg|png|webp|gif)$/) ? (
                                    <div className="max-h-[60vh] sm:h-[65vh] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 flex items-center justify-center p-2">
                                        <img
                                            src={`/storage/${previewNotice.file_path}`}
                                            alt={previewNotice.title}
                                            className="max-h-full max-w-full object-contain rounded-xl shadow-sm"
                                        />
                                    </div>
                                ) : (
                                    /* Word Doc / DOCX / Other */
                                    <div className="space-y-3">
                                        <div className="w-full h-[55vh] rounded-2xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100">
                                            <iframe
                                                src={`https://docs.google.com/viewer?url=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/storage/${previewNotice.file_path}` : `/storage/${previewNotice.file_path}`)}&embedded=true`}
                                                className="w-full h-full border-0"
                                                title="Notice Word Document Viewer"
                                            />
                                        </div>
                                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
                                            <span>Document preview rendered via online viewer. You can also download the file directly.</span>
                                            <a
                                                href={`/storage/${previewNotice.file_path}`}
                                                download
                                                className="font-bold underline ml-2 shrink-0"
                                            >
                                                Download File
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null}

                        {previewNotice.url && (
                            <div className="pt-2 border-t border-slate-100">
                                <a 
                                    href={previewNotice.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline"
                                >
                                    <span>Open Associated Web Destination</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setPreviewNotice(null)}
                                className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                                Close Viewer
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

        </AuthenticatedLayout>
    );
}
