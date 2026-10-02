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
    ExternalLink,
    Upload,
    RefreshCw
} from 'lucide-react';
import InputError from '@/Components/InputError';

const DEFAULT_TOURNAMENT_IMAGE = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop';

const resolveImageUrl = (path) => {
    if (!path) return DEFAULT_TOURNAMENT_IMAGE;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return path;
    return `/storage/${path}`;
};

export default function Edit({ tournament }) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isNewUpload, setIsNewUpload] = useState(false);
    const [imagePreview, setImagePreview] = useState(resolveImageUrl(tournament.image_path));

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: tournament.title || '',
        description: tournament.description || '',
        start_date: tournament.start_date ? tournament.start_date.substring(0, 10) : '',
        end_date: tournament.end_date ? tournament.end_date.substring(0, 10) : '',
        status: tournament.status || 'upcoming',
        location: tournament.location || 'Bogura Golf Course',
        link: tournament.link || '',
        image_path: null,
        is_active: Boolean(tournament.is_active),
        sort_order: tournament.sort_order || 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tournaments.update', tournament.id));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image_path', file);
            setIsNewUpload(true);
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
            setIsNewUpload(true);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result);
            reader.readAsDataURL(file);
        }
    };

    const handleCancelNewUpload = (e) => {
        e.stopPropagation();
        setImagePreview(resolveImageUrl(tournament.image_path));
        setData('image_path', null);
        setIsNewUpload(false);
    };

    return (
        <AuthenticatedLayout header="Edit Tournament">
            <Head title={`Edit Tournament - ${tournament.title}`} />

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
                                    Edit Tournament: {tournament.title}
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                                    Update fixture dates, match guidelines, venue, and public visibility.
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
                                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                />
                                <InputError message={errors.description} className="mt-1.5" />
                            </div>

                            {/* Tournament Banner Photo Display & Replacer */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                        Tournament Banner Photo
                                    </label>
                                    <span className="text-[11px] font-semibold text-slate-400">
                                        {isNewUpload ? 'New replacement image selected' : 'Currently active image preview'}
                                    </span>
                                </div>

                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
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

                                    <div className="relative max-w-md mx-auto aspect-16/9 rounded-xl overflow-hidden shadow-sm border border-slate-200 group bg-slate-950">
                                        <img 
                                            src={imagePreview} 
                                            alt={tournament.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.src = DEFAULT_TOURNAMENT_IMAGE;
                                            }}
                                        />
                                        
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-3">
                                            <Upload className="w-6 h-6 mb-1" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Click or Drop Image to Replace</span>
                                            <span className="text-[10px] text-slate-300 mt-0.5">Recommended: 1600x900px (JPG, PNG, WebP)</span>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                            {isNewUpload ? 'New Upload' : (tournament.image_path ? 'Custom Image' : 'Default Golf Image')}
                                        </div>

                                        {/* Revert / Cancel Button if new file is selected */}
                                        {isNewUpload && (
                                            <button
                                                type="button"
                                                onClick={handleCancelNewUpload}
                                                className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs transition-colors"
                                                title="Revert to original image"
                                            >
                                                <RefreshCw className="w-3 h-3" />
                                                <span>Revert</span>
                                            </button>
                                        )}
                                    </div>
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
                                    <Save className="w-4 h-4" />
                                    <span>{processing ? 'Saving...' : 'Update Tournament'}</span>
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
