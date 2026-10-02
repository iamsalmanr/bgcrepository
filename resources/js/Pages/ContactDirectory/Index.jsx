import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Plus, 
    Edit, 
    Trash2, 
    GripVertical, 
    PhoneCall, 
    Building2, 
    Mail, 
    ExternalLink, 
    Search, 
    CheckCircle2, 
    Sparkles, 
    SlidersHorizontal,
    Phone,
    Columns,
    Check,
    X,
    FolderKanban
} from 'lucide-react';
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
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

function SortableContactRow({ dir, index, handleDelete, onEdit }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: dir.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 0,
        position: 'relative',
    };

    const isLeft = dir.column === 'left';

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

            {/* Column Location Tag */}
            <td className="px-5 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    isLeft 
                        ? 'bg-blue-50 text-blue-900 border-blue-200' 
                        : 'bg-purple-50 text-purple-900 border-purple-200'
                }`}>
                    <Columns className="w-3 h-3" />
                    <span>{isLeft ? 'Primary / Desk' : 'Intercom / Ext'}</span>
                </span>
            </td>

            {/* Title & Icon */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 border ${
                        isLeft ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-purple-50 text-purple-700 border-purple-100'
                    }`}>
                        {dir.title.toLowerCase().includes('email') ? (
                            <Mail className="w-4 h-4" />
                        ) : dir.title.toLowerCase().includes('exchange') || dir.title.toLowerCase().includes('reception') ? (
                            <Building2 className="w-4 h-4" />
                        ) : (
                            <Phone className="w-4 h-4" />
                        )}
                    </div>
                    <span className="font-bold text-slate-900 text-sm group-hover:text-emerald-900 transition-colors">
                        {dir.title}
                    </span>
                </div>
            </td>

            {/* Contact Details */}
            <td className="px-6 py-4">
                <p className="text-xs sm:text-sm text-slate-700 font-medium whitespace-pre-wrap leading-relaxed max-w-lg">
                    {dir.details}
                </p>
            </td>

            {/* Actions */}
            <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                    <Link
                        href={route('contact-directory.edit', dir.id)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors"
                        title="Edit Contact"
                    >
                        <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                        onClick={() => handleDelete(dir.id, dir.title)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors"
                        title="Delete Contact"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function Index({ directories = [] }) {
    const { delete: destroy } = useForm();
    const { flash } = usePage().props;
    const [items, setItems] = useState(directories);
    const [searchQuery, setSearchQuery] = useState('');
    const [columnFilter, setColumnFilter] = useState('all'); // 'all', 'left', 'middle'
    const [isReordering, setIsReordering] = useState(false);

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    useEffect(() => {
        setItems(directories);
    }, [directories]);

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
            
            const updatedItems = newItems.map((item, index) => ({
                ...item,
                sort_order: index + 1
            }));

            setItems(updatedItems);
            setIsReordering(true);

            router.post(route('contact-directory.reorder'), {
                items: updatedItems.map(item => ({
                    id: item.id,
                    sort_order: item.sort_order
                }))
            }, {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsReordering(false),
            });
        }
    };

    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            destroy(route('contact-directory.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    // Filtered entries
    const filteredItems = useMemo(() => {
        return items.filter(dir => {
            const matchesSearch = 
                (dir.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (dir.details || '').toLowerCase().includes(searchQuery.toLowerCase());

            const matchesColumn = 
                columnFilter === 'all' ? true :
                dir.column === columnFilter;

            return matchesSearch && matchesColumn;
        });
    }, [items, searchQuery, columnFilter]);

    const leftCount = useMemo(() => items.filter(i => i.column === 'left').length, [items]);
    const middleCount = useMemo(() => items.filter(i => i.column === 'middle').length, [items]);

    return (
        <AuthenticatedLayout header="Manage Contact Directory">
            <Head title="Contact Directory - Bogura Golf Club" />

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
                                <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Official Contact Directory</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                <span>{items.length} Total Numbers</span>
                            </span>
                            {isReordering && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold animate-pulse">
                                    Saving Order...
                                </span>
                            )}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={appleStyle}>
                            Contact Numbers & Department Directory
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                            Maintain reception helplines, army exchange intercoms, department extensions, and official emails. <strong className="text-slate-700">Drag handles to re-order entries.</strong>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
                        <Link
                            href="/contact-us"
                            target="_blank"
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-200 transition-all active:scale-95"
                        >
                            <span>Public Page</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        </Link>
                        <Link
                            href={route('contact-directory.create')}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0c2417] hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4 text-emerald-300" />
                            <span>Add Contact Entry</span>
                        </Link>
                    </div>
                </div>

                {/* ── 3. SEARCH & COLUMN FILTER TOOLBAR ── */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    {/* Live Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by department title, phone, or email..."
                            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-600 transition-all font-medium"
                        />
                    </div>

                    {/* Column Filter Pills */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                        <button
                            onClick={() => setColumnFilter('all')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                columnFilter === 'all' 
                                    ? 'bg-white text-slate-900 shadow-xs' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            All ({items.length})
                        </button>
                        <button
                            onClick={() => setColumnFilter('left')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                columnFilter === 'left' 
                                    ? 'bg-blue-700 text-white shadow-xs' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Primary / Desk ({leftCount})
                        </button>
                        <button
                            onClick={() => setColumnFilter('middle')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                columnFilter === 'middle' 
                                    ? 'bg-purple-700 text-white shadow-xs' 
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            Intercom / Ext ({middleCount})
                        </button>
                    </div>
                </div>

                {/* ── 4. MODERN REORDERABLE CONTACT DIRECTORY TABLE ── */}
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
                                        <th className="px-5 py-4">Column Group</th>
                                        <th className="px-5 py-4">Department / Section Title</th>
                                        <th className="px-6 py-4">Contact Details & Numbers</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    <SortableContext 
                                        items={filteredItems.map(i => i.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {filteredItems.length > 0 ? (
                                            filteredItems.map((dir, index) => (
                                                <SortableContactRow 
                                                    key={dir.id} 
                                                    dir={dir} 
                                                    index={index}
                                                    handleDelete={handleDelete} 
                                                />
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 space-y-2">
                                                    <PhoneCall className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                                                    <p className="text-sm font-semibold text-slate-600">No contact entries found</p>
                                                    <p className="text-xs text-slate-400">Click "Add Contact Entry" above to create a new phone or email record.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </SortableContext>
                                </tbody>
                            </table>
                        </DndContext>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
