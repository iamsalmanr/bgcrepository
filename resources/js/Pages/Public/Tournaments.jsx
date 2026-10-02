import React, { useState, useMemo } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmationModal from '@/Components/ConfirmationModal';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { 
    Calendar, 
    MapPin, 
    ExternalLink, 
    Download, 
    Trophy, 
    Search, 
    Filter, 
    Clock, 
    CheckCircle2, 
    Radio, 
    ChevronRight, 
    X, 
    Eye,
    Flag,
    Sparkles,
    ArrowRight,
    ArrowUpRight,
    Award,
    Activity,
    Star,
    FileText,
    Users,
    UserPlus,
    Check,
    ShieldCheck,
    Lock
} from 'lucide-react';
import InputError from '@/Components/InputError';

export default function Tournaments({ type = 'Club Tournaments', initialStatus = 'all', tournaments = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [searchQuery, setSearchQuery] = useState('');
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'danger',
        onConfirm: () => {},
    });
    const [canceling, setCanceling] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [registeringTournament, setRegisteringTournament] = useState(null);

    const { data: regData, setData: setRegData, post: postReg, processing: regProcessing, errors: regErrors, reset: resetReg, clearErrors: clearRegErrors } = useForm({
        player_name: '',
        member_id: '',
        email: '',
        phone: '',
        handicap: 0,
        category: 'Regular Men',
        t_shirt_size: 'L',
        notes: '',
    });

    const openRegisterModal = (tournament) => {
        clearRegErrors();
        resetReg();
        setRegisteringTournament(tournament);
        if (user) {
            setRegData({
                player_name: user.name || '',
                member_id: user.member_id || user.membership_number || '',
                email: user.email || '',
                phone: user.phone || '',
                handicap: user.handicap || 0,
                category: 'Regular Men',
                t_shirt_size: 'L',
                notes: '',
            });
        } else {
            setRegData({
                player_name: '',
                member_id: '',
                email: '',
                phone: '',
                handicap: 0,
                category: 'Regular Men',
                t_shirt_size: 'L',
                notes: '',
            });
        }
    };

    const submitRegistration = (e) => {
        e.preventDefault();
        if (!registeringTournament) return;
        postReg(route('tournaments.register', registeringTournament.id), {
            preserveScroll: true,
            onSuccess: () => {
                setRegisteringTournament(null);
            },
        });
    };

    const canUnenroll = (tournament) => {
        if (!user) return false;
        if (user.role === 'admin' || user.role === 'super_admin') return true;
        if (!tournament || !tournament.start_date) return true;
        const startParts = tournament.start_date.substring(0, 10).split('-');
        if (startParts.length < 3) return true;
        const start = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));
        start.setHours(0, 0, 0, 0);
        const now = new Date();
        return now < start;
    };

    const handleCancelRegistration = (registrationId, tournamentTitle = '') => {
        setConfirmDialog({
            isOpen: true,
            title: 'Withdraw Tournament Registration',
            message: `Are you sure you want to un-enroll from ${tournamentTitle || 'this tournament'}? Your slot will be released.`,
            confirmText: 'Yes, Un-enroll',
            cancelText: 'Keep Registration',
            type: 'danger',
            onConfirm: () => {
                setCanceling(true);
                router.delete(route('tournaments.registrations.cancel', registrationId), {
                    preserveScroll: true,
                    onSuccess: () => {
                        setSelectedTournament(null);
                        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                    },
                    onError: () => {
                        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                    },
                    onFinish: () => {
                        setCanceling(false);
                    }
                });
            }
        });
    };

    const formatDateDDMMYYYY = (dateStr) => {
        if (!dateStr) return '';
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

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    // Helper to resolve storage asset URLs
    const resolveAssetUrl = (path, fallback = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop') => {
        if (!path) return fallback;
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `/storage/${cleanPath}`;
    };

    // Calculate Status Counts
    const statusCounts = useMemo(() => {
        const counts = { all: tournaments.length, live: 0, upcoming: 0, completed: 0 };
        tournaments.forEach(t => {
            const s = (t.status || 'upcoming').toLowerCase();
            if (counts[s] !== undefined) counts[s]++;
        });
        return counts;
    }, [tournaments]);

    // Filter tournaments based on search and status
    const filteredTournaments = useMemo(() => {
        return tournaments.filter(tournament => {
            const matchesStatus = selectedStatus === 'all' || (tournament.status || 'upcoming').toLowerCase() === selectedStatus;
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q || 
                (tournament.title && tournament.title.toLowerCase().includes(q)) ||
                (tournament.location && tournament.location.toLowerCase().includes(q)) ||
                (tournament.description && tournament.description.toLowerCase().includes(q));

            return matchesStatus && matchesSearch;
        });
    }, [tournaments, selectedStatus, searchQuery]);

    // Status Badge Component
    const renderStatusBadge = (status) => {
        const s = (status || 'upcoming').toLowerCase();
        if (s === 'live') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Live Match</span>
                </span>
            );
        }
        if (s === 'completed') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 text-slate-300 border border-white/20 backdrop-blur-md text-[11px] font-semibold uppercase tracking-wider shadow-md">
                    <CheckCircle2 className="w-3 h-3 text-slate-400" />
                    <span>Completed</span>
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/85 text-amber-300 border border-amber-400/30 backdrop-blur-md text-[11px] font-semibold uppercase tracking-wider shadow-md">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Upcoming</span>
            </span>
        );
    };

    // ─────────────────────────────────────────────────────────────
    // 1. MEMBER AUTHENTICATED VIEW (Matching Dashboard Pastel Bento)
    // ─────────────────────────────────────────────────────────────
    if (user) {
        return (
            <AuthenticatedLayout header="Tournaments & Matches">
                <Head title="Tournaments & Matches - Bogura Golf Club" />

                <div className="bg-[#F8F9FB] min-h-screen text-slate-900 pb-16">
                    <div className="max-w-[1520px] mx-auto px-3.5 sm:px-6 lg:px-8 pt-3 sm:pt-6 space-y-3 sm:space-y-6">
                        
                        {/* ── TOP HEADER ── */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
                            <div>
                                <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                                    Tournaments & Match Fixtures
                                </h1>
                                <p className="text-[11px] sm:text-sm text-slate-500 font-medium mt-0.5 sm:mt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                                    <span>Bogura Golf Club &bull; Member Match Portal</span>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500"></span>
                                        {statusCounts.all} Total Scheduled
                                    </span>
                                </p>
                            </div>

                            {/* Search Pill */}
                            <div className="flex items-center gap-3">
                                <div className="relative w-full md:w-80 lg:w-96">
                                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search tournament title or venue..."
                                        className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-1.5 sm:py-2.5 rounded-full bg-white border border-slate-200/80 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 shadow-xs transition-all"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── 4 MILITARY OLIVE METRIC CARDS (Bento Row - Compact on Mobile) ── */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                            
                            {/* Card 1: All Tournaments (Soft Olive Sage) */}
                            <button
                                type="button"
                                onClick={() => setSelectedStatus('all')}
                                className={`rounded-xl sm:rounded-[24px] p-2.5 sm:p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                    selectedStatus === 'all'
                                        ? 'bg-[#D4E2D2] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-sm sm:shadow-md scale-[1.01]'
                                        : 'bg-[#D4E2D2] border-[#BFD4BD] hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-1 w-full">
                                    <div className="min-w-0">
                                        <span className="text-[9px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider truncate block leading-tight">All Fixtures</span>
                                        <p className="text-lg sm:text-3xl font-black text-slate-900 font-display leading-none mt-0.5 sm:mt-2">{statusCounts.all}</p>
                                    </div>
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-[#1C2C1D] flex items-center justify-center shadow-xs shrink-0 ml-1">
                                        <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                                <span className="hidden sm:block text-[11px] font-semibold text-[#243B26] mt-1.5 truncate">Official Club Events</span>
                            </button>

                            {/* Card 2: Live Matches (Field Olive Khaki) */}
                            <button
                                type="button"
                                onClick={() => setSelectedStatus('live')}
                                className={`rounded-xl sm:rounded-[24px] p-2.5 sm:p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                    selectedStatus === 'live'
                                        ? 'bg-[#E2E6D5] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-sm sm:shadow-md scale-[1.01]'
                                        : 'bg-[#E2E6D5] border-[#CCD3BD] hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-1 w-full">
                                    <div className="min-w-0">
                                        <span className="text-[9px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider truncate block leading-tight">Live In Play</span>
                                        <p className="text-lg sm:text-3xl font-black text-slate-900 font-display leading-none mt-0.5 sm:mt-2">{statusCounts.live}</p>
                                    </div>
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs shrink-0 ml-1">
                                        <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                                    </div>
                                </div>
                                <span className="hidden sm:block text-[11px] font-semibold text-[#35432B] mt-1.5 truncate">Active Match Play</span>
                            </button>

                            {/* Card 3: Upcoming (Warm Khaki Olive) */}
                            <button
                                type="button"
                                onClick={() => setSelectedStatus('upcoming')}
                                className={`rounded-xl sm:rounded-[24px] p-2.5 sm:p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                    selectedStatus === 'upcoming'
                                        ? 'bg-[#DFE5D4] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-sm sm:shadow-md scale-[1.01]'
                                        : 'bg-[#DFE5D4] border-[#CBD4BD] hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-1 w-full">
                                    <div className="min-w-0">
                                        <span className="text-[9px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider truncate block leading-tight">Upcoming</span>
                                        <p className="text-lg sm:text-3xl font-black text-slate-900 font-display leading-none mt-0.5 sm:mt-2">{statusCounts.upcoming}</p>
                                    </div>
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs shrink-0 ml-1">
                                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                                <span className="hidden sm:block text-[11px] font-semibold text-[#2B402C] mt-1.5 truncate">Scheduled Tournaments</span>
                            </button>

                            {/* Card 4: Completed (Muted Drab Olive) */}
                            <button
                                type="button"
                                onClick={() => setSelectedStatus('completed')}
                                className={`rounded-xl sm:rounded-[24px] p-2.5 sm:p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                    selectedStatus === 'completed'
                                        ? 'bg-[#D8DFD5] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-sm sm:shadow-md scale-[1.01]'
                                        : 'bg-[#D8DFD5] border-[#C5CEC1] hover:shadow-sm'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-1 w-full">
                                    <div className="min-w-0">
                                        <span className="text-[9px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider truncate block leading-tight">Completed</span>
                                        <p className="text-lg sm:text-3xl font-black text-slate-900 font-display leading-none mt-0.5 sm:mt-2">{statusCounts.completed}</p>
                                    </div>
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs shrink-0 ml-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                                <span className="hidden sm:block text-[11px] font-semibold text-[#2B402C] mt-1.5 truncate">Archives & Results</span>
                            </button>

                        </div>

                        {/* ── STATUS PILL TABS BAR (Horizontal Scrollbar Hidden on Mobile) ── */}
                        <div className="flex items-center justify-between gap-2 sm:gap-4">
                            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-0.5 scrollbar-hide no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                {[
                                    { id: 'all', label: 'All Fixtures', count: statusCounts.all },
                                    { id: 'live', label: 'Live Now', count: statusCounts.live, isLive: true },
                                    { id: 'upcoming', label: 'Upcoming', count: statusCounts.upcoming },
                                    { id: 'completed', label: 'Completed', count: statusCounts.completed },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSelectedStatus(tab.id)}
                                        className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
                                            selectedStatus === tab.id
                                                ? 'bg-slate-900 text-white shadow-xs'
                                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                                        }`}
                                    >
                                        {tab.isLive && (
                                            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${selectedStatus === tab.id ? 'bg-emerald-400 animate-ping' : 'bg-emerald-600'}`} />
                                        )}
                                        <span>{tab.label}</span>
                                        <span className={`px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-bold ${
                                            selectedStatus === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <Link
                                href="/tournament-result"
                                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200/80 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors shadow-2xs shrink-0"
                            >
                                <Award className="w-3.5 h-3.5 text-amber-500" />
                                <span>Winner Archives</span>
                            </Link>
                        </div>

                        {/* ── TOURNAMENT CARDS GRID ── */}
                        {filteredTournaments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTournaments.map((tournament) => {
                                    const startDate = tournament.start_date ? new Date(tournament.start_date) : null;
                                    const endDate = tournament.end_date ? new Date(tournament.end_date) : null;
                                    const coverImg = resolveAssetUrl(tournament.image_path);
                                    const isPdf = tournament.link && tournament.link.toLowerCase().endsWith('.pdf');

                                    return (
                                        <div
                                            key={tournament.id}
                                            className="bg-white rounded-[28px] overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                                        >
                                            {/* Image Header */}
                                            <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900">
                                                <img
                                                    src={coverImg}
                                                    alt={tournament.title}
                                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                                                {/* Status Badge */}
                                                <div className="absolute top-4 left-4 z-10">
                                                    {renderStatusBadge(tournament.status)}
                                                </div>

                                                {/* Date Badge */}
                                                {startDate && (
                                                    <div className="absolute bottom-3 left-4 z-10 flex items-center gap-2.5">
                                                        <div className="w-11 h-11 rounded-2xl bg-slate-900/90 text-white flex flex-col items-center justify-center border border-white/20 backdrop-blur-md shadow-md">
                                                            <span className="text-[8px] font-bold uppercase text-emerald-300">
                                                                {startDate.toLocaleDateString('en-US', { month: 'short' })}
                                                            </span>
                                                            <span className="text-sm font-extrabold text-amber-300 leading-none mt-0.5">
                                                                {startDate.getDate()}
                                                            </span>
                                                        </div>
                                                        <div className="text-white text-xs drop-shadow-md">
                                                            <span className="font-bold block">{startDate.getFullYear()}</span>
                                                            <span className="text-[11px] text-emerald-300 font-medium">
                                                                {endDate ? `to ${formatDateDDMMYYYY(tournament.end_date)}` : '1-Day Match'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Card Content */}
                                            <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                                                <div className="space-y-2">
                                                    <h3 
                                                        onClick={() => setSelectedTournament(tournament)}
                                                        className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors leading-snug cursor-pointer line-clamp-2"
                                                    >
                                                        {tournament.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                        <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                                        <span className="truncate">{tournament.location || 'Bogura Golf Club'}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1 font-normal">
                                                        {tournament.description || 'Official club championship fixture. Review guidelines for handicaps and reporting times.'}
                                                    </p>
                                                </div>

                                                {/* Participants & Registration Info */}
                                                <div className="pt-2 flex items-center justify-between gap-2">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E2E6D5] text-[#1C2C1D] text-[11px] font-bold">
                                                        <Users className="w-3 h-3" />
                                                        <span>{tournament.registrations?.length || 0} Registered</span>
                                                    </span>

                                                    {user && tournament.registrations?.some(r => r.user_id === user.id) ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D4E2D2] text-[#1C2C1D] text-[11px] font-extrabold border border-[#BFD4BD]">
                                                                <Check className="w-3 h-3 text-[#2C442E]" />
                                                                <span>Enrolled</span>
                                                            </span>
                                                            {canUnenroll(tournament) ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => { 
                                                                        e.stopPropagation(); 
                                                                        const userReg = tournament.registrations.find(r => r.user_id === user.id);
                                                                        if (userReg) handleCancelRegistration(userReg.id, tournament.title);
                                                                    }}
                                                                    className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition-all border border-rose-200 shadow-2xs"
                                                                    title="Un-enroll from this tournament"
                                                                >
                                                                    Un-enroll
                                                                </button>
                                                            ) : (
                                                                <span className="text-[10px] font-semibold text-slate-400">Locked</span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        (tournament.status || 'upcoming').toLowerCase() !== 'completed' && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.stopPropagation(); openRegisterModal(tournament); }}
                                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1C2C1D] hover:bg-[#2C442E] text-white text-[11px] font-bold uppercase tracking-wider transition-all shadow-xs"
                                                            >
                                                                <UserPlus className="w-3 h-3" />
                                                                <span>Register</span>
                                                            </button>
                                                        )
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                                    {tournament.link ? (
                                                        <a
                                                            href={tournament.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 uppercase tracking-wider"
                                                        >
                                                            {isPdf ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                                                            <span>{isPdf ? 'Download PDF' : 'Entry Link'}</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                            Club Match
                                                        </span>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedTournament(tournament)}
                                                        className="w-9 h-9 rounded-full bg-slate-900 text-white shadow-xs flex items-center justify-center hover:scale-105 transition-transform shrink-0"
                                                        title="View Guidelines & Details"
                                                    >
                                                        <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[28px] border border-slate-200/80 p-12 text-center max-w-xl mx-auto space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#D8EDE4] text-emerald-900 flex items-center justify-center mx-auto shadow-xs">
                                    <Trophy className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">No Tournaments Found</h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        No tournaments match the selected status or search filter.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedStatus('all'); setSearchQuery(''); }}
                                    className="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}

                    </div>
                </div>

                {/* ── TOURNAMENT DETAIL MODAL ── */}
                {selectedTournament && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
                        <div className="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col my-auto">
                            {/* Modal Image */}
                            <div className="relative h-48 sm:h-56 bg-slate-900 shrink-0">
                                <img
                                    src={resolveAssetUrl(selectedTournament.image_path)}
                                    alt={selectedTournament.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                                <button
                                    onClick={() => setSelectedTournament(null)}
                                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="absolute top-4 left-4 z-10">
                                    {renderStatusBadge(selectedTournament.status)}
                                </div>

                                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                                    <h2 className="text-lg sm:text-xl font-bold leading-tight">
                                        {selectedTournament.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 sm:p-8 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                                    <div className="flex items-center gap-2.5 text-slate-700">
                                        <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                                        <div>
                                            <span className="font-bold text-slate-900 block">Date Range:</span>
                                            <span>
                                                {selectedTournament.start_date ? formatDateDDMMYYYY(selectedTournament.start_date) : 'TBA'}
                                                {selectedTournament.end_date && ` to ${formatDateDDMMYYYY(selectedTournament.end_date)}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 text-slate-700">
                                        <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                                        <div>
                                            <span className="font-bold text-slate-900 block">Venue:</span>
                                            <span>{selectedTournament.location || 'Bogura Golf Club'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        Match Guidelines & Information
                                    </h4>
                                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                        {selectedTournament.description || 'Official club championship tournament. Entry requirements and flight schedules are managed by the Bogura Golf Club Tournament Committee.'}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-600">
                                            {selectedTournament.registrations?.length || 0} Registered Golfer(s)
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {user && selectedTournament.registrations?.some(r => r.user_id === user.id) ? (
                                            <div className="flex items-center gap-2">
                                                <span className="px-3.5 py-2 rounded-full bg-[#D4E2D2] text-[#1C2C1D] font-extrabold text-xs flex items-center gap-1.5 border border-[#BFD4BD]">
                                                    <Check className="w-3.5 h-3.5 text-[#2C442E]" />
                                                    <span>You Are Enrolled</span>
                                                </span>
                                                {canUnenroll(selectedTournament) ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const userReg = selectedTournament.registrations.find(r => r.user_id === user.id);
                                                            if (userReg) handleCancelRegistration(userReg.id, selectedTournament.title);
                                                        }}
                                                        className="px-3.5 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors border border-rose-200"
                                                    >
                                                        Un-enroll / Cancel
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-medium italic">
                                                        Match in progress (Locked)
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            (selectedTournament.status || 'upcoming').toLowerCase() !== 'completed' && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const t = selectedTournament;
                                                        setSelectedTournament(null);
                                                        openRegisterModal(t);
                                                    }}
                                                    className="px-5 py-2.5 rounded-full bg-[#1C2C1D] hover:bg-[#2C442E] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all"
                                                >
                                                    <UserPlus className="w-4 h-4" />
                                                    <span>Register for Tournament</span>
                                                </button>
                                            )
                                        )}

                                        {selectedTournament.link && (
                                            <a
                                                href={selectedTournament.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 rounded-full bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                <span>Schedule</span>
                                            </a>
                                        )}

                                        <button
                                            onClick={() => setSelectedTournament(null)}
                                            className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── MEMBER / PLAYER TOURNAMENT REGISTRATION MODAL ── */}
                {registeringTournament && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
                        <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-xl w-full border border-slate-100 shadow-2xl space-y-6 my-auto max-h-[95vh] overflow-y-auto">
                            
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-[#D4E2D2] text-[#1C2C1D] flex items-center justify-center shrink-0">
                                        <Trophy className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                                            Tournament Registration
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-1">
                                            {registeringTournament.title}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setRegisteringTournament(null)}
                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={submitRegistration} className="space-y-4">
                                
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Golfer / Participant Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={regData.player_name}
                                        onChange={(e) => setRegData('player_name', e.target.value)}
                                        placeholder="e.g. Lt Col Kamrul / Salman Rahman"
                                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]"
                                        required
                                    />
                                    <InputError message={regErrors.player_name} className="mt-1" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                                Member ID
                                            </label>
                                            {user && (
                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                                                    <Lock className="w-2.5 h-2.5" />
                                                    <span>Locked</span>
                                                </span>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            value={regData.member_id}
                                            onChange={(e) => !user && setRegData('member_id', e.target.value)}
                                            readOnly={!!user}
                                            disabled={!!user}
                                            placeholder={user ? (user.member_id || user.membership_number || 'No Member ID') : 'BGC-260001 (Optional for Guests)'}
                                            className={`w-full px-3.5 py-2 rounded-2xl border text-xs sm:text-sm font-mono font-bold transition-all ${
                                                user 
                                                    ? 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed select-none' 
                                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]'
                                            }`}
                                        />
                                        {user && (
                                            <p className="text-[10px] text-slate-400 mt-1">
                                                Locked to your verified member profile.
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                            Current Handicap (H'cap)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="54"
                                            value={regData.handicap}
                                            onChange={(e) => setRegData('handicap', parseInt(e.target.value) || 0)}
                                            className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="text"
                                            value={regData.phone}
                                            onChange={(e) => setRegData('phone', e.target.value)}
                                            placeholder="017xxxxxxxx"
                                            className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]"
                                            required
                                        />
                                        <InputError message={regErrors.phone} className="mt-1" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={regData.email}
                                            onChange={(e) => setRegData('email', e.target.value)}
                                            placeholder="member@bgcbd.com"
                                            className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                            Match Category
                                        </label>
                                        <select
                                            value={regData.category}
                                            onChange={(e) => setRegData('category', e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]"
                                        >
                                            <option value="Regular Men">Regular Men</option>
                                            <option value="Ladies">Ladies</option>
                                            <option value="Senior">Senior</option>
                                            <option value="Junior">Junior</option>
                                            <option value="Veteran">Veteran</option>
                                            <option value="Guest">Guest</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                            Tournament T-Shirt Size
                                        </label>
                                        <select
                                            value={regData.t_shirt_size}
                                            onChange={(e) => setRegData('t_shirt_size', e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]"
                                        >
                                            <option value="S">Small (S)</option>
                                            <option value="M">Medium (M)</option>
                                            <option value="L">Large (L)</option>
                                            <option value="XL">Extra Large (XL)</option>
                                            <option value="XXL">XXL</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Notes / Caddy or Tee-Off Preferences
                                    </label>
                                    <textarea
                                        rows="2"
                                        value={regData.notes}
                                        onChange={(e) => setRegData('notes', e.target.value)}
                                        placeholder="Optional preferences or flight requests..."
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]"
                                    />
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRegisteringTournament(null)}
                                        className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={regProcessing}
                                        className="px-7 py-2 rounded-full bg-[#1C2C1D] hover:bg-[#2C442E] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Check className="w-4 h-4" />
                                        <span>{regProcessing ? 'Registering...' : 'Confirm Registration'}</span>
                                    </button>
                                </div>

                            </form>
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
                    loading={canceling}
                />
            </AuthenticatedLayout>
        );
    }

    // ─────────────────────────────────────────────────────────────
    // 2. GUEST PUBLIC VIEW (For non-logged in visitors)
    // ─────────────────────────────────────────────────────────────
    return (
        <PublicLayout>
            <Head title={`${type} - Bogura Golf Club`} />

            {/* ── EXECUTIVE HERO HEADER ── */}
            <div className="relative bg-gradient-to-b from-[#092215] via-[#0c2e1d] to-[#081b11] text-white pt-5 pb-10 sm:pt-10 sm:pb-16 md:pt-16 md:pb-28 overflow-hidden">
                <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                    <nav aria-label="Breadcrumb" className="flex items-center justify-center flex-wrap gap-x-1.5 gap-y-1 text-[10px] sm:text-xs font-semibold text-emerald-300/85 uppercase tracking-wider mb-2 sm:mb-4">
                        <Link href="/" className="hover:text-white transition-colors shrink-0">Home</Link>
                        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-50 shrink-0" />
                        <span className="shrink-0 text-emerald-200/90">Tournaments & Events</span>
                        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-50 shrink-0" />
                        <span className="text-white font-bold shrink-0">Tournament Calendar</span>
                    </nav>

                    <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-2 sm:mb-4" style={appleStyle}>
                        Golf Tournaments & Championships
                    </h1>

                    <p className="text-[11px] sm:text-base md:text-lg text-emerald-100/85 max-w-2xl mx-auto leading-normal sm:leading-relaxed font-normal px-2 sm:px-0">
                        Official tournament schedule, real-time match fixtures, entry guidelines, and championship circulars at Bogura Golf Club.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:gap-8 mt-3 sm:mt-8 text-[11px] sm:text-xs font-medium sm:font-semibold text-emerald-200">
                        <div className="flex items-center gap-1.5">
                            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                            <span>{statusCounts.all} Official Events</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-emerald-600 hidden sm:block" />
                        <div className="flex items-center gap-1.5">
                            <Radio className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
                            <span>{statusCounts.live} Active Matches</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-emerald-600 hidden sm:block" />
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
                            <span>{statusCounts.upcoming} Upcoming Fixtures</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── SEARCH & STATUS FILTER CONTROL BAR ── */}
            <div className="container mx-auto px-3.5 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 md:-mt-12 relative z-20">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xl border border-slate-200/90 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-0.5 md:pb-0 scrollbar-hide no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {[
                            { id: 'all', label: 'All Events', count: statusCounts.all },
                            { id: 'live', label: 'Live Now', count: statusCounts.live, isLive: true },
                            { id: 'upcoming', label: 'Upcoming', count: statusCounts.upcoming },
                            { id: 'completed', label: 'Completed', count: statusCounts.completed },
                        ].map((tab) => {
                            const isActive = selectedStatus === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedStatus(tab.id)}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full sm:rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 sm:gap-2 shrink-0 ${
                                        isActive
                                            ? 'bg-[#0c2417] text-white shadow-md'
                                            : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                                    }`}
                                >
                                    {tab.isLive && (
                                        <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-ping' : 'bg-emerald-600'}`} />
                                    )}
                                    <span>{tab.label}</span>
                                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-bold ${
                                        isActive ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tournaments or venues..."
                            className="w-full pl-10 pr-9 py-2 rounded-2xl bg-slate-100/90 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/50 focus:bg-white transition-all placeholder:text-slate-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                aria-label="Clear search"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── TOURNAMENT CARDS GRID ── */}
            <div className="bg-[#fafaf8] min-h-[500px] py-10 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredTournaments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {filteredTournaments.map((tournament) => {
                                const startDate = tournament.start_date ? new Date(tournament.start_date) : null;
                                const endDate = tournament.end_date ? new Date(tournament.end_date) : null;
                                const coverImg = resolveAssetUrl(tournament.image_path);
                                const isPdf = tournament.link && tournament.link.toLowerCase().endsWith('.pdf');

                                return (
                                    <div
                                        key={tournament.id}
                                        className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col group"
                                    >
                                        <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-900">
                                            <img
                                                src={coverImg}
                                                alt={tournament.title}
                                                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                                            <div className="absolute top-4 left-4 z-10">
                                                {renderStatusBadge(tournament.status)}
                                            </div>

                                            <button
                                                onClick={() => setSelectedTournament(tournament)}
                                                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-emerald-700 text-white backdrop-blur-md flex items-center justify-center transition-colors shadow-md"
                                                aria-label="View tournament details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            {startDate && (
                                                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-2xl bg-emerald-950/95 border border-emerald-500/40 text-white flex flex-col items-center justify-center shadow-lg backdrop-blur-md">
                                                        <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                                                            {startDate.toLocaleDateString('en-US', { month: 'short' })}
                                                        </span>
                                                        <span className="text-base font-bold leading-none text-amber-300">
                                                            {startDate.getDate()}
                                                        </span>
                                                    </div>
                                                    <div className="text-white drop-shadow-md">
                                                        <span className="text-[11px] font-semibold opacity-90 block">
                                                            {startDate.getFullYear()}
                                                        </span>
                                                        <span className="text-[11px] font-medium text-emerald-300">
                                                            {endDate ? `to ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : '1-Day Event'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                                            <div className="space-y-2.5">
                                                <h3 
                                                    onClick={() => setSelectedTournament(tournament)}
                                                    className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug cursor-pointer"
                                                    style={appleStyle}
                                                >
                                                    {tournament.title}
                                                </h3>

                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                                    <span className="truncate">{tournament.location || 'Bogura Golf Course, Majhira'}</span>
                                                </div>

                                                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-normal pt-1">
                                                    {tournament.description || 'Official club championship tournament. Please check guidelines and circulars for schedule and handicap eligibility.'}
                                                </p>
                                            </div>

                                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                                                {tournament.link ? (
                                                    <a
                                                        href={tournament.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 uppercase tracking-wider"
                                                    >
                                                        {isPdf ? <Download className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
                                                        <span>{isPdf ? 'Download Circular' : 'Tournament Link'}</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                        Club Fixture
                                                    </span>
                                                )}

                                                <button
                                                    onClick={() => setSelectedTournament(tournament)}
                                                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#0c2417] hover:text-white text-slate-800 text-xs font-semibold uppercase tracking-wider flex items-center gap-1 transition-all"
                                                >
                                                    <span>Details</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-5">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
                                <Trophy className="w-8 h-8 text-emerald-700" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900" style={appleStyle}>
                                    {selectedStatus === 'live'
                                        ? 'No Live Matches In Play Right Now'
                                        : selectedStatus === 'upcoming'
                                        ? 'No Upcoming Fixtures Currently Scheduled'
                                        : 'No Tournaments Found Matching Criteria'}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed font-normal">
                                    {selectedStatus === 'live'
                                        ? 'There are no active tournament matches underway at this exact moment. Please view upcoming scheduled tournaments or past match results.'
                                        : 'The tournament committee publishes fixtures ahead of each season. Check back shortly or browse all club notices.'}
                                </p>
                            </div>

                            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                                {selectedStatus !== 'all' && (
                                    <button
                                        onClick={() => setSelectedStatus('all')}
                                        className="px-5 py-2.5 rounded-full bg-[#0c2417] hover:bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-colors"
                                    >
                                        View All Tournaments ({statusCounts.all})
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── TOURNAMENT DETAILS MODAL ── */}
            {selectedTournament && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col my-auto">
                        <div className="relative h-48 sm:h-60 bg-slate-900 shrink-0">
                            <img
                                src={resolveAssetUrl(selectedTournament.image_path)}
                                alt={selectedTournament.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1200&auto=format&fit=crop';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40" />

                            <button
                                onClick={() => setSelectedTournament(null)}
                                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="absolute top-4 left-4 z-10">
                                {renderStatusBadge(selectedTournament.status)}
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                                <h2 className="text-xl sm:text-2xl font-bold leading-tight" style={appleStyle}>
                                    {selectedTournament.title}
                                </h2>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                                <div className="flex items-center gap-2.5 text-slate-700">
                                    <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                                    <div>
                                        <span className="font-semibold text-slate-900 block">Date:</span>
                                        <span>
                                            {selectedTournament.start_date ? new Date(selectedTournament.start_date).toLocaleDateString('en-US', { dateStyle: 'long' }) : 'TBA'}
                                            {selectedTournament.end_date && ` - ${new Date(selectedTournament.end_date).toLocaleDateString('en-US', { dateStyle: 'long' })}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2.5 text-slate-700">
                                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                                    <div>
                                        <span className="font-semibold text-slate-900 block">Venue:</span>
                                        <span>{selectedTournament.location || 'Bogura Golf Course, Majhira'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Tournament Information & Guidelines
                                </h4>
                                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                                    {selectedTournament.description || 'Official club championship tournament. Entry requirements and flight details are managed under the Bogura Golf Club Tournament Committee.'}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
                                {selectedTournament.link && (
                                    <a
                                        href={selectedTournament.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 rounded-full bg-[#0c2417] hover:bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-colors"
                                    >
                                        <Download className="w-4 h-4 text-emerald-400" />
                                        <span>Download Official Circular / Rulebook</span>
                                    </a>
                                )}
                                <button
                                    onClick={() => setSelectedTournament(null)}
                                    className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs uppercase tracking-wider transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                confirmText={confirmDialog.confirmText}
                cancelText={confirmDialog.cancelText}
                type={confirmDialog.type}
                loading={canceling}
            />
        </PublicLayout>
    );
}
