import React, { useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    ChevronLeft, 
    Save, 
    UploadCloud, 
    FileText, 
    Check, 
    X, 
    FileUp, 
    FileCheck,
    ExternalLink,
    RefreshCw
} from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Edit({ form }) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: form.title || '',
        file: null,
        sort_order: form.sort_order || 0,
        is_active: Boolean(form.is_active),
    });

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.015em'
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('forms.update', form.id));
    };

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setData('file', selected);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) {
            setData('file', dropped);
        }
    };

    return (
        <AuthenticatedLayout header="Edit Club Form">
            <Head title={`Edit Form - ${form.title}`} />

            <div className="max-w-4xl mx-auto space-y-6 pb-16">
                
                {/* ── 1. CLEAN BACK LINK & HEADER BANNER ── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <Link 
                            href={route('forms.index')}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-900 uppercase tracking-wider transition-colors mb-1"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back to Forms Directory</span>
                        </Link>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight" style={appleStyle}>
                            Edit Form: <span className="text-emerald-900">{form.title}</span>
                        </h2>
                        <p className="text-xs text-slate-500 font-normal">
                            Update document title, replace file attachment, sort order index, and public status.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {form.file_path && (
                            <a
                                href={route('forms.view', form.id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-2xl bg-emerald-50 hover:bg-[#0c2417] text-emerald-900 hover:text-white border border-emerald-200 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-2xs"
                            >
                                <span>View Document</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>
                </div>

                {/* ── 2. EXECUTIVE EDIT FORM CARD ── */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8">
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Current Active File Banner */}
                        {form.file_path && (
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">Current Attached Document</p>
                                        <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate max-w-sm sm:max-w-md">
                                            {form.file_path}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={route('forms.view', form.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 uppercase tracking-wider shrink-0"
                                >
                                    <span>Open in Tab</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        )}

                        {/* Replace File Drag & Drop Surface */}
                        <div>
                            <InputLabel value="Replace Document (Optional - leave blank to keep current file)" />
                            
                            {!data.file ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    className={`mt-2 p-6 sm:p-8 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group ${
                                        isDragging 
                                            ? 'border-emerald-600 bg-emerald-50' 
                                            : 'border-slate-300 hover:border-emerald-600 bg-slate-50/50 hover:bg-emerald-50/40'
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 group-hover:scale-110 group-hover:bg-[#0c2417] group-hover:text-white transition-all">
                                        <UploadCloud className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-950 transition-colors">
                                            Click to upload a replacement file or drag & drop here
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Supports PDF, DOCX, DOC, JPG, PNG up to 10MB
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* Replacement File Selected Preview Card */
                                <div className="mt-2 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                                            <FileCheck className="w-6 h-6 text-emerald-300" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate" title={data.file.name}>
                                                Replacement: {data.file.name}
                                            </p>
                                            <p className="text-xs text-emerald-800 font-medium mt-0.5">
                                                {(data.file.size / 1024).toFixed(1)} KB • Will replace current file upon saving
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setData('file', null)}
                                        className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 text-xs font-bold uppercase transition-colors shrink-0 flex items-center gap-1"
                                    >
                                        <X className="w-4 h-4" />
                                        <span className="hidden sm:inline">Cancel Replacement</span>
                                    </button>
                                </div>
                            )}

                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={handleFileChange} 
                            />
                            <InputError message={errors.file} className="mt-1.5" />
                        </div>

                        {/* Form Title Field */}
                        <div>
                            <InputLabel htmlFor="title" value="Form Display Title" />
                            <TextInput
                                id="title"
                                value={data.title}
                                className="mt-1.5 block w-full rounded-2xl border-slate-200 text-sm focus:border-emerald-600 focus:ring-emerald-600 font-semibold text-slate-900"
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            <InputError message={errors.title} className="mt-1.5" />
                        </div>

                        {/* Sort Order & Visibility Toggle */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
                            <div>
                                <InputLabel htmlFor="sort_order" value="Display Sort Order Index" />
                                <TextInput
                                    id="sort_order"
                                    type="number"
                                    value={data.sort_order}
                                    className="mt-1.5 block w-full rounded-2xl border-slate-200 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                                    onChange={(e) => setData('sort_order', e.target.value)}
                                />
                                <p className="text-[11px] text-slate-400 mt-1">Lower order numbers appear first on the forms list.</p>
                                <InputError message={errors.sort_order} className="mt-1.5" />
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-slate-900 block">Public Visibility</span>
                                    <span className="text-[11px] text-slate-500 block">Visible on the public club forms page</span>
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
                        </div>

                        {/* ── 3. FORM ACTION BUTTONS ── */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                            <Link 
                                href={route('forms.index')} 
                                className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="px-7 py-3 rounded-2xl bg-[#0c2417] hover:bg-emerald-950 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4 text-emerald-300" />
                                <span>{processing ? 'Saving Changes...' : 'Update Form Record'}</span>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
