import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Plus, 
    Edit, 
    Trash2, 
    FileText, 
    ExternalLink, 
    Eye, 
    Search, 
    Filter, 
    Download, 
    CheckCircle2, 
    EyeOff, 
    Sparkles, 
    X, 
    FileDown, 
    Layers, 
    Check, 
    ChevronRight,
    ArrowUpRight,
    GripVertical,
    FileCheck
} from 'lucide-react';
import Modal from '@/Components/Modal';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';

function SortableFormRow({ form, index, onPreview, onDelete, onQuickToggle }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: form.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 0,
        position: 'relative',
    };

    return (
        <tr 
            ref={setNodeRef} 
            style={style} 
            className={`transition-colors group ${isDragging ? 'bg-emerald-100 shadow-xl opacity-90' : 'hover:bg-emerald-50/30'}`}
        >
            {/* Drag Handle */}
            <td className="px-4 py-4 w-10 text-center">
                <div 
                    {...attributes} 
                    {...listeners} 
                    className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-300 hover:text-emerald-700 hover:bg-emerald-50 transition-colors inline-block"
                    title="Drag to reorder"
                >
                    <GripVertical className="w-4 h-4" />
                </div>
            </td>

            {/* Form Title & Icon */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 max-w-md">
                        <p 
                            onClick={() => onPreview(form)}
                            className="font-bold text-slate-900 text-sm group-hover:text-emerald-900 transition-colors truncate cursor-pointer hover:underline" 
                            title={form.title}
                        >
                            {form.title}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                            {form.file_path ? form.file_path.split('/').pop() : 'No attachment'}
                        </p>
                    </div>
                </div>
            </td>

            {/* Direct View / Stream in Tab */}
            <td className="px-6 py-4 text-center">
                {form.file_path ? (
                    <div className="inline-flex items-center gap-1.5">
                        <a
                            href={route('forms.view', form.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-[#0c2417] text-emerald-900 hover:text-white border border-emerald-200 text-xs font-bold uppercase tracking-wider transition-all shadow-2xs"
                            title="Open direct file stream in new tab"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open in Tab</span>
                        </a>
                        <button
                            type="button"
                            onClick={() => onPreview(form)}
                            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors"
                            title="Quick in-page preview modal"
                        >
                            <Eye className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ) : (
                    <span className="text-slate-300 text-xs italic">No document</span>
                )}
            </td>

            {/* Sort Order Index */}
            <td className="px-6 py-4 text-center text-slate-500 font-semibold">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold font-mono">
                    #{index + 1}
                </span>
            </td>

            {/* Public Status Toggle */}
            <td className="px-6 py-4 text-center">
                <button
                    onClick={() => onQuickToggle(form)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                        form.is_active 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200 hover:bg-emerald-200' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Click to toggle visibility"
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${form.is_active ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                    <span>{form.is_active ? 'Active' : 'Hidden'}</span>
                </button>
            </td>

            {/* Actions */}
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                    <Link
                        href={route('forms.edit', form.id)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors"
                        title="Edit Form"
                    >
                        <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                        onClick={() => onDelete(form.id, form.title)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors"
                        title="Delete Form"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function Index({ forms }) {
    const { delete: destroy } = useForm();
    const { flash } = usePage().props;

    const initialList = forms.data || forms;
    const [items, setItems] = useState(initialList);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'hidden'
    const [previewForm, setPreviewForm] = useState(null);
    const [isReordering, setIsReordering] = useState(false);

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    useEffect(() => {
        setItems(forms.data || forms);
    }, [forms]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);

            setIsReordering(true);
            const orders = newItems.map((item, index) => ({
                id: item.id,
                sort_order: index + 1,
            }));

            axios.post(route('forms.reorder'), { orders })
                .then(() => {
                    setIsReordering(false);
                })
                .catch((err) => {
                    console.error('Failed to save form order', err);
                    setIsReordering(false);
                });
        }
    };

    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            destroy(route('forms.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const handleQuickToggle = (form) => {
        router.put(route('forms.update', form.id), {
            title: form.title,
            sort_order: form.sort_order,
            is_active: !form.is_active,
        }, {
            preserveScroll: true,
        });
    };

    // Filtered items
    const filteredForms = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = 
                statusFilter === 'all' ? true :
                statusFilter === 'active' ? item.is_active :
                !item.is_active;

            return matchesSearch && matchesStatus;
        });
    }, [items, searchQuery, statusFilter]);

    const activeCount = useMemo(() => items.filter(f => f.is_active).length, [items]);
    const hiddenCount = items.length - activeCount;

    return (
        <AuthenticatedLayout header="Manage Club Forms">
            <Head title="Manage Club Forms - Bogura Golf Club" />

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
                                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Official Documents Registry</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                <span>{items.length} Total Forms</span>
                            </span>
                            {isReordering && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold animate-pulse">
                                    Saving Order...
                                </span>
                            )}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={appleStyle}>
                            Club Forms & Application Directory
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                            Manage downloadable PDF applications, membership documents, and tournament entry declarations. <strong className="text-slate-700">Drag handles to re-order forms.</strong>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
                        <Link
                            href="/club-form"
                            target="_blank"
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-200 transition-all active:scale-95"
                        >
                            <span>Public Page</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        </Link>
                        <Link
                            href={route('forms.create')}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0c2417] hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4 text-emerald-300" />
                            <span>Add New Form</span>
                        </Link>
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
                            placeholder="Search forms by title..."
                            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-600 transition-all font-medium"
                        />
                    </div>

                    {/* Status Filter Pills */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                statusFilter === 'all' 
                                    ? 'bg-white text-slate-900 shadow-xs' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            All ({items.length})
                        </button>
                        <button
                            onClick={() => setStatusFilter('active')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                statusFilter === 'active' 
                                    ? 'bg-emerald-800 text-white shadow-xs' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Active ({activeCount})
                        </button>
                        <button
                            onClick={() => setStatusFilter('hidden')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                statusFilter === 'hidden' 
                                    ? 'bg-slate-700 text-white shadow-xs' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Hidden ({hiddenCount})
                        </button>
                    </div>
                </div>

                {/* ── 4. MODERN REORDERABLE FORMS TABLE ── */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <table className="w-full text-left text-xs whitespace-nowrap">
                                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200/80">
                                    <tr>
                                        <th className="px-4 py-4 w-10 text-center">Reorder</th>
                                        <th className="px-5 py-4">Form Document Title</th>
                                        <th className="px-6 py-4 text-center">Direct View / PDF</th>
                                        <th className="px-6 py-4 text-center">Sort Order</th>
                                        <th className="px-6 py-4 text-center">Public Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredForms.length > 0 ? (
                                        <SortableContext
                                            items={filteredForms.map((f) => f.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {filteredForms.map((form, index) => (
                                                <SortableFormRow
                                                    key={form.id}
                                                    form={form}
                                                    index={index}
                                                    onPreview={setPreviewForm}
                                                    onDelete={handleDelete}
                                                    onQuickToggle={handleQuickToggle}
                                                />
                                            ))}
                                        </SortableContext>
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-slate-400 space-y-2">
                                                <FileText className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                                                <p className="text-sm font-semibold text-slate-600">No forms found</p>
                                                <p className="text-xs text-slate-400">Click "Add New Form" above to upload a PDF or application form.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </DndContext>
                    </div>
                </div>

            </div>

            {/* ── 5. IN-PAGE PDF & ATTACHMENT PREVIEW MODAL ── */}
            <Modal show={previewForm !== null} onClose={() => setPreviewForm(null)} maxWidth="4xl">
                {previewForm && (
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900" style={appleStyle}>
                                        {previewForm.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-normal">
                                        Stored at: <span className="font-mono">{previewForm.file_path}</span>
                                    </p>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => setPreviewForm(null)} 
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Document Viewer Frame */}
                        <div className="w-full h-[65vh] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                            <iframe
                                src={route('forms.view', previewForm.id)}
                                title={previewForm.title}
                                className="w-full h-full border-0"
                            />
                        </div>

                        {/* Footer Controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-xs text-slate-400 font-medium">
                                Status: <strong className={previewForm.is_active ? 'text-emerald-700' : 'text-slate-500'}>{previewForm.is_active ? 'Publicly Active' : 'Hidden'}</strong>
                            </span>
                            <div className="flex items-center gap-2">
                                <a
                                    href={route('forms.view', previewForm.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-[#0c2417] text-emerald-900 hover:text-white border border-emerald-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-2xs"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Open Fullscreen in New Tab</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setPreviewForm(null)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

        </AuthenticatedLayout>
    );
}
