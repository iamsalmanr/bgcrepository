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
    Sparkles,
    FileCheck,
    HelpCircle
} from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Create() {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        file: null,
        sort_order: 0,
        is_active: true,
    });

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.015em'
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('forms.store'));
    };

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setData('file', selected);
            // Auto-fill title if empty
            if (!data.title) {
                const cleanTitle = selected.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                setData('title', cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
            }
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files?.[0];
        if (dropped) {
            setData('file', dropped);
            if (!data.title) {
                const cleanTitle = dropped.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
                setData('title', cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
            }
        }
    };

    return (
        <AuthenticatedLayout header="Upload Club Form">
            <Head title="Upload Form - Bogura Golf Club" />

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
                            Upload New Club Form
                        </h2>
                        <p className="text-xs text-slate-500 font-normal">
                            Publish downloadable PDF membership applications, entry forms, and agreements.
                        </p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold border border-emerald-200 shrink-0">
                        <FileUp className="w-6 h-6" />
                    </div>
                </div>

                {/* ── 2. EXECUTIVE UPLOAD FORM CARD ── */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8">
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Interactive Drag & Drop File Upload Surface */}
                        <div>
                            <InputLabel value="Upload Document (PDF, DOC, DOCX, Image)" />
                            
                            {!data.file ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    className={`mt-2 p-8 sm:p-10 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 group ${
                                        isDragging 
                                            ? 'border-emerald-600 bg-emerald-50' 
                                            : 'border-emerald-300/80 hover:border-emerald-600 bg-emerald-50/20 hover:bg-emerald-50/50'
                                    }`}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-200 shadow-sm flex items-center justify-center text-emerald-800 group-hover:scale-110 group-hover:bg-[#0c2417] group-hover:text-white transition-all">
                                        <UploadCloud className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-950 transition-colors">
                                            Click to browse or drag & drop application document here
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Supports PDF, DOCX, DOC, JPG, PNG up to 10MB
                                        </p>
                                    </div>
                                    <span className="px-4 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-2xs group-hover:border-emerald-400">
                                        Choose File
                                    </span>
                                </div>
                            ) : (
                                /* Selected File Preview Card */
                                <div className="mt-2 p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                                            <FileCheck className="w-6 h-6 text-emerald-300" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate" title={data.file.name}>
                                                {data.file.name}
                                            </p>
                                            <p className="text-xs text-emerald-800 font-medium mt-0.5">
                                                {(data.file.size / 1024).toFixed(1)} KB • Ready to upload
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setData('file', null)}
                                        className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 text-xs font-bold uppercase transition-colors shrink-0 flex items-center gap-1"
                                    >
                                        <X className="w-4 h-4" />
                                        <span className="hidden sm:inline">Change</span>
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
                                placeholder="e.g. Permanent Membership Application Form (Form A)"
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            <p className="text-[11px] text-slate-400 mt-1">This title will be displayed to members and public applicants.</p>
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
                                    placeholder="0"
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
                                disabled={processing || !data.file}
                                className="px-7 py-3 rounded-2xl bg-[#0c2417] hover:bg-emerald-950 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4 text-emerald-300" />
                                <span>{processing ? 'Uploading Document...' : 'Publish Club Form'}</span>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
