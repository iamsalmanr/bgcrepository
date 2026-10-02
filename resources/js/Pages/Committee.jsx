import React, { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, usePage } from '@inertiajs/react';
import { User, Focus, Check, Edit3 } from 'lucide-react';
import CommitteePhotoAdjustModal from '@/Components/CommitteePhotoAdjustModal';

export default function Committee({ committeeName, members }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin' || auth?.user?.role === 'super_admin';

    const [memberList, setMemberList] = useState(members || []);
    const [selectedMemberForAdjust, setSelectedMemberForAdjust] = useState(null);
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        setMemberList(members || []);
    }, [members]);

    const handleOpenAdjust = (member) => {
        setSelectedMemberForAdjust(member);
        setIsAdjustModalOpen(true);
    };

    const handleSaveSuccess = (updatedMember) => {
        setMemberList(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
        setToastMessage(`Photo framing saved for ${updatedMember.name}!`);
        setTimeout(() => setToastMessage(null), 4000);
    };

    return (
        <PublicLayout>
            <Head title={`${committeeName} - Bogura Golf Club`} />

            {/* Page Header */}
            <div className="bg-military-800 py-10 md:py-16 shrink-0">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'serif' }}>{committeeName}</h1>
                    <p className="text-military-200 max-w-2xl mx-auto text-lg">Meet the dedicated members driving the club forward.</p>
                </div>
            </div>

            {/* Main Content Wrapper */}
            <div className="bg-slate-100 flex-1 flex flex-col w-full">
                {/* Main Content */}
                <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
                    
                    {/* Admin Mode Floating Helper Banner */}
                    {isAdmin && (
                        <div className="mb-10 w-full max-w-4xl mx-auto p-4 rounded-3xl bg-[#0c2417] text-white border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-300">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
                                    <Focus className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs sm:text-sm font-bold text-white">
                                        Admin Photo Positioning Active
                                    </p>
                                    <p className="text-[11px] text-emerald-200/80 font-normal">
                                        Click <span className="text-emerald-300 font-semibold underline decoration-emerald-400">"Recenter / Resize"</span> on any member card below to reposition and zoom their photo.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <a
                                    href={route('committee-members.index')}
                                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
                                >
                                    Admin Dashboard →
                                </a>
                            </div>
                        </div>
                    )}

                    {memberList && memberList.length > 0 ? (
                        <div className="flex flex-col items-center space-y-12">
                            {/* Group members by designation while maintaining sorted order */}
                            {(() => {
                                const grouped = [];
                                let currentGroup = null;
                                memberList.forEach(member => {
                                    if (!currentGroup || currentGroup.designation !== member.designation) {
                                        currentGroup = { designation: member.designation, items: [] };
                                        grouped.push(currentGroup);
                                    }
                                    currentGroup.items.push(member);
                                });

                                return grouped.map((group, groupIdx) => (
                                    <div key={groupIdx} className="w-full flex flex-col items-center relative">
                                        
                                        {/* Connector Line from previous level */}
                                        {groupIdx > 0 && (
                                            <div className="h-8 w-px bg-military-300 absolute -top-10"></div>
                                        )}
                                        
                                        <div className="flex flex-wrap justify-center gap-6 md:gap-8 w-full max-w-7xl">
                                            {group.items.map((member) => (
                                                <div key={member.id} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.33rem)] lg:w-[calc(25%-1.5rem)] max-w-[280px] bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col group relative z-10">
                                                    
                                                    {/* Card Image Container */}
                                                    <div className="relative pt-[100%] bg-military-50 overflow-hidden">
                                                        {member.image_path ? (
                                                            <div 
                                                                className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105"
                                                                style={{
                                                                    transformOrigin: member.image_position || '50% 50%'
                                                                }}
                                                            >
                                                                <img 
                                                                    src={`/storage/${member.image_path}`} 
                                                                    alt={member.name} 
                                                                    style={{
                                                                        objectPosition: member.image_position || '50% 50%',
                                                                        transform: `scale(${member.image_scale ? member.image_scale / 100 : 1})`,
                                                                        transformOrigin: member.image_position || '50% 50%',
                                                                    }}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-military-300 group-hover:bg-military-100 transition-colors duration-500">
                                                                <User className="w-20 h-20 mb-2 opacity-50" />
                                                            </div>
                                                        )}
                                                        
                                                        {/* Dark vignette gradient */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-military-900/80 via-transparent to-transparent opacity-60 pointer-events-none"></div>

                                                        {/* ── Admin Instant Positioning & Editing Actions ── */}
                                                        {isAdmin && (
                                                            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                                                                {member.image_path ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            handleOpenAdjust(member);
                                                                        }}
                                                                        className="px-2.5 py-1.5 rounded-xl bg-black/75 hover:bg-[#0c2417] text-white text-[11px] font-bold tracking-tight shadow-md backdrop-blur-md border border-white/30 hover:border-emerald-400 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                                                                        title="Recenter or resize this photo"
                                                                    >
                                                                        <Focus className="w-3.5 h-3.5 text-emerald-400" />
                                                                        <span>Recenter / Resize</span>
                                                                    </button>
                                                                ) : (
                                                                    <a
                                                                        href={route('committee-members.edit', member.id)}
                                                                        className="px-2.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold shadow-md border border-emerald-600 transition-all flex items-center gap-1 active:scale-95"
                                                                        title="Upload a photo for this member"
                                                                    >
                                                                        <Edit3 className="w-3.5 h-3.5" />
                                                                        <span>+ Add Photo</span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Card Content */}
                                                    <div className="p-6 flex flex-col items-center text-center relative flex-grow">
                                                        <div className="w-10 h-1 bg-military-500 rounded-full mb-4"></div>
                                                        <h3 className="text-lg md:text-xl font-bold text-military-900 mb-1 leading-tight">{member.name}</h3>
                                                        <p className="text-military-600 font-semibold text-xs md:text-sm uppercase tracking-wider mt-auto pt-4">{member.designation || 'Member'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-16 text-center flex flex-col items-center max-w-3xl mx-auto mt-8">
                            <div className="w-20 h-20 bg-military-50 rounded-full flex items-center justify-center mb-6">
                                <User className="w-10 h-10 text-military-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-military-900 mb-3" style={{ fontFamily: 'serif' }}>No Members Found</h3>
                            <p className="text-slate-500 text-lg">There are currently no members assigned to the {committeeName}. Please check back later.</p>
                        </div>
                    )}
                </main>
            </div>

            {/* ── Interactive Photo Recenter & Resize Modal ── */}
            <CommitteePhotoAdjustModal
                isOpen={isAdjustModalOpen}
                onClose={() => setIsAdjustModalOpen(false)}
                member={selectedMemberForAdjust}
                onSaveSuccess={handleSaveSuccess}
            />

            {/* ── Success Toast Feedback ── */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#0c2417] text-white shadow-2xl border border-emerald-500/50 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold">{toastMessage}</span>
                </div>
            )}
        </PublicLayout>
    );
}
