import UserDropdown from '@/Components/UserDropdown';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { 
    Users, 
    Calendar as CalendarIcon, 
    Flag, 
    Trophy, 
    Bell, 
    FileText, 
    User, 
    ShieldCheck, 
    Download, 
    ArrowUpRight, 
    ExternalLink, 
    MapPin, 
    Clock, 
    Building2,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Award,
    FolderOpen,
    Settings,
    Layers,
    Image as ImageIcon,
    Plus,
    Activity,
    Search,
    Star,
    CheckCircle2,
    SlidersHorizontal,
    Compass,
    KeyRound
} from 'lucide-react';

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

export default function Dashboard({ 
    dashboard_stats = {}, 
    allTournaments = [],
    recentTournaments = [], 
    recentNotices = [], 
    recentForms = [] 
}) {
    const { user } = usePage().props.auth;
    const { site_settings } = usePage().props;
    const isMember = user.role === 'member';

    const [searchQuery, setSearchQuery] = useState('');
    
    // Calendar Navigation State
    const [currentCalendarDate, setCurrentCalendarDate] = useState(() => new Date());
    const [selectedCalendarDay, setSelectedCalendarDay] = useState(() => new Date().getDate());

    // Month navigation helpers
    const currentYear = currentCalendarDate.getFullYear();
    const currentMonth = currentCalendarDate.getMonth();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[currentMonth];

    const prevMonth = () => {
        setCurrentCalendarDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const nextMonth = () => {
        setCurrentCalendarDate(new Date(currentYear, currentMonth + 1, 1));
    };

    // Active tournaments list for calendar matching
    const activeTournamentEvents = useMemo(() => {
        return allTournaments.length > 0 ? allTournaments : recentTournaments;
    }, [allTournaments, recentTournaments]);

    // Generate days grid for calendar
    const calendarDays = useMemo(() => {
        const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
        const mondayFirstDayIndex = (firstDayIndex + 6) % 7; 
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

        const days = [];

        // Previous month filler days
        for (let i = mondayFirstDayIndex - 1; i >= 0; i--) {
            days.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                isPrevMonth: true,
                events: []
            });
        }

        // Current month days
        const realToday = new Date();
        const isThisCurrentMonth = realToday.getFullYear() === currentYear && realToday.getMonth() === currentMonth;

        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = isThisCurrentMonth && realToday.getDate() === i;
            
            // Check if any tournament is active on this day (handling start_date & optional end_date)
            const currentDayDate = new Date(currentYear, currentMonth, i);
            currentDayDate.setHours(0, 0, 0, 0);

            const dayEvents = activeTournamentEvents.filter(t => {
                if (!t.start_date) return false;
                const startParts = t.start_date.substring(0, 10).split('-');
                if (startParts.length < 3) return false;
                const start = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));
                start.setHours(0, 0, 0, 0);

                let end = new Date(start);
                if (t.end_date) {
                    const endParts = t.end_date.substring(0, 10).split('-');
                    if (endParts.length === 3) {
                        end = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]));
                    }
                }
                end.setHours(23, 59, 59, 999);

                return currentDayDate >= start && currentDayDate <= end;
            });

            days.push({
                day: i,
                isCurrentMonth: true,
                isToday,
                hasEvent: dayEvents.length > 0,
                events: dayEvents
            });
        }

        // Next month filler days
        const totalCells = days.length <= 35 ? 35 : 42;
        const remaining = totalCells - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                isNextMonth: true,
                events: []
            });
        }

        return days;
    }, [currentYear, currentMonth, activeTournamentEvents]);

    // Tournaments happening on the selected day
    const selectedDayEvents = useMemo(() => {
        const found = calendarDays.find(d => d.isCurrentMonth && d.day === selectedCalendarDay);
        return found?.events || [];
    }, [calendarDays, selectedCalendarDay]);

    // Search filter for lists
    const filteredTournaments = useMemo(() => {
        if (!searchQuery.trim()) return recentTournaments;
        const q = searchQuery.toLowerCase();
        return recentTournaments.filter(t => 
            t.title?.toLowerCase().includes(q) || 
            t.location?.toLowerCase().includes(q)
        );
    }, [recentTournaments, searchQuery]);

    const filteredNotices = useMemo(() => {
        if (!searchQuery.trim()) return recentNotices;
        const q = searchQuery.toLowerCase();
        return recentNotices.filter(n => 
            n.title?.toLowerCase().includes(q)
        );
    }, [recentNotices, searchQuery]);

    return (
        <AuthenticatedLayout header={isMember ? "Member Portal" : "Administration Hub"}>
            <Head title={isMember ? "Member Dashboard - Bogura Golf Club" : "Admin Dashboard - Bogura Golf Club"} />

            <div className="bg-[#F8F9F8] min-h-screen text-slate-900 pb-16">
                <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-7">

                    {/* ══════════════════════════════════════════════════════
                       TOP HEADER AREA
                    ══════════════════════════════════════════════════════ */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                                Welcome back, {user.name.split(' ')[0]}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
                                <span>{isMember ? 'Bogura Golf Club Member Portal' : 'Official Administration Console'}</span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1 text-[#2B402C] font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-[#3D5A3E]"></span>
                                    Live System
                                </span>
                            </p>
                        </div>

                        {/* Top Right Controls: Search Pill & User Avatar */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-full md:w-80 lg:w-96">
                                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search fixtures, circulars, forms..."
                                    className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200/80 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] shadow-xs transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ══════════════════════════════════════════════════════
                       MAIN BENTO GRID (Left 7-Cols & Right 5-Cols)
                    ══════════════════════════════════════════════════════ */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-7 items-start">
                        
                        {/* ──────────────────────────────────────────────────
                           LEFT COLUMN (Content, Activities, Progress, Cards)
                        ────────────────────────────────────────────────── */}
                        <div className="xl:col-span-7 2xl:col-span-7 space-y-7">
                            
                            {/* SECTION 1: Your activities today */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-display">
                                        {isMember ? 'Club Services & Quick Access' : 'Your activities today'}
                                    </h2>
                                    <span className="text-xs sm:text-sm font-bold text-slate-400">
                                        ({(dashboard_stats.total_tournaments || 0) + (dashboard_stats.total_notices || 0)})
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                    
                                    {/* Military Olive Bento Card 1: Soft Sage Olive (#D4E2D2) */}
                                    <div className="bg-[#D4E2D2] rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[200px] border border-[#BFD4BD] shadow-xs relative transition-all duration-300 hover:shadow-md">
                                        <div className="flex items-start justify-between">
                                            {/* Overlapping Avatar Stack */}
                                            <div className="flex items-center -space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-[#1C2C1D] text-white flex items-center justify-center text-xs font-bold border-2 border-[#D4E2D2]">
                                                    <Trophy className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-[#2C442E] text-white flex items-center justify-center text-xs font-bold border-2 border-[#D4E2D2]">
                                                    <Flag className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-[#415C43] text-white flex items-center justify-center text-xs font-bold border-2 border-[#D4E2D2]">
                                                    <Award className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-white/90 text-slate-800 flex items-center justify-center text-[10px] font-bold border-2 border-[#D4E2D2]">
                                                    +{dashboard_stats.total_tournaments || 4}
                                                </div>
                                            </div>

                                            {/* Rating / Status Pill */}
                                            <div className="bg-white/85 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-2xs">
                                                <Star className="w-3.5 h-3.5 fill-[#3D5A3E] text-[#2C442E]" />
                                                <span>Active Fixtures</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-end justify-between gap-4">
                                            <div>
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#243B26] block mb-1">
                                                    Match Hub
                                                </span>
                                                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                                                    Tournaments & Matches
                                                </h3>
                                            </div>

                                            <Link
                                                href={isMember ? "/tournament" : route('tournaments.index')}
                                                className="w-10 h-10 rounded-full bg-white text-[#1C2C1D] shadow-sm flex items-center justify-center shrink-0 hover:bg-[#1C2C1D] hover:text-white transition-colors duration-200"
                                                title="Open Tournaments"
                                            >
                                                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Military Olive Bento Card 2: Field Sand Khaki (#E2E6D5) */}
                                    <div className="bg-[#E2E6D5] rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[200px] border border-[#CCD3BD] shadow-xs relative transition-all duration-300 hover:shadow-md">
                                        <div className="flex items-start justify-between">
                                            {/* Overlapping Avatar Stack */}
                                            <div className="flex items-center -space-x-2">
                                                <div className="w-8 h-8 rounded-full bg-[#1C2C1D] text-white flex items-center justify-center text-xs font-bold border-2 border-[#E2E6D5]">
                                                    <Bell className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-[#3E4F33] text-white flex items-center justify-center text-xs font-bold border-2 border-[#E2E6D5]">
                                                    <FileText className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-white/90 text-slate-800 flex items-center justify-center text-[10px] font-bold border-2 border-[#E2E6D5]">
                                                    +{dashboard_stats.total_notices || 4}
                                                </div>
                                            </div>

                                            {/* Status Pill */}
                                            <div className="bg-white/85 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-2xs">
                                                <Star className="w-3.5 h-3.5 fill-[#4C5D3D] text-[#3E4F33]" />
                                                <span>Circulars</span>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex items-end justify-between gap-4">
                                            <div>
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#35432B] block mb-1">
                                                    Official Bulletins
                                                </span>
                                                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                                                    Notice Board & Updates
                                                </h3>
                                            </div>

                                            <Link
                                                href={isMember ? "/notice-board" : route('notices.index')}
                                                className="w-10 h-10 rounded-full bg-white text-[#1C2C1D] shadow-sm flex items-center justify-center shrink-0 hover:bg-[#1C2C1D] hover:text-white transition-colors duration-200"
                                                title="Open Notices"
                                            >
                                                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* SECTION 2: Club Overview & Statistics */}
                            <div className="space-y-4">
                                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-display">
                                    {isMember ? 'Club Fixtures & Resources' : 'Management progress & metrics'}
                                </h2>

                                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                    
                                    {!isMember ? (
                                        /* Stat 1 for Admin: Total Members (#D4E2D2) */
                                        <div className="bg-[#D4E2D2] rounded-[24px] p-4 sm:p-5 flex flex-col justify-between border border-[#BFD4BD] shadow-xs relative group">
                                            <div>
                                                <span className="text-xs font-semibold text-slate-700 block">Total Members</span>
                                                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-display">
                                                    {dashboard_stats.total_members || 0}
                                                </p>
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Link
                                                    href={route('users.index')}
                                                    className="w-8 h-8 rounded-full bg-white text-[#1C2C1D] shadow-2xs flex items-center justify-center group-hover:bg-[#1C2C1D] group-hover:text-white transition-colors"
                                                >
                                                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                                                </Link>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Stat 1 for Member: Official Bulletins / Notices (#D4E2D2) */
                                        <div className="bg-[#D4E2D2] rounded-[24px] p-4 sm:p-5 flex flex-col justify-between border border-[#BFD4BD] shadow-xs relative group">
                                            <div>
                                                <span className="text-xs font-semibold text-slate-700 block">Official Bulletins</span>
                                                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-display">
                                                    {dashboard_stats.total_notices || 0}
                                                </p>
                                            </div>
                                            <div className="mt-4 flex justify-end">
                                                <Link
                                                    href="/notice-board"
                                                    className="w-8 h-8 rounded-full bg-white text-[#1C2C1D] shadow-2xs flex items-center justify-center group-hover:bg-[#1C2C1D] group-hover:text-white transition-colors"
                                                >
                                                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stat 2: Warm Olive Khaki (#E2E6D5) */}
                                    <div className="bg-[#E2E6D5] rounded-[24px] p-4 sm:p-5 flex flex-col justify-between border border-[#CCD3BD] shadow-xs relative group">
                                        <div>
                                            <span className="text-xs font-semibold text-slate-700 block">
                                                {isMember ? 'Active Tournaments' : 'Tournaments'}
                                            </span>
                                            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-display">
                                                {dashboard_stats.total_tournaments || 0}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <Link
                                                href={isMember ? "/tournament" : route('tournaments.index')}
                                                className="w-8 h-8 rounded-full bg-white text-[#1C2C1D] shadow-2xs flex items-center justify-center group-hover:bg-[#1C2C1D] group-hover:text-white transition-colors"
                                            >
                                                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Stat 3: Muted Drab Olive (#D8DFD5) */}
                                    <div className="bg-[#D8DFD5] rounded-[24px] p-4 sm:p-5 flex flex-col justify-between border border-[#C5CEC1] shadow-xs relative group">
                                        <div>
                                            <span className="text-xs font-semibold text-slate-700 block">Committees</span>
                                            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-display">
                                                {dashboard_stats.total_committees || 0}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <Link
                                                href={!isMember ? route('committee-members.index') : "/committee-list"}
                                                className="w-8 h-8 rounded-full bg-white text-[#1C2C1D] shadow-2xs flex items-center justify-center group-hover:bg-[#1C2C1D] group-hover:text-white transition-colors"
                                            >
                                                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* SECTION 3: Wide Bubbly Feature Cards & Progress Bars */}
                            <div className="space-y-4">
                                
                                {/* Wide Card A: Warm Olive Khaki with progress status */}
                                <div className="bg-[#DFE5D4] rounded-[28px] p-6 sm:p-7 border border-[#CBD4BD] shadow-xs space-y-4 relative">
                                    <div className="flex items-center justify-between">
                                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-xs text-xs font-bold text-slate-800 shadow-2xs">
                                            <Activity className="w-3.5 h-3.5 text-[#2C442E]" />
                                            <span>Bogura Golf Course &bull; 9-Hole Operational</span>
                                        </div>

                                        <Link
                                            href="/"
                                            target="_blank"
                                            className="w-9 h-9 rounded-full bg-white text-[#1C2C1D] shadow-2xs flex items-center justify-center hover:bg-[#1C2C1D] hover:text-white transition-colors"
                                            title="View Public Site"
                                        >
                                            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                                        </Link>
                                    </div>

                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#2B402C] block mb-1">
                                            Course Maintenance & Match Dispatcher
                                        </span>
                                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                                            Green Aeration, Practice Grounds & Active Fixtures
                                        </h3>
                                    </div>

                                    {/* Progress track */}
                                    <div className="space-y-1.5 pt-1">
                                        <div className="w-full bg-[#1C2C1D]/10 h-2.5 rounded-full overflow-hidden">
                                            <div className="bg-[#1C2C1D] h-2.5 rounded-full w-4/5"></div>
                                        </div>
                                        <div className="flex justify-between text-[11px] font-bold text-[#2B402C]">
                                            <span>Club Season Readiness</span>
                                            <span>85% Completed</span>
                                        </div>
                                    </div>

                                    {/* Quick action buttons row */}
                                    {!isMember && (
                                        <div className="pt-2 flex flex-wrap items-center gap-2">
                                            <Link
                                                href={route('notices.create')}
                                                className="px-4 py-2 rounded-full bg-[#1C2C1D] text-white text-xs font-bold hover:bg-[#2C442E] transition-colors flex items-center gap-1.5 shadow-xs"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>Publish Notice</span>
                                            </Link>
                                            <Link
                                                href={route('tournaments.create')}
                                                className="px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-white transition-colors border border-[#CBD4BD] shadow-2xs flex items-center gap-1.5"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>New Tournament</span>
                                            </Link>
                                            <Link
                                                href={route('media.index')}
                                                className="px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-white transition-colors border border-[#CBD4BD] shadow-2xs flex items-center gap-1.5"
                                            >
                                                <FolderOpen className="w-3.5 h-3.5" />
                                                <span>Media Library</span>
                                            </Link>
                                            {user.role === 'super_admin' && (
                                                <Link
                                                    href={route('settings.index') + '?tab=google'}
                                                    className="px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-emerald-50 transition-colors border border-[#CBD4BD] shadow-2xs flex items-center gap-1.5"
                                                >
                                                    <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                                                    <span>Google Login Setup</span>
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Wide Card B: Soft Olive Field Governance Card */}
                                <div className="bg-[#D6E0D5] rounded-[28px] p-6 sm:p-7 border border-[#C2CEC0] shadow-xs space-y-4 relative">
                                    <div className="flex items-center justify-between">
                                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-xs text-xs font-bold text-slate-800 shadow-2xs">
                                            <FileText className="w-3.5 h-3.5 text-[#2C442E]" />
                                            <span>Governance, Downloads & Directory</span>
                                        </div>

                                        <Link
                                            href={isMember ? "/club-form" : route('forms.index')}
                                            className="w-9 h-9 rounded-full bg-white text-[#1C2C1D] shadow-2xs flex items-center justify-center hover:bg-[#1C2C1D] hover:text-white transition-colors"
                                        >
                                            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                                        </Link>
                                    </div>

                                    <div>
                                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                                            Official Club Forms, Committee Boards & Media Assets
                                        </h3>
                                        <p className="text-xs text-[#2A3F2B]/80 mt-1 leading-relaxed">
                                            Access printable membership forms, administrative contact directories, and tournament winner archives.
                                        </p>
                                    </div>

                                    {/* Category pills */}
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <Link
                                            href={isMember ? "/club-form" : route('forms.index')}
                                            className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-white transition-colors shadow-2xs"
                                        >
                                            Club Forms ({dashboard_stats.total_forms || recentForms.length || 0})
                                        </Link>
                                        <Link
                                            href={isMember ? "/guest-room-rent" : route('committee-members.index')}
                                            className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-white transition-colors shadow-2xs"
                                        >
                                            {isMember ? 'Guest Rooms' : 'Committees'}
                                        </Link>
                                        <Link
                                            href={route('contact-directory.index')}
                                            className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-white transition-colors shadow-2xs"
                                        >
                                            Directory
                                        </Link>
                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* ──────────────────────────────────────────────────
                           RIGHT COLUMN (Calendar & Stacked Event Pills)
                        ────────────────────────────────────────────────── */}
                        <div className="xl:col-span-5 2xl:col-span-5 space-y-7">
                            
                            {/* SECTION: Calendar Widget */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 font-display">
                                        Club schedule
                                    </h2>
                                    <span className="text-xs font-bold text-slate-400">
                                        {monthName} {currentYear}
                                    </span>
                                </div>

                                <div className="bg-white rounded-[28px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100 space-y-5">
                                    
                                    {/* Month Header with Nav Arrows */}
                                    <div className="flex items-center justify-between pb-1">
                                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
                                            {monthName} {currentYear}
                                        </h3>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={prevMonth}
                                                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors"
                                                title="Previous Month"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={nextMonth}
                                                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors"
                                                title="Next Month"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Weekdays Row */}
                                    <div className="grid grid-cols-7 text-center">
                                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                                            <span key={day} className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1">
                                                {day}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Days Grid */}
                                    <div className="grid grid-cols-7 gap-y-2.5 gap-x-1 text-center">
                                        {calendarDays.map((item, idx) => {
                                            const isSelected = item.isCurrentMonth && selectedCalendarDay === item.day;
                                            const tooltipText = item.events.length > 0 ? item.events.map(e => e.title).join(' • ') : undefined;
                                            
                                            return (
                                                <div key={idx} className="flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => item.isCurrentMonth && setSelectedCalendarDay(item.day)}
                                                        disabled={!item.isCurrentMonth}
                                                        title={tooltipText}
                                                        className={`relative w-8 h-8 sm:w-9 sm:h-9 text-xs font-semibold rounded-full flex flex-col items-center justify-center transition-all ${
                                                            !item.isCurrentMonth
                                                                ? 'text-slate-300 border border-dashed border-slate-200/80 cursor-default'
                                                                : item.isToday && isSelected
                                                                    ? 'bg-[#1C2C1D] text-white font-black shadow-md scale-105 ring-2 ring-[#4CAF50]'
                                                                    : item.isToday
                                                                        ? 'bg-[#1C2C1D] text-white font-black shadow-sm scale-105'
                                                                        : isSelected
                                                                            ? 'bg-[#1C2C1D] text-white font-bold shadow-xs'
                                                                            : item.hasEvent
                                                                                ? 'bg-[#D4E2D2] text-[#1C2C1D] font-extrabold border border-[#A9C4A6] hover:bg-[#BFD4BD] hover:scale-105 shadow-2xs'
                                                                                : 'text-slate-700 hover:bg-slate-100'
                                                                }`}
                                                    >
                                                        <span className={item.hasEvent ? '-mt-1' : ''}>{item.day}</span>
                                                        {item.hasEvent && (
                                                            <span className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                                                                (item.isToday || isSelected) ? 'bg-amber-300' : 'bg-[#1C2C1D]'
                                                            }`} />
                                                        )}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Selected Day Match Fixtures Preview */}
                                    {selectedDayEvents.length > 0 && (
                                        <div className="p-3.5 rounded-2xl bg-[#E2EBDD] border border-[#BFD4BD] space-y-2 animate-in fade-in duration-200 shadow-2xs">
                                            <div className="flex items-center justify-between text-[11px] font-bold text-[#1C2C1D]">
                                                <span className="flex items-center gap-1.5">
                                                    <Trophy className="w-3.5 h-3.5 text-[#2C442E]" />
                                                    <span>Fixtures on {monthName} {selectedCalendarDay}</span>
                                                </span>
                                                <span className="px-2 py-0.5 rounded-full bg-[#1C2C1D] text-white text-[9px] font-bold">
                                                    {selectedDayEvents.length} Match{selectedDayEvents.length > 1 ? 'es' : ''}
                                                </span>
                                            </div>
                                            <div className="space-y-1.5 pt-1">
                                                {selectedDayEvents.map(ev => (
                                                    <div key={ev.id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/90 border border-[#BFD4BD]/60 shadow-2xs">
                                                        <div className="min-w-0">
                                                            <h5 className="text-xs font-bold text-slate-900 truncate">{ev.title}</h5>
                                                            <p className="text-[10px] text-slate-500 font-medium truncate">{ev.location || 'Bogura Golf Club'}</p>
                                                        </div>
                                                        <Link
                                                            href={isMember ? "/tournament" : route('tournaments.edit', ev.id)}
                                                            className="px-2.5 py-1 rounded-full bg-[#1C2C1D] text-white text-[10px] font-bold hover:bg-[#2C442E] transition-colors shrink-0 flex items-center gap-1"
                                                        >
                                                            <span>{isMember ? 'Register' : 'Manage'}</span>
                                                            <ArrowRight className="w-2.5 h-2.5" />
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Calendar Legend */}
                                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#1C2C1D]"></span>
                                            <span>Today</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#D4E2D2] border border-[#BFD4BD]"></span>
                                            <span>Match Fixture</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SECTION: Stacked Soft Pill Cards in Olive Tones */}
                            <div className="space-y-3.5">
                                
                                {/* Recent Tournaments Header */}
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Upcoming Fixtures
                                    </span>
                                    <Link 
                                        href={isMember ? "/tournament" : route('tournaments.index')} 
                                        className="text-xs font-bold text-[#2B402C] hover:underline"
                                    >
                                        View all ({dashboard_stats.total_tournaments || recentTournaments.length})
                                    </Link>
                                </div>

                                {filteredTournaments.length > 0 ? (
                                    filteredTournaments.slice(0, 3).map((tourn) => {
                                        const startDate = tourn.start_date ? new Date(tourn.start_date) : null;
                                        return (
                                            <div 
                                                key={tourn.id}
                                                className="bg-[#D4E2D2] rounded-[24px] p-4 sm:p-4.5 flex items-center justify-between gap-3.5 border border-[#BFD4BD] shadow-xs transition-all duration-200 hover:bg-[#C9DBC7]"
                                            >
                                                <div className="flex items-center gap-3.5 min-w-0">
                                                    <div className="w-10 h-10 rounded-full bg-[#1C2C1D] text-white flex items-center justify-center shrink-0 shadow-xs">
                                                        <Trophy className="w-4 h-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                                                            {tourn.title}
                                                        </h4>
                                                        <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                                                            {startDate ? formatDateDDMMYYYY(tourn.start_date) : 'Bogura Golf Club'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Link
                                                    href={isMember ? "/tournament" : route('tournaments.edit', tourn.id)}
                                                    className="w-8 h-8 rounded-full bg-white text-[#1C2C1D] shadow-2xs flex items-center justify-center shrink-0 hover:bg-[#1C2C1D] hover:text-white transition-colors"
                                                    title="View Details"
                                                >
                                                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                                                </Link>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="bg-white rounded-[24px] p-5 text-center text-xs text-slate-400 border border-slate-100">
                                        No upcoming tournaments found.
                                    </div>
                                )}

                                {/* Recent Notices Header */}
                                <div className="flex items-center justify-between px-1 pt-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Latest Circulars
                                    </span>
                                    <Link 
                                        href={isMember ? "/notice-board" : route('notices.index')} 
                                        className="text-xs font-bold text-[#2B402C] hover:underline"
                                    >
                                        View all ({dashboard_stats.total_notices || recentNotices.length})
                                    </Link>
                                </div>

                                {filteredNotices.length > 0 ? (
                                    filteredNotices.slice(0, 3).map((n) => {
                                        const pubDate = n.created_at ? new Date(n.created_at) : null;
                                        return (
                                            <div 
                                                key={n.id}
                                                className="bg-[#E2E6D5] rounded-[24px] p-4 sm:p-4.5 flex items-center justify-between gap-3.5 border border-[#CCD3BD] shadow-xs transition-all duration-200 hover:bg-[#D8DEC9]"
                                            >
                                                <div className="flex items-center gap-3.5 min-w-0">
                                                    <div className="w-10 h-10 rounded-full bg-[#1C2C1D] text-white flex items-center justify-center shrink-0 shadow-xs">
                                                        <Bell className="w-4 h-4" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                                                            {n.title}
                                                        </h4>
                                                        <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                                                            {pubDate ? formatDateDDMMYYYY(n.created_at) : 'Official Circular'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Link
                                                    href={isMember ? "/notice-board" : route('notices.edit', n.id)}
                                                    className="w-8 h-8 rounded-full bg-white text-[#1C2C1D] shadow-2xs flex items-center justify-center shrink-0 hover:bg-[#1C2C1D] hover:text-white transition-colors"
                                                    title="View Circular"
                                                >
                                                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                                                </Link>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="bg-white rounded-[24px] p-5 text-center text-xs text-slate-400 border border-slate-100">
                                        No circulars published.
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
