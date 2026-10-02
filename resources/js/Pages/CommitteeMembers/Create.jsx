import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ImageCropUploader from '@/Components/ImageCropUploader';
import { ChevronLeft, UserPlus, Save, PlusCircle, Check } from 'lucide-react';

export default function Create({ committees = [] }) {
    const [isCustomCommittee, setIsCustomCommittee] = useState(false);
    const [customCommitteeName, setCustomCommitteeName] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        committee: '',
        designation: '',
        sort_order: 0,
        image: null,
    });

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.015em'
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('committee-members.store'));
    };

    // Normalize committees list from prop or defaults
    const committeeOptions = committees.length > 0
        ? committees.map(c => typeof c === 'object' ? c.name : c)
        : [
            'Executive Committee',
            'Tournament Committee',
            'Development Committee',
            'Audit & Finance Committee',
            'Handicap Committee',
            'Entertainment & Cultural Committee',
            'Discipline Committee',
            'Balloting Committee',
            'Grounds & Rules Committee',
            'Welfare Fund Management Committee',
        ];

    const handleCustomCommitteeSubmit = (e) => {
        e.preventDefault();
        if (customCommitteeName.trim()) {
            setData('committee', customCommitteeName.trim());
            setIsCustomCommittee(false);
        }
    };

    return (
        <AuthenticatedLayout header="Add Member">
            <Head title="Add New Committee Member" />

            <div className="max-w-4xl mx-auto space-y-6 pb-16">
                
                {/* ── 1. CLEAN BACK LINK & HEADER BANNER ── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <Link 
                            href={route('committee-members.index')}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-900 uppercase tracking-wider transition-colors mb-1"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back to Committee List</span>
                        </Link>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight" style={appleStyle}>
                            Add New Committee Member
                        </h2>
                        <p className="text-xs text-slate-500 font-normal">
                            Assign member designation, committee governance board, ordering index, and portrait photography.
                        </p>
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold border border-emerald-200 shrink-0">
                        <UserPlus className="w-6 h-6" />
                    </div>
                </div>

                {/* ── 2. EXECUTIVE CREATE FORM CARD ── */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 sm:p-8">
                    <form onSubmit={submit} className="space-y-6">
                        
                        {/* Member Name Field */}
                        <div>
                            <InputLabel htmlFor="name" value="Full Name & Military Title / Rank" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1.5 block w-full rounded-2xl border-slate-200 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                                placeholder="e.g. Brigadier General Md Habibur Rahman, SGP, PPM, afwc, psc"
                                onChange={(e) => setData('name', e.target.value)}
                                isFocused={true}
                                required
                            />
                            <p className="text-[11px] text-slate-400 mt-1">Include rank prefix, honors, and military appointment if applicable.</p>
                            <InputError message={errors.name} className="mt-1.5" />
                        </div>

                        {/* Committee Selection */}
                        <div>
                            <div className="flex items-center justify-between">
                                <InputLabel htmlFor="committee" value="Assigned Committee Board" />
                                <button
                                    type="button"
                                    onClick={() => setIsCustomCommittee(!isCustomCommittee)}
                                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 transition-colors"
                                >
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    <span>{isCustomCommittee ? 'Choose Existing' : '+ Add New Committee Name'}</span>
                                </button>
                            </div>

                            {isCustomCommittee ? (
                                <div className="mt-1.5 flex gap-2">
                                    <TextInput
                                        id="custom_committee"
                                        type="text"
                                        value={customCommitteeName}
                                        onChange={(e) => {
                                            setCustomCommitteeName(e.target.value);
                                            setData('committee', e.target.value);
                                        }}
                                        placeholder="Type new committee board name..."
                                        className="flex-1 rounded-2xl border-slate-200 text-sm focus:border-emerald-600 focus:ring-emerald-600 font-semibold"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCustomCommitteeSubmit}
                                        className="px-4 py-2.5 bg-emerald-800 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-900"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span>Use</span>
                                    </button>
                                </div>
                            ) : (
                                <select
                                    id="committee"
                                    name="committee"
                                    value={data.committee}
                                    className="mt-1.5 block w-full rounded-2xl border-slate-200 bg-white text-sm focus:border-emerald-600 focus:ring-emerald-600 py-3 px-4 font-semibold text-slate-800"
                                    onChange={(e) => setData('committee', e.target.value)}
                                    required
                                >
                                    <option value="">Select Committee</option>
                                    {committeeOptions.map((comm) => (
                                        <option key={comm} value={comm}>{comm}</option>
                                    ))}
                                </select>
                            )}
                            <InputError message={errors.committee} className="mt-1.5" />
                        </div>

                        {/* Designation and Sort Order in 2 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <InputLabel htmlFor="designation" value="Designation / Role" />
                                <TextInput
                                    id="designation"
                                    type="text"
                                    name="designation"
                                    value={data.designation}
                                    className="mt-1.5 block w-full rounded-2xl border-slate-200 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                                    placeholder="e.g. President, Chairman, Member Secretary, Member"
                                    onChange={(e) => setData('designation', e.target.value)}
                                />
                                <InputError message={errors.designation} className="mt-1.5" />
                            </div>

                            <div>
                                <InputLabel htmlFor="sort_order" value="Display Sort Order Number" />
                                <TextInput
                                    id="sort_order"
                                    type="number"
                                    name="sort_order"
                                    value={data.sort_order}
                                    className="mt-1.5 block w-full rounded-2xl border-slate-200 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                                    placeholder="0"
                                    onChange={(e) => setData('sort_order', e.target.value)}
                                />
                                <p className="text-[11px] text-slate-400 mt-1">Lower numbers appear first on the public website.</p>
                                <InputError message={errors.sort_order} className="mt-1.5" />
                            </div>
                        </div>

                        {/* ── 3. INTERACTIVE IMAGE CROP, RESIZE & REMOVE STUDIO ── */}
                        <div className="pt-2 border-t border-slate-100">
                            <ImageCropUploader
                                currentImageUrl={null}
                                onImageCropped={(file) => setData('image', file)}
                                onRemoveImage={() => setData('image', null)}
                                label="Official Member Portrait Photo"
                            />
                            <InputError message={errors.image} className="mt-1.5" />
                        </div>

                        {/* ── 4. FORM ACTION BUTTONS ── */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                            <Link 
                                href={route('committee-members.index')} 
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
                                <span>{processing ? 'Creating Record...' : 'Save Committee Member'}</span>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
