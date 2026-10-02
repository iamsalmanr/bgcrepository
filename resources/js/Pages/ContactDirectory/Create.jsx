import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    ChevronLeft, 
    Save, 
    PhoneCall, 
    Columns, 
    Building2, 
    Mail, 
    FileText, 
    Sparkles 
} from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        column: 'left',
        title: '',
        details: '',
        sort_order: 0,
    });

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.015em'
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('contact-directory.store'));
    };

    return (
        <AuthenticatedLayout header="Add Contact Entry">
            <Head title="Add Contact Entry - Bogura Golf Club" />

            <div className="max-w-4xl mx-auto space-y-6 pb-16">
                
                {/* ── 1. HEADER BANNER ── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <Link 
                            href={route('contact-directory.index')}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-900 uppercase tracking-wider transition-colors mb-1"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back to Contact Directory</span>
                        </Link>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight" style={appleStyle}>
                            Add New Contact Entry
                        </h2>
                        <p className="text-xs text-slate-500 font-normal">
                            Configure department title, direct mobile numbers, extensions, or official email address.
                        </p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold border border-emerald-200 shrink-0">
                        <PhoneCall className="w-6 h-6" />
                    </div>
                </div>

                {/* ── 2. EXECUTIVE FORM CARD ── */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8">
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Column Group Selection */}
                        <div>
                            <InputLabel htmlFor="column" value="Directory Column Group" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                                    data.column === 'left' 
                                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' 
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="column" 
                                        value="left" 
                                        checked={data.column === 'left'}
                                        onChange={() => setData('column', 'left')}
                                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Left Column (Primary Contact Desk)</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Reception, General Email, Pro Shop, Restaurant, Room Booking</p>
                                    </div>
                                </label>

                                <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                                    data.column === 'middle' 
                                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' 
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="column" 
                                        value="middle" 
                                        checked={data.column === 'middle'}
                                        onChange={() => setData('column', 'middle')}
                                        className="mt-1 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Middle Column (Intercom & Extensions)</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Army Exchange Intercom, Office Operator, Department Extensions</p>
                                    </div>
                                </label>
                            </div>
                            <InputError message={errors.column} className="mt-1.5" />
                        </div>

                        {/* Title */}
                        <div>
                            <InputLabel htmlFor="title" value="Department / Section Title" />
                            <TextInput
                                id="title"
                                type="text"
                                value={data.title}
                                className="mt-1.5 block w-full rounded-2xl border-slate-200 text-sm focus:border-emerald-600 focus:ring-emerald-600 font-semibold text-slate-900"
                                placeholder="e.g. Reception Desk, Restaurant, Pro Shop, Army Exchange"
                                onChange={(e) => setData('title', e.target.value)}
                                autoFocus
                                required
                            />
                            <InputError message={errors.title} className="mt-1.5" />
                        </div>

                        {/* Details */}
                        <div>
                            <InputLabel htmlFor="details" value="Contact Details (Phone Numbers, Emails, Extensions)" />
                            <textarea
                                id="details"
                                rows={4}
                                value={data.details}
                                onChange={(e) => setData('details', e.target.value)}
                                className="mt-1.5 block w-full rounded-2xl border-slate-200 text-sm focus:border-emerald-600 focus:ring-emerald-600 font-medium text-slate-800"
                                placeholder="e.g. Contact No: 0173 000 4680, 0173 000 4690&#10;Email: bogragolf@gmail.com"
                                required
                            />
                            <p className="text-[11px] text-slate-400 mt-1">Multi-line supported for listing multiple phone numbers or extensions.</p>
                            <InputError message={errors.details} className="mt-1.5" />
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                            <Link 
                                href={route('contact-directory.index')} 
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
                                <span>{processing ? 'Saving...' : 'Save Contact Record'}</span>
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
