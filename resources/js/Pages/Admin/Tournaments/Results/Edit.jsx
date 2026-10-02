import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Save, 
    Award, 
    UploadCloud, 
    Calendar, 
    Building2, 
    FileText, 
    X,
    FileCheck,
    ExternalLink
} from 'lucide-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function Edit({ record }) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: record.name || '',
        sponsored_by: record.sponsored_by || '',
        date: record.date || '',
        file: null,
    });

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.015em'
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('tournament-results.update', record.id));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setData('file', file);
        }
    };

    return (
        <AuthenticatedLayout header="Edit Match Result">
            <Head title={`Edit Result - ${record.name}`} />

            <div className="max-w-4xl mx-auto space-y-6 pb-16">
                
                {/* ── 1. HEADER BANNER ── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <Link 
                            href={route('tournament-results.index')}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-900 uppercase tracking-wider transition-colors mb-1"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back to Results</span>
                        </Link>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight" style={appleStyle}>
                            Edit Result: <span className="text-emerald-900">{record.name}</span>
                        </h2>
                        <p className="text-xs text-slate-500 font-normal">
                            Update match title, event date, sponsor details, or replace scorecard document.
                        </p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold border border-amber-200 shrink-0">
                        <Award className="w-6 h-6" />
                    </div>
                </div>

                {/* ── 2. EXECUTIVE FORM CARD ── */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8">
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Tournament Name */}
                        <div>
                            <InputLabel htmlFor="name" value="Tournament / Match Title" />
                            <TextInput
                                id="name"
                                type="text"
                                value={data.name}
                                className="mt-1.5 block w-full rounded-2xl border-slate-200 text-sm font-semibold"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-1.5" />
                        </div>

                        {/* Sponsor & Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <InputLabel htmlFor="sponsored_by" value="Sponsored By (Optional)" />
                                <TextInput
                                    id="sponsored_by"
                                    type="text"
                                    value={data.sponsored_by}
                                    className="mt-1.5 block w-full rounded-2xl border-slate-200 text-sm"
                                    onChange={(e) => setData('sponsored_by', e.target.value)}
                                />
                                <InputError message={errors.sponsored_by} className="mt-1.5" />
                            </div>

                            <div>
                                <InputLabel htmlFor="date" value="Competition Date (Optional)" />
                                <TextInput
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    className="mt-1.5 block w-full rounded-2xl border-slate-200 text-sm font-medium"
                                    onChange={(e) => setData('date', e.target.value)}
                                />
                                <InputError message={errors.date} className="mt-1.5" />
                            </div>
                        </div>

                        {/* File Upload Drag & Drop */}
                        <div>
                            <InputLabel value="Scorecard / Official Standings Document (PDF or Image)" />
                            
                            {/* Current File Display */}
                            {record.file_path && !data.file && (
                                <div className="mt-2 mb-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-800">
                                                Current Scorecard Attached
                                            </p>
                                            <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                                                {record.file_path}
                                            </p>
                                        </div>
                                    </div>

                                    <a
                                        href={`/storage/${record.file_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 border border-slate-200 text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-2xs"
                                    >
                                        <span>View</span>
                                        <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                                    </a>
                                </div>
                            )}

                            {/* New Attached File */}
                            {data.file && (
                                <div className="mt-2 mb-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                                            <FileCheck className="w-5 h-5 text-emerald-700" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate">
                                                {data.file.name}
                                            </p>
                                            <p className="text-[11px] text-emerald-800 font-mono mt-0.5">
                                                {(data.file.size / 1024).toFixed(1)} KB (Will replace current)
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setData('file', null)}
                                        className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 text-xs font-bold transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                className={`p-6 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group ${
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
                                        Click to browse or drop replacement scorecard document here
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        PDF, PNG, JPG, WEBP up to 10MB
                                    </p>
                                </div>
                            </div>

                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept=".pdf,image/*"
                                onChange={handleFileChange} 
                            />
                            <InputError message={errors.file} className="mt-1.5" />
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                            <Link 
                                href={route('tournament-results.index')} 
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
                                <span>{processing ? 'Saving...' : 'Update Result'}</span>
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
