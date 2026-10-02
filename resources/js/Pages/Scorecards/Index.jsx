import React, { useState, useMemo, useRef, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { 
    Trophy, 
    Plus, 
    Search, 
    Calendar, 
    User, 
    Check, 
    X, 
    Pencil, 
    Trash2, 
    Printer, 
    Eye, 
    Award, 
    Activity, 
    Sparkles, 
    FileSpreadsheet, 
    CheckCircle2, 
    ArrowUpRight, 
    Flag, 
    Layers, 
    UserCheck,
    Hash,
    Clock,
    ChevronRight,
    ChevronDown,
    MapPin,
    SlidersHorizontal,
    LayoutGrid,
    List,
    ShieldCheck,
    CheckSquare,
    RotateCcw,
    Lock,
    AlertCircle,
    Info
} from 'lucide-react';
import InputError from '@/Components/InputError';

const BGC_HOLES_R1 = [
    { hole: 1, par: 4, strokeIndex: 9, menYards: 274, ladiesYards: 243 },
    { hole: 2, par: 5, strokeIndex: 3, menYards: 564, ladiesYards: 532 },
    { hole: 3, par: 4, strokeIndex: 7, menYards: 338, ladiesYards: 304 },
    { hole: 4, par: 4, strokeIndex: 8, menYards: 355, ladiesYards: 335 },
    { hole: 5, par: 5, strokeIndex: 4, menYards: 557, ladiesYards: 518 },
    { hole: 6, par: 3, strokeIndex: 6, menYards: 181, ladiesYards: 146 },
    { hole: 7, par: 4, strokeIndex: 1, menYards: 433, ladiesYards: 345 },
    { hole: 8, par: 4, strokeIndex: 5, menYards: 343, ladiesYards: 301 },
    { hole: 9, par: 3, strokeIndex: 2, menYards: 177, ladiesYards: 127 },
];

const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return 'N/A';
    const cleanStr = String(dateStr).substring(0, 10);
    const parts = cleanStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const BGC_HOLES_R2 = [
    { hole: 1, label: '1', par: 4, strokeIndex: 9, menYards: 274, ladiesYards: 243 },
    { hole: 2, label: '2', par: 5, strokeIndex: 3, menYards: 564, ladiesYards: 532 },
    { hole: 3, label: '3', par: 4, strokeIndex: 7, menYards: 338, ladiesYards: 304 },
    { hole: 4, label: '4', par: 4, strokeIndex: 8, menYards: 355, ladiesYards: 335 },
    { hole: 5, label: '5', par: 5, strokeIndex: 4, menYards: 557, ladiesYards: 518 },
    { hole: 6, label: '6', par: 3, strokeIndex: 6, menYards: 181, ladiesYards: 146 },
    { hole: 7, label: '7', par: 4, strokeIndex: 1, menYards: 433, ladiesYards: 345 },
    { hole: 8, label: '8', par: 4, strokeIndex: 5, menYards: 343, ladiesYards: 301 },
    { hole: 9, label: '9', par: 3, strokeIndex: 2, menYards: 177, ladiesYards: 127 },
];

const BGC_TOTALS = { par: 36, menYards: 3222, ladiesYards: 2851 };

const resolveProfileImageUrl = (path) => {
    if (!path) return null;
    const str = String(path).trim();
    if (!str) return null;
    if (str.startsWith('http://') || str.startsWith('https://')) return str;
    if (str.startsWith('/storage/')) return str;
    if (str.startsWith('storage/')) return `/${str}`;
    if (str.startsWith('/')) return str;
    return `/storage/${str}`;
};

export default function Index({ 
    scorecards, 
    stats = {}, 
    members = [], 
    tournaments = [], 
    filters = {}, 
    isMember = false,
    isAdmin = false
}) {
    const authUser = usePage().props.auth.user;
    const { flash } = usePage().props;

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedTournament, setSelectedTournament] = useState(filters.tournament_id || '');
    const [selectedRoundType, setSelectedRoundType] = useState(filters.round_type || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [activeTab, setActiveTab] = useState(filters.view || (isMember ? 'my' : 'all'));
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'danger',
        onConfirm: () => {},
    });

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingScorecard, setEditingScorecard] = useState(null);
    const [viewingScorecard, setViewingScorecard] = useState(null);

    // Searchable Member Selector States
    const [memberSearchQuery, setMemberSearchQuery] = useState('');
    const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
    const memberDropdownRef = useRef(null);

    // Tournament Selector States
    const [tournamentSelectType, setTournamentSelectType] = useState('tournament'); // 'tournament' or 'custom'

    // Form Hook
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        user_id: '',
        player_name: '',
        member_id: '',
        competition: '',
        tournament_id: '',
        played_at: new Date().toISOString().substring(0, 10),
        tee_type: 'men',
        round_type: '9_holes',
        handicap: 0,
        scores_r1: [4, 5, 4, 4, 5, 3, 4, 4, 3], // Default to course par
        scores_r2: [4, 5, 4, 4, 5, 3, 4, 4, 3],
        marker_name: '',
        notes: '',
        status: 'approved',
    });

    // Active player profile image resolution (for modal strip)
    const activePlayerImage = useMemo(() => {
        if (data.user_id) {
            const found = members.find(m => String(m.id) === String(data.user_id));
            if (found?.profile_picture) return resolveProfileImageUrl(found.profile_picture);
            if (String(authUser?.id) === String(data.user_id) && authUser?.profile_picture) {
                return resolveProfileImageUrl(authUser.profile_picture);
            }
        }
        if (isMember && authUser?.profile_picture) {
            return resolveProfileImageUrl(authUser.profile_picture);
        }
        return null;
    }, [data.user_id, members, authUser, isMember]);

    // Close member dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (memberDropdownRef.current && !memberDropdownRef.current.contains(e.target)) {
                setIsMemberDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredMembers = useMemo(() => {
        if (!memberSearchQuery.trim()) return members;
        const q = memberSearchQuery.toLowerCase();
        return members.filter(m => 
            (m.name && m.name.toLowerCase().includes(q)) ||
            (m.member_id && m.member_id.toLowerCase().includes(q)) ||
            (m.email && m.email.toLowerCase().includes(q)) ||
            (m.rank_designation && m.rank_designation.toLowerCase().includes(q))
        );
    }, [members, memberSearchQuery]);

    const handleFilterSubmit = (search, tourId, rType, view, status) => {
        router.get(route('scorecards.index'), {
            search: search || undefined,
            tournament_id: tourId || undefined,
            round_type: rType === 'all' ? undefined : rType,
            view: view,
            status: status === 'all' ? undefined : status,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchChange = (val) => {
        setSearchQuery(val);
        handleFilterSubmit(val, selectedTournament, selectedRoundType, activeTab, selectedStatus);
    };

    const handleTournamentFilterChange = (val) => {
        setSelectedTournament(val);
        handleFilterSubmit(searchQuery, val, selectedRoundType, activeTab, selectedStatus);
    };

    const handleRoundTypeTab = (type) => {
        setSelectedRoundType(type);
        handleFilterSubmit(searchQuery, selectedTournament, type, activeTab, selectedStatus);
    };

    const handleStatusFilterChange = (status) => {
        setSelectedStatus(status);
        handleFilterSubmit(searchQuery, selectedTournament, selectedRoundType, activeTab, status);
    };

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        handleFilterSubmit(searchQuery, selectedTournament, selectedRoundType, tab, selectedStatus);
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditingScorecard(null);
        setMemberSearchQuery('');
        setTournamentSelectType('tournament');

        const defaultTournament = tournaments.length > 0 ? tournaments[0] : null;

        if (isMember) {
            setData({
                user_id: authUser.id,
                player_name: authUser.name,
                member_id: authUser.member_id || authUser.membership_number || '',
                competition: defaultTournament ? defaultTournament.title : 'Club Practice Round',
                tournament_id: defaultTournament ? defaultTournament.id : '',
                played_at: new Date().toISOString().substring(0, 10),
                tee_type: 'men',
                round_type: '9_holes',
                handicap: authUser.handicap !== undefined ? authUser.handicap : 0,
                scores_r1: [4, 5, 4, 4, 5, 3, 4, 4, 3],
                scores_r2: [4, 5, 4, 4, 5, 3, 4, 4, 3],
                marker_name: '',
                notes: '',
                status: 'pending',
            });
        } else {
            setData({
                user_id: '',
                player_name: '',
                member_id: '',
                competition: defaultTournament ? defaultTournament.title : 'President Cup Golf Tournament 2026',
                tournament_id: defaultTournament ? defaultTournament.id : '',
                played_at: new Date().toISOString().substring(0, 10),
                tee_type: 'men',
                round_type: '9_holes',
                handicap: 0,
                scores_r1: [4, 5, 4, 4, 5, 3, 4, 4, 3],
                scores_r2: [4, 5, 4, 4, 5, 3, 4, 4, 3],
                marker_name: '',
                notes: '',
                status: 'approved',
            });
        }
        setIsCreateModalOpen(true);
    };

    const openEditModal = (card) => {
        clearErrors();
        setEditingScorecard(card);
        setMemberSearchQuery('');
        if (card.tournament_id) {
            setTournamentSelectType('tournament');
        } else {
            setTournamentSelectType('custom');
        }
        setData({
            user_id: card.user_id || '',
            player_name: card.player_name || '',
            member_id: card.user_id ? (card.member_id || '') : '',
            competition: card.competition || '',
            tournament_id: card.tournament_id || '',
            played_at: card.played_at ? card.played_at.substring(0, 10) : new Date().toISOString().substring(0, 10),
            tee_type: card.tee_type || 'men',
            round_type: card.round_type || '9_holes',
            handicap: card.handicap || 0,
            scores_r1: Array.isArray(card.scores_r1) ? card.scores_r1 : [4, 5, 4, 4, 5, 3, 4, 4, 3],
            scores_r2: Array.isArray(card.scores_r2) ? card.scores_r2 : [4, 5, 4, 4, 5, 3, 4, 4, 3],
            marker_name: card.marker_name || '',
            notes: card.notes || '',
            status: card.status || 'pending',
        });
        setIsCreateModalOpen(true);
    };

    const handleSelectMember = (member) => {
        if (!member) {
            setData(prev => ({ ...prev, user_id: '', player_name: '', member_id: '' }));
        } else {
            const memberCode = member.member_id || member.membership_number || '';
            setData(prev => ({
                ...prev,
                user_id: member.id,
                player_name: member.name,
                member_id: memberCode,
                handicap: member.handicap !== undefined ? member.handicap : prev.handicap,
            }));
        }
        setIsMemberDropdownOpen(false);
    };

    const handleTournamentDropdownSelect = (e) => {
        const val = e.target.value;
        if (val === 'custom') {
            setTournamentSelectType('custom');
            setData(prev => ({ ...prev, tournament_id: '', competition: '' }));
        } else {
            setTournamentSelectType('tournament');
            const found = tournaments.find(t => String(t.id) === String(val));
            if (found) {
                setData(prev => ({
                    ...prev,
                    tournament_id: found.id,
                    competition: found.title,
                }));
            }
        }
    };

    const handleScoreChange = (round, index, val) => {
        if (val === '') {
            if (round === 1) {
                const newScores = [...data.scores_r1];
                newScores[index] = '';
                setData('scores_r1', newScores);
            } else {
                const newScores = [...(data.scores_r2 || [4, 5, 4, 4, 5, 3, 4, 4, 3])];
                newScores[index] = '';
                setData('scores_r2', newScores);
            }
            return;
        }
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) return;
        const clamped = Math.max(1, Math.min(25, parsed));
        if (round === 1) {
            const newScores = [...data.scores_r1];
            newScores[index] = clamped;
            setData('scores_r1', newScores);
        } else {
            const newScores = [...(data.scores_r2 || [4, 5, 4, 4, 5, 3, 4, 4, 3])];
            newScores[index] = clamped;
            setData('scores_r2', newScores);
        }
    };

    const fillParScores = (round) => {
        if (round === 1) {
            setData('scores_r1', [4, 5, 4, 4, 5, 3, 4, 4, 3]);
        } else {
            setData('scores_r2', [4, 5, 4, 4, 5, 3, 4, 4, 3]);
        }
    };

    // Calculate real-time gross & net
    const calculatedGrossR1 = useMemo(() => {
        return (data.scores_r1 || []).reduce((acc, curr) => acc + (parseInt(curr) || 0), 0);
    }, [data.scores_r1]);

    const calculatedGrossR2 = useMemo(() => {
        if (data.round_type !== '18_holes') return 0;
        return (data.scores_r2 || []).reduce((acc, curr) => acc + (parseInt(curr) || 0), 0);
    }, [data.scores_r2, data.round_type]);

    const calculatedTotalGross = useMemo(() => {
        return calculatedGrossR1 + calculatedGrossR2;
    }, [calculatedGrossR1, calculatedGrossR2]);

    const calculatedNet = useMemo(() => {
        const hcap = parseInt(data.handicap) || 0;
        return Math.max(0, calculatedTotalGross - hcap);
    }, [calculatedTotalGross, data.handicap]);

    const submitScorecard = (e) => {
        e.preventDefault();
        const finalR1 = (data.scores_r1 || []).map((s, idx) => (s === '' || isNaN(parseInt(s))) ? BGC_HOLES_R1[idx].par : parseInt(s));
        const finalR2 = data.round_type === '18_holes' 
            ? (data.scores_r2 || []).map((s, idx) => (s === '' || isNaN(parseInt(s))) ? BGC_HOLES_R2[idx].par : parseInt(s))
            : null;

        const payload = {
            ...data,
            scores_r1: finalR1,
            scores_r2: finalR2,
        };

        if (editingScorecard) {
            router.put(route('scorecards.update', editingScorecard.id), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    setEditingScorecard(null);
                },
            });
        } else {
            router.post(route('scorecards.store'), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                },
            });
        }
    };

    const handleApprove = (card) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Approve Official Scorecard',
            message: `Approve scorecard for "${card.player_name}" (${card.competition || card.played_at})? This will publish it to the official club records and player statistics.`,
            confirmText: 'Approve & Publish',
            cancelText: 'Cancel',
            type: 'success',
            onConfirm: () => {
                router.post(route('scorecards.approve', card.id), {}, {
                    preserveScroll: true,
                    onSuccess: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
                });
            }
        });
    };

    const handleReject = (card) => {
        const reason = prompt(`Enter rejection reason for "${card.player_name}" (optional):`, 'Unverified strokes or marker details');
        if (reason !== null) {
            router.post(route('scorecards.reject', card.id), { rejection_reason: reason }, { preserveScroll: true });
        }
    };

    const handleDelete = (card) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Scorecard',
            message: `Are you sure you want to permanently delete the scorecard for "${card.player_name}" (${card.competition || card.played_at})? This action cannot be undone.`,
            confirmText: 'Delete Scorecard',
            cancelText: 'Cancel',
            type: 'danger',
            onConfirm: () => {
                router.delete(route('scorecards.destroy', card.id), {
                    preserveScroll: true,
                    onSuccess: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
                });
            }
        });
    };

    const handleSeedSamples = () => {
        setConfirmDialog({
            isOpen: true,
            title: 'Load Authentic Match Samples',
            message: 'Seed authentic Bogura Golf Club scorecards from official club tournament matches into the system?',
            confirmText: 'Load Samples',
            cancelText: 'Cancel',
            type: 'info',
            onConfirm: () => {
                router.post(route('scorecards.seed'), {}, {
                    preserveScroll: true,
                    onSuccess: () => setConfirmDialog(prev => ({ ...prev, isOpen: false }))
                });
            }
        });
    };

    const getScoreBadge = (score, par) => {
        const diff = score - par;
        if (diff <= -2) return 'bg-amber-400 text-amber-950 font-black ring-2 ring-amber-500'; // Eagle
        if (diff === -1) return 'bg-[#1C2C1D] text-white font-bold ring-2 ring-[#D4E2D2]'; // Birdie
        if (diff === 0) return 'bg-slate-100 text-slate-800 font-semibold border border-slate-300'; // Par
        if (diff === 1) return 'bg-amber-100 text-amber-900 font-bold border border-amber-300'; // Bogey
        return 'bg-rose-100 text-rose-900 font-bold border border-rose-300'; // Double+
    };

    const scorecardList = scorecards?.data || [];

    return (
        <AuthenticatedLayout header="Scorecards & Round Tracker">
            <Head title="Bogura Golf Club - Digital Scorecards & Player Handicap Registry" />

            <style>{`
                @media print {
                    *, *::before, *::after {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    body, html {
                        background: #FAF9F5 !important;
                        color: #000000 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    nav, header, aside, .no-print, [role="dialog"], .fixed, .modal-backdrop {
                        display: none !important;
                    }
                    #printable-authentic-scorecard {
                        display: block !important;
                        position: static !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                        page-break-inside: avoid;
                    }
                    @page {
                        size: A4 landscape;
                        margin: 4mm 6mm 4mm 6mm;
                    }
                }
                @media screen {
                    #printable-authentic-scorecard {
                        display: none;
                    }
                }
            `}</style>

            <div className="bg-[#F8F9F8] min-h-screen text-slate-900 pb-16">
                <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 sm:space-y-7">
                    
                    {/* ── 1. FLASH SUCCESS/ERROR MESSAGES ── */}
                    {flash?.success && (
                        <div className="p-4 rounded-2xl bg-[#D4E2D2] border border-[#BFD4BD] text-[#1C2C1D] text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-5 h-5 text-[#2C442E] shrink-0" />
                                <span>{flash.success}</span>
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
                            <div className="flex items-center gap-2.5">
                                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                                <span>{flash.error}</span>
                            </div>
                        </div>
                    )}

                    {/* ── PENDING APPROVAL ALERTS ── */}
                    {isAdmin && (stats.pending_approvals > 0) && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                            <div className="flex items-center gap-2.5">
                                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                                <span>
                                    <strong>{stats.pending_approvals} scorecard(s)</strong> are awaiting administrative approval before appearing on official club records.
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleStatusFilterChange('pending')}
                                className="px-4 py-1.5 rounded-full bg-amber-800 text-white font-bold text-xs hover:bg-amber-900 transition-colors shrink-0"
                            >
                                Review Pending
                            </button>
                        </div>
                    )}

                    {isMember && (stats.my_pending > 0) && (
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-xs">
                            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                            <span>
                                You have <strong>{stats.my_pending} scorecard(s)</strong> submitted and awaiting club admin approval.
                            </span>
                        </div>
                    )}

                    {/* ── 2. HEADER BAR & ACTIONS ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div>
                            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                                {isMember ? 'My Scorecards & Round Log' : 'Club Scorecards & Rounds'}
                            </h1>
                            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 sm:mt-1 flex items-center gap-1.5 flex-wrap">
                                <span>Bogura Golf Club &bull; Match Registry</span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1 text-[#2B402C] font-bold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#3D5A3E]"></span>
                                    {isMember ? (stats.my_rounds || 0) : (stats.total_rounds || 0)} {isMember ? 'Personal Verified Rounds' : 'Total Club Rounds'}
                                </span>
                            </p>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            {isAdmin && (
                                <button
                                    type="button"
                                    onClick={handleSeedSamples}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-[11px] sm:text-xs uppercase tracking-wider border border-slate-200/80 shadow-xs transition-all flex items-center gap-1.5"
                                    title="Load Authentic Bogura Golf Club Scorecard Samples"
                                >
                                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Load Samples</span>
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-[#1C2C1D] hover:bg-[#2C442E] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
                            >
                                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>{isMember ? 'Submit Scorecard' : 'Record Scorecard'}</span>
                            </button>
                        </div>
                    </div>

                    {/* ── 3. EXECUTIVE MILITARY OLIVE BENTO STAT METRICS ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                        
                        {/* Metric 1 */}
                        <div className="bg-[#D4E2D2] rounded-xl sm:rounded-[22px] p-2.5 sm:p-4 border border-[#BFD4BD] flex flex-col justify-between shadow-xs">
                            <span className="text-[9px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block truncate">
                                {isMember ? 'My Logged Rounds' : 'Total Approved'}
                            </span>
                            <div className="mt-1 sm:mt-3">
                                <p className="text-lg sm:text-3xl font-black text-slate-900 font-display leading-tight">
                                    {isMember ? (stats.my_rounds || 0) : stats.total_rounds}
                                </p>
                                <span className="text-[9px] sm:text-[11px] font-semibold text-[#2B402C] mt-0.5 block truncate">
                                    {isMember ? (stats.my_pending > 0 ? `${stats.my_rounds} Approved (${stats.my_pending} Pending)` : 'Personal Matches') : 'Verified Club Rounds'}
                                </span>
                            </div>
                        </div>

                        {/* Metric 2 */}
                        <div className="bg-[#E2E6D5] rounded-xl sm:rounded-[22px] p-2.5 sm:p-4 border border-[#CCD3BD] flex flex-col justify-between shadow-xs">
                            <span className="text-[9px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block truncate">
                                {isMember ? 'My Best Gross' : 'Pending Review'}
                            </span>
                            <div className="mt-1 sm:mt-3">
                                <p className="text-lg sm:text-3xl font-black text-slate-900 font-display leading-tight">
                                    {isMember ? (stats.my_best || '--') : (stats.pending_approvals || 0)}
                                </p>
                                <span className="text-[9px] sm:text-[11px] font-semibold text-[#2B402C] mt-0.5 block truncate">
                                    {isMember ? 'Lowest Round Strokes' : 'Awaiting Approval'}
                                </span>
                            </div>
                        </div>

                        {/* Metric 3 */}
                        <div className="bg-[#DFE5D4] rounded-xl sm:rounded-[22px] p-2.5 sm:p-4 border border-[#CBD4BD] flex flex-col justify-between shadow-xs">
                            <span className="text-[9px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block truncate">
                                {isMember ? 'My Average Gross' : 'Course Avg Gross'}
                            </span>
                            <div className="mt-1 sm:mt-3">
                                <p className="text-lg sm:text-3xl font-black text-slate-900 font-display leading-tight">
                                    {isMember ? (stats.my_avg || '--') : stats.avg_gross}
                                </p>
                                <span className="text-[9px] sm:text-[11px] font-semibold text-[#2B402C] mt-0.5 block truncate">
                                    {isMember ? 'Stroke Average' : 'Overall Course Average'}
                                </span>
                            </div>
                        </div>

                        {/* Metric 4 */}
                        <div className="bg-[#D8DFD5] rounded-xl sm:rounded-[22px] p-2.5 sm:p-4 border border-[#C5CEC1] flex flex-col justify-between shadow-xs">
                            <span className="text-[9px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block truncate">
                                {isMember ? 'Lowest Net' : 'Club Record Gross'}
                            </span>
                            <div className="mt-1 sm:mt-3">
                                <p className="text-lg sm:text-3xl font-black text-slate-900 font-display leading-tight">
                                    {isMember ? (stats.my_lowest_net || '--') : (stats.best_gross || '--')}
                                </p>
                                <span className="text-[9px] sm:text-[11px] font-semibold text-[#2B402C] mt-0.5 block truncate">
                                    {isMember ? 'Gross − Handicap' : 'Course Record'}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* ── 4. TOOLBAR & FILTERS ── */}
                    <div className="bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Search player name, ID, or competition..."
                                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] shadow-xs transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => handleSearchChange('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Filter Tabs & Toggle */}
                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
                            
                            {/* Status Filter Selector (for Admin & Member) */}
                            <select
                                value={selectedStatus}
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
                                className="px-3.5 py-1.5 rounded-full bg-slate-100/80 border border-slate-200 text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]"
                            >
                                <option value="all">All Statuses</option>
                                <option value="approved">Approved Only</option>
                                <option value="pending">Pending Approval</option>
                                <option value="rejected">Rejected</option>
                            </select>

                            {/* Tournament Selector Filter */}
                            {tournaments.length > 0 && (
                                <select
                                    value={selectedTournament}
                                    onChange={(e) => handleTournamentFilterChange(e.target.value)}
                                    className="px-3.5 py-1.5 rounded-full bg-slate-100/80 border border-slate-200 text-xs font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]"
                                >
                                    <option value="">All Tournaments</option>
                                    {tournaments.map(t => (
                                        <option key={t.id} value={t.id}>{t.title}</option>
                                    ))}
                                </select>
                            )}

                            {/* Member View Switcher */}
                            {isMember && (
                                <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80">
                                    <button
                                        type="button"
                                        onClick={() => handleTabSwitch('my')}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                            activeTab === 'my' ? 'bg-[#1C2C1D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        My Rounds
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleTabSwitch('all')}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                            activeTab === 'all' ? 'bg-[#1C2C1D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        Club Records
                                    </button>
                                </div>
                            )}

                            {/* Format Filter */}
                            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80">
                                <button
                                    onClick={() => handleRoundTypeTab('all')}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        selectedRoundType === 'all' ? 'bg-[#1C2C1D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    All Holes
                                </button>
                                <button
                                    onClick={() => handleRoundTypeTab('9_holes')}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        selectedRoundType === '9_holes' ? 'bg-[#1C2C1D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    9-Holes
                                </button>
                                <button
                                    onClick={() => handleRoundTypeTab('18_holes')}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        selectedRoundType === '18_holes' ? 'bg-[#1C2C1D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    18-Holes
                                </button>
                            </div>

                            {/* Grid / Table Toggle */}
                            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-full transition-all ${
                                        viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                    title="Card Grid View"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('table')}
                                    className={`p-1.5 rounded-full transition-all ${
                                        viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                    title="Table View"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* ── 5. SCORECARD LISTING (GRID OR TABLE) ── */}
                    {scorecardList.length > 0 ? (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {scorecardList.map((card) => {
                                    const r1 = Array.isArray(card.scores_r1) ? card.scores_r1 : [];
                                    const r2 = Array.isArray(card.scores_r2) ? card.scores_r2 : [];
                                    const is18 = card.round_type === '18_holes';
                                    const isPending = card.status === 'pending';
                                    const isRejected = card.status === 'rejected';

                                    return (
                                        <div 
                                            key={card.id}
                                            className={`bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-6 border shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 sm:space-y-5 group ${
                                                isPending ? 'border-amber-300 bg-amber-50/20' : isRejected ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200/80'
                                            }`}
                                        >
                                            <div className="space-y-3 sm:space-y-4">
                                                {/* Card Header: Player, Status & Competition */}
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div className="w-8 h-8 rounded-full bg-[#1C2C1D] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-slate-200/80 shadow-2xs">
                                                                {card.user?.profile_picture ? (
                                                                    <img 
                                                                        src={resolveProfileImageUrl(card.user.profile_picture)} 
                                                                        alt={card.player_name} 
                                                                        className="w-full h-full object-cover" 
                                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                                    />
                                                                ) : (
                                                                    <span>{card.player_name?.charAt(0)?.toUpperCase() || 'P'}</span>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-1.5 min-w-0">
                                                                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base font-display group-hover:text-[#1C2C1D] transition-colors truncate">
                                                                        {card.player_name}
                                                                    </h3>
                                                                    {card.user_id && card.member_id && (
                                                                        <span className="px-2 py-0.5 rounded-full bg-[#D4E2D2] text-[#1C2C1D] text-[10px] font-mono font-bold whitespace-nowrap shrink-0 border border-[#BFD4BD]">
                                                                            {card.member_id}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            {/* Status Badge */}
                                                            {card.status === 'pending' && (
                                                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase border border-amber-300 inline-flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" /> Pending Review
                                                                </span>
                                                            )}
                                                            {card.status === 'rejected' && (
                                                                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase border border-rose-300 inline-flex items-center gap-1" title={card.rejection_reason}>
                                                                    <X className="w-3 h-3" /> Rejected
                                                                </span>
                                                            )}
                                                            {card.status === 'approved' && (
                                                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-200 inline-flex items-center gap-1">
                                                                    <CheckCircle2 className="w-3 h-3" /> Approved
                                                                </span>
                                                            )}

                                                            <span className={`px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 border whitespace-nowrap ${
                                                                is18 ? 'bg-[#1C2C1D] text-white border-[#1C2C1D]' : 'bg-[#E2E6D5] text-[#2C442E] border-[#CCD3BD]'
                                                            }`}>
                                                                {is18 ? '18H' : '9H'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                                                        {card.competition || 'Club Match / Practice Round'}
                                                    </p>
                                                </div>

                                                {/* Mini Hole By Hole Breakdown Preview */}
                                                <div className="p-3 rounded-2xl bg-[#F8F9F8] border border-slate-200/80 space-y-2">
                                                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pb-1 border-b border-slate-200">
                                                        <span>First Round (Holes 1–9)</span>
                                                        <span className="font-black text-slate-900">R1 Gross: {card.gross_r1 || card.gross_total}</span>
                                                    </div>
                                                    <div className="grid grid-cols-9 gap-1 text-center">
                                                        {BGC_HOLES_R1.map((h, i) => (
                                                            <div key={h.hole} className="space-y-1">
                                                                <span className="text-[9px] font-bold text-slate-400 block">{h.hole}</span>
                                                                <span className={`w-6 h-6 mx-auto rounded-md flex items-center justify-center text-xs ${getScoreBadge(r1[i] || h.par, h.par)}`}>
                                                                    {r1[i] || '-'}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Second round preview if 18 holes */}
                                                    {is18 && r2.length > 0 && (
                                                        <>
                                                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 pt-2 pb-1 border-b border-slate-200">
                                                                <span>Second Round (Holes 10–18)</span>
                                                                <span className="font-black text-slate-900">R2 Gross: {card.gross_r2 || '-'}</span>
                                                            </div>
                                                            <div className="grid grid-cols-9 gap-1 text-center">
                                                                {BGC_HOLES_R2.map((h, i) => (
                                                                    <div key={h.hole} className="space-y-1">
                                                                        <span className="text-[9px] font-bold text-slate-400 block">{h.hole}</span>
                                                                        <span className={`w-6 h-6 mx-auto rounded-md flex items-center justify-center text-xs ${getScoreBadge(r2[i] || h.par, h.par)}`}>
                                                                            {r2[i] || '-'}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Summary Totals */}
                                                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                                                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                                                        <span className="text-[10px] uppercase font-bold text-slate-500 block">G. Total</span>
                                                        <span className="text-lg font-black text-slate-900 font-display">{card.gross_total}</span>
                                                    </div>
                                                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                                                        <span className="text-[10px] uppercase font-bold text-slate-500 block">H'cap</span>
                                                        <span className="text-lg font-black text-slate-900 font-display">{card.handicap || 0}</span>
                                                    </div>
                                                    <div className="p-2.5 rounded-xl bg-[#D4E2D2]/50 border border-[#BFD4BD]">
                                                        <span className="text-[10px] uppercase font-bold text-[#1C2C1D] block">Net Score</span>
                                                        <span className="text-lg font-black text-[#1C2C1D] font-display">{card.net_score}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span>{formatDateDDMMYYYY(card.played_at)}</span>
                                                    </span>
                                                    {card.marker_name && (
                                                        <span>Marker: {card.marker_name}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setViewingScorecard(card)}
                                                    className="text-xs font-bold text-[#1C2C1D] hover:text-[#2C442E] flex items-center gap-1 transition-colors"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>View Official Card</span>
                                                </button>

                                                <div className="flex items-center gap-1.5">
                                                    {/* Admin Quick Approve & Reject Buttons */}
                                                    {isAdmin && card.status === 'pending' && (
                                                        <>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleApprove(card)}
                                                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold inline-flex items-center gap-1 transition-colors shadow-2xs"
                                                                title="Approve Scorecard"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                                <span>Approve</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleReject(card)}
                                                                className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold inline-flex items-center gap-1 border border-rose-200 transition-colors"
                                                                title="Reject Scorecard"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                                <span>Reject</span>
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* Edit Button: Member can edit their own scorecard (submitting updates to pending review), Admin can edit any scorecard */}
                                                    {(isAdmin || authUser.id === card.user_id) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(card)}
                                                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                                            title={isMember ? "Update & Submit for Review" : "Edit Scorecard"}
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Delete Button: Admin or Member on pending */}
                                                    {(isAdmin || (authUser.id === card.user_id && card.status === 'pending')) && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(card)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                            title="Delete Scorecard"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Table View */
                            <div className="bg-white rounded-[24px] sm:rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#F8F9F8] border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                                                <th className="py-4 px-5">Date</th>
                                                <th className="py-4 px-5">Player Name</th>
                                                <th className="py-4 px-5">Member ID</th>
                                                <th className="py-4 px-5">Status</th>
                                                <th className="py-4 px-5">Competition</th>
                                                <th className="py-4 px-5 text-center">Format</th>
                                                <th className="py-4 px-5 text-center">R1</th>
                                                <th className="py-4 px-5 text-center">R2</th>
                                                <th className="py-4 px-5 text-center">G. Total</th>
                                                <th className="py-4 px-5 text-center">H'cap</th>
                                                <th className="py-4 px-5 text-center">Net</th>
                                                <th className="py-4 px-5 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                                            {scorecardList.map((card) => (
                                                <tr key={card.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="py-4 px-5 font-mono text-slate-600 whitespace-nowrap">
                                                        {formatDateDDMMYYYY(card.played_at)}
                                                    </td>
                                                    <td className="py-4 px-5 font-bold text-slate-900 whitespace-nowrap">
                                                        {card.player_name}
                                                    </td>
                                                    <td className="py-4 px-5 font-mono">
                                                        {card.user_id && card.member_id ? (
                                                            <span className="px-2 py-0.5 rounded bg-[#D4E2D2] text-[#1C2C1D] font-bold text-[11px]">
                                                                {card.member_id}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-400">—</span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-5 whitespace-nowrap">
                                                        {card.status === 'pending' && (
                                                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase border border-amber-300">
                                                                Pending
                                                            </span>
                                                        )}
                                                        {card.status === 'rejected' && (
                                                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase border border-rose-300">
                                                                Rejected
                                                            </span>
                                                        )}
                                                        {card.status === 'approved' && (
                                                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-200">
                                                                Approved
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-5 truncate max-w-xs">
                                                        {card.competition || 'Club Match'}
                                                    </td>
                                                    <td className="py-4 px-5 text-center whitespace-nowrap">
                                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                                                            {card.round_type === '18_holes' ? '18H' : '9H'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-5 text-center font-semibold text-slate-700">
                                                        {card.gross_r1 || card.gross_total}
                                                    </td>
                                                    <td className="py-4 px-5 text-center font-semibold text-slate-700">
                                                        {card.gross_r2 ? card.gross_r2 : '—'}
                                                    </td>
                                                    <td className="py-4 px-5 text-center font-black text-slate-900 text-sm">
                                                        {card.gross_total}
                                                    </td>
                                                    <td className="py-4 px-5 text-center font-bold text-slate-600">
                                                        {card.handicap || 0}
                                                    </td>
                                                    <td className="py-4 px-5 text-center font-black text-[#1C2C1D] text-sm bg-[#D4E2D2]/30">
                                                        {card.net_score}
                                                    </td>
                                                    <td className="py-4 px-5 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => setViewingScorecard(card)}
                                                                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                                                            >
                                                                View
                                                            </button>

                                                            {isAdmin && card.status === 'pending' && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleApprove(card)}
                                                                    className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                                                                >
                                                                    Approve
                                                                </button>
                                                            )}

                                                            {(isAdmin || authUser.id === card.user_id) && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => openEditModal(card)}
                                                                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Pencil className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                            {(isAdmin || (authUser.id === card.user_id && card.status === 'pending')) && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDelete(card)}
                                                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="bg-white rounded-[28px] p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
                            <div className="w-16 h-16 rounded-full bg-[#D4E2D2] text-[#1C2C1D] mx-auto flex items-center justify-center">
                                <FileSpreadsheet className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 font-display">No Scorecards Found</h3>
                                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                                    There are no match scorecards matching your current filter. Record a round or select another status filter.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="px-6 py-2.5 rounded-full bg-[#1C2C1D] text-white font-bold text-xs uppercase tracking-wider shadow-xs hover:bg-[#2C442E] transition-colors inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>{isMember ? 'Submit New Scorecard' : 'Record Scorecard'}</span>
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
               6. COMPACT & CLEAN RECORD/EDIT SCORECARD MODAL
            ══════════════════════════════════════════════════════ */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-white rounded-[24px] sm:rounded-[32px] max-w-2xl sm:max-w-3xl w-full border border-slate-200/80 shadow-2xl flex flex-col max-h-[88vh] sm:max-h-[92vh] overflow-hidden">
                        
                        {/* Compact Modal Header (Fixed at Top) */}
                        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                            <div>
                                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
                                    {editingScorecard 
                                        ? 'Update Match Scorecard' 
                                        : (isMember ? 'Submit Match Scorecard' : 'Record Official Scorecard')}
                                </h2>
                                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                                    {isMember 
                                        ? 'Submitted scorecards are reviewed by club administration before appearing on official records.' 
                                        : 'Official BGC 9-hole & 18-hole dual round scoring system.'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Form Container with Scrollable Body and Fixed Sticky Action Footer */}
                        <form onSubmit={submitScorecard} className="flex flex-col flex-1 overflow-hidden">
                            
                            {/* Scrollable Form Body */}
                            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3.5 sm:space-y-4 pr-2 sm:pr-4">
                                
                                {/* ── PLAYER INFO COMPACT STRIP ── */}
                                {isMember || (data.user_id && authUser.id === data.user_id) ? (
                                    <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F4F6F0] border border-[#D5DDD0]">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-[#1C2C1D] text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden border border-slate-200 shadow-2xs">
                                                {activePlayerImage ? (
                                                    <img 
                                                        src={activePlayerImage} 
                                                        alt={data.player_name || authUser.name || 'Member'} 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <span>{data.player_name?.charAt(0)?.toUpperCase() || authUser.name?.charAt(0)?.toUpperCase() || 'P'}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">{data.player_name || authUser.name}</span>
                                                <span className="text-[10px] font-mono font-semibold text-slate-500">{data.member_id || authUser.member_id || 'BGC Member'}</span>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-0.5 rounded-full bg-[#D4E2D2] text-[#1C2C1D] text-[10px] font-bold uppercase shrink-0 border border-[#BFD4BD]">
                                            Verified Member
                                        </span>
                                    </div>
                                ) : (
                                    /* Admin Player Selection */
                                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                                                Player / Member *
                                            </label>
                                            <span className="text-[10px] text-slate-400">Search club registry or type guest name</span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative">
                                            <input
                                                type="text"
                                                value={data.player_name}
                                                onChange={(e) => setData('player_name', e.target.value)}
                                                placeholder="Player Name (e.g. Lt Col Kamrul)"
                                                className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#1C2C1D]"
                                                required
                                            />
                                            <div className="relative" ref={memberDropdownRef}>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
                                                    className="w-full text-left px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 flex items-center justify-between"
                                                >
                                                    <span className="truncate">
                                                        {data.user_id ? `Linked: ${data.player_name} (${data.member_id || 'ID'})` : '-- Link to Registered Member --'}
                                                    </span>
                                                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                </button>

                                                {isMemberDropdownOpen && (
                                                    <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100">
                                                        <div className="p-2 sticky top-0 bg-white border-b border-slate-100">
                                                            <input
                                                                type="text"
                                                                value={memberSearchQuery}
                                                                onChange={(e) => setMemberSearchQuery(e.target.value)}
                                                                placeholder="Filter member..."
                                                                className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-50 border border-slate-200"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSelectMember(null)}
                                                            className="w-full text-left px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50"
                                                        >
                                                            -- Manual Non-Member / Guest --
                                                        </button>
                                                        {filteredMembers.map((m) => (
                                                            <button
                                                                key={m.id}
                                                                type="button"
                                                                onClick={() => handleSelectMember(m)}
                                                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-[#D4E2D2]/30 flex items-center justify-between gap-2"
                                                            >
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    <div className="w-6 h-6 rounded-full bg-[#1C2C1D] text-white flex items-center justify-center font-bold text-[10px] shrink-0 overflow-hidden">
                                                                        {m.profile_picture ? (
                                                                            <img src={resolveProfileImageUrl(m.profile_picture)} alt={m.name} className="w-full h-full object-cover" />
                                                                        ) : (
                                                                            <span>{m.name?.charAt(0)?.toUpperCase() || 'M'}</span>
                                                                        )}
                                                                    </div>
                                                                    <span className="font-semibold text-slate-800 truncate">{m.name}</span>
                                                                </div>
                                                                <span className="text-[10px] font-mono text-slate-400 shrink-0">{m.member_id || `#${m.id}`}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── COMPACT MATCH METADATA ROW ── */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Date Played *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.played_at}
                                            onChange={(e) => setData('played_at', e.target.value)}
                                            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1C2C1D]"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Handicap (H'cap)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="54"
                                            value={data.handicap}
                                            onChange={(e) => setData('handicap', parseInt(e.target.value) || 0)}
                                            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1C2C1D]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Round Format
                                        </label>
                                        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                                            <button
                                                type="button"
                                                onClick={() => setData('round_type', '9_holes')}
                                                className={`py-1 rounded-lg text-xs font-bold transition-all text-center ${
                                                    data.round_type === '9_holes' ? 'bg-[#1C2C1D] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                                                }`}
                                            >
                                                9 Holes
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('round_type', '18_holes')}
                                                className={`py-1 rounded-lg text-xs font-bold transition-all text-center ${
                                                    data.round_type === '18_holes' ? 'bg-[#1C2C1D] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                                                }`}
                                            >
                                                18 Holes
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Tee Category
                                        </label>
                                        <select
                                            value={data.tee_type}
                                            onChange={(e) => setData('tee_type', e.target.value)}
                                            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1C2C1D]"
                                        >
                                            <option value="men">Men's Tee (White)</option>
                                            <option value="ladies">Ladies' Tee (Red)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Competition / Tournament selection */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                            Tournament / Event Name *
                                        </label>
                                        <div className="flex items-center gap-1.5 text-[10px]">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setTournamentSelectType('tournament');
                                                    if (tournaments.length > 0) {
                                                        setData(prev => ({ ...prev, tournament_id: tournaments[0].id, competition: tournaments[0].title }));
                                                    }
                                                }}
                                                className={`underline ${tournamentSelectType === 'tournament' ? 'text-[#1C2C1D] font-bold' : 'text-slate-400'}`}
                                            >
                                                Club Tournaments
                                            </button>
                                            <span className="text-slate-300">|</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setTournamentSelectType('custom');
                                                    setData(prev => ({ ...prev, tournament_id: '', competition: '' }));
                                                }}
                                                className={`underline ${tournamentSelectType === 'custom' ? 'text-[#1C2C1D] font-bold' : 'text-slate-400'}`}
                                            >
                                                Custom / Practice
                                            </button>
                                        </div>
                                    </div>

                                    {tournamentSelectType === 'tournament' && tournaments.length > 0 ? (
                                        <select
                                            value={data.tournament_id || 'custom'}
                                            onChange={handleTournamentDropdownSelect}
                                            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1C2C1D]"
                                        >
                                            {tournaments.map(t => (
                                                <option key={t.id} value={t.id}>
                                                    {t.title} {t.start_date ? `(${formatDateDDMMYYYY(t.start_date)})` : ''}
                                                </option>
                                            ))}
                                            <option value="custom">-- Custom / Other Practice Match --</option>
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={data.competition}
                                            onChange={(e) => setData('competition', e.target.value)}
                                            placeholder="e.g. Club Weekend Match / Practice Round"
                                            className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#1C2C1D]"
                                            required
                                        />
                                    )}
                                </div>

                                {/* ── 1. FIRST ROUND SCORE INPUT (HOLES 1 TO 9) ── */}
                                <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FAF9F5] border border-slate-200 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                            First Round (Holes 1–9 &bull; Par 36)
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => fillParScores(1)}
                                                className="text-[10px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                                            >
                                                <RotateCcw className="w-3 h-3" />
                                                <span>Reset Par</span>
                                            </button>
                                            <span className="px-2 py-0.5 rounded-md bg-[#1C2C1D] text-white font-mono font-bold text-[10px]">
                                                R1: {calculatedGrossR1}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mobile Touch-Friendly Scrollable Strip */}
                                    <div className="overflow-x-auto pb-1 scrollbar-none touch-pan-x">
                                        <div className="grid grid-cols-9 gap-1.5 sm:gap-2 text-center min-w-[460px] sm:min-w-0">
                                            {BGC_HOLES_R1.map((h, index) => (
                                                <div key={h.hole} className="space-y-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                                                    <span className="text-[10px] font-bold text-slate-700 block">#{h.hole}</span>
                                                    <span className="text-[8px] font-semibold text-slate-400 block">Par {h.par}</span>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        maxLength={2}
                                                        value={data.scores_r1[index] !== undefined && data.scores_r1[index] !== null ? data.scores_r1[index] : ''}
                                                        onChange={(e) => handleScoreChange(1, index, e.target.value)}
                                                        onFocus={(e) => e.target.select()}
                                                        className="w-full h-8 sm:h-9 text-center rounded-lg border border-slate-300 font-black text-sm text-slate-900 focus:ring-2 focus:ring-[#1C2C1D] focus:border-[#1C2C1D] bg-slate-50 focus:bg-white p-0 shadow-inner"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* ── 2. SECOND ROUND SCORE INPUT (HOLES 10 TO 18) ── */}
                                {data.round_type === '18_holes' && (
                                    <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FAF9F5] border border-slate-200 space-y-2 animate-in fade-in duration-150">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                                                Second Round (Holes 10–18 &bull; Par 36)
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => fillParScores(2)}
                                                    className="text-[10px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                                                >
                                                    <RotateCcw className="w-3 h-3" />
                                                    <span>Reset Par</span>
                                                </button>
                                                <span className="px-2 py-0.5 rounded-md bg-[#1C2C1D] text-white font-mono font-bold text-[10px]">
                                                    R2: {calculatedGrossR2}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto pb-1 scrollbar-none touch-pan-x">
                                            <div className="grid grid-cols-9 gap-1.5 sm:gap-2 text-center min-w-[460px] sm:min-w-0">
                                                {BGC_HOLES_R2.map((h, index) => (
                                                    <div key={h.hole} className="space-y-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                                                        <span className="text-[10px] font-bold text-slate-700 block">#{h.label}</span>
                                                        <span className="text-[8px] font-semibold text-slate-400 block">Par {h.par}</span>
                                                        <input
                                                            type="text"
                                                            inputMode="numeric"
                                                            pattern="[0-9]*"
                                                            maxLength={2}
                                                            value={data.scores_r2 && data.scores_r2[index] !== undefined && data.scores_r2[index] !== null ? data.scores_r2[index] : ''}
                                                            onChange={(e) => handleScoreChange(2, index, e.target.value)}
                                                            onFocus={(e) => e.target.select()}
                                                            className="w-full h-8 sm:h-9 text-center rounded-lg border border-slate-300 font-black text-sm text-slate-900 focus:ring-2 focus:ring-[#1C2C1D] focus:border-[#1C2C1D] bg-slate-50 focus:bg-white p-0 shadow-inner"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ── SUMMARY CALCULATION & MARKER BAR ── */}
                                <div className="p-3 rounded-2xl bg-[#D4E2D2]/40 border border-[#BFD4BD] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                                    <div className="grid grid-cols-3 gap-2 text-center sm:text-left sm:flex sm:items-center sm:gap-4">
                                        <div className="p-1.5 sm:p-0 rounded-lg bg-white/80 sm:bg-transparent border sm:border-0 border-[#BFD4BD]">
                                            <span className="text-[9px] font-bold uppercase text-slate-600 block">Gross Total</span>
                                            <span className="text-base sm:text-lg font-black text-slate-900 font-display">{calculatedTotalGross}</span>
                                        </div>
                                        <div className="p-1.5 sm:p-0 rounded-lg bg-white/80 sm:bg-transparent border sm:border-0 border-[#BFD4BD]">
                                            <span className="text-[9px] font-bold uppercase text-slate-600 block">Handicap</span>
                                            <span className="text-base sm:text-lg font-black text-slate-900 font-display">{data.handicap || 0}</span>
                                        </div>
                                        <div className="p-1.5 sm:p-0 rounded-lg bg-[#D4E2D2] sm:bg-transparent border sm:border-0 border-[#BFD4BD]">
                                            <span className="text-[9px] font-bold uppercase text-[#1C2C1D] block">Net Score</span>
                                            <span className="text-base sm:text-lg font-black text-[#1C2C1D] font-display">{calculatedNet}</span>
                                        </div>
                                    </div>

                                    <div className="w-full sm:w-56">
                                        <input
                                            type="text"
                                            value={data.marker_name}
                                            onChange={(e) => setData('marker_name', e.target.value)}
                                            placeholder="Marker Name (Optional)"
                                            className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#1C2C1D]"
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Modal Action Buttons (Fixed Sticky Footer - Always Fully Visible) */}
                            <div className="px-4 sm:px-6 py-3 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0 bg-white">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 sm:px-6 py-2 rounded-full bg-[#1C2C1D] hover:bg-[#2C442E] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    <Check className="w-4 h-4 shrink-0" />
                                    <span>
                                        {isMember
                                            ? (editingScorecard ? 'Submit Update' : 'Submit for Approval')
                                            : (editingScorecard ? 'Update Scorecard' : 'Save Scorecard')}
                                    </span>
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
               7. OFFICIAL BGC DIGITAL SCORECARD VIEW / PRINT MODAL
               (Authentic Physical Replica)
            ══════════════════════════════════════════════════════ */}
            {viewingScorecard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 no-print">
                    <div className="bg-white rounded-[24px] sm:rounded-[32px] max-w-[1240px] w-full border border-slate-200 shadow-2xl flex flex-col max-h-[88vh] sm:max-h-[94vh] overflow-hidden">
                        
                        {/* Print / Close Toolbar (Single Row Mobile Unbreakable Header) */}
                        <div className="px-3.5 sm:px-6 py-3 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0 bg-white">
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <h2 className="text-xs sm:text-base font-extrabold text-slate-900 font-display truncate">
                                        BGC Scorecard
                                    </h2>
                                    <span className="px-2 py-0.5 rounded-full bg-[#E2E6D5] text-[#1C2C1D] text-[9px] sm:text-[10px] font-bold uppercase shrink-0 border border-[#CCD3BD]">
                                        {viewingScorecard.round_type === '18_holes' ? '18H Dual' : '9H Single'}
                                    </span>
                                    {viewingScorecard.status === 'pending' && (
                                        <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold uppercase border border-amber-300 shrink-0">
                                            Pending
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
                                    {viewingScorecard.player_name} &bull; {viewingScorecard.competition || 'Club Match'}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#1C2C1D] hover:bg-[#2C442E] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                                >
                                    <Printer className="w-3.5 h-3.5 shrink-0" />
                                    <span className="hidden sm:inline">Print Card</span>
                                    <span className="sm:hidden">Print</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewingScorecard(null)}
                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shrink-0"
                                    title="Close"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-3 sm:space-y-4">
                            {/* Mobile Swipe Hint */}
                            <div className="text-[10px] text-slate-400 font-medium sm:hidden text-center flex items-center justify-center gap-1 py-0.5">
                                <span>← Swipe card horizontally to view full table →</span>
                            </div>

                            {/* ── AUTHENTIC PHYSICAL SCORECARD REPLICA (SCREEN VIEW) ── */}
                            <div className="overflow-x-auto pb-2 touch-pan-x">
                            <div className={`bg-[#FAF9F5] p-4 sm:p-5 rounded-2xl border-2 border-slate-800 text-slate-900 font-sans shadow-sm select-none ${
                                viewingScorecard.round_type === '18_holes' ? 'min-w-[960px]' : 'min-w-[560px] sm:min-w-[620px]'
                            }`}>
                                
                                {/* ── TOP INFO & NAVY BANNERS ── */}
                                <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-300">
                                    <div className="space-y-1 text-xs font-bold">
                                        <div className="flex flex-wrap items-baseline gap-2">
                                            <span className="text-slate-700 text-xs sm:text-sm">Player</span>
                                            <span className="font-extrabold text-sm sm:text-base border-b border-slate-800 pb-0.5 px-2 min-w-[160px]">
                                                {viewingScorecard.player_name} {viewingScorecard.user_id && viewingScorecard.member_id ? `(${viewingScorecard.member_id})` : ''}
                                            </span>
                                            <span className="text-slate-700 text-xs sm:text-sm ml-2">H'cap</span>
                                            <span className="font-extrabold text-sm sm:text-base border-b border-slate-800 pb-0.5 px-2 min-w-[36px] text-center">
                                                {viewingScorecard.handicap || 0}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-baseline gap-2 pt-0.5">
                                            <span className="text-slate-700 text-xs sm:text-sm">Competition</span>
                                            <span className="font-extrabold text-xs sm:text-sm border-b border-slate-800 pb-0.5 px-2 min-w-[200px]">
                                                {viewingScorecard.competition || 'Club Championship Match'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-1 text-right shrink-0">
                                        <div className="flex items-center gap-1.5 justify-end">
                                            <span className="px-2.5 py-0.5 rounded bg-[#10243E] text-white font-extrabold text-[9px] sm:text-[10px] tracking-wide uppercase">
                                                Smooth bunkers
                                            </span>
                                            <span className="px-2.5 py-0.5 rounded bg-[#10243E] text-white font-extrabold text-[9px] sm:text-[10px] tracking-wide uppercase">
                                                Replace divots
                                            </span>
                                        </div>
                                        <div className="px-3 py-1 rounded bg-[#10243E] text-white font-black text-[10px] sm:text-xs tracking-wider uppercase text-center">
                                            Maintain Pace of Play
                                        </div>
                                    </div>
                                </div>

                                {/* ── SCORE TABLES ── */}
                                <div className={viewingScorecard.round_type === '18_holes' ? "grid grid-cols-2 gap-4 pt-2" : "space-y-3 pt-2"}>
                                    
                                    {/* ── FIRST ROUND TABLE ── */}
                                    <div className={`space-y-2 ${viewingScorecard.round_type === '18_holes' ? 'border-r border-slate-300 pr-3' : ''}`}>
                                        <div className="text-center font-bold text-xs text-slate-800 tracking-wide">
                                            {viewingScorecard.round_type === '18_holes' ? 'First Round (Holes 1–9)' : 'Official Round (9 Holes)'}
                                        </div>

                                        {/* Graphic Strip */}
                                        <div className="h-10 bg-sky-50 border border-slate-300 rounded flex items-center justify-between px-2 overflow-hidden">
                                            <div className="flex items-center gap-1">
                                                <div className="w-7 h-7 rounded-full bg-red-600 border border-green-700 flex items-center justify-center text-white text-[9px] font-black shadow-2xs">
                                                    BGC
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {[1,2,3,4,5,6,7,8,9].map(n => (
                                                    <div key={n} className="w-4 h-6 flex flex-col items-center justify-between py-0.5">
                                                        <div className="w-2 h-2 rounded-full bg-green-600 border border-blue-500"></div>
                                                        <div className="w-0.5 h-3 bg-blue-600 rounded"></div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="text-right">
                                                <span className="font-black text-red-600 text-xs block leading-none">BGC</span>
                                                <span className="text-[7px] font-bold text-slate-600 leading-none block uppercase">Golfers Den In North Bengal</span>
                                            </div>
                                        </div>

                                        {/* First Round Table */}
                                        <table className="w-full text-center border-collapse border border-slate-800 text-xs">
                                            <thead>
                                                <tr className="bg-[#EAE0C8] border-b border-slate-800 text-[10px] font-black uppercase">
                                                    <th className="border border-slate-800 py-1 px-1 text-left w-24">HOLE</th>
                                                    {BGC_HOLES_R1.map(h => (
                                                        <th key={h.hole} className="border border-slate-800 py-1 px-0.5 w-6">{h.hole}</th>
                                                    ))}
                                                    <th className="border border-slate-800 py-1 px-1 bg-[#D8CEB4] w-10">Gross</th>
                                                    {viewingScorecard.round_type !== '18_holes' && (
                                                        <>
                                                            <th className="border border-slate-800 py-1 px-1 bg-[#D8CEB4] w-10">H'cap</th>
                                                            <th className="border border-slate-800 py-1 px-1 bg-[#D8CEB4] w-10">Net</th>
                                                        </>
                                                    )}
                                                </tr>
                                                <tr className="border-b border-slate-800 text-[10px] font-bold bg-white">
                                                    <td className="border border-slate-800 py-0.5 px-1 text-left font-bold">PAR</td>
                                                    {BGC_HOLES_R1.map(h => (
                                                        <td key={h.hole} className="border border-slate-800 py-0.5 px-0.5">{h.par}</td>
                                                    ))}
                                                    <td className="border border-slate-800 py-0.5 px-1 font-black bg-slate-100">{BGC_TOTALS.par}</td>
                                                    {viewingScorecard.round_type !== '18_holes' && (
                                                        <>
                                                            <td className="border border-slate-800 py-0.5 px-1 bg-slate-100"></td>
                                                            <td className="border border-slate-800 py-0.5 px-1 bg-slate-100"></td>
                                                        </>
                                                    )}
                                                </tr>
                                                <tr className="border-b border-slate-800 text-[9px] font-bold bg-white">
                                                    <td className="border border-slate-800 py-0.5 px-1 text-left">STROKE INDEX</td>
                                                    {BGC_HOLES_R1.map(h => (
                                                        <td key={h.hole} className="border border-slate-800 py-0.5 px-0.5">{h.strokeIndex}</td>
                                                    ))}
                                                    <td className="border border-slate-800 py-0.5 px-1 bg-slate-100">—</td>
                                                    {viewingScorecard.round_type !== '18_holes' && (
                                                        <>
                                                            <td className="border border-slate-800 py-0.5 px-1 bg-slate-100">—</td>
                                                            <td className="border border-slate-800 py-0.5 px-1 bg-slate-100">—</td>
                                                        </>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Player Row 1 */}
                                                <tr className="border-b border-slate-800 bg-white font-bold">
                                                    <td className="border border-slate-800 py-1 px-1 text-left text-[11px] truncate max-w-[90px]">
                                                        1. {viewingScorecard.player_name}
                                                    </td>
                                                    {(viewingScorecard.scores_r1 || []).map((s, idx) => (
                                                        <td key={idx} className="border border-slate-800 py-1 px-0.5 text-sm font-black">
                                                            {s}
                                                        </td>
                                                    ))}
                                                    <td className="border border-slate-800 py-1 px-1 bg-[#EAE0C8] font-black text-sm">
                                                        <span className="inline-block border border-slate-900 rounded-full w-6 h-6 leading-5 text-center">
                                                            {viewingScorecard.gross_r1 || viewingScorecard.gross_total}
                                                        </span>
                                                    </td>
                                                    {viewingScorecard.round_type !== '18_holes' && (
                                                        <>
                                                            <td className="border border-slate-800 py-1 px-1 bg-[#EAE0C8] font-black text-sm">
                                                                {viewingScorecard.handicap || 0}
                                                            </td>
                                                            <td className="border border-slate-800 py-1 px-1 bg-[#EAE0C8] font-black text-base text-[#1C2C1D]">
                                                                {viewingScorecard.net_score}
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>

                                                {/* Fellow Players Blank / Marker Rows */}
                                                <tr className="border-b border-slate-800 bg-white">
                                                    <td className="border border-slate-800 py-1 px-1 text-left text-[11px] text-slate-500 truncate max-w-[90px]">2. {viewingScorecard.marker_name || 'Marker'}</td>
                                                    {[...Array(9)].map((_, i) => <td key={i} className="border border-slate-800 py-1 px-0.5"></td>)}
                                                    <td className="border border-slate-800 py-1 px-1 bg-slate-50"></td>
                                                    {viewingScorecard.round_type !== '18_holes' && (
                                                        <>
                                                            <td className="border border-slate-800 py-1 px-1 bg-slate-50"></td>
                                                            <td className="border border-slate-800 py-1 px-1 bg-slate-50"></td>
                                                        </>
                                                    )}
                                                </tr>
                                                <tr className="border-b border-slate-800 bg-white">
                                                    <td className="border border-slate-800 py-1 px-1 text-left text-[11px] text-slate-400">3.</td>
                                                    {[...Array(9)].map((_, i) => <td key={i} className="border border-slate-800 py-1 px-0.5"></td>)}
                                                    <td className="border border-slate-800 py-1 px-1 bg-slate-50"></td>
                                                    {viewingScorecard.round_type !== '18_holes' && (
                                                        <>
                                                            <td className="border border-slate-800 py-1 px-1 bg-slate-50"></td>
                                                            <td className="border border-slate-800 py-1 px-1 bg-slate-50"></td>
                                                        </>
                                                    )}
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* ── SECOND ROUND TABLE IF 18 HOLES ── */}
                                    {viewingScorecard.round_type === '18_holes' && (
                                        <div className="space-y-2 pl-2">
                                            <div className="text-center font-bold text-xs text-slate-800 tracking-wide">
                                                Second Round (Holes 1–9 Repeated)
                                            </div>

                                            <div className="h-10 bg-sky-50 border border-slate-300 rounded flex items-center justify-between px-2 overflow-hidden">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-7 h-7 rounded-full bg-red-600 border border-green-700 flex items-center justify-center text-white text-[9px] font-black shadow-2xs">
                                                        BGC
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {[1,2,3,4,5,6,7,8,9].map(n => (
                                                        <div key={n} className="w-4 h-6 flex flex-col items-center justify-between py-0.5">
                                                            <div className="w-2 h-2 rounded-full bg-green-600 border border-blue-500"></div>
                                                            <div className="w-0.5 h-3 bg-blue-600 rounded"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-black text-red-600 text-xs block leading-none">BGC</span>
                                                    <span className="text-[7px] font-bold text-slate-600 leading-none block uppercase">18 Holes Dual Round</span>
                                                </div>
                                            </div>

                                            <table className="w-full text-center border-collapse border border-slate-800 text-xs">
                                                <thead>
                                                    <tr className="bg-[#EAE0C8] border-b border-slate-800 text-[10px] font-black uppercase">
                                                        <th className="border border-slate-800 py-1 px-1 text-left w-24">HOLE</th>
                                                        {BGC_HOLES_R2.map(h => (
                                                            <th key={h.hole} className="border border-slate-800 py-1 px-0.5 w-6">{h.label}</th>
                                                        ))}
                                                        <th className="border border-slate-800 py-1 px-1 bg-[#D8CEB4] w-10">R2</th>
                                                        <th className="border border-slate-800 py-1 px-1 bg-[#D8CEB4] w-10">Total</th>
                                                        <th className="border border-slate-800 py-1 px-1 bg-[#D8CEB4] w-10">Net</th>
                                                    </tr>
                                                    <tr className="border-b border-slate-800 text-[10px] font-bold bg-white">
                                                        <td className="border border-slate-800 py-0.5 px-1 text-left font-bold">PAR</td>
                                                        {BGC_HOLES_R2.map(h => (
                                                            <td key={h.hole} className="border border-slate-800 py-0.5 px-0.5">{h.par}</td>
                                                        ))}
                                                        <td className="border border-slate-800 py-0.5 px-1 font-black bg-slate-100">{BGC_TOTALS.par}</td>
                                                        <td className="border border-slate-800 py-0.5 px-1 font-black bg-slate-100">72</td>
                                                        <td className="border border-slate-800 py-0.5 px-1 bg-slate-100"></td>
                                                    </tr>
                                                    <tr className="border-b border-slate-800 text-[9px] font-bold bg-white">
                                                        <td className="border border-slate-800 py-0.5 px-1 text-left">STROKE INDEX</td>
                                                        {BGC_HOLES_R2.map(h => (
                                                            <td key={h.hole} className="border border-slate-800 py-0.5 px-0.5">{h.strokeIndex}</td>
                                                        ))}
                                                        <td className="border border-slate-800 py-0.5 px-1 bg-slate-100">—</td>
                                                        <td className="border border-slate-800 py-0.5 px-1 bg-slate-100">—</td>
                                                        <td className="border border-slate-800 py-0.5 px-1 bg-slate-100">—</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr className="border-b border-slate-800 bg-white font-bold">
                                                        <td className="border border-slate-800 py-1 px-1 text-left text-[11px] truncate max-w-[90px]">
                                                            1. {viewingScorecard.player_name}
                                                        </td>
                                                        {(viewingScorecard.scores_r2 || []).map((s, idx) => (
                                                            <td key={idx} className="border border-slate-800 py-1 px-0.5 text-sm font-black">
                                                                {s}
                                                            </td>
                                                        ))}
                                                        <td className="border border-slate-800 py-1 px-1 bg-[#EAE0C8] font-black text-sm">
                                                            {viewingScorecard.gross_r2 || '—'}
                                                        </td>
                                                        <td className="border border-slate-800 py-1 px-1 bg-[#EAE0C8] font-black text-sm">
                                                            <span className="inline-block border border-slate-900 rounded-full w-6 h-6 leading-5 text-center">
                                                                {viewingScorecard.gross_total}
                                                            </span>
                                                        </td>
                                                        <td className="border border-slate-800 py-1 px-1 bg-[#EAE0C8] font-black text-base text-[#1C2C1D]">
                                                            {viewingScorecard.net_score}
                                                        </td>
                                                    </tr>
                                                    <tr className="border-b border-slate-800 bg-white">
                                                        <td className="border border-slate-800 py-1 px-1 text-left text-[11px] text-slate-500 truncate max-w-[90px]">2. {viewingScorecard.marker_name || 'Marker'}</td>
                                                        {[...Array(9)].map((_, i) => <td key={i} className="border border-slate-800 py-1 px-0.5"></td>)}
                                                        <td className="border border-slate-800 py-1 px-1 bg-slate-50"></td>
                                                        <td className="border border-slate-800 py-1 px-1 bg-slate-50"></td>
                                                        <td className="border border-slate-800 py-1 px-1 bg-slate-50"></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* ── FOOTER SIGNATURES & OFFICIAL LOGOS ── */}
                                <div className="mt-4 pt-3 border-t-2 border-slate-800 flex items-end justify-between gap-4 text-xs font-bold">
                                    <div className="space-y-1">
                                        <div className="w-44 border-b border-slate-900 pb-1 text-slate-500 font-normal italic">
                                            {viewingScorecard.player_name}
                                        </div>
                                        <span className="text-[10px] uppercase tracking-wider text-slate-700 block">
                                            Player's Signature
                                        </span>
                                    </div>

                                    <div className="text-center space-y-0.5">
                                        <span className="text-[10px] font-black uppercase text-slate-900 block">Bogura Golf Club</span>
                                        <span className="text-[9px] text-slate-600 block">Majhira Cantonment, Bogura, Bangladesh</span>
                                    </div>

                                    <div className="space-y-1 text-right">
                                        <div className="w-44 border-b border-slate-900 pb-1 text-slate-500 font-normal italic ml-auto">
                                            {viewingScorecard.marker_name || 'Tournament Official'}
                                        </div>
                                        <span className="text-[10px] uppercase tracking-wider text-slate-700 block">
                                            Marker's Signature
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
            )}

            {/* Executive Confirmation Dialog */}
            <ConfirmationModal
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                confirmText={confirmDialog.confirmText}
                cancelText={confirmDialog.cancelText}
                type={confirmDialog.type}
            />

        </AuthenticatedLayout>
    );
}
