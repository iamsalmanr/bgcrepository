import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import ImageCropUploader from '@/Components/ImageCropUploader';
import CommitteePhotoAdjustModal from '@/Components/CommitteePhotoAdjustModal';
import { ChevronLeft, Save, PlusCircle, Check, Focus } from 'lucide-react';

export default function Edit({ member, committees = [] }) {
    const [isCustomCommittee, setIsCustomCommittee] = useState(false);
    const [customCommitteeName, setCustomCommitteeName] = useState('');
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [currentMember, setCurrentMember] = useState(member);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: member.name || '',
        committee: member.committee || '',
        designation: member.designation || '',
        sort_order: member.sort_order || 0,
        image: null,
        remove_image: false,
    });

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.015em'
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('committee-members.update', member.id));
    };

    // Normalize committees list
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

    // Ensure member's current committee is in list
    if (member.committee && !committeeOptions.includes(member.committee)) {
        committeeOptions.push(member.committee);
    }

    const handleCustomCommitteeSubmit = (e) => {
        e.preventDefault();
        if (customCommitteeName.trim()) {
            setData('committee', customCommitteeName.trim());
            setIsCustomCommittee(false);
        }
    };

    return (
        <AuthenticatedLayout header="Edit Member">
            <Head title={`Edit Member - ${member.name}`} />

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
                            Edit Member: <span className="text-emerald-900">{member.name}</span>
                        </h2>
                        <p className="text-xs text-slate-500 font-normal">
                            Update designation, committee assignment, ordering index, and portrait photography.
                        </p>
                    </div>

                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200 shrink-0">
                        {member.committee}
                    </span>
                </div>

                {/* ── 2. EXECUTIVE EDIT FORM CARD ── */}
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
                        <div className="pt-2 border-t border-slate-100 space-y-3">
                            <ImageCropUploader
                                currentImageUrl={member.image_path ? `/storage/${member.image_path}` : null}
                                onImageCropped={(file) => {
                                    setData('image', file);
                                    setData('remove_image', false);
                                }}
                                onRemoveImage={() => {
                                    setData('image', null);
                                    setData('remove_image', true);
                                }}
                                label="Official Member Portrait Photo"
                            />

                            {member.image_path && !data.remove_image && !data.image && (
                                <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                                            <Focus className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-900">
                                                Active Framing & Centering
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                Position: <span className="font-semibold text-emerald-900">{currentMember.image_position || '50% 50%'}</span> • Zoom: <span className="font-semibold text-emerald-900">{currentMember.image_scale || 100}%</span>
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsAdjustModalOpen(true)}
                                        className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 shrink-0 cursor-pointer"
                                    >
                                        <Focus className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Recenter & Resize</span>
                                    </button>
                                </div>
                            )}

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
                                <span>{processing ? 'Saving Changes...' : 'Update Member Record'}</span>
                            </button>
                        </div>
                    </form>
                </div>

            </div>

            <CommitteePhotoAdjustModal
                isOpen={isAdjustModalOpen}
                onClose={() => setIsAdjustModalOpen(false)}
                member={currentMember}
                onSaveSuccess={(updated) => {
                    setCurrentMember(updated);
                }}
            />
        </AuthenticatedLayout>
    );
}
