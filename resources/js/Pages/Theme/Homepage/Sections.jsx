import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserDropdown from '@/Components/UserDropdown';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Save, 
    Upload, 
    Image as ImageIcon, 
    X, 
    Sparkles, 
    CheckCircle2, 
    Layers, 
    Sliders, 
    Eye,
    Compass,
    Award,
    Trophy,
    Flag,
    ExternalLink
} from 'lucide-react';
import InputError from '@/Components/InputError';

const DEFAULT_SERVICE_IMAGES = {
    1: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop',
    2: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=800&auto=format&fit=crop',
    3: 'https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=800&auto=format&fit=crop',
    4: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=800&auto=format&fit=crop',
};

const DEFAULT_ABOUT_IMAGES = {
    main: 'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?q=80&w=1000&auto=format&fit=crop',
    inset: 'https://images.unsplash.com/photo-1592919505780-303950717480?q=80&w=800&auto=format&fit=crop',
};

export default function Sections({ settings = {} }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        home_service_title: settings.home_service_title || 'Professional Golf Training & Coaching Services',
        home_service_subtitle: settings.home_service_subtitle || 'Our Services',

        home_service_1_title: settings.home_service_1_title || 'Practice Areas',
        home_service_1_desc: settings.home_service_1_desc || 'Dedicated spaces to improve swing, accuracy, and performance.',
        home_service_1_image_file: null,

        home_service_2_title: settings.home_service_2_title || 'Golf Training',
        home_service_2_desc: settings.home_service_2_desc || 'Professional coaching designed for skill development at every level.',
        home_service_2_image_file: null,

        home_service_3_title: settings.home_service_3_title || 'Club Amenities',
        home_service_3_desc: settings.home_service_3_desc || 'Premium facilities for comfort and relaxation experience.',
        home_service_3_image_file: null,

        home_service_4_title: settings.home_service_4_title || 'Event Facilities',
        home_service_4_desc: settings.home_service_4_desc || 'Perfect venues for tournaments and special events hosting.',
        home_service_4_image_file: null,

        home_about_badge: settings.home_about_badge || 'About the Club',
        home_about_title: settings.home_about_title || 'Premier 9-Hole Golfing & Facilities in Bogura',
        home_about_text_1: settings.home_about_text_1 || 'Founded in 1998 and inaugurated in 2000, The Bogura Golf Club is a stunning 52.05-acre, 9-hole course located beautifully inside Bogura Cantonment, Majhira, providing well-maintained practice facilities and hospitality services for members, armed forces officers, and invited guests.',
        home_about_text_2: settings.home_about_text_2 || 'The 52.05-acre course features a pristine Par 36 layout, tree-lined fairways, manicured greens, and natural hazards. The club regularly organizes seasonal tournaments, corporate golf events, and structured training programs for junior and amateur players.',
        home_about_image_main_file: null,
        home_about_image_inset_file: null,
    });

    // Local previews for uploaded files or current settings
    const [previews, setPreviews] = useState({
        service_1: settings.home_service_1_image || DEFAULT_SERVICE_IMAGES[1],
        service_2: settings.home_service_2_image || DEFAULT_SERVICE_IMAGES[2],
        service_3: settings.home_service_3_image || DEFAULT_SERVICE_IMAGES[3],
        service_4: settings.home_service_4_image || DEFAULT_SERVICE_IMAGES[4],
        about_main: settings.home_about_image_main || DEFAULT_ABOUT_IMAGES.main,
        about_inset: settings.home_about_image_inset || DEFAULT_ABOUT_IMAGES.inset,
    });

    const fileRefs = {
        service_1: useRef(null),
        service_2: useRef(null),
        service_3: useRef(null),
        service_4: useRef(null),
        about_main: useRef(null),
        about_inset: useRef(null),
    };

    const handleFileSelect = (key, formField, file) => {
        if (file) {
            setData(formField, file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews(prev => ({ ...prev, [key]: e.target?.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('homepage-sections.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header="Homepage Sections & Images">
            <Head title="Homepage Sections & Media Customizer - Bogura Golf Club" />

            <div className="bg-[#F8F9F8] min-h-screen text-slate-900 pb-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
                    
                    {/* ── TOP NAVIGATION TABS ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route('hero-slides.index')}
                                    className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border border-slate-200/80 shadow-2xs transition-colors"
                                >
                                    Hero Carousel Slides
                                </Link>
                                <span className="px-4 py-2 rounded-full bg-[#1C2C1D] text-white text-xs font-bold uppercase tracking-wider shadow-2xs">
                                    Homepage Sections & Media
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display mt-3">
                                Homepage Sections & Media Manager
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                                Update the images, titles, and text for the Training Services and About Club sections.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href="/"
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200/80 shadow-2xs transition-colors flex items-center gap-1.5 shrink-0"
                            >
                                <span>View Live Site</span>
                                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            </a>
                        </div>
                    </div>

                    {/* Flash Success Message */}
                    {flash?.success && (
                        <div className="bg-[#D4E2D2] text-[#1C2C1D] p-4 rounded-2xl border border-[#BFD4BD] flex items-center gap-2.5 shadow-xs">
                            <CheckCircle2 className="w-5 h-5 text-[#2C442E] shrink-0" />
                            <span className="text-xs sm:text-sm font-bold">{flash.success}</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-8">
                        
                        {/* ══════════════════════════════════════════════════════
                           SECTION 1: GOLF TRAINING & SERVICES (4 CARDS)
                        ══════════════════════════════════════════════════════ */}
                        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                            
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#D4E2D2] text-[#1C2C1D] flex items-center justify-center font-bold">
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                                            1. Golf Training & Coaching Services (4 Circular Showcase Cards)
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Manage the 4 service highlight photos and text cards displayed below the hero section.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section Header Controls */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Section Subtitle / Badge
                                    </label>
                                    <input
                                        type="text"
                                        value={data.home_service_subtitle}
                                        onChange={(e) => setData('home_service_subtitle', e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Section Main Headline
                                    </label>
                                    <input
                                        type="text"
                                        value={data.home_service_title}
                                        onChange={(e) => setData('home_service_title', e.target.value)}
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                </div>
                            </div>

                            {/* 4 Service Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
                                
                                {/* Card 1 */}
                                <div className="p-4 rounded-2xl bg-[#F8F9F8] border border-slate-200/80 space-y-3 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="text-center">
                                            <span className="text-[10px] font-black text-[#1C2C1D] uppercase tracking-wider bg-[#D4E2D2] px-2.5 py-0.5 rounded-full">
                                                Service Card #1
                                            </span>
                                        </div>

                                        {/* Image Dropzone / Preview */}
                                        <div
                                            onClick={() => fileRefs.service_1.current?.click()}
                                            className="relative aspect-4/3 rounded-2xl overflow-hidden cursor-pointer group border-2 border-dashed border-slate-300 hover:border-[#1C2C1D] transition-all bg-slate-100"
                                        >
                                            <img
                                                src={previews.service_1}
                                                alt="Service 1"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                                                <Upload className="w-5 h-5 mb-1" />
                                                <span className="text-[11px] font-bold">Change Image</span>
                                            </div>
                                            <input
                                                ref={fileRefs.service_1}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileSelect('service_1', 'home_service_1_image_file', e.target.files?.[0])}
                                                className="hidden"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                                Card Title
                                            </label>
                                            <input
                                                type="text"
                                                value={data.home_service_1_title}
                                                onChange={(e) => setData('home_service_1_title', e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                                Short Description
                                            </label>
                                            <textarea
                                                rows="2"
                                                value={data.home_service_1_desc}
                                                onChange={(e) => setData('home_service_1_desc', e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="p-4 rounded-2xl bg-[#F8F9F8] border border-slate-200/80 space-y-3 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="text-center">
                                            <span className="text-[10px] font-black text-[#1C2C1D] uppercase tracking-wider bg-[#D4E2D2] px-2.5 py-0.5 rounded-full">
                                                Service Card #2
                                            </span>
                                        </div>

                                        {/* Image Dropzone / Preview */}
                                        <div
                                            onClick={() => fileRefs.service_2.current?.click()}
                                            className="relative aspect-4/3 rounded-2xl overflow-hidden cursor-pointer group border-2 border-dashed border-slate-300 hover:border-[#1C2C1D] transition-all bg-slate-100"
                                        >
                                            <img
                                                src={previews.service_2}
                                                alt="Service 2"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                                                <Upload className="w-5 h-5 mb-1" />
                                                <span className="text-[11px] font-bold">Change Image</span>
                                            </div>
                                            <input
                                                ref={fileRefs.service_2}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileSelect('service_2', 'home_service_2_image_file', e.target.files?.[0])}
                                                className="hidden"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                                Card Title
                                            </label>
                                            <input
                                                type="text"
                                                value={data.home_service_2_title}
                                                onChange={(e) => setData('home_service_2_title', e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                                Short Description
                                            </label>
                                            <textarea
                                                rows="2"
                                                value={data.home_service_2_desc}
                                                onChange={(e) => setData('home_service_2_desc', e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="p-4 rounded-2xl bg-[#F8F9F8] border border-slate-200/80 space-y-3 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="text-center">
                                            <span className="text-[10px] font-black text-[#1C2C1D] uppercase tracking-wider bg-[#D4E2D2] px-2.5 py-0.5 rounded-full">
                                                Service Card #3
                                            </span>
                                        </div>

                                        {/* Image Dropzone / Preview */}
                                        <div
                                            onClick={() => fileRefs.service_3.current?.click()}
                                            className="relative aspect-4/3 rounded-2xl overflow-hidden cursor-pointer group border-2 border-dashed border-slate-300 hover:border-[#1C2C1D] transition-all bg-slate-100"
                                        >
                                            <img
                                                src={previews.service_3}
                                                alt="Service 3"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                                                <Upload className="w-5 h-5 mb-1" />
                                                <span className="text-[11px] font-bold">Change Image</span>
                                            </div>
                                            <input
                                                ref={fileRefs.service_3}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileSelect('service_3', 'home_service_3_image_file', e.target.files?.[0])}
                                                className="hidden"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                                Card Title
                                            </label>
                                            <input
                                                type="text"
                                                value={data.home_service_3_title}
                                                onChange={(e) => setData('home_service_3_title', e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                                Short Description
                                            </label>
                                            <textarea
                                                rows="2"
                                                value={data.home_service_3_desc}
                                                onChange={(e) => setData('home_service_3_desc', e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Card 4 */}
                                <div className="p-4 rounded-2xl bg-[#F8F9F8] border border-slate-200/80 space-y-3 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="text-center">
                                            <span className="text-[10px] font-black text-[#1C2C1D] uppercase tracking-wider bg-[#D4E2D2] px-2.5 py-0.5 rounded-full">
                                                Service Card #4
                                            </span>
                                        </div>

                                        {/* Image Dropzone / Preview */}
                                        <div
                                            onClick={() => fileRefs.service_4.current?.click()}
                                            className="relative aspect-4/3 rounded-2xl overflow-hidden cursor-pointer group border-2 border-dashed border-slate-300 hover:border-[#1C2C1D] transition-all bg-slate-100"
                                        >
                                            <img
                                                src={previews.service_4}
                                                alt="Service 4"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                                                <Upload className="w-5 h-5 mb-1" />
                                                <span className="text-[11px] font-bold">Change Image</span>
                                            </div>
                                            <input
                                                ref={fileRefs.service_4}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileSelect('service_4', 'home_service_4_image_file', e.target.files?.[0])}
                                                className="hidden"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                                Card Title
                                            </label>
                                            <input
                                                type="text"
                                                value={data.home_service_4_title}
                                                onChange={(e) => setData('home_service_4_title', e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                                Short Description
                                            </label>
                                            <textarea
                                                rows="2"
                                                value={data.home_service_4_desc}
                                                onChange={(e) => setData('home_service_4_desc', e.target.value)}
                                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>


                        {/* ══════════════════════════════════════════════════════
                           SECTION 2: ABOUT THE CLUB & HERITAGE (2 LAYERED IMAGES)
                        ══════════════════════════════════════════════════════ */}
                        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                            
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#DFE5D4] text-[#1C2C1D] flex items-center justify-center font-bold">
                                        <Flag className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                                            2. About the Club & Heritage Section (Layered Visuals & Editorial)
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            Manage the main tall oval image, overlapping circle inset, and club story texts.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                
                                {/* Left: Layered Images Customizer */}
                                <div className="lg:col-span-5 space-y-5">
                                    
                                    {/* Main Tall Oval Image */}
                                    <div className="p-4 rounded-2xl bg-[#F8F9F8] border border-slate-200/80 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                                Main Tall Oval Image
                                            </span>
                                            <span className="text-[10px] font-semibold text-slate-400">Portrait Arch</span>
                                        </div>

                                        <div
                                            onClick={() => fileRefs.about_main.current?.click()}
                                            className="relative aspect-3/4 max-w-[240px] mx-auto rounded-3xl overflow-hidden cursor-pointer group border-2 border-dashed border-slate-300 hover:border-[#1C2C1D] transition-all bg-slate-100 shadow-md"
                                        >
                                            <img
                                                src={previews.about_main}
                                                alt="About Main"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                                                <Upload className="w-6 h-6 mb-1" />
                                                <span className="text-xs font-bold">Replace Oval Image</span>
                                            </div>
                                            <input
                                                ref={fileRefs.about_main}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileSelect('about_main', 'home_about_image_main_file', e.target.files?.[0])}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>

                                    {/* Overlapping Circle Inset */}
                                    <div className="p-4 rounded-2xl bg-[#F8F9F8] border border-slate-200/80 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                                Overlapping Circular Inset
                                            </span>
                                            <span className="text-[10px] font-semibold text-slate-400">Bottom-Right Float</span>
                                        </div>

                                        <div
                                            onClick={() => fileRefs.about_inset.current?.click()}
                                            className="relative w-36 h-36 mx-auto rounded-full overflow-hidden cursor-pointer group border-2 border-dashed border-slate-300 hover:border-[#1C2C1D] transition-all bg-slate-100 shadow-md"
                                        >
                                            <img
                                                src={previews.about_inset}
                                                alt="About Inset"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                                                <Upload className="w-5 h-5 mb-1" />
                                                <span className="text-[11px] font-bold">Replace Inset</span>
                                            </div>
                                            <input
                                                ref={fileRefs.about_inset}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileSelect('about_inset', 'home_about_image_inset_file', e.target.files?.[0])}
                                                className="hidden"
                                            />
                                        </div>
                                    </div>

                                </div>

                                {/* Right: Editorial Story & Headings */}
                                <div className="lg:col-span-7 space-y-4">
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                                Badge Text
                                            </label>
                                            <input
                                                type="text"
                                                value={data.home_about_badge}
                                                onChange={(e) => setData('home_about_badge', e.target.value)}
                                                className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                                Main Section Heading
                                            </label>
                                            <input
                                                type="text"
                                                value={data.home_about_title}
                                                onChange={(e) => setData('home_about_title', e.target.value)}
                                                className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                            Story Paragraph 1 (Club Heritage & Origin)
                                        </label>
                                        <textarea
                                            rows="3"
                                            value={data.home_about_text_1}
                                            onChange={(e) => setData('home_about_text_1', e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                            Story Paragraph 2 (Facilities & Programs)
                                        </label>
                                        <textarea
                                            rows="3"
                                            value={data.home_about_text_2}
                                            onChange={(e) => setData('home_about_text_2', e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                        />
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Save Sticky Action Bar */}
                        <div className="pt-4 flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3.5 rounded-full bg-[#1C2C1D] hover:bg-[#2C442E] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-95"
                            >
                                <Save className="w-4 h-4" />
                                <span>{processing ? 'Saving Changes...' : 'Save Homepage Content & Images'}</span>
                            </button>
                        </div>

                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
