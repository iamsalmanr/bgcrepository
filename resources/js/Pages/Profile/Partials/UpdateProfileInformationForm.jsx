import React, { useState, useEffect, useRef } from 'react';
import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm, usePage, Link, router } from '@inertiajs/react';
import { 
    User, 
    Mail, 
    Phone, 
    Smartphone, 
    Globe, 
    Award, 
    Briefcase, 
    Building2, 
    MapPin, 
    Plus, 
    Trash2, 
    Camera, 
    Check, 
    Shield, 
    ShieldCheck,
    Sparkles,
    Save,
    Loader2,
    Lock,
    Hash
} from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const [previewUrl, setPreviewUrl] = useState(user.profile_picture ? `/storage/${user.profile_picture}` : null);
    const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
    const isFirstRender = useRef(true);
    const debounceTimer = useRef(null);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            mobile: user.mobile || '',
            country: user.country || 'Bangladesh',
            rank_designation: user.rank_designation || '',
            appointment: user.appointment || '',
            profession: user.profession || '',
            organization: user.organization || '',
            profile_picture: null,
            addresses: user.addresses || [],
            _method: 'patch',
        });

    const memberId = user.member_id || ('BGC-26' + String(user.id).padStart(4, '0'));

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    // Auto-Save Function
    const triggerAutoSave = (updatedData, photoFile = null) => {
        setAutoSaveStatus('saving');

        const formData = new FormData();
        formData.append('_method', 'patch');
        formData.append('name', updatedData.name || '');
        formData.append('email', updatedData.email || '');
        formData.append('phone', updatedData.phone || '');
        formData.append('mobile', updatedData.mobile || '');
        formData.append('country', updatedData.country || 'Bangladesh');
        formData.append('rank_designation', updatedData.rank_designation || '');
        formData.append('appointment', updatedData.appointment || '');
        formData.append('profession', updatedData.profession || '');
        formData.append('organization', updatedData.organization || '');
        
        if (photoFile) {
            formData.append('profile_picture', photoFile);
        }

        (updatedData.addresses || []).forEach((addr, i) => {
            formData.append(`addresses[${i}][type]`, addr.type || '');
            formData.append(`addresses[${i}][street]`, addr.street || '');
            formData.append(`addresses[${i}][city]`, addr.city || '');
            formData.append(`addresses[${i}][zip]`, addr.zip || '');
            formData.append(`addresses[${i}][mobile]`, addr.mobile || '');
            formData.append(`addresses[${i}][email]`, addr.email || '');
        });

        router.post(route('profile.update'), formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setAutoSaveStatus('saved');
                setTimeout(() => setAutoSaveStatus('idle'), 3000);
            },
            onError: () => {
                setAutoSaveStatus('error');
            },
        });
    };

    // Debounced auto-save on field changes
    const handleFieldChange = (field, value) => {
        const updated = { ...data, [field]: value };
        setData(field, value);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            triggerAutoSave(updated);
        }, 650);
    };

    // Immediate photo save
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreviewUrl(URL.createObjectURL(file));
        setData('profile_picture', file);
        triggerAutoSave(data, file);
    };

    const addAddress = () => {
        const updatedAddresses = [
            ...data.addresses, 
            { type: 'Home', street: '', city: 'Bogura', zip: '', mobile: data.mobile || '', email: data.email || '' }
        ];
        setData('addresses', updatedAddresses);
        triggerAutoSave({ ...data, addresses: updatedAddresses });
    };

    const removeAddress = (index) => {
        const newAddresses = [...data.addresses];
        newAddresses.splice(index, 1);
        setData('addresses', newAddresses);
        triggerAutoSave({ ...data, addresses: newAddresses });
    };

    const handleAddressChange = (index, field, value) => {
        const newAddresses = [...data.addresses];
        newAddresses[index][field] = value;
        setData('addresses', newAddresses);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            triggerAutoSave({ ...data, addresses: newAddresses });
        }, 650);
    };

    const submit = (e) => {
        e.preventDefault();
        triggerAutoSave(data);
    };

    return (
        <section className={className}>
            {/* Live Auto-Saving Status Indicator Header */}
            <div className="sticky top-20 z-20 mb-4 flex items-center justify-end pointer-events-none">
                {autoSaveStatus === 'saving' && (
                    <div className="inline-flex items-center gap-2 bg-slate-900/90 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl border border-white/20 backdrop-blur-md animate-in fade-in zoom-in duration-150">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        <span>Auto-saving changes...</span>
                    </div>
                )}
                {autoSaveStatus === 'saved' && (
                    <div className="inline-flex items-center gap-1.5 bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl border border-emerald-400/40 backdrop-blur-md animate-in fade-in zoom-in duration-150">
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>All changes auto-saved</span>
                    </div>
                )}
                {autoSaveStatus === 'error' && (
                    <div className="inline-flex items-center gap-1.5 bg-rose-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl border border-rose-400/40 backdrop-blur-md">
                        <span>Save error. Please check required fields.</span>
                    </div>
                )}
            </div>

            <form onSubmit={submit} className="space-y-8">
                
                {/* ── SECTION 1: PERSONAL & CONTACT INFORMATION ── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900" style={appleStyle}>
                                    Personal & Membership Profile
                                </h3>
                                <p className="text-xs text-slate-500">
                                    All modifications to your profile are automatically saved in real time.
                                </p>
                            </div>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider hidden sm:inline">
                            Live Auto-Save
                        </span>
                    </div>

                    {/* Profile Photo Uploader Banner */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                        {/* Avatar Preview */}
                        <div className="relative group shrink-0">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-emerald-600 shadow-md bg-emerald-950 text-white flex items-center justify-center text-3xl font-bold relative">
                                {previewUrl ? (
                                    <img src={previewUrl} alt={data.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{data.name ? data.name.charAt(0).toUpperCase() : 'M'}</span>
                                )}

                                {/* Saving indicator */}
                                {autoSaveStatus === 'saving' && (
                                    <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-1 z-20">
                                        <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                                        <span className="text-[9px] font-bold uppercase tracking-wider">Saving...</span>
                                    </div>
                                )}
                            </div>

                            <label 
                                htmlFor="profile_picture" 
                                className="absolute bottom-0 right-0 p-2 rounded-full bg-[#0c2417] text-white hover:bg-emerald-800 shadow-lg cursor-pointer transition-transform group-hover:scale-105"
                                title="Change Profile Photo"
                            >
                                <Camera className="w-4 h-4" />
                            </label>
                            <input
                                type="file"
                                id="profile_picture"
                                className="hidden"
                                onChange={handlePhotoChange}
                                accept=".jpg,.jpeg,.png"
                            />
                        </div>

                        {/* Photo Details & Requirements */}
                        <div className="flex-1 text-center sm:text-left space-y-2">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <label 
                                    htmlFor="profile_picture" 
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-100 cursor-pointer shadow-xs transition-colors"
                                >
                                    <Camera className="w-3.5 h-3.5 text-emerald-700" />
                                    <span>Choose Passport Photo</span>
                                </label>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed">
                                Upload a passport-size portrait photo (JPG, JPEG, or PNG, max 1MB). Your photo will <span className="font-semibold text-emerald-800">auto-save instantly</span> and update across your digital membership card.
                            </p>
                            <InputError message={errors.profile_picture} className="text-left" />
                        </div>
                    </div>

                    {/* Inputs Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        
                        {/* Member ID - System Auto-Generated & Locked */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Member ID <span className="text-emerald-700 font-bold">(Auto-Generated)</span>
                                </label>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                    <span>Official ID</span>
                                </span>
                            </div>
                            <div className="relative">
                                <Hash className="w-4 h-4 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    id="member_id"
                                    type="text"
                                    value={memberId}
                                    readOnly={true}
                                    disabled={true}
                                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs font-bold text-emerald-900 cursor-not-allowed select-all tracking-wider font-mono"
                                />
                                <Lock className="w-3.5 h-3.5 text-emerald-600/70 absolute right-3.5 top-1/2 -translate-y-1/2" />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">
                                Unique club membership ID assigned by Bogura Golf Club.
                            </p>
                        </div>

                        {/* Email Address - Locked */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Email Address <span className="text-rose-500">*</span>
                                </label>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                    <Lock className="w-3 h-3 text-slate-400" />
                                    <span>Locked</span>
                                </span>
                            </div>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    readOnly={true}
                                    disabled={true}
                                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-100/90 border border-slate-200 text-xs font-medium text-slate-500 cursor-not-allowed select-all"
                                    placeholder="Enter email address"
                                    required
                                />
                                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                                Primary membership email is locked for account verification & security.
                            </p>
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        {/* Member Full Name */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Member Full Name <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => handleFieldChange('name', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Mobile Number
                            </label>
                            <div className="relative">
                                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    id="mobile"
                                    type="text"
                                    value={data.mobile}
                                    onChange={(e) => handleFieldChange('mobile', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all"
                                    placeholder="+880 1700-000000"
                                />
                            </div>
                            <InputError message={errors.mobile} className="mt-1" />
                        </div>

                        {/* Phone / Landline */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Phone / Army Intercom
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all"
                                    placeholder="e.g. 7790 or Landline"
                                />
                            </div>
                            <InputError message={errors.phone} className="mt-1" />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Country
                            </label>
                            <div className="relative">
                                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <select
                                    id="country"
                                    value={data.country}
                                    onChange={(e) => handleFieldChange('country', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all"
                                >
                                    <option value="Bangladesh">Bangladesh</option>
                                    <option value="United States">United States</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Australia">Australia</option>
                                    <option value="India">India</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <InputError message={errors.country} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* ── SECTION 2: PROFESSIONAL & RANK DESIGNATION ── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                                <Award className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900" style={appleStyle}>
                                    Rank, Designation & Profession
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Official military rank, professional designation, and organization details.
                                </p>
                            </div>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider hidden sm:inline">
                            Designation
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Rank / Designation */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Rank / Designation
                            </label>
                            <div className="relative">
                                <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <select
                                    id="rank_designation"
                                    value={data.rank_designation}
                                    onChange={(e) => handleFieldChange('rank_designation', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all"
                                >
                                    <option value="">Select Rank / Designation...</option>
                                    <option value="Lieutenant General">Lieutenant General</option>
                                    <option value="Major General">Major General</option>
                                    <option value="Brigadier General">Brigadier General</option>
                                    <option value="Colonel">Colonel</option>
                                    <option value="Lieutenant Colonel">Lieutenant Colonel</option>
                                    <option value="Major">Major</option>
                                    <option value="Captain">Captain</option>
                                    <option value="Lieutenant">Lieutenant</option>
                                    <option value="Civilian Executive">Civilian Executive</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <InputError message={errors.rank_designation} className="mt-1" />
                        </div>

                        {/* Appointment */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Appointment
                            </label>
                            <div className="relative">
                                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    id="appointment"
                                    type="text"
                                    value={data.appointment}
                                    onChange={(e) => handleFieldChange('appointment', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all"
                                    placeholder="e.g. Commander / Director"
                                />
                            </div>
                            <InputError message={errors.appointment} className="mt-1" />
                        </div>

                        {/* Profession */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Profession
                            </label>
                            <div className="relative">
                                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <select
                                    id="profession"
                                    value={data.profession}
                                    onChange={(e) => handleFieldChange('profession', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all"
                                >
                                    <option value="">Select Profession...</option>
                                    <option value="Armed Forces">Armed Forces</option>
                                    <option value="Civil Services">Civil Services</option>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Engineer">Engineer</option>
                                    <option value="Businessman / Industrialist">Businessman / Industrialist</option>
                                    <option value="Corporate Executive">Corporate Executive</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <InputError message={errors.profession} className="mt-1" />
                        </div>

                        {/* Organization */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                Organization / Company
                            </label>
                            <div className="relative">
                                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    id="organization"
                                    type="text"
                                    value={data.organization}
                                    onChange={(e) => handleFieldChange('organization', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 transition-all"
                                    placeholder="e.g. Bangladesh Army / Company Name"
                                />
                            </div>
                            <InputError message={errors.organization} className="mt-1" />
                        </div>
                    </div>
                </div>

                {/* ── SECTION 3: ADDRESSES & LOCATION ── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900" style={appleStyle}>
                                    Addresses & Mailing Contact
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Permanent, present, and office address records. Automatically saved upon changes.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={addAddress}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Address</span>
                        </button>
                    </div>

                    {/* Address List */}
                    <div className="space-y-4">
                        {data.addresses.map((address, idx) => (
                            <div 
                                key={idx} 
                                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 relative group hover:border-emerald-500/50 transition-all"
                            >
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-700" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                                            Address Record #{idx + 1}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeAddress(idx)}
                                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                                        title="Remove Address"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Type</label>
                                        <input
                                            type="text"
                                            value={address.type}
                                            onChange={(e) => handleAddressChange(idx, 'type', e.target.value)}
                                            placeholder="Home / Office / Cantonment"
                                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-700/30"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Street Address</label>
                                        <input
                                            type="text"
                                            value={address.street}
                                            onChange={(e) => handleAddressChange(idx, 'street', e.target.value)}
                                            placeholder="House / Road / Sector / Quarter"
                                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-700/30"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">City</label>
                                        <input
                                            type="text"
                                            value={address.city}
                                            onChange={(e) => handleAddressChange(idx, 'city', e.target.value)}
                                            placeholder="Bogura / Dhaka"
                                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-700/30"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Postal Zip Code</label>
                                        <input
                                            type="text"
                                            value={address.zip}
                                            onChange={(e) => handleAddressChange(idx, 'zip', e.target.value)}
                                            placeholder="5800"
                                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-700/30"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Contact Phone</label>
                                        <input
                                            type="text"
                                            value={address.mobile}
                                            onChange={(e) => handleAddressChange(idx, 'mobile', e.target.value)}
                                            placeholder="+880 1700..."
                                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-700/30"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {data.addresses.length === 0 && (
                            <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
                                <p className="text-xs text-slate-500 font-medium">
                                    No address records added yet. Click the "Add Address" button above to add your official mailing location.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── EMAIL VERIFICATION ALERT ── */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-4">
                        <span>Your email address is unverified.</span>
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="font-bold underline text-amber-950 hover:text-amber-800"
                        >
                            Resend verification email
                        </Link>
                    </div>
                )}
            </form>
        </section>
    );
}
