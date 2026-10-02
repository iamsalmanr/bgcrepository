import React, { useState, useEffect, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Search, 
    User, 
    GripVertical, 
    Users, 
    ShieldCheck, 
    Sparkles, 
    Award, 
    Briefcase, 
    Building2, 
    Layers, 
    CheckCircle2, 
    LayoutGrid, 
    Table as TableIcon,
    ArrowUpDown,
    Filter,
    X,
    Check,
    Globe,
    Eye,
    EyeOff,
    Settings2,
    MoveUp,
    MoveDown,
    AlertCircle,
    Loader2
} from 'lucide-react';

export default function Index({ members = [], committees = [], filters = {} }) {
    const { delete: destroy } = useForm();
    const [localMembers, setLocalMembers] = useState(members);
    const [localCommittees, setLocalCommittees] = useState(committees);
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);
    const [committeeFilter, setCommitteeFilter] = useState(filters?.committee || 'All');
    const [searchQuery, setSearchQuery] = useState('');
    const [designationFilter, setDesignationFilter] = useState('All');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    // Modal state for Committee Management
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [newCommitteeName, setNewCommitteeName] = useState('');
    const [newCommitteeInNavbar, setNewCommitteeInNavbar] = useState(true);
    const [editingCommitteeId, setEditingCommitteeId] = useState(null);
    const [editingCommitteeName, setEditingCommitteeName] = useState('');
    const [editingCommitteeNavbar, setEditingCommitteeNavbar] = useState(true);
    const [isSubmittingCommittee, setIsSubmittingCommittee] = useState(false);
    const [togglingCommitteeId, setTogglingCommitteeId] = useState(null);

    useEffect(() => {
        setLocalMembers(members);
    }, [members]);

    useEffect(() => {
        setLocalCommittees(committees);
    }, [committees]);

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.015em'
    };

    // Filter members based on committee, search query, and designation
    const filteredMembers = useMemo(() => {
        return localMembers.filter(member => {
            const matchesCommittee = 
                committeeFilter === 'All' || 
                committeeFilter === '' || 
                member.committee === committeeFilter;

            const matchesSearch = 
                (member.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (member.committee || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (member.designation || '').toLowerCase().includes(searchQuery.toLowerCase());

            let matchesDesignation = true;
            if (designationFilter === 'Chairman') {
                matchesDesignation = (member.designation || '').toLowerCase().includes('chair') || (member.designation || '').toLowerCase().includes('president');
            } else if (designationFilter === 'Secretary') {
                matchesDesignation = (member.designation || '').toLowerCase().includes('secretary') || (member.designation || '').toLowerCase().includes('convener');
            } else if (designationFilter === 'Member') {
                matchesDesignation = !(member.designation || '').toLowerCase().includes('chair') && !(member.designation || '').toLowerCase().includes('secretary');
            }

            return matchesCommittee && matchesSearch && matchesDesignation;
        });
    }, [localMembers, committeeFilter, searchQuery, designationFilter]);

    // Drag-and-drop ordering handlers for members
    const onDragStart = (e, index) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.parentNode);
    };

    const onDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        if (draggedItemIndex === null || draggedItemIndex === index) return;
        
        const newMembers = [...localMembers];
        const draggedMember = newMembers[draggedItemIndex];
        
        // Remove from old position and insert at new
        newMembers.splice(draggedItemIndex, 1);
        newMembers.splice(index, 0, draggedMember);
        
        setDraggedItemIndex(index);
        setLocalMembers(newMembers);
    };

    const onDragEnd = () => {
        setDraggedItemIndex(null);
        
        // Update sort order values and persist
        const updatedMembers = localMembers.map((m, i) => ({ ...m, sort_order: i }));
        setLocalMembers(updatedMembers);
        
        router.post(route('committee-members.reorder'), {
            members: updatedMembers.map(m => ({ id: m.id, sort_order: m.sort_order }))
        }, { preserveScroll: true });
    };

    const handleDeleteMember = (id, name) => {
        if (confirm(`Are you sure you want to remove ${name} from the committee?`)) {
            destroy(route('committee-members.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    setLocalMembers(localMembers.filter(m => m.id !== id));
                }
            });
        }
    };

    // Committee Management Handlers
    const handleCreateCommittee = (e) => {
        e.preventDefault();
        if (!newCommitteeName.trim()) return;

        setIsSubmittingCommittee(true);
        router.post(route('committees.store'), {
            name: newCommitteeName.trim(),
            show_in_navbar: newCommitteeInNavbar,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewCommitteeName('');
                setNewCommitteeInNavbar(true);
                setIsSubmittingCommittee(false);
            },
            onError: () => {
                setIsSubmittingCommittee(false);
            }
        });
    };

    const handleStartEditCommittee = (committee) => {
        setEditingCommitteeId(committee.id);
        setEditingCommitteeName(committee.name);
        setEditingCommitteeNavbar(committee.show_in_navbar);
    };

    const handleCancelEditCommittee = () => {
        setEditingCommitteeId(null);
        setEditingCommitteeName('');
    };

    const handleSaveEditCommittee = (committeeId) => {
        if (!editingCommitteeName.trim()) return;

        setIsSubmittingCommittee(true);
        router.put(route('committees.update', committeeId), {
            name: editingCommitteeName.trim(),
            show_in_navbar: editingCommitteeNavbar,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingCommitteeId(null);
                setEditingCommitteeName('');
                setIsSubmittingCommittee(false);
            },
            onError: () => {
                setIsSubmittingCommittee(false);
            }
        });
    };

    const handleToggleNavbar = (committee) => {
        setTogglingCommitteeId(committee.id);
        
        // Optimistic UI update
        setLocalCommittees(prev => prev.map(c => 
            c.id === committee.id ? { ...c, show_in_navbar: !c.show_in_navbar } : c
        ));

        router.post(route('committees.toggle-navbar', committee.id), {}, {
            preserveScroll: true,
            onFinish: () => {
                setTogglingCommitteeId(null);
            }
        });
    };

    const handleDeleteCommittee = (committee) => {
        const memberCount = localMembers.filter(m => m.committee === committee.name).length;
        let confirmMsg = `Are you sure you want to delete the committee "${committee.name}"?`;
        if (memberCount > 0) {
            confirmMsg = `The committee "${committee.name}" currently has ${memberCount} member(s).\n\nAre you sure you want to delete this committee from governance and the navbar?`;
        }

        if (confirm(confirmMsg)) {
            router.delete(route('committees.destroy', committee.id), {
                preserveScroll: true,
                onSuccess: () => {
                    if (committeeFilter === committee.name) {
                        setCommitteeFilter('All');
                    }
                }
            });
        }
    };

    const handleMoveCommittee = (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= localCommittees.length) return;

        const updated = [...localCommittees];
        const [moved] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, moved);

        const reordered = updated.map((c, idx) => ({ ...c, sort_order: idx + 1 }));
        setLocalCommittees(reordered);

        router.post(route('committees.reorder'), {
            committees: reordered.map(c => ({ id: c.id, sort_order: c.sort_order }))
        }, { preserveScroll: true });
    };

    // Helper to parse name and appointment if comma-separated
    const parseMemberDetails = (fullName = '') => {
        const parts = fullName.split(',');
        if (parts.length <= 1) {
            return { primaryName: fullName, subDetails: null };
        }
        const primaryName = parts[0].trim();
        const subDetails = parts.slice(1).join(',').trim();
        return { primaryName, subDetails };
    };

    // Helper for designation badge styling
    const renderDesignationBadge = (designation) => {
        const d = (designation || '').toLowerCase();
        if (d.includes('chair') || d.includes('president')) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/80 shadow-xs">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>{designation || 'Chairman'}</span>
                </span>
            );
        }
        if (d.includes('secretary') || d.includes('convener')) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200/80 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>{designation}</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                {designation || 'Member'}
            </span>
        );
    };

    return (
        <AuthenticatedLayout header="Manage Committee Members">
            <Head title="Committee Members & Governance Management" />

            <div className="space-y-6 max-w-7xl mx-auto pb-12">
                
                {/* ── 1. TOP STATS & ACTIONS BANNER ── */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                                <Users className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Club Governance</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                <Building2 className="w-3 h-3 text-slate-500" />
                                <span>{localCommittees.length} Committee Boards</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                                <ArrowUpDown className="w-3 h-3 text-slate-500" />
                                <span>Drag to Reorder</span>
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={appleStyle}>
                            Executive Committee & Governance
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                            Manage club governance boards, committee titles, navbar dropdown visibility, member assignments, and presentation ordering.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0">
                        {/* Manage Committees Button */}
                        <button
                            type="button"
                            onClick={() => setIsManageModalOpen(true)}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-300/80 shadow-xs hover:shadow-sm transition-all active:scale-95"
                        >
                            <Settings2 className="w-4 h-4 text-emerald-800" />
                            <span>Manage Committees</span>
                        </button>

                        {/* Add New Member Button */}
                        <Link
                            href={route('committee-members.create')}
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#0c2417] hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4 text-emerald-300" />
                            <span>Add New Member</span>
                        </Link>
                    </div>
                </div>

                {/* ── 2. FILTER & SEARCH TOOLBAR ── */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                        
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-lg">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by member name, rank, or appointment..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-600 transition-all"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 uppercase"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Dropdown Committee Filter & View Toggle */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Filter className="w-3.5 h-3.5 text-slate-400" />
                                <select
                                    value={committeeFilter}
                                    onChange={(e) => setCommitteeFilter(e.target.value)}
                                    className="rounded-xl border-slate-200 bg-slate-50 py-2 pl-3 pr-8 text-xs font-bold text-slate-700 uppercase tracking-wider focus:border-emerald-600 focus:ring-emerald-600"
                                >
                                    <option value="All">All Committees ({localMembers.length})</option>
                                    {localCommittees.map(c => {
                                        const cName = typeof c === 'object' ? c.name : c;
                                        const count = localMembers.filter(m => m.committee === cName).length;
                                        return (
                                            <option key={cName} value={cName}>{cName} ({count})</option>
                                        );
                                    })}
                                </select>
                            </div>

                            {/* View Switcher */}
                            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-400 hover:text-slate-700'}`}
                                    title="Structured Table View"
                                    aria-label="Table View"
                                >
                                    <TableIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-400 hover:text-slate-700'}`}
                                    title="Grid Cards View"
                                    aria-label="Grid View"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Committee Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide pt-1 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Quick Select:</span>
                        <button
                            onClick={() => setCommitteeFilter('All')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                                committeeFilter === 'All'
                                    ? 'bg-[#0c2417] text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            All ({localMembers.length})
                        </button>
                        {localCommittees.map((c) => {
                            const cName = typeof c === 'object' ? c.name : c;
                            const count = localMembers.filter(m => m.committee === cName).length;
                            const inNavbar = typeof c === 'object' ? c.show_in_navbar : true;

                            return (
                                <button
                                    key={cName}
                                    onClick={() => setCommitteeFilter(cName)}
                                    className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                        committeeFilter === cName
                                            ? 'bg-[#0c2417] text-white shadow-xs'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {inNavbar && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Visible in Navbar"></span>
                                    )}
                                    <span>{cName} ({count})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── 3. MAIN MEMBERS LIST: TABLE OR GRID VIEW ── */}
                {viewMode === 'table' ? (
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                        <th className="py-3.5 px-4 w-16 text-center">Sort</th>
                                        <th className="py-3.5 px-4">Member Name & Details</th>
                                        <th className="py-3.5 px-4">Committee</th>
                                        <th className="py-3.5 px-4">Designation</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                                    {filteredMembers.length > 0 ? (
                                        filteredMembers.map((member, index) => {
                                            const { primaryName, subDetails } = parseMemberDetails(member.name);
                                            return (
                                                <tr
                                                    key={member.id}
                                                    draggable
                                                    onDragStart={(e) => onDragStart(e, index)}
                                                    onDragOver={(e) => onDragOver(e, index)}
                                                    onDragEnd={onDragEnd}
                                                    className="hover:bg-slate-50/80 transition-colors group cursor-move"
                                                >
                                                    {/* Sort Handle & Order */}
                                                    <td className="py-3 px-4 text-center">
                                                        <div className="flex items-center justify-center gap-1 text-slate-400 group-hover:text-slate-700">
                                                            <GripVertical className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                                                            <span className="text-[10px] font-mono font-bold text-slate-400">#{index + 1}</span>
                                                        </div>
                                                    </td>

                                                    {/* Member Portrait & Name Details */}
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            {member.image_path ? (
                                                                <img
                                                                    src={`/storage/${member.image_path}`}
                                                                    alt={member.name}
                                                                    style={{
                                                                        objectPosition: member.image_position || '50% 50%',
                                                                        transform: `scale(${member.image_scale ? member.image_scale / 100 : 1})`,
                                                                        transformOrigin: member.image_position || '50% 50%',
                                                                    }}
                                                                    className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 font-extrabold flex items-center justify-center text-xs border border-emerald-200 shrink-0">
                                                                    {primaryName.charAt(0)}
                                                                </div>
                                                            )}
                                                            <div className="min-w-0">
                                                                <p className="font-extrabold text-slate-900 leading-snug">
                                                                    {primaryName}
                                                                </p>
                                                                {subDetails && (
                                                                    <p className="text-[11px] text-slate-500 font-medium truncate max-w-md">
                                                                        {subDetails}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Committee */}
                                                    <td className="py-3 px-4">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200/60">
                                                            <Layers className="w-3 h-3 text-emerald-700" />
                                                            <span>{member.committee}</span>
                                                        </span>
                                                    </td>

                                                    {/* Designation Badge */}
                                                    <td className="py-3 px-4">
                                                        {renderDesignationBadge(member.designation)}
                                                    </td>

                                                    {/* Action Buttons */}
                                                    <td className="py-3 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Link
                                                                href={route('committee-members.edit', member.id)}
                                                                className="p-2 rounded-xl text-slate-400 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                                                                title="Edit Member"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDeleteMember(member.id, member.name)}
                                                                className="p-2 rounded-xl text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                                                                title="Delete Member"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-slate-400">
                                                <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                                                <p className="text-sm font-semibold">No committee members found.</p>
                                                <p className="text-xs text-slate-400 mt-0.5">Try adjusting your search query or committee filters.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Grid Cards View */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredMembers.map((member) => {
                            const { primaryName, subDetails } = parseMemberDetails(member.name);
                            return (
                                <div 
                                    key={member.id}
                                    className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 text-[11px] font-bold border border-emerald-200/60">
                                                {member.committee}
                                            </span>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={route('committee-members.edit', member.id)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-800 hover:bg-emerald-50"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteMember(member.id, member.name)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {member.image_path ? (
                                                <img
                                                    src={`/storage/${member.image_path}`}
                                                    alt={member.name}
                                                    style={{
                                                        objectPosition: member.image_position || '50% 50%',
                                                        transform: `scale(${member.image_scale ? member.image_scale / 100 : 1})`,
                                                        transformOrigin: member.image_position || '50% 50%',
                                                    }}
                                                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 font-black text-lg flex items-center justify-center border border-emerald-200 shrink-0">
                                                    {primaryName.charAt(0)}
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                                                    {primaryName}
                                                </h3>
                                                {subDetails && (
                                                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                                        {subDetails}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                                        {renderDesignationBadge(member.designation)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── 4. MANAGE COMMITTEES & NAVBAR VISIBILITY MODAL ── */}
                {isManageModalOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                            
                            {/* Modal Header */}
                            <div className="p-6 sm:p-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-900">
                                            <Layers className="w-4 h-4" />
                                        </span>
                                        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight" style={appleStyle}>
                                            Manage Governance Committees
                                        </h3>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Add, rename, or delete committee names and toggle their public navbar display.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsManageModalOpen(false)}
                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Modal Body with Scroll */}
                            <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
                                
                                {/* ── A. ADD NEW COMMITTEE FORM ── */}
                                <form onSubmit={handleCreateCommittee} className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                        <Plus className="w-4 h-4 text-emerald-700" />
                                        <span>Add New Committee Board</span>
                                    </h4>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="text"
                                            value={newCommitteeName}
                                            onChange={(e) => setNewCommitteeName(e.target.value)}
                                            placeholder="e.g. Golf Development & Greens Committee"
                                            className="flex-1 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-600"
                                            required
                                        />

                                        {/* Show in Navbar Toggle Switch */}
                                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shrink-0">
                                            <span className="text-xs font-semibold text-slate-700">Navbar</span>
                                            <button
                                                type="button"
                                                onClick={() => setNewCommitteeInNavbar(!newCommitteeInNavbar)}
                                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                    newCommitteeInNavbar ? 'bg-emerald-600' : 'bg-slate-300'
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                                        newCommitteeInNavbar ? 'translate-x-4' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmittingCommittee || !newCommitteeName.trim()}
                                            className="px-4 py-2.5 bg-[#0c2417] hover:bg-emerald-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                                        >
                                            {isSubmittingCommittee ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 text-emerald-300" />}
                                            <span>Add Board</span>
                                        </button>
                                    </div>
                                </form>

                                {/* ── B. EXISTING COMMITTEES LIST ── */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Active Committee Boards ({localCommittees.length})
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-medium">
                                            Toggle "Navbar" to show/hide in About Us menu
                                        </span>
                                    </div>

                                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                                        {localCommittees.map((committee, idx) => {
                                            const isEditing = editingCommitteeId === committee.id;
                                            const memberCount = localMembers.filter(m => m.committee === committee.name).length;
                                            const isToggling = togglingCommitteeId === committee.id;

                                            return (
                                                <div 
                                                    key={committee.id || committee.name}
                                                    className={`p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                                                        committee.show_in_navbar ? 'bg-white' : 'bg-slate-50/60'
                                                    }`}
                                                >
                                                    {/* Left: Reorder Arrows & Name/Edit */}
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        {/* Up/Down Reorder */}
                                                        <div className="flex flex-col gap-0.5 shrink-0 text-slate-400">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleMoveCommittee(idx, -1)}
                                                                disabled={idx === 0}
                                                                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                                                                title="Move Up"
                                                            >
                                                                <MoveUp className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleMoveCommittee(idx, 1)}
                                                                disabled={idx === localCommittees.length - 1}
                                                                className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                                                                title="Move Down"
                                                            >
                                                                <MoveDown className="w-3 h-3" />
                                                            </button>
                                                        </div>

                                                        {isEditing ? (
                                                            <div className="flex-1 flex items-center gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={editingCommitteeName}
                                                                    onChange={(e) => setEditingCommitteeName(e.target.value)}
                                                                    className="flex-1 rounded-xl border border-emerald-500 bg-white text-xs sm:text-sm font-bold text-slate-900 py-1.5 px-3 focus:outline-none"
                                                                    autoFocus
                                                                />
                                                                <button
                                                                    onClick={() => handleSaveEditCommittee(committee.id)}
                                                                    className="p-2 bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 text-xs"
                                                                    title="Save"
                                                                >
                                                                    <Check className="w-3.5 h-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={handleCancelEditCommittee}
                                                                    className="p-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 text-xs"
                                                                    title="Cancel"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug truncate">
                                                                        {committee.name}
                                                                    </span>
                                                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold shrink-0">
                                                                        {memberCount} members
                                                                    </span>
                                                                </div>
                                                                <span className="text-[11px] text-slate-400 font-mono block truncate">
                                                                    /{committee.slug || committee.name.toLowerCase().replace(/\s+/g, '-')}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Right: Navbar Toggle & Actions */}
                                                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                                                        
                                                        {/* Navbar Visibility Toggle */}
                                                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80">
                                                            {committee.show_in_navbar ? (
                                                                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                                                            ) : (
                                                                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                                                            )}
                                                            <span className="text-[11px] font-bold text-slate-700">
                                                                {committee.show_in_navbar ? 'In Navbar' : 'Hidden'}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleToggleNavbar(committee)}
                                                                disabled={isToggling}
                                                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                                    committee.show_in_navbar ? 'bg-emerald-600' : 'bg-slate-300'
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                                                        committee.show_in_navbar ? 'translate-x-4' : 'translate-x-0'
                                                                    }`}
                                                                />
                                                            </button>
                                                        </div>

                                                        {/* Edit Button */}
                                                        {!isEditing && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleStartEditCommittee(committee)}
                                                                className="p-2 rounded-xl text-slate-400 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                                                                title="Rename Committee"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}

                                                        {/* Delete Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteCommittee(committee)}
                                                            className="p-2 rounded-xl text-slate-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                                                            title="Delete Committee"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Navbar updates sync automatically to top bar and mobile navigation.</span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsManageModalOpen(false)}
                                    className="px-5 py-2.5 bg-[#0c2417] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-950 transition-colors"
                                >
                                    Done
                                </button>
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
