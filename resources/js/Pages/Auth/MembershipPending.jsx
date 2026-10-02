import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { 
    Clock, 
    ShieldAlert, 
    ShieldCheck, 
    CheckCircle2, 
    Phone, 
    Mail, 
    MapPin, 
    RefreshCw, 
    LogOut, 
    User, 
    Check, 
    Sparkles,
    Calendar,
    BadgeCheck
} from 'lucide-react';

export default function MembershipPending({ user }) {
    const { site_settings, flash } = usePage().props;
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        router.visit(route('dashboard'), {
            preserveScroll: true,
            onFinish: () => setIsRefreshing(false)
        });
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const formattedDate = user?.created_at 
        ? new Date(user.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'Recently';

    return (
        <div className="min-h-screen bg-[#07190F] text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden font-sans">
            <Head title="Membership Verification Pending - Bogura Golf Club" />

            {/* Ambient Golf Course Glows */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] bg-[#1C2C1D]/60 rounded-full blur-[140px] pointer-events-none" />

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

            {/* Top Navigation Bar */}
            <header className="relative z-10 w-full border-b border-emerald-900/40 bg-[#07190F]/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <ApplicationLogo className="w-10 h-10 object-contain drop-shadow-md group-hover:scale-105 transition-transform" />
                        <div>
                            <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase block leading-none font-display">
                                {site_settings?.site_name || 'Bogura Golf Club'}
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase">
                                Member Verification Portal
                            </span>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all border border-white/10"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </header>

            {/* Main Center Content */}
            <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
                    
                    {/* Flash Notification if present */}
                    {flash?.success && (
                        <div className="bg-emerald-900/50 border border-emerald-500/40 rounded-2xl p-4 flex items-center gap-3 text-emerald-200 text-xs font-semibold">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span>{flash.success}</span>
                        </div>
                    )}

                    {/* Status Icon & Header */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                            <Clock className="w-10 h-10 animate-pulse" />
                        </div>

                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                                <span>Awaiting Admin Verification</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Membership Verification in Progress
                            </h1>
                            <p className="text-slate-300 text-sm max-w-lg mx-auto leading-relaxed">
                                Welcome to Bogura Golf Club, <strong className="text-emerald-300">{user?.name}</strong>. Your membership registration has been received and is currently undergoing verification by the Club Administration.
                            </p>
                        </div>
                    </div>

                    {/* Registered Member Details Card */}
                    <div className="bg-[#0b2416]/80 rounded-2xl border border-emerald-800/40 p-5 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-emerald-800/30 pb-3">
                            <div className="flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                                    Registration Profile
                                </span>
                            </div>
                            <span className="font-mono text-xs font-black bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-700/50 text-emerald-300">
                                {user?.member_id || 'BGC-PENDING'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="text-slate-400 block mb-0.5">Full Name</span>
                                <span className="font-semibold text-white text-sm">{user?.name}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block mb-0.5">Email Address</span>
                                <span className="font-semibold text-white">{user?.email}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block mb-0.5">Application Date</span>
                                <span className="font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                                    {formattedDate}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-400 block mb-0.5">Account Status</span>
                                <span className="inline-flex items-center gap-1 text-amber-300 font-bold mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                    <span>Pending Secretariat Approval</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Verification Progression Steps */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Verification Workflow
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-700/50 flex items-start gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                    ✓
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-emerald-300">1. Registration</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Submitted successfully</p>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/40 flex items-start gap-2.5">
                                <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                    2
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-amber-300">2. Review</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Under Secretariat scrutiny</p>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-2.5 opacity-60">
                                <div className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                    3
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-300">3. Portal Enabled</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Dashboard & fixtures</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#5b8e31] hover:bg-[#4a7727] text-white font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            <span>{isRefreshing ? 'Checking Status...' : 'Check Verification Status'}</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-sm transition-all"
                        >
                            Log Out
                        </button>
                    </div>

                    {/* Help & Secretariat Contact Footnote */}
                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Club Secretariat: {site_settings?.contact_phone || '+88 02 9835105 / Army: 8802'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <a href={`mailto:${site_settings?.contact_email || 'bogragolf@gmail.com'}`} className="hover:text-emerald-300 underline">
                                {site_settings?.contact_email || 'bogragolf@gmail.com'}
                            </a>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Footer */}
            <footer className="relative z-10 py-4 text-center text-xs text-slate-500 border-t border-emerald-950/40">
                <p>© {new Date().getFullYear()} Bogura Golf Club. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
