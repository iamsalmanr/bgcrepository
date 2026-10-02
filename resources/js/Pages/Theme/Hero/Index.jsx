import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserDropdown from '@/Components/UserDropdown';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    ArrowUp, 
    ArrowDown, 
    Trash2, 
    Plus, 
    GripVertical, 
    Pencil, 
    X, 
    Upload, 
    Image as ImageIcon, 
    Eye, 
    Check, 
    Sparkles, 
    SlidersHorizontal,
    Layers,
    ShieldCheck
} from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Index({ auth, slides = [] }) {
    const [localSlides, setLocalSlides] = useState(slides);
    const [editingSlide, setEditingSlide] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        setLocalSlides(slides);
    }, [slides]);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: 'post',
        image: null,
        title: '',
        subtitle: '',
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleEdit = (slide) => {
        clearErrors();
        setEditingSlide(slide);
        setPreviewUrl(slide.image_path ? `/storage/${slide.image_path}` : null);
        setData({
            _method: 'put',
            image: null,
            title: slide.title || '',
            subtitle: slide.subtitle || '',
        });
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const cancelEdit = () => {
        clearErrors();
        setEditingSlide(null);
        setPreviewUrl(null);
        reset();
        setData('_method', 'post');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingSlide) {
            post(route('hero-slides.update', editingSlide.id), {
                onSuccess: () => {
                    cancelEdit();
                    router.reload({ only: ['slides'] });
                },
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            post(route('hero-slides.store'), {
                onSuccess: () => {
                    cancelEdit();
                    router.reload({ only: ['slides'] });
                },
                forceFormData: true,
                preserveScroll: true,
            });
        }
    };

    const handleToggleActive = (slide, checked) => {
        router.post(route('hero-slides.update', slide.id), {
            _method: 'put',
            is_active: checked ? 1 : 0,
        }, {
            preserveScroll: true
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this hero slide?')) {
            router.delete(route('hero-slides.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    setLocalSlides(localSlides.filter(s => s.id !== id));
                    if (editingSlide && editingSlide.id === id) {
                        cancelEdit();
                    }
                }
            });
        }
    };

    const moveSlide = (index, direction) => {
        const newSlides = [...localSlides];
        if (direction === 'up' && index > 0) {
            [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
        } else if (direction === 'down' && index < newSlides.length - 1) {
            [newSlides[index + 1], newSlides[index]] = [newSlides[index], newSlides[index + 1]];
        } else {
            return;
        }
        
        const updatedSlides = newSlides.map((s, i) => ({ ...s, order: i }));
        setLocalSlides(updatedSlides);

        router.post(route('hero-slides.reorder'), {
            slides: updatedSlides.map(s => ({ id: s.id, order: s.order }))
        }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header="Hero Banner Settings">
            <Head title="Homepage Hero Settings - Bogura Golf Club" />

            <div className="bg-[#F8F9F8] min-h-screen text-slate-900 pb-16">
                <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-7">
                    
                    {/* ── TOP HEADER & TABS ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-4 py-2 rounded-full bg-[#1C2C1D] text-white text-xs font-bold uppercase tracking-wider shadow-2xs">
                                    Hero Carousel Slides
                                </span>
                                <Link
                                    href={route('homepage-sections.index')}
                                    className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border border-slate-200/80 shadow-2xs transition-colors"
                                >
                                    Homepage Sections & Media
                                </Link>
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-display mt-3">
                                Homepage Hero Banner Manager
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
                                <span>Bogura Golf Club &bull; Theme Customization</span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1 text-[#2B402C] font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-[#3D5A3E]"></span>
                                    {localSlides.length} Configured Slides
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* ── 2-COLUMN WORKSPACE: FORM & LIVE PREVIEW ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start" ref={formRef}>
                        
                        {/* LEFT COLUMN: Add/Edit Form (7 Cols) */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-[#D4E2D2] text-[#1C2C1D] flex items-center justify-center font-bold">
                                            <ImageIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                                                {editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                {editingSlide ? 'Replace the slide image or update title & subtitle overlays.' : 'Upload a high-resolution hero background photo and set text.'}
                                            </p>
                                        </div>
                                    </div>
                                    {editingSlide && (
                                        <span className="text-[11px] font-bold text-[#1C2C1D] bg-[#D4E2D2] border border-[#BFD4BD] px-3 py-1 rounded-full uppercase tracking-wider">
                                            Editing Mode
                                        </span>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    
                                    {/* Image Upload Zone */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                                            {editingSlide ? 'Replace Hero Background Image (Optional)' : 'Hero Background Image *'}
                                        </label>
                                        
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="relative border-2 border-dashed border-slate-300 hover:border-[#1C2C1D] rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50 hover:bg-slate-100/80 group"
                                        >
                                            <input 
                                                ref={fileInputRef}
                                                id="image" 
                                                type="file" 
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                required={!editingSlide}
                                                className="hidden"
                                            />

                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <div className="w-12 h-12 rounded-full bg-white text-[#1C2C1D] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                                                    <Upload className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                                                        Click or drop image here to upload
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                                        Recommended: Landscape 1920x1080px (JPG, PNG, WebP up to 5MB)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <InputError message={errors.image} className="mt-2" />
                                    </div>

                                    {/* Title Input */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Overlay Headline Title (Optional)
                                        </label>
                                        <input 
                                            id="title" 
                                            type="text"
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            placeholder="e.g. Welcome To Bogura Golf Club"
                                            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                        />
                                        <InputError message={errors.title} className="mt-1" />
                                    </div>

                                    {/* Subtitle Input */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Overlay Description / Subtitle (Optional)
                                        </label>
                                        <textarea 
                                            id="subtitle" 
                                            rows="3"
                                            value={data.subtitle}
                                            onChange={e => setData('subtitle', e.target.value)}
                                            placeholder="e.g. The Bogura Golf Club, founded in 1998 and inaugurated in 2000, is a stunning 52.05-acre, 9-hole course located beautifully inside Bogura Cantonment."
                                            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                        />
                                        <InputError message={errors.subtitle} className="mt-1" />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                                        <button 
                                            type="submit" 
                                            disabled={processing} 
                                            className="px-6 py-2.5 rounded-full bg-[#1C2C1D] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#2C442E] transition-colors shadow-xs flex items-center gap-2"
                                        >
                                            {editingSlide ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    <span>Update Hero Slide</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4" />
                                                    <span>Add Hero Slide</span>
                                                </>
                                            )}
                                        </button>
                                        
                                        {editingSlide && (
                                            <button 
                                                type="button" 
                                                onClick={cancelEdit} 
                                                disabled={processing} 
                                                className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-200 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Live Hero Preview (5 Cols) */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Real-Time Slide Preview
                                </span>
                                <span className="text-[11px] font-semibold text-emerald-800">
                                    {previewUrl ? 'Live Preview' : 'Awaiting Selection'}
                                </span>
                            </div>

                            <div className="bg-white rounded-[28px] p-4 border border-slate-200/80 shadow-xs space-y-3">
                                <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-900 flex flex-col justify-end p-6 text-white shadow-inner">
                                    {previewUrl ? (
                                        <img 
                                            src={previewUrl} 
                                            alt="Hero Preview" 
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-950">
                                            <ImageIcon className="w-8 h-8 opacity-40" />
                                            <span className="text-xs font-medium">Select an image to see live preview</span>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                                    <div className="relative z-10 space-y-1.5 max-w-sm">
                                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#D4E2D2]/90 text-[#1C2C1D] text-[10px] font-extrabold uppercase tracking-wider">
                                            Bogura Golf Club
                                        </span>
                                        <h4 className="text-base sm:text-lg font-black text-white leading-tight font-display drop-shadow-md">
                                            {data.title || editingSlide?.title || 'Welcome To Bogura Golf Club'}
                                        </h4>
                                        <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed font-normal drop-shadow">
                                            {data.subtitle || editingSlide?.subtitle || 'Experience championship golf and scenic landscapes in Majhira.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* ── MANAGE SLIDES LIST BENTO GRID ── */}
                    <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                                    Active Slides & Sequence Order
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Reorder slides or toggle visibility on the homepage slider.
                                </p>
                            </div>
                            <span className="text-xs font-bold text-slate-600 px-3 py-1 rounded-full bg-slate-100">
                                {localSlides.length} Total Slides
                            </span>
                        </div>

                        <div className="space-y-3.5">
                            {localSlides.length === 0 ? (
                                <div className="p-10 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                                    No hero slides configured. Use the form above to add your first hero image.
                                </div>
                            ) : (
                                localSlides.map((slide, index) => (
                                    <div 
                                        key={slide.id} 
                                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                                            editingSlide && editingSlide.id === slide.id
                                                ? 'bg-[#D4E2D2]/30 border-[#1C2C1D] ring-2 ring-[#1C2C1D]/15'
                                                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            {/* Reorder Up/Down Buttons */}
                                            <div className="flex sm:flex-col gap-1 shrink-0">
                                                <button 
                                                    type="button" 
                                                    onClick={() => moveSlide(index, 'up')} 
                                                    disabled={index === 0}
                                                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#1C2C1D] hover:text-white text-slate-600 flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                                    title="Move Up"
                                                >
                                                    <ArrowUp className="w-3.5 h-3.5" />
                                                </button>
                                                <button 
                                                    type="button" 
                                                    onClick={() => moveSlide(index, 'down')} 
                                                    disabled={index === localSlides.length - 1}
                                                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-[#1C2C1D] hover:text-white text-slate-600 flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                                    title="Move Down"
                                                >
                                                    <ArrowDown className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {/* Thumbnail Image */}
                                            <div className="w-28 h-18 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-slate-200 relative group">
                                                <img 
                                                    src={`/storage/${slide.image_path}`} 
                                                    alt={slide.title || 'Slide'} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </div>

                                            {/* Title & Subtitle */}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                                        Slide #{index + 1}
                                                    </span>
                                                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                                                        {slide.title || '(No Title)'}
                                                    </h4>
                                                </div>
                                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                                    {slide.subtitle || 'No subtitle overlay.'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                            {/* Active Toggle */}
                                            <label className="flex items-center cursor-pointer gap-2 select-none">
                                                <span className="text-xs font-semibold text-slate-600">
                                                    {slide.is_active ? 'Active' : 'Hidden'}
                                                </span>
                                                <div className="relative">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only" 
                                                        checked={slide.is_active} 
                                                        onChange={(e) => handleToggleActive(slide, e.target.checked)} 
                                                    />
                                                    <div className={`block w-9 h-5 rounded-full transition-colors ${slide.is_active ? 'bg-[#1C2C1D]' : 'bg-slate-300'}`}></div>
                                                    <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${slide.is_active ? 'translate-x-4' : ''}`}></div>
                                                </div>
                                            </label>

                                            {/* Edit Button */}
                                            <button 
                                                type="button" 
                                                onClick={() => handleEdit(slide)}
                                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#1C2C1D] hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                                                title="Edit Slide"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Delete Button */}
                                            <button 
                                                type="button" 
                                                onClick={() => handleDelete(slide.id)}
                                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                                                title="Delete Slide"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
