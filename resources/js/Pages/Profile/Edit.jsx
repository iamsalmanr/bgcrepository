import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserDropdown from '@/Components/UserDropdown';
import { Head, usePage, Link } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { User, Shield, ChevronRight, Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    const { user } = usePage().props.auth;
    const memberId = user?.member_id || ('BGC-26' + String(user?.id || 1).padStart(4, '0'));

    return (
        <AuthenticatedLayout header="Profile Settings">
            <Head title="Profile Settings - Bogura Golf Club" />

            <div className="bg-[#F8F9FB] min-h-screen text-slate-900 pb-16">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-7">
                    
                    {/* ── TOP HEADER ── */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                            <Link
                                href={route('dashboard')}
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white border border-slate-200/80 text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-2xs shrink-0"
                                title="Back to Dashboard"
                            >
                                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                            </Link>
                            <div className="min-w-0">
                                <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 font-display truncate">
                                    Profile & Membership
                                </h1>
                                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                                    Manage your official credentials, contact records, and account security.
                                </p>
                            </div>
                        </div>

                        {/* Official Member Badge */}
                        <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#D4E2D2] border border-[#BFD4BD] text-[#1C2C1D] flex items-center gap-1.5 shadow-2xs shrink-0">
                            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2C442E] shrink-0" />
                            <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase font-mono">{memberId}</span>
                        </div>
                    </div>

                    {/* ── Profile Information Form ── */}
                    <div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="w-full"
                        />
                    </div>

                    {/* ── Password Security Form ── */}
                    <div>
                        <UpdatePasswordForm className="w-full" />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
