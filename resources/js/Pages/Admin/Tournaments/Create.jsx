import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserDropdown from '@/Components/UserDropdown';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Save, 
    Trophy, 
    UploadCloud, 
    Calendar, 
    MapPin, 
    Globe, 
    Image as ImageIcon, 
    X, 
    FileCheck,
    Plus,
    Upload
} from 'lucide-react';
import InputError from '@/Components/InputError';

export default function Create() {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'upcoming',
        location: 'Bogura Golf Course',
        link: '',
        image_path: null,
        is_active: true,
        sort_order: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tournaments.store'));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image_path', file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result);
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setData('image_path', file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <AuthenticatedLayout header="Create Tournament">
            <Head title="Create Tournament - Bogura Golf Club" />

            <div className="bg-[#F8F9F8] min-h-screen text-slate-900 py-10 sm:py-14">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* ── TOP HEADER ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <Link 
                                href={route('tournaments.index')}
                                className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-2xs shrink-0"
                                title="Back to Tournaments"
                            >
                                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                            </Link>

                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                                    Schedule New Tournament
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                                    Publish a championship fixture, division trophy, or corporate golf match.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── MAIN FORM CARD ── */}
                    <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-7">
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Tournament Title */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Tournament Title / Event Name *
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. 11 Infantry Division Championship Trophy 2026"
                                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    required
                                />
                                <InputError message={errors.title} className="mt-1.5" />
                            </div>

                            {/* Dates & Status */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Start Date *
                                    </label>
                                    <input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                        required
                                    />
                                    <InputError message={errors.start_date} className="mt-1.5" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                        End Date
                                    </label>
                                    <input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                    <InputError message={errors.end_date} className="mt-1.5" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Event Status
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    >
                                        <option value="upcoming">Upcoming Match</option>
                                        <option value="live">Live Tournament</option>
                                        <option value="completed">Completed Event</option>
                                    </select>
                                    <InputError message={errors.status} className="mt-1.5" />
                                </div>
                            </div>

                            {/* Location & External Link */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Venue Location
                                    </label>
                                    <input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="e.g. Bogura Golf Course / Driving Range"
                                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                    <InputError message={errors.location} className="mt-1.5" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Registration / Details URL (Optional)
                                    </label>
                                    <input
                                        id="link"
                                        type="url"
                                        value={data.link}
                                        onChange={(e) => setData('link', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                    <InputError message={errors.link} className="mt-1.5" />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Match Description & Guidelines
                                </label>
                                <textarea
                                    id="description"
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter tournament format, entry fees, eligibility, scoring system..."
                                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                />
                                <InputError message={errors.description} className="mt-1.5" />
                            </div>

                            {/* Featured Banner Image Upload */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                    Tournament Banner Photo (Optional)
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                                        isDragging ? 'border-[#1C2C1D] bg-[#D4E2D2]/20' : 'border-slate-300 hover:border-[#1C2C1D] bg-slate-50'
                                    }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />

                                    {imagePreview ? (
                                        <div className="relative max-w-sm mx-auto aspect-16/9 rounded-xl overflow-hidden shadow-sm">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setImagePreview(null); setData('image_path', null); }}
                                                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/80 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <div className="w-11 h-11 rounded-full bg-white text-[#1C2C1D] flex items-center justify-center shadow-xs">
                                                <Upload className="w-5 h-5" />
                                            </div>
                                            <p className="text-xs sm:text-sm font-bold text-slate-800">
                                                Click or drop tournament banner image here
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                                Recommended: Landscape 1600x900px (JPG, PNG, WebP up to 5MB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <InputError message={errors.image_path} className="mt-1.5" />
                            </div>

                            {/* Public Visibility Toggle */}
                            <div className="p-4 rounded-2xl bg-[#D4E2D2]/30 border border-[#BFD4BD] flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                        Public Fixture Visibility
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Show this tournament on the public fixtures calendar and member dashboard.
                                    </p>
                                </div>
                                <label className="flex items-center cursor-pointer gap-2 select-none">
                                    <span className="text-xs font-bold text-slate-700">
                                        {data.is_active ? 'Active' : 'Hidden'}
                                    </span>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                        />
                                        <div className={`block w-10 h-6 rounded-full transition-colors ${data.is_active ? 'bg-[#1C2C1D]' : 'bg-slate-300'}`}></div>
                                        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.is_active ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <Link
                                    href={route('tournaments.index')}
                                    className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
                                >
                                    Cancel
                                </Link>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-7 py-2.5 rounded-full bg-[#1C2C1D] hover:bg-[#2C442E] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>{processing ? 'Scheduling...' : 'Publish Tournament'}</span>
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
