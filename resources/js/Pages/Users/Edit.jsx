import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserDropdown from '@/Components/UserDropdown';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Save, 
    Users, 
    Key, 
    Sparkles, 
    Mail, 
    Phone, 
    Building, 
    Shield, 
    UserCheck,
    Lock,
    LogIn,
    Info,
    ShieldCheck,
    Check
} from 'lucide-react';
import InputError from '@/Components/InputError';

export default function Edit({ user, isSuperAdmin: propIsSuperAdmin }) {
    const authUser = usePage().props.auth.user;
    const isSuperAdmin = propIsSuperAdmin !== undefined ? propIsSuperAdmin : authUser?.role === 'super_admin';

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'member',
        phone: user.phone || '',
        mobile: user.mobile || '',
        rank_designation: user.rank_designation || '',
        profession: user.profession || '',
        organization: user.organization || '',
        is_active: user.is_active !== false && user.is_active !== 0,
    });

    const memberId = user.member_id || ('BGC-26' + String(user.id).padStart(4, '0'));

    const submit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
        let pass = 'BGC#';
        for (let i = 0; i < 6; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setData('password', pass);
    };

    const handleImpersonate = () => {
        if (confirm(`You are about to sign in and view the portal as "${user.name}". Proceed?`)) {
            router.post(route('users.impersonate', user.id));
        }
    };

    return (
        <AuthenticatedLayout header="Edit Member Profile">
            <Head title={`Edit Member - ${user.name}`} />

            <div className="bg-[#F8F9F8] min-h-screen text-slate-900 py-10 sm:py-14">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    
                    {/* ── TOP HEADER ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <Link 
                                href={route('users.index')}
                                className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-2xs shrink-0"
                                title="Back to Member Directory"
                            >
                                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                            </Link>

                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                                        Edit Member: {user.name}
                                    </h1>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                                    <span className="font-mono font-bold text-[#1C2C1D]">{memberId}</span>
                                    <span>•</span>
                                    <span>Update credentials, role permissions, and contact records.</span>
                                </p>
                            </div>
                        </div>

                        {/* Top Right Controls */}
                        <div className="flex items-center gap-3 self-start sm:self-auto">
                            {user.id !== authUser.id && (
                                <button
                                    type="button"
                                    onClick={handleImpersonate}
                                    className="px-4 py-2.5 rounded-full bg-[#DFE5D4] hover:bg-[#CBD4BD] text-[#1C2C1D] text-xs font-bold uppercase tracking-wider border border-[#CBD4BD] shadow-xs transition-all flex items-center gap-2"
                                >
                                    <LogIn className="w-3.5 h-3.5 text-[#2C442E]" />
                                    <span>View As Member</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── MAIN FORM CARD ── */}
                    <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-7">
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Full Name & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Full Name / Official Title *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-1.5" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Official Email Address *
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-1.5" />
                                </div>
                            </div>

                            {/* Reset Password & Role */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Reset Password (Leave blank to keep unchanged)
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type="text"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full pl-4 pr-24 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                            placeholder="New password (optional)"
                                        />
                                        <button
                                            type="button"
                                            onClick={generateRandomPassword}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 text-[10px] font-bold text-[#1C2C1D] bg-[#D4E2D2] hover:bg-[#C2D6BF] rounded-lg transition-colors flex items-center gap-1"
                                            title="Auto-Generate Password"
                                        >
                                            <Sparkles className="w-3 h-3" />
                                            <span>Generate</span>
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-1.5" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Account Role & Privileges
                                    </label>
                                    {isSuperAdmin ? (
                                        <select
                                            id="role"
                                            value={data.role}
                                            onChange={(e) => setData('role', e.target.value)}
                                            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                        >
                                            <option value="member">Club Member (Standard Member Portal)</option>
                                            <option value="admin">Administrator (Full Backoffice Control)</option>
                                            <option value="super_admin">Super Admin (System Governance)</option>
                                        </select>
                                    ) : (
                                        <div className="px-4 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-between">
                                            <span>{data.role === 'admin' ? 'Administrator' : 'Club Member'}</span>
                                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                                        </div>
                                    )}
                                    <InputError message={errors.role} className="mt-1.5" />
                                </div>
                            </div>

                            {/* Contact Numbers */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Landline / Desk Telephone (Optional)
                                    </label>
                                    <input
                                        id="phone"
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+880..."
                                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                    <InputError message={errors.phone} className="mt-1.5" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Mobile Phone Number (Optional)
                                    </label>
                                    <input
                                        id="mobile"
                                        type="text"
                                        value={data.mobile}
                                        onChange={(e) => setData('mobile', e.target.value)}
                                        placeholder="0171..."
                                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                    <InputError message={errors.mobile} className="mt-1.5" />
                                </div>
                            </div>

                            {/* Military & Professional Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Rank / Designation
                                    </label>
                                    <input
                                        id="rank_designation"
                                        type="text"
                                        value={data.rank_designation}
                                        onChange={(e) => setData('rank_designation', e.target.value)}
                                        placeholder="e.g. Brigadier General"
                                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                    <InputError message={errors.rank_designation} className="mt-1.5" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Profession
                                    </label>
                                    <input
                                        id="profession"
                                        type="text"
                                        value={data.profession}
                                        onChange={(e) => setData('profession', e.target.value)}
                                        placeholder="e.g. Military Officer / Civil"
                                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                    <InputError message={errors.profession} className="mt-1.5" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                        Organization / Unit
                                    </label>
                                    <input
                                        id="organization"
                                        type="text"
                                        value={data.organization}
                                        onChange={(e) => setData('organization', e.target.value)}
                                        placeholder="e.g. 11 Infantry Division"
                                        className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                    <InputError message={errors.organization} className="mt-1.5" />
                                </div>
                            </div>

                            {/* Account Login Status Toggle */}
                            <div className="p-4 rounded-2xl bg-[#D4E2D2]/30 border border-[#BFD4BD] flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                        Account Portal Access Status
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Enable or suspend this member's credentials for signing into the BGC portal.
                                    </p>
                                </div>
                                <label className="flex items-center cursor-pointer gap-2 select-none">
                                    <span className="text-xs font-bold text-slate-700">
                                        {data.is_active ? 'Active' : 'Disabled'}
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
                                    href={route('users.index')}
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
                                    <span>{processing ? 'Saving...' : 'Update Member Account'}</span>
                                </button>
                            </div>

                        </form>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
