import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState, useEffect } from 'react';
import { 
    Upload, 
    Sliders, 
    Type, 
    KeyRound, 
    Eye, 
    EyeOff, 
    Copy, 
    Check, 
    ExternalLink, 
    CheckCircle2, 
    AlertCircle, 
    Info, 
    ShieldCheck,
    Share2,
    Globe
} from 'lucide-react';

export default function Index({ settings }) {
    const { props } = usePage();
    
    // Determine active tab from URL query params or default to 'general'
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const tabParam = new URLSearchParams(window.location.search).get('tab');
            if (tabParam === 'google') setActiveTab('google');
            else if (tabParam === 'typography') setActiveTab('typography');
            else if (tabParam === 'social') setActiveTab('social');
            else if (tabParam === 'general') setActiveTab('general');
        }
    }, []);

    const defaultRedirectUri = typeof window !== 'undefined' 
        ? `${window.location.origin}/auth/google/callback` 
        : 'https://bgcbd.com/auth/google/callback';

    const defaultOrigin = typeof window !== 'undefined'
        ? window.location.origin
        : 'https://bgcbd.com';

    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        address: settings.address || '',
        map_url: settings.map_url || '',
        frontpage_navbar_font: settings.frontpage_navbar_font || 'Outfit',
        frontpage_body_font: settings.frontpage_body_font || 'Plus Jakarta Sans',
        frontpage_heading_font: settings.frontpage_heading_font || 'Outfit',
        google_login_enabled: settings.google_login_enabled !== undefined ? String(settings.google_login_enabled) : '1',
        google_client_id: settings.google_client_id || '',
        google_client_secret: settings.google_client_secret || '',
        google_redirect_uri: settings.google_redirect_uri || defaultRedirectUri,
        footer_social_enabled: settings.footer_social_enabled !== undefined ? String(settings.footer_social_enabled) : '1',
        social_facebook_enabled: settings.social_facebook_enabled !== undefined ? String(settings.social_facebook_enabled) : '1',
        social_facebook_url: settings.social_facebook_url !== undefined ? settings.social_facebook_url : 'https://facebook.com',
        social_twitter_enabled: settings.social_twitter_enabled !== undefined ? String(settings.social_twitter_enabled) : '1',
        social_twitter_url: settings.social_twitter_url !== undefined ? settings.social_twitter_url : 'https://twitter.com',
        social_instagram_enabled: settings.social_instagram_enabled !== undefined ? String(settings.social_instagram_enabled) : '1',
        social_instagram_url: settings.social_instagram_url !== undefined ? settings.social_instagram_url : 'https://instagram.com',
        social_linkedin_enabled: settings.social_linkedin_enabled !== undefined ? String(settings.social_linkedin_enabled) : '1',
        social_linkedin_url: settings.social_linkedin_url !== undefined ? settings.social_linkedin_url : 'https://linkedin.com',
        social_youtube_enabled: settings.social_youtube_enabled !== undefined ? String(settings.social_youtube_enabled) : '0',
        social_youtube_url: settings.social_youtube_url !== undefined ? settings.social_youtube_url : '',
        social_whatsapp_enabled: settings.social_whatsapp_enabled !== undefined ? String(settings.social_whatsapp_enabled) : '0',
        social_whatsapp_url: settings.social_whatsapp_url !== undefined ? settings.social_whatsapp_url : '',
        logo: null,
    });

    const [logoPreview, setLogoPreview] = useState(settings.logo_path || null);
    const [showSecret, setShowSecret] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setData('logo', file);
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const copyToClipboard = (text, fieldName) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2500);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('settings.update'), {
            preserveScroll: true,
        });
    };

    // Google Configuration status
    const isGoogleConfigured = Boolean(data.google_client_id && data.google_client_secret);
    const isGoogleActive = data.google_login_enabled === '1' && isGoogleConfigured;

    return (
        <AuthenticatedLayout header="Site Settings">
            <Head title="Settings - Bogura Golf Club" />

            <div className="max-w-5xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 space-y-6">
                {props.flash?.success && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3.5 rounded-xl font-medium flex items-center gap-2 shadow-xs">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{props.flash.success}</span>
                    </div>
                )}

                {/* Settings Navigation Tabs */}
                <div className="flex border-b border-gray-200 bg-white rounded-t-2xl shadow-xs px-4 pt-2 gap-2 overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('general')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'general'
                                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <Sliders className="w-4 h-4" />
                        <span>General & Club Details</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('typography')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'typography'
                                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <Type className="w-4 h-4" />
                        <span>Typography & Fonts</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('social')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'social'
                                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <Share2 className="w-4 h-4" />
                        <span>Footer Social Links</span>
                        {data.footer_social_enabled === '1' ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('google')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === 'google'
                                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50 rounded-t-lg'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        <KeyRound className="w-4 h-4 text-emerald-600" />
                        <span>Google Login Setup</span>
                        {isGoogleActive ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        ) : data.google_login_enabled === '1' ? (
                            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        ) : null}
                    </button>
                </div>

                <div className="bg-white overflow-hidden shadow-sm rounded-b-2xl sm:rounded-2xl">
                    <div className="p-6 sm:p-8 text-gray-900">
                        <form onSubmit={submit} className="space-y-8">
                            
                            {/* ══════════════════════════════════════════════════
                               TAB 1: GENERAL & CLUB DETAILS
                            ══════════════════════════════════════════════════ */}
                            {activeTab === 'general' && (
                                <div className="space-y-8 animate-in fade-in duration-150">
                                    {/* Logo Upload Section */}
                                    <div className="border-b border-gray-200 pb-8">
                                        <h3 className="text-lg font-bold leading-6 text-gray-900 mb-1">Club Logo</h3>
                                        <p className="text-sm text-gray-500 mb-4">Official insignia displayed on the website and document headers.</p>
                                        <div className="flex items-center gap-x-6">
                                            <div className="h-24 w-24 shrink-0 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden shadow-2xs">
                                                {logoPreview ? (
                                                    <img src={logoPreview} alt="Logo Preview" className="h-full w-full object-contain" />
                                                ) : (
                                                    <span className="text-gray-400 text-xs text-center px-2">No Logo</span>
                                                )}
                                            </div>
                                            <div>
                                                <label htmlFor="logo-upload" className="cursor-pointer rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 inline-flex items-center transition-all">
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Change Logo
                                                </label>
                                                <input
                                                    id="logo-upload"
                                                    name="logo"
                                                    type="file"
                                                    className="sr-only"
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                />
                                                <p className="mt-2 text-xs text-gray-500">JPG, PNG, GIF up to 2MB</p>
                                                <InputError message={errors.logo} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* General Details Section */}
                                    <div>
                                        <h3 className="text-lg font-bold leading-6 text-gray-900 mb-1">General Details</h3>
                                        <p className="text-sm text-gray-500 mb-6">Contact info and location coordinates published across the club portal.</p>
                                        
                                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                                            <div className="sm:col-span-2">
                                                <InputLabel htmlFor="site_name" value="Club / Site Name" />
                                                <TextInput
                                                    id="site_name"
                                                    name="site_name"
                                                    value={data.site_name}
                                                    className="mt-1 block w-full rounded-xl"
                                                    onChange={(e) => setData('site_name', e.target.value)}
                                                />
                                                <InputError message={errors.site_name} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="contact_email" value="Contact Email" />
                                                <TextInput
                                                    id="contact_email"
                                                    type="email"
                                                    name="contact_email"
                                                    value={data.contact_email}
                                                    className="mt-1 block w-full rounded-xl"
                                                    onChange={(e) => setData('contact_email', e.target.value)}
                                                />
                                                <InputError message={errors.contact_email} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="contact_phone" value="Contact Phone" />
                                                <TextInput
                                                    id="contact_phone"
                                                    type="text"
                                                    name="contact_phone"
                                                    value={data.contact_phone}
                                                    className="mt-1 block w-full rounded-xl"
                                                    onChange={(e) => setData('contact_phone', e.target.value)}
                                                    placeholder="e.g. +88 02 9835105"
                                                />
                                                <InputError message={errors.contact_phone} className="mt-2" />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <InputLabel htmlFor="address" value="Physical Address" />
                                                <TextInput
                                                    id="address"
                                                    name="address"
                                                    value={data.address}
                                                    className="mt-1 block w-full rounded-xl"
                                                    onChange={(e) => setData('address', e.target.value)}
                                                />
                                                <InputError message={errors.address} className="mt-2" />
                                            </div>
                                            
                                            <div className="sm:col-span-2">
                                                <InputLabel htmlFor="map_url" value="Google Maps Embed URL" />
                                                <TextInput
                                                    id="map_url"
                                                    name="map_url"
                                                    value={data.map_url}
                                                    className="mt-1 block w-full rounded-xl font-mono text-xs"
                                                    onChange={(e) => setData('map_url', e.target.value)}
                                                    placeholder="e.g., https://maps.google.com/maps?..."
                                                />
                                                <p className="mt-1 text-xs text-gray-500">Paste the embed URL or the full Google Map iframe source.</p>
                                                <InputError message={errors.map_url} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ══════════════════════════════════════════════════
                               TAB 2: TYPOGRAPHY & FONTS
                            ══════════════════════════════════════════════════ */}
                            {activeTab === 'typography' && (
                                <div className="space-y-6 animate-in fade-in duration-150">
                                    <div>
                                        <h3 className="text-lg font-bold leading-6 text-gray-900 mb-1">Frontpage Typography & Fonts</h3>
                                        <p className="text-sm text-gray-500 mb-6">Select Google Fonts for the frontpage navigation bar and main body copy.</p>

                                        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                                            <div>
                                                <InputLabel htmlFor="frontpage_navbar_font" value="Navigation Bar Font" />
                                                <select
                                                    id="frontpage_navbar_font"
                                                    name="frontpage_navbar_font"
                                                    value={data.frontpage_navbar_font}
                                                    onChange={(e) => setData('frontpage_navbar_font', e.target.value)}
                                                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-xs focus:border-emerald-500 focus:ring-emerald-500 text-sm font-medium"
                                                >
                                                    <option value="Anton">Anton (Bold Condensed - Default)</option>
                                                    <option value="Outfit">Outfit (Modern Bold Geometric)</option>
                                                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Clean Modern Sans)</option>
                                                    <option value="Inter">Inter (Universal Tech Sans)</option>
                                                    <option value="Cinzel">Cinzel (Royal Heritage Serif)</option>
                                                    <option value="Playfair Display">Playfair Display (Championship Serif)</option>
                                                    <option value="Montserrat">Montserrat (Architectural Sans)</option>
                                                    <option value="Poppins">Poppins (Soft Geometric)</option>
                                                    <option value="Bebas Neue">Bebas Neue (Condensed Athletic)</option>
                                                    <option value="DM Sans">DM Sans (Minimalist Clean)</option>
                                                    <option value="Lora">Lora (Literary Warm Serif)</option>
                                                    <option value="Cormorant Garamond">Cormorant Garamond (Nobility Serif)</option>
                                                    <option value="Cinzel Decorative">Cinzel Decorative (Majestic Flourish)</option>
                                                    <option value="Raleway">Raleway (Airy Sophisticated)</option>
                                                    <option value="Syne">Syne (Avant-Garde Art)</option>
                                                    <option value="Space Grotesk">Space Grotesk (Tech Modern)</option>
                                                </select>
                                                <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <span className="text-xs text-gray-500 block mb-1">Live Navbar Preview:</span>
                                                    <span className="text-base font-bold text-gray-900 uppercase tracking-wide block" style={{ fontFamily: `"${data.frontpage_navbar_font}", sans-serif` }}>
                                                        {data.site_name || 'BOGURA GOLF CLUB'} • HOME • ABOUT US
                                                    </span>
                                                </div>
                                                <InputError message={errors.frontpage_navbar_font} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="frontpage_body_font" value="Main Body / Content Font" />
                                                <select
                                                    id="frontpage_body_font"
                                                    name="frontpage_body_font"
                                                    value={data.frontpage_body_font}
                                                    onChange={(e) => setData('frontpage_body_font', e.target.value)}
                                                    className="mt-1 block w-full rounded-xl border-gray-300 shadow-xs focus:border-emerald-500 focus:ring-emerald-500 text-sm font-medium"
                                                >
                                                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Clean Modern Sans - Default)</option>
                                                    <option value="Outfit">Outfit (Modern Bold Geometric)</option>
                                                    <option value="Inter">Inter (Universal Tech Sans)</option>
                                                    <option value="Lora">Lora (Literary Warm Serif)</option>
                                                    <option value="DM Sans">DM Sans (Minimalist Clean)</option>
                                                    <option value="Poppins">Poppins (Soft Geometric)</option>
                                                    <option value="Merriweather">Merriweather (Stately Book Serif)</option>
                                                    <option value="Playfair Display">Playfair Display (Championship Serif)</option>
                                                    <option value="Raleway">Raleway (Airy Sophisticated)</option>
                                                    <option value="Nunito Sans">Nunito Sans (Soft Balanced)</option>
                                                    <option value="Cinzel">Cinzel (Royal Heritage Serif)</option>
                                                    <option value="Cormorant Garamond">Cormorant Garamond (Nobility Serif)</option>
                                                </select>
                                                <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <span className="text-xs text-gray-500 block mb-1">Live Body Preview:</span>
                                                    <span className="text-xs text-gray-700 leading-relaxed block" style={{ fontFamily: `"${data.frontpage_body_font}", sans-serif` }}>
                                                        Bogura Golf Club (BGC) is an exquisite sanctuary in Bogura Cantonment offering world-class golfing facilities.
                                                    </span>
                                                </div>
                                                <InputError message={errors.frontpage_body_font} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ══════════════════════════════════════════════════
                               TAB 3: GOOGLE LOGIN SETUP (SUPER ADMIN ONLY)
                            ══════════════════════════════════════════════════ */}
                            {activeTab === 'google' && (
                                <div className="space-y-8 animate-in fade-in duration-150">
                                    {/* Section Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-extrabold text-gray-900">Google OAuth & SSO Configuration</h3>
                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 text-white px-2.5 py-0.5 text-[11px] font-bold">
                                                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                                                    Super Admin
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Manage Google Single Sign-On credentials for seamless login across all member and admin accounts.
                                            </p>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="shrink-0">
                                            {isGoogleActive ? (
                                                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    <span>Active & Configured</span>
                                                </div>
                                            ) : data.google_login_enabled === '0' ? (
                                                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                                                    <span>Login Disabled</span>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                                    <span>Missing Credentials</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Enable / Disable Toggle Card */}
                                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-200 shadow-2xs">
                                        <div className="max-w-xl">
                                            <label htmlFor="google_toggle" className="text-base font-bold text-gray-900 cursor-pointer block">
                                                Enable "Continue with Google" Login
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                When turned on, the Google authentication button will be visible on the login page (<span className="font-mono text-gray-700">/login</span>). If turned off, users can only sign in via email/password.
                                            </p>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                id="google_toggle"
                                                role="switch"
                                                aria-checked={data.google_login_enabled === '1'}
                                                onClick={() => setData('google_login_enabled', data.google_login_enabled === '1' ? '0' : '1')}
                                                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                                    data.google_login_enabled === '1' ? 'bg-emerald-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                                        data.google_login_enabled === '1' ? 'translate-x-7' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Google OAuth Credentials Input */}
                                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                                        <div className="sm:col-span-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <InputLabel htmlFor="google_client_id" value="Google OAuth Client ID" />
                                                <span className="text-xs text-gray-400">Required for authentication</span>
                                            </div>
                                            <TextInput
                                                id="google_client_id"
                                                name="google_client_id"
                                                value={data.google_client_id}
                                                className="mt-1 block w-full rounded-xl font-mono text-xs sm:text-sm"
                                                onChange={(e) => setData('google_client_id', e.target.value)}
                                                placeholder="e.g. 1234567890-abcdefg123456.apps.googleusercontent.com"
                                            />
                                            <InputError message={errors.google_client_id} className="mt-2" />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <InputLabel htmlFor="google_client_secret" value="Google OAuth Client Secret" />
                                                <span className="text-xs text-gray-400">Encrypted and kept secure</span>
                                            </div>
                                            <div className="relative mt-1">
                                                <TextInput
                                                    id="google_client_secret"
                                                    type={showSecret ? 'text' : 'password'}
                                                    name="google_client_secret"
                                                    value={data.google_client_secret}
                                                    className="block w-full rounded-xl pr-12 font-mono text-xs sm:text-sm"
                                                    onChange={(e) => setData('google_client_secret', e.target.value)}
                                                    placeholder="e.g. GOCSPX-xxxxxxxxxxxxxxxxxxxx"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSecret(!showSecret)}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-700 transition-colors"
                                                    title={showSecret ? "Hide secret" : "Show secret"}
                                                >
                                                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <InputError message={errors.google_client_secret} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* Google Console URIs for Copying */}
                                    <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-5 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <KeyRound className="w-5 h-5 text-amber-400" />
                                            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-100">
                                                Google Cloud Console Setup Values
                                            </h4>
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            Paste these exact URLs into your Google Cloud project's OAuth 2.0 Client credentials under <strong>Authorized JavaScript origins</strong> and <strong>Authorized redirect URIs</strong>.
                                        </p>

                                        {/* Authorized JavaScript Origins */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300">
                                                Authorized JavaScript Origins:
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={defaultOrigin}
                                                    className="flex-1 bg-slate-800 border border-slate-700 text-emerald-400 rounded-xl px-3 py-2 text-xs font-mono select-all focus:outline-hidden"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(defaultOrigin, 'origin')}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
                                                >
                                                    {copiedField === 'origin' ? (
                                                        <>
                                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                            <span className="text-emerald-400">Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3.5 h-3.5 text-slate-300" />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Authorized Redirect URI */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300">
                                                Authorized Redirect URI:
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={data.google_redirect_uri || defaultRedirectUri}
                                                    className="flex-1 bg-slate-800 border border-slate-700 text-emerald-400 rounded-xl px-3 py-2 text-xs font-mono select-all focus:outline-hidden"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(data.google_redirect_uri || defaultRedirectUri, 'redirect')}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
                                                >
                                                    {copiedField === 'redirect' ? (
                                                        <>
                                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                                            <span className="text-emerald-400">Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3.5 h-3.5 text-slate-300" />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step-by-Step Google Cloud Console Guide */}
                                    <div className="p-6 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Info className="w-4 h-4 text-emerald-700" />
                                                <h4 className="text-sm font-bold text-emerald-900">
                                                    How to create your Google OAuth Credentials
                                                </h4>
                                            </div>
                                            <a
                                                href="https://console.cloud.google.com/apis/credentials"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                                            >
                                                <span>Open Google Cloud Console</span>
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </div>

                                        <ol className="text-xs text-emerald-900/90 space-y-2 list-decimal list-inside leading-relaxed font-medium">
                                            <li>Go to the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="underline font-bold">Google Cloud Console Credentials page</a>.</li>
                                            <li>Click <strong>Create Credentials</strong> at the top and select <strong>OAuth Client ID</strong>.</li>
                                            <li>Select <strong>Application type: Web application</strong> and set a name like <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-950 font-mono">BGC Portal</code>.</li>
                                            <li>Under <strong>Authorized JavaScript origins</strong>, click <em>+ Add URI</em> and paste <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-950 font-mono">{defaultOrigin}</code>.</li>
                                            <li>Under <strong>Authorized redirect URIs</strong>, click <em>+ Add URI</em> and paste <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-950 font-mono">{defaultRedirectUri}</code>.</li>
                                            <li>Click <strong>Create</strong>, then copy your <strong>Client ID</strong> and <strong>Client Secret</strong> into the fields above and hit <strong>Save Settings</strong>.</li>
                                        </ol>
                                    </div>
                                </div>
                            )}

                            {/* ══════════════════════════════════════════════════
                               TAB 4: FOOTER SOCIAL LINKS
                            ══════════════════════════════════════════════════ */}
                            {activeTab === 'social' && (
                                <div className="space-y-8 animate-in fade-in duration-150">
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-extrabold text-gray-900">Homepage Footer Social Links</h3>
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-bold">
                                                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                                                    Homepage Footer
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Manage and customize the social media links displayed in the "Get in Touch" section of the website footer.
                                            </p>
                                        </div>

                                        {/* Master Status Badge */}
                                        <div className="shrink-0">
                                            {data.footer_social_enabled === '1' ? (
                                                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    <span>Footer Social Visible</span>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                                                    <span>Footer Social Hidden</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Master Enable/Disable Switch */}
                                    <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-200 shadow-2xs">
                                        <div className="max-w-xl">
                                            <label htmlFor="master_social_toggle" className="text-base font-bold text-gray-900 cursor-pointer block">
                                                Display Social Media Icons in Footer
                                            </label>
                                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                When turned on, the enabled social media buttons will appear in the footer. When turned off, the entire social links row is hidden across the site.
                                            </p>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                id="master_social_toggle"
                                                role="switch"
                                                aria-checked={data.footer_social_enabled === '1'}
                                                onClick={() => setData('footer_social_enabled', data.footer_social_enabled === '1' ? '0' : '1')}
                                                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                                                    data.footer_social_enabled === '1' ? 'bg-emerald-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                                        data.footer_social_enabled === '1' ? 'translate-x-7' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Social Channels Configuration List */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                                                Configured Social Networks
                                            </h4>
                                            <span className="text-xs text-gray-500">
                                                Toggle on/off and enter your official URL or invite link
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Facebook */}
                                            <div className={`p-4 rounded-2xl border transition-all ${
                                                data.social_facebook_enabled === '1' 
                                                    ? 'bg-white border-blue-200 shadow-sm' 
                                                    : 'bg-gray-50 border-gray-200 opacity-75'
                                            }`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-xs">
                                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-gray-900 text-sm">Facebook</h5>
                                                            <span className="text-[11px] font-semibold text-gray-500">
                                                                {data.social_facebook_enabled === '1' ? 'Enabled' : 'Disabled'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('social_facebook_enabled', data.social_facebook_enabled === '1' ? '0' : '1')}
                                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                                            data.social_facebook_enabled === '1' ? 'bg-[#1877F2]' : 'bg-gray-300'
                                                        }`}
                                                    >
                                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                                            data.social_facebook_enabled === '1' ? 'translate-x-5' : 'translate-x-0'
                                                        }`} />
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-semibold text-gray-600">Facebook Page URL</label>
                                                        {data.social_facebook_url && (
                                                            <a href={data.social_facebook_url} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-[#1877F2] hover:underline inline-flex items-center gap-0.5">
                                                                <span>Test</span>
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                    <TextInput
                                                        type="url"
                                                        value={data.social_facebook_url}
                                                        onChange={(e) => setData('social_facebook_url', e.target.value)}
                                                        placeholder="https://facebook.com/boguragolfclub"
                                                        className="w-full text-xs font-mono rounded-xl"
                                                    />
                                                </div>
                                            </div>

                                            {/* Twitter / X */}
                                            <div className={`p-4 rounded-2xl border transition-all ${
                                                data.social_twitter_enabled === '1' 
                                                    ? 'bg-white border-slate-300 shadow-sm' 
                                                    : 'bg-gray-50 border-gray-200 opacity-75'
                                            }`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-gray-900 text-sm">X / Twitter</h5>
                                                            <span className="text-[11px] font-semibold text-gray-500">
                                                                {data.social_twitter_enabled === '1' ? 'Enabled' : 'Disabled'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('social_twitter_enabled', data.social_twitter_enabled === '1' ? '0' : '1')}
                                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                                            data.social_twitter_enabled === '1' ? 'bg-slate-900' : 'bg-gray-300'
                                                        }`}
                                                    >
                                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                                            data.social_twitter_enabled === '1' ? 'translate-x-5' : 'translate-x-0'
                                                        }`} />
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-semibold text-gray-600">X / Twitter Profile URL</label>
                                                        {data.social_twitter_url && (
                                                            <a href={data.social_twitter_url} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-slate-800 hover:underline inline-flex items-center gap-0.5">
                                                                <span>Test</span>
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                    <TextInput
                                                        type="url"
                                                        value={data.social_twitter_url}
                                                        onChange={(e) => setData('social_twitter_url', e.target.value)}
                                                        placeholder="https://x.com/boguragolfclub"
                                                        className="w-full text-xs font-mono rounded-xl"
                                                    />
                                                </div>
                                            </div>

                                            {/* Instagram */}
                                            <div className={`p-4 rounded-2xl border transition-all ${
                                                data.social_instagram_enabled === '1' 
                                                    ? 'bg-white border-pink-200 shadow-sm' 
                                                    : 'bg-gray-50 border-gray-200 opacity-75'
                                            }`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-xs">
                                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-gray-900 text-sm">Instagram</h5>
                                                            <span className="text-[11px] font-semibold text-gray-500">
                                                                {data.social_instagram_enabled === '1' ? 'Enabled' : 'Disabled'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('social_instagram_enabled', data.social_instagram_enabled === '1' ? '0' : '1')}
                                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                                            data.social_instagram_enabled === '1' ? 'bg-rose-500' : 'bg-gray-300'
                                                        }`}
                                                    >
                                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                                            data.social_instagram_enabled === '1' ? 'translate-x-5' : 'translate-x-0'
                                                        }`} />
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-semibold text-gray-600">Instagram Profile URL</label>
                                                        {data.social_instagram_url && (
                                                            <a href={data.social_instagram_url} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-rose-600 hover:underline inline-flex items-center gap-0.5">
                                                                <span>Test</span>
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                    <TextInput
                                                        type="url"
                                                        value={data.social_instagram_url}
                                                        onChange={(e) => setData('social_instagram_url', e.target.value)}
                                                        placeholder="https://instagram.com/boguragolfclub"
                                                        className="w-full text-xs font-mono rounded-xl"
                                                    />
                                                </div>
                                            </div>

                                            {/* LinkedIn */}
                                            <div className={`p-4 rounded-2xl border transition-all ${
                                                data.social_linkedin_enabled === '1' 
                                                    ? 'bg-white border-sky-200 shadow-sm' 
                                                    : 'bg-gray-50 border-gray-200 opacity-75'
                                            }`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center shadow-xs">
                                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-gray-900 text-sm">LinkedIn</h5>
                                                            <span className="text-[11px] font-semibold text-gray-500">
                                                                {data.social_linkedin_enabled === '1' ? 'Enabled' : 'Disabled'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('social_linkedin_enabled', data.social_linkedin_enabled === '1' ? '0' : '1')}
                                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                                            data.social_linkedin_enabled === '1' ? 'bg-[#0A66C2]' : 'bg-gray-300'
                                                        }`}
                                                    >
                                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                                            data.social_linkedin_enabled === '1' ? 'translate-x-5' : 'translate-x-0'
                                                        }`} />
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-semibold text-gray-600">LinkedIn Organization URL</label>
                                                        {data.social_linkedin_url && (
                                                            <a href={data.social_linkedin_url} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-[#0A66C2] hover:underline inline-flex items-center gap-0.5">
                                                                <span>Test</span>
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                    <TextInput
                                                        type="url"
                                                        value={data.social_linkedin_url}
                                                        onChange={(e) => setData('social_linkedin_url', e.target.value)}
                                                        placeholder="https://linkedin.com/company/boguragolfclub"
                                                        className="w-full text-xs font-mono rounded-xl"
                                                    />
                                                </div>
                                            </div>

                                            {/* YouTube */}
                                            <div className={`p-4 rounded-2xl border transition-all ${
                                                data.social_youtube_enabled === '1' 
                                                    ? 'bg-white border-red-200 shadow-sm' 
                                                    : 'bg-gray-50 border-gray-200 opacity-75'
                                            }`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-[#FF0000] text-white flex items-center justify-center shadow-xs">
                                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-gray-900 text-sm">YouTube</h5>
                                                            <span className="text-[11px] font-semibold text-gray-500">
                                                                {data.social_youtube_enabled === '1' ? 'Enabled' : 'Disabled'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('social_youtube_enabled', data.social_youtube_enabled === '1' ? '0' : '1')}
                                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                                            data.social_youtube_enabled === '1' ? 'bg-[#FF0000]' : 'bg-gray-300'
                                                        }`}
                                                    >
                                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                                            data.social_youtube_enabled === '1' ? 'translate-x-5' : 'translate-x-0'
                                                        }`} />
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-semibold text-gray-600">YouTube Channel URL</label>
                                                        {data.social_youtube_url && (
                                                            <a href={data.social_youtube_url} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-[#FF0000] hover:underline inline-flex items-center gap-0.5">
                                                                <span>Test</span>
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                    <TextInput
                                                        type="url"
                                                        value={data.social_youtube_url}
                                                        onChange={(e) => setData('social_youtube_url', e.target.value)}
                                                        placeholder="https://youtube.com/@boguragolfclub"
                                                        className="w-full text-xs font-mono rounded-xl"
                                                    />
                                                </div>
                                            </div>

                                            {/* WhatsApp */}
                                            <div className={`p-4 rounded-2xl border transition-all ${
                                                data.social_whatsapp_enabled === '1' 
                                                    ? 'bg-white border-emerald-200 shadow-sm' 
                                                    : 'bg-gray-50 border-gray-200 opacity-75'
                                            }`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                                                <path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.98-.276-.1-.476-.15-.677.15-.2.3-.777.98-.953 1.18-.175.2-.351.226-.652.075-.3-.15-1.267-.467-2.414-1.49-1.01-1.006-1.503-2.023-1.654-2.324-.15-.3-.016-.462.134-.612.136-.135.301-.351.452-.527.15-.175.2-.3.301-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.235-.244-.588-.493-.509-.677-.518-.175-.009-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.3-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.227 3.11.15.2 2.12 3.238 5.137 4.542.718.311 1.278.497 1.716.636.721.23 1.378.198 1.897.12.578-.088 1.782-.728 2.033-1.431.25-.702.25-1.304.175-1.43-.075-.126-.276-.201-.577-.352zm-5.464 7.218c-2.106 0-4.168-.567-5.972-1.642l-.428-.255-4.437 1.164 1.185-4.325-.28-.445C1.196 14.28 0.6 12.186 0.6 10.02c0-5.744 4.673-10.417 10.418-10.417 2.784 0 5.4 1.084 7.369 3.053s3.053 4.585 3.053 7.369c0 5.744-4.673 10.417-10.432 10.417z"/>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-bold text-gray-900 text-sm">WhatsApp</h5>
                                                            <span className="text-[11px] font-semibold text-gray-500">
                                                                {data.social_whatsapp_enabled === '1' ? 'Enabled' : 'Disabled'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => setData('social_whatsapp_enabled', data.social_whatsapp_enabled === '1' ? '0' : '1')}
                                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                                            data.social_whatsapp_enabled === '1' ? 'bg-[#25D366]' : 'bg-gray-300'
                                                        }`}
                                                    >
                                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                                            data.social_whatsapp_enabled === '1' ? 'translate-x-5' : 'translate-x-0'
                                                        }`} />
                                                    </button>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-xs font-semibold text-gray-600">WhatsApp Chat / Group Link</label>
                                                        {data.social_whatsapp_url && (
                                                            <a href={data.social_whatsapp_url} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-[#25D366] hover:underline inline-flex items-center gap-0.5">
                                                                <span>Test</span>
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        )}
                                                    </div>
                                                    <TextInput
                                                        type="url"
                                                        value={data.social_whatsapp_url}
                                                        onChange={(e) => setData('social_whatsapp_url', e.target.value)}
                                                        placeholder="https://wa.me/8801700000000 or chat invite"
                                                        className="w-full text-xs font-mono rounded-xl"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Interactive Live Footer Preview Card */}
                                    <div className="p-6 bg-gradient-to-br from-[#0c2e1d] to-[#071d11] text-white rounded-2xl space-y-4 shadow-md border border-emerald-800/40">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-emerald-400" />
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                                                    Live Footer Presentation Preview
                                                </h4>
                                            </div>
                                            <span className="text-[11px] font-medium text-slate-300">
                                                Simulates actual homepage footer appearance
                                            </span>
                                        </div>

                                        {data.footer_social_enabled === '0' ? (
                                            <div className="p-4 rounded-xl bg-black/30 border border-dashed border-white/20 text-center text-xs text-slate-400">
                                                Social icons are currently turned off and will not be displayed on the homepage footer.
                                            </div>
                                        ) : (
                                            <div className="pt-2 flex items-center gap-2 flex-wrap">
                                                {data.social_facebook_enabled === '1' && (
                                                    <div className="w-9 h-9 rounded-lg bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer" title={`Facebook: ${data.social_facebook_url}`}>
                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                        </svg>
                                                    </div>
                                                )}
                                                {data.social_twitter_enabled === '1' && (
                                                    <div className="w-9 h-9 rounded-lg bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer" title={`Twitter/X: ${data.social_twitter_url}`}>
                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                                        </svg>
                                                    </div>
                                                )}
                                                {data.social_instagram_enabled === '1' && (
                                                    <div className="w-9 h-9 rounded-lg bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer" title={`Instagram: ${data.social_instagram_url}`}>
                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                                        </svg>
                                                    </div>
                                                )}
                                                {data.social_youtube_enabled === '1' && (
                                                    <div className="w-9 h-9 rounded-lg bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer" title={`YouTube: ${data.social_youtube_url}`}>
                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                                        </svg>
                                                    </div>
                                                )}
                                                {data.social_linkedin_enabled === '1' && (
                                                    <div className="w-9 h-9 rounded-lg bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer" title={`LinkedIn: ${data.social_linkedin_url}`}>
                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                                        </svg>
                                                    </div>
                                                )}
                                                {data.social_whatsapp_enabled === '1' && (
                                                    <div className="w-9 h-9 rounded-lg bg-white text-slate-900 flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer" title={`WhatsApp: ${data.social_whatsapp_url}`}>
                                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.301-.15-1.782-.879-2.057-.98-.276-.1-.476-.15-.677.15-.2.3-.777.98-.953 1.18-.175.2-.351.226-.652.075-.3-.15-1.267-.467-2.414-1.49-1.01-1.006-1.503-2.023-1.654-2.324-.15-.3-.016-.462.134-.612.136-.135.301-.351.452-.527.15-.175.2-.3.301-.5.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.927-2.235-.244-.588-.493-.509-.677-.518-.175-.009-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.3-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.227 3.11.15.2 2.12 3.238 5.137 4.542.718.311 1.278.497 1.716.636.721.23 1.378.198 1.897.12.578-.088 1.782-.728 2.033-1.431.25-.702.25-1.304.175-1.43-.075-.126-.276-.201-.577-.352zm-5.464 7.218c-2.106 0-4.168-.567-5.972-1.642l-.428-.255-4.437 1.164 1.185-4.325-.28-.445C1.196 14.28 0.6 12.186 0.6 10.02c0-5.744 4.673-10.417 10.418-10.417 2.784 0 5.4 1.084 7.369 3.053s3.053 4.585 3.053 7.369c0 5.744-4.673 10.417-10.432 10.417z"/>
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Form Submission Button */}
                            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                                <span className="text-xs text-gray-500">
                                    {activeTab === 'google' 
                                        ? 'Saving updates Google OAuth settings immediately for all users.' 
                                        : 'Changes will apply to the live club portal immediately.'}
                                </span>
                                <PrimaryButton disabled={processing} className="bg-emerald-600 hover:bg-emerald-500 rounded-xl px-6 py-2.5">
                                    {processing ? 'Saving...' : 'Save Settings'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
