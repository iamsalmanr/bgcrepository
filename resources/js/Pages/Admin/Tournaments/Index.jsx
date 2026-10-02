import React, { useState, useMemo, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserDropdown from '@/Components/UserDropdown';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { 
    Plus, 
    Pencil, 
    Trash2, 
    Trophy, 
    Calendar, 
    MapPin, 
    ExternalLink, 
    Search, 
    CheckCircle2, 
    Sparkles, 
    Eye, 
    Check, 
    X, 
    Clock, 
    Award, 
    GripVertical, 
    LayoutGrid, 
    List,
    Activity,
    ArrowUpRight,
    Users,
    UserCheck,
    Phone,
    Mail,
    Printer,
    UserPlus,
    Tag,
    ChevronDown,
    SlidersHorizontal,
    Flag
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import InputError from '@/Components/InputError';

const DEFAULT_TOURNAMENT_IMAGE = 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop';

const getTournamentImage = (path) => {
    if (!path) return DEFAULT_TOURNAMENT_IMAGE;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return path;
    return `/storage/${path}`;
};

function SortableTournamentRow({ tournament, index, onDelete, onQuickToggle, onOpenParticipants }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: tournament.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 0,
        position: 'relative',
    };

    const status = (tournament.status || 'upcoming').toLowerCase();
    const participantsCount = tournament.registrations?.length || 0;

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

    const formatDateRange = (start, end) => {
        if (!start) return 'Dates TBA';
        if (!end || start === end) {
            return formatDateDDMMYYYY(start);
        }
        return `${formatDateDDMMYYYY(start)} to ${formatDateDDMMYYYY(end)}`;
    };

    return (
        <tr 
            ref={setNodeRef} 
            style={style} 
            className={`transition-colors group ${isDragging ? 'bg-[#D4E2D2] shadow-xl opacity-90' : 'hover:bg-slate-50/80'}`}
        >
            {/* Drag Handle */}
            <td className="px-4 py-4 w-10 text-center">
                <div 
                    {...attributes} 
                    {...listeners} 
                    className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg text-slate-300 hover:text-[#1C2C1D] hover:bg-[#D4E2D2] transition-colors inline-block"
                    title="Drag to reorder sequence"
                >
                    <GripVertical className="w-4 h-4" />
                </div>
            </td>

            {/* Tournament Title & Venue */}
            <td className="px-4 py-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#1C2C1D] border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs overflow-hidden">
                        <img 
                            src={getTournamentImage(tournament.image_path)} 
                            alt={tournament.title}
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                                e.target.src = DEFAULT_TOURNAMENT_IMAGE;
                            }}
                        />
                    </div>
                    <div className="min-w-0">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-[#1C2C1D] transition-colors block truncate">
                            {tournament.title}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{tournament.location || 'Bogura Golf Course'}</span>
                        </div>
                    </div>
                </div>
            </td>

            {/* Date Schedule */}
            <td className="px-4 py-4 whitespace-nowrap text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDateRange(tournament.start_date, tournament.end_date)}</span>
                </div>
            </td>

            {/* Registered Players / Participants Button */}
            <td className="px-4 py-4 whitespace-nowrap">
                <button
                    type="button"
                    onClick={() => onOpenParticipants(tournament)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E2E6D5] hover:bg-[#D4E2D2] text-[#1C2C1D] text-xs font-bold transition-all border border-[#CBD4BD] shadow-2xs"
                >
                    <Users className="w-3.5 h-3.5" />
                    <span>{participantsCount} Registered</span>
                </button>
            </td>

            {/* Event Status */}
            <td className="px-4 py-4 whitespace-nowrap">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-xs ${
                    status === 'live' 
                        ? 'bg-[#D4E2D2] text-[#1C2C1D] border-[#BFD4BD] animate-pulse' 
                        : status === 'completed' 
                        ? 'bg-slate-100 text-slate-700 border-slate-200' 
                        : 'bg-[#E2E6D5] text-[#2C442E] border-[#CCD3BD]'
                }`}>
                    {status}
                </span>
            </td>

            {/* Public Visibility Toggle */}
            <td className="px-4 py-4 whitespace-nowrap">
                <button
                    type="button"
                    onClick={() => onQuickToggle(tournament)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                        tournament.is_active 
                            ? 'bg-[#D4E2D2] text-[#1C2C1D] border border-[#BFD4BD] hover:bg-[#C2D6BF]' 
                            : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Click to toggle public visibility"
                >
                    <span className={`w-1.5 h-1.5 rounded-full ${tournament.is_active ? 'bg-[#1C2C1D]' : 'bg-slate-400'}`} />
                    <span>{tournament.is_active ? 'Active' : 'Hidden'}</span>
                </button>
            </td>

            {/* Actions */}
            <td className="px-4 py-4 whitespace-nowrap text-right text-xs">
                <div className="flex items-center justify-end gap-1.5">
                    <button
                        type="button"
                        onClick={() => onOpenParticipants(tournament)}
                        className="px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#1C2C1D] hover:text-white text-slate-700 font-bold text-[11px] transition-colors flex items-center gap-1"
                        title="Manage Tournament Players"
                    >
                        <Users className="w-3.5 h-3.5" />
                        <span>Players</span>
                    </button>

                    <Link
                        href={route('tournaments.edit', tournament.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Tournament"
                    >
                        <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                        type="button"
                        onClick={() => onDelete(tournament.id, tournament.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Tournament"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function Index({ tournaments: initialTournaments = [], members = [] }) {
    const { flash } = usePage().props;
    const [items, setItems] = useState(initialTournaments);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    // Participant Management Modal State
    const [selectedTournamentForPlayers, setSelectedTournamentForPlayers] = useState(null);
    const [playerSearchQuery, setPlayerSearchQuery] = useState('');
    const [playerStatusFilter, setPlayerStatusFilter] = useState('all');
    const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);

    // Member Selector for Add Player Modal
    const [memberSearchQuery, setMemberSearchQuery] = useState('');
    const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
    const memberDropdownRef = useRef(null);

    // Form for Adding / Editing Player in Tournament
    const { data: playerData, setData: setPlayerData, post: postPlayer, put: putPlayer, processing: playerProcessing, reset: resetPlayer, errors: playerErrors, clearErrors: clearPlayerErrors } = useForm({
        user_id: '',
        player_name: '',
        member_id: '',
        email: '',
        phone: '',
        handicap: 0,
        category: 'Regular Men',
        t_shirt_size: 'L',
        status: 'confirmed',
        notes: '',
    });

    useEffect(() => {
        setItems(initialTournaments);
    }, [initialTournaments]);

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

    // Filtered Tournaments
    const filteredTournaments = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch = searchQuery === '' || 
                item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchQuery.toLowerCase());
            
            const itemStatus = (item.status || 'upcoming').toLowerCase();
            const matchesStatus = statusFilter === 'all' || itemStatus === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [items, searchQuery, statusFilter]);

    // Filtered Players inside Participant Modal
    const currentTournamentRegistrations = useMemo(() => {
        if (!selectedTournamentForPlayers) return [];
        const found = items.find(t => t.id === selectedTournamentForPlayers.id);
        return found?.registrations || selectedTournamentForPlayers.registrations || [];
    }, [items, selectedTournamentForPlayers]);

    const filteredPlayers = useMemo(() => {
        return currentTournamentRegistrations.filter(reg => {
            const q = playerSearchQuery.toLowerCase();
            const matchesSearch = !q || 
                (reg.player_name && reg.player_name.toLowerCase().includes(q)) ||
                (reg.member_id && reg.member_id.toLowerCase().includes(q)) ||
                (reg.phone && reg.phone.toLowerCase().includes(q)) ||
                (reg.category && reg.category.toLowerCase().includes(q));

            const matchesStatus = playerStatusFilter === 'all' || reg.status === playerStatusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [currentTournamentRegistrations, playerSearchQuery, playerStatusFilter]);

    // Member search for player modal
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

    // Sensors for DND
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setItems((currentItems) => {
                const oldIndex = currentItems.findIndex((item) => item.id === active.id);
                const newIndex = currentItems.findIndex((item) => item.id === over.id);
                const reordered = arrayMove(currentItems, oldIndex, newIndex);

                const orders = reordered.map((item, idx) => ({
                    id: item.id,
                    sort_order: idx + 1,
                }));

                setIsSavingOrder(true);
                axios.post(route('tournaments.reorder'), { orders })
                    .catch((err) => console.error('Error saving reordered tournaments:', err))
                    .finally(() => setIsSavingOrder(false));

                return reordered;
            });
        }
    };

    const handleDelete = (id, title) => {
        if (confirm(`Are you sure you want to delete tournament "${title}"?`)) {
            router.delete(route('tournaments.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    setItems(prev => prev.filter(t => t.id !== id));
                },
            });
        }
    };

    const handleQuickToggleActive = (tournament) => {
        const updatedIsActive = !tournament.is_active;
        setItems(prev => prev.map(t => t.id === tournament.id ? { ...t, is_active: updatedIsActive } : t));

        router.put(route('tournaments.update', tournament.id), {
            title: tournament.title,
            start_date: tournament.start_date,
            end_date: tournament.end_date,
            status: tournament.status,
            location: tournament.location,
            link: tournament.link,
            is_active: updatedIsActive,
            sort_order: tournament.sort_order,
        }, {
            preserveScroll: true,
        });
    };

    // Open Participant Manager
    const handleOpenParticipants = (tournament) => {
        setSelectedTournamentForPlayers(tournament);
        setPlayerSearchQuery('');
        setPlayerStatusFilter('all');
        setIsAddPlayerOpen(false);
        setEditingPlayer(null);
    };

    const handleOpenAddPlayer = () => {
        clearPlayerErrors();
        resetPlayer();
        setEditingPlayer(null);
        setMemberSearchQuery('');
        setPlayerData({
            user_id: '',
            player_name: '',
            member_id: '',
            email: '',
            phone: '',
            handicap: 0,
            category: 'Regular Men',
            t_shirt_size: 'L',
            status: 'confirmed',
            notes: '',
        });
        setIsAddPlayerOpen(true);
    };

    const handleOpenEditPlayer = (player) => {
        clearPlayerErrors();
        setEditingPlayer(player);
        setMemberSearchQuery('');
        setPlayerData({
            user_id: player.user_id || '',
            player_name: player.player_name || '',
            member_id: player.member_id || '',
            email: player.email || '',
            phone: player.phone || '',
            handicap: player.handicap || 0,
            category: player.category || 'Regular Men',
            t_shirt_size: player.t_shirt_size || 'L',
            status: player.status || 'confirmed',
            notes: player.notes || '',
        });
        setIsAddPlayerOpen(true);
    };

    const handleSelectMemberForPlayer = (member) => {
        if (!member) {
            setPlayerData(prev => ({
                ...prev,
                user_id: '',
                player_name: '',
                member_id: '',
                email: '',
                phone: '',
            }));
        } else {
            const memberCode = member.member_id || '';
            setPlayerData(prev => ({
                ...prev,
                user_id: member.id,
                player_name: member.name,
                member_id: memberCode,
                email: member.email || '',
                phone: member.phone || '',
            }));
        }
        setIsMemberDropdownOpen(false);
    };

    const submitPlayerForm = (e) => {
        e.preventDefault();
        if (!selectedTournamentForPlayers) return;

        if (editingPlayer) {
            putPlayer(route('admin.tournaments.registrations.update', editingPlayer.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAddPlayerOpen(false);
                    setEditingPlayer(null);
                    router.reload({ only: ['tournaments'] });
                },
            });
        } else {
            postPlayer(route('admin.tournaments.registrations.store', selectedTournamentForPlayers.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsAddPlayerOpen(false);
                    router.reload({ only: ['tournaments'] });
                },
            });
        }
    };

    const handlePlayerStatusChange = (playerId, newStatus) => {
        router.post(route('admin.tournaments.registrations.status', playerId), {
            status: newStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['tournaments'] });
            },
        });
    };

    const handleDeletePlayer = (playerId, playerName) => {
        if (confirm(`Remove "${playerName}" from this tournament?`)) {
            router.delete(route('admin.tournaments.registrations.destroy', playerId), {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['tournaments'] });
                },
            });
        }
    };

    // Calculate Statistics
    const stats = useMemo(() => {
        const total = items.length;
        const upcoming = items.filter(t => (t.status || 'upcoming').toLowerCase() === 'upcoming').length;
        const live = items.filter(t => (t.status || 'upcoming').toLowerCase() === 'live').length;
        const completed = items.filter(t => (t.status || 'upcoming').toLowerCase() === 'completed').length;
        const totalPlayers = items.reduce((acc, t) => acc + (t.registrations?.length || 0), 0);
        return { total, upcoming, live, completed, totalPlayers };
    }, [items]);

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

    const formatDateRange = (start, end) => {
        if (!start) return 'Dates TBA';
        if (!end || start === end) {
            return formatDateDDMMYYYY(start);
        }
        return `${formatDateDDMMYYYY(start)} to ${formatDateDDMMYYYY(end)}`;
    };

    return (
        <AuthenticatedLayout header="Tournament Management">
            <Head title="Bogura Golf Club - Tournament Management & Player Roster" />

            <style>{`
                @media print {
                    body, html {
                        background: #ffffff !important;
                        color: #000000 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    nav, header, aside, .no-print, [role="dialog"], .fixed, .modal-backdrop {
                        display: none !important;
                    }
                    #printable-flight-sheet {
                        display: block !important;
                        position: static !important;
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 10px !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                    }
                    @page {
                        size: A4 portrait;
                        margin: 10mm 12mm 12mm 12mm;
                    }
                }
                @media screen {
                    #printable-flight-sheet {
                        display: none;
                    }
                }
            `}</style>

            <div className="bg-[#F8F9F8] min-h-screen text-slate-900 pb-20 no-print">
                <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-7">
                    
                    {/* ── 1. FLASH MESSAGE ── */}
                    {flash?.success && (
                        <div className="bg-[#D4E2D2] text-[#1C2C1D] p-4 rounded-2xl border border-[#BFD4BD] flex items-center justify-between shadow-xs">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-5 h-5 text-[#2C442E] shrink-0" />
                                <span className="text-xs sm:text-sm font-bold">{flash.success}</span>
                            </div>
                        </div>
                    )}

                    {/* ── 2. TOP HEADER ── */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                                    Tournaments & Player Rosters
                                </h1>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
                                <span>Bogura Golf Club &bull; Fixture Calendar & Player Enrolment Control</span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1 text-[#2B402C] font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-[#3D5A3E]"></span>
                                    {stats.totalPlayers} Enrolled Players Across Tournaments
                                </span>
                            </p>
                        </div>

                        {/* Top Action Buttons */}
                        <div className="flex items-center gap-3 shrink-0">
                            <Link
                                href={route('scorecards.index')}
                                className="px-4 py-2.5 rounded-full bg-[#E2E6D5] hover:bg-[#D4E2D2] text-[#1C2C1D] text-xs font-bold uppercase tracking-wider border border-[#CBD4BD] transition-all flex items-center gap-1.5 shadow-2xs"
                            >
                                <Flag className="w-3.5 h-3.5" />
                                <span>Scorecards & Rounds</span>
                            </Link>

                            <Link
                                href={route('tournaments.create')}
                                className="px-5 py-2.5 rounded-full bg-[#1C2C1D] hover:bg-[#2C442E] text-white font-bold text-xs uppercase tracking-wider shadow-xs flex items-center gap-2 transition-all shrink-0 active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create Tournament</span>
                            </Link>
                        </div>
                    </div>

                    {/* ── 3. STAT METRIC CARDS ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        
                        {/* Metric 1 */}
                        <div className="bg-[#D4E2D2] rounded-[24px] p-5 border border-[#BFD4BD] flex flex-col justify-between shadow-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    All Fixtures
                                </span>
                                <div className="w-8 h-8 rounded-full bg-white text-[#1C2C1D] flex items-center justify-center shadow-xs">
                                    <Trophy className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-3xl font-black text-slate-900 font-display">
                                    {stats.total}
                                </p>
                                <span className="text-[11px] font-semibold text-[#2B402C] mt-0.5 block">
                                    Official Schedule
                                </span>
                            </div>
                        </div>

                        {/* Metric 2 */}
                        <div className="bg-[#E2E6D5] rounded-[24px] p-5 border border-[#CCD3BD] flex flex-col justify-between shadow-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Upcoming
                                </span>
                                <div className="w-8 h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs">
                                    <Calendar className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-3xl font-black text-slate-900 font-display">
                                    {stats.upcoming}
                                </p>
                                <span className="text-[11px] font-semibold text-[#2B402C] mt-0.5 block">
                                    Scheduled Matches
                                </span>
                            </div>
                        </div>

                        {/* Metric 3 */}
                        <div className="bg-[#DFE5D4] rounded-[24px] p-5 border border-[#CBD4BD] flex flex-col justify-between shadow-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Enrolled Players
                                </span>
                                <div className="w-8 h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs">
                                    <Users className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-3xl font-black text-slate-900 font-display">
                                    {stats.totalPlayers}
                                </p>
                                <span className="text-[11px] font-semibold text-[#2B402C] mt-0.5 block">
                                    Registered Members & Guests
                                </span>
                            </div>
                        </div>

                        {/* Metric 4 */}
                        <div className="bg-[#D8DFD5] rounded-[24px] p-5 border border-[#C5CEC1] flex flex-col justify-between shadow-xs">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Completed
                                </span>
                                <div className="w-8 h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs">
                                    <Award className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-3xl font-black text-slate-900 font-display">
                                    {stats.completed}
                                </p>
                                <span className="text-[11px] font-semibold text-[#2B402C] mt-0.5 block">
                                    Final Standings
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* ── 4. TOOLBAR & FILTERS ── */}
                    <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by tournament title, venue, or details..."
                                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] shadow-xs transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Status Filter Tabs & Layout Toggle */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            
                            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80">
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        statusFilter === 'all' ? 'bg-[#1C2C1D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    All ({stats.total})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('upcoming')}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        statusFilter === 'upcoming' ? 'bg-[#1C2C1D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Upcoming ({stats.upcoming})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('completed')}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        statusFilter === 'completed' ? 'bg-[#1C2C1D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Completed ({stats.completed})
                                </button>
                            </div>

                            {/* View Switcher */}
                            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-full transition-all ${
                                        viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                    title="Grid View"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('table')}
                                    className={`p-1.5 rounded-full transition-all ${
                                        viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                    title="Table List View"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* ── 5. TOURNAMENTS DIRECTORY: GRID VIEW ── */}
                    {viewMode === 'grid' ? (
                        filteredTournaments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredTournaments.map((tournament, idx) => {
                                    const status = (tournament.status || 'upcoming').toLowerCase();
                                    const regCount = tournament.registrations?.length || 0;

                                    return (
                                        <div
                                            key={tournament.id}
                                            className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5 group"
                                        >
                                            {/* Top: Image, Dates, Status */}
                                            <div className="space-y-4">
                                                <div className="relative aspect-16/9 rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 shadow-inner">
                                                    <img 
                                                        src={getTournamentImage(tournament.image_path)} 
                                                        alt={tournament.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.src = DEFAULT_TOURNAMENT_IMAGE;
                                                        }}
                                                    />

                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                                    {/* Top Badges */}
                                                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-xs ${
                                                            status === 'live' 
                                                                ? 'bg-[#D4E2D2] text-[#1C2C1D] border-[#BFD4BD] animate-pulse' 
                                                                : status === 'completed' 
                                                                ? 'bg-slate-900/80 text-white border-slate-700 backdrop-blur-xs' 
                                                                : 'bg-[#E2E6D5] text-[#2C442E] border-[#CCD3BD]'
                                                        }`}>
                                                            {status}
                                                        </span>

                                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                                                            {formatDateRange(tournament.start_date, tournament.end_date)}
                                                        </span>
                                                    </div>

                                                    {/* Bottom Venue on image */}
                                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 font-medium">
                                                        <div className="flex items-center gap-1.5 truncate">
                                                            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                                            <span className="truncate">{tournament.location || 'Bogura Golf Course'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-base group-hover:text-[#1C2C1D] transition-colors leading-snug line-clamp-2">
                                                        {tournament.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                                        {tournament.description || 'Championship golf event organized at Bogura Golf Club.'}
                                                    </p>
                                                </div>

                                                {/* Participants Count Ribbon */}
                                                <div className="pt-1 flex items-center justify-between">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenParticipants(tournament)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E2E6D5] hover:bg-[#D4E2D2] text-[#1C2C1D] text-xs font-bold transition-all border border-[#CBD4BD] shadow-2xs group/btn"
                                                    >
                                                        <Users className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                                                        <span>{regCount} Players Registered</span>
                                                        <ChevronDown className="w-3 h-3 text-[#1C2C1D]" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleQuickToggleActive(tournament)}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                                                            tournament.is_active 
                                                                ? 'bg-[#D4E2D2] text-[#1C2C1D] border border-[#BFD4BD]' 
                                                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                        }`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${tournament.is_active ? 'bg-[#1C2C1D]' : 'bg-slate-400'}`} />
                                                        <span>{tournament.is_active ? 'Active' : 'Hidden'}</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Bottom Controls */}
                                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenParticipants(tournament)}
                                                    className="text-xs font-bold text-[#1C2C1D] hover:text-[#2C442E] flex items-center gap-1 transition-colors"
                                                >
                                                    <Users className="w-3.5 h-3.5" />
                                                    <span>Manage Roster</span>
                                                </button>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-1.5">
                                                    <Link
                                                        href={route('tournaments.edit', tournament.id)}
                                                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#1C2C1D] hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                                                        title="Edit Tournament"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(tournament.id, tournament.title)}
                                                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                                                        title="Delete Tournament"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[28px] border border-slate-200/80 p-12 text-center max-w-xl mx-auto space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#D4E2D2] text-[#1C2C1D] flex items-center justify-center mx-auto shadow-xs">
                                    <Trophy className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">No Tournaments Found</h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        No tournaments match the selected status or search query.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setStatusFilter('all'); setSearchQuery(''); }}
                                    className="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )
                    ) : (
                        /* ── 6. TOURNAMENTS DIRECTORY: TABLE VIEW (DND SORTABLE) ── */
                        <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden">
                            <div className="overflow-x-auto">
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#F8F9F8] border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                                                <th className="py-4 px-4 w-10 text-center">Order</th>
                                                <th className="py-4 px-4">Tournament & Venue</th>
                                                <th className="py-4 px-4">Schedule</th>
                                                <th className="py-4 px-4">Participants</th>
                                                <th className="py-4 px-4">Status</th>
                                                <th className="py-4 px-4">Visibility</th>
                                                <th className="py-4 px-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            <SortableContext
                                                items={filteredTournaments.map(t => t.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                {filteredTournaments.map((tournament, index) => (
                                                    <SortableTournamentRow
                                                        key={tournament.id}
                                                        tournament={tournament}
                                                        index={index}
                                                        onDelete={handleDelete}
                                                        onQuickToggle={handleQuickToggleActive}
                                                        onOpenParticipants={handleOpenParticipants}
                                                    />
                                                ))}
                                            </SortableContext>
                                        </tbody>
                                    </table>
                                </DndContext>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
               7. TOURNAMENT PARTICIPANTS / PLAYERS MANAGEMENT MODAL
            ══════════════════════════════════════════════════════ */}
            {selectedTournamentForPlayers && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto no-print">
                    <div className="bg-white rounded-[32px] p-5 sm:p-8 max-w-5xl w-full border border-slate-200 shadow-2xl space-y-6 my-auto max-h-[95vh] overflow-y-auto">
                        
                        {/* Modal Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-[#D4E2D2] text-[#1C2C1D] flex items-center justify-center shrink-0">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-slate-900 font-display">
                                            {selectedTournamentForPlayers.title}
                                        </h3>
                                        <span className="px-2.5 py-0.5 rounded-full bg-[#E2E6D5] text-[#2C442E] text-[10px] font-extrabold uppercase">
                                            {currentTournamentRegistrations.length} Players
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {formatDateRange(selectedTournamentForPlayers.start_date, selectedTournamentForPlayers.end_date)} &bull; {selectedTournamentForPlayers.location || 'Bogura Golf Course'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                                >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Print Flight Sheet</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleOpenAddPlayer}
                                    className="px-4 py-2 rounded-full bg-[#1C2C1D] hover:bg-[#2C442E] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
                                >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    <span>Add Player</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedTournamentForPlayers(null)}
                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Add / Edit Player Inline Form Box */}
                        {isAddPlayerOpen && (
                            <div className="p-5 rounded-2xl bg-[#F8F9F8] border-2 border-[#1C2C1D]/20 space-y-4 animate-in fade-in-50">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                                        <UserPlus className="w-4 h-4 text-[#2C442E]" />
                                        <span>{editingPlayer ? 'Edit Registered Golfer' : 'Register Golfer / Member for Tournament'}</span>
                                    </h4>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddPlayerOpen(false)}
                                        className="text-xs text-slate-400 hover:text-slate-700"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <form onSubmit={submitPlayerForm} className="space-y-4">
                                    
                                    {/* Searchable Member Combobox */}
                                    <div className="space-y-1.5" ref={memberDropdownRef}>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                                            Select Club Member (Searchable)
                                        </label>

                                        <div className="relative">
                                            {playerData.user_id ? (
                                                <div className="flex items-center justify-between p-3 rounded-xl bg-[#D4E2D2]/50 border border-[#BFD4BD]">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-full bg-[#1C2C1D] text-white flex items-center justify-center font-bold text-xs">
                                                            {playerData.player_name?.charAt(0) || 'M'}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-xs text-slate-900">{playerData.player_name}</span>
                                                                <span className="px-2 py-0.5 rounded bg-white text-[10px] font-mono font-bold text-[#1C2C1D]">
                                                                    {playerData.member_id}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSelectMemberForPlayer(null)}
                                                        className="px-2.5 py-1 rounded-full bg-white text-slate-700 text-xs font-bold border border-slate-200"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={memberSearchQuery}
                                                        onChange={(e) => {
                                                            setMemberSearchQuery(e.target.value);
                                                            setIsMemberDropdownOpen(true);
                                                        }}
                                                        onFocus={() => setIsMemberDropdownOpen(true)}
                                                        placeholder="Search member by name, rank, ID, or email..."
                                                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#2C3E2D]"
                                                    />

                                                    {isMemberDropdownOpen && (
                                                        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSelectMemberForPlayer(null)}
                                                                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-xs font-semibold text-slate-500"
                                                            >
                                                                -- Manual Guest / Non-Member Player --
                                                            </button>
                                                            {filteredMembers.map((m) => (
                                                                <button
                                                                    key={m.id}
                                                                    type="button"
                                                                    onClick={() => handleSelectMemberForPlayer(m)}
                                                                    className="w-full text-left px-3.5 py-2 hover:bg-[#D4E2D2]/30 flex items-center justify-between text-xs transition-colors"
                                                                >
                                                                    <div>
                                                                        <span className="font-bold text-slate-900 block">{m.name}</span>
                                                                        <span className="text-[10px] text-slate-400">{m.rank_designation || m.email}</span>
                                                                    </div>
                                                                    <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono font-bold text-slate-700">
                                                                        {m.member_id || `ID #${m.id}`}
                                                                    </span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Player Details Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                                                Player Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={playerData.player_name}
                                                onChange={(e) => setPlayerData('player_name', e.target.value)}
                                                placeholder="e.g. Lt Col Kamrul"
                                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                                                required
                                            />
                                            <InputError message={playerErrors.player_name} className="mt-1" />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                                                Member ID (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={playerData.member_id}
                                                onChange={(e) => setPlayerData('member_id', e.target.value)}
                                                placeholder="BGC-260001"
                                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                                                Handicap (H'cap)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="54"
                                                value={playerData.handicap}
                                                onChange={(e) => setPlayerData('handicap', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                                            />
                                        </div>
                                    </div>

                                    {/* Contact & Category */}
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                value={playerData.phone}
                                                onChange={(e) => setPlayerData('phone', e.target.value)}
                                                placeholder="017xxxxxxxx"
                                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                                                Category
                                            </label>
                                            <select
                                                value={playerData.category}
                                                onChange={(e) => setPlayerData('category', e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
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
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                                                T-Shirt Size
                                            </label>
                                            <select
                                                value={playerData.t_shirt_size}
                                                onChange={(e) => setPlayerData('t_shirt_size', e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                                            >
                                                <option value="S">Small (S)</option>
                                                <option value="M">Medium (M)</option>
                                                <option value="L">Large (L)</option>
                                                <option value="XL">Extra Large (XL)</option>
                                                <option value="XXL">XXL</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                                                Enrolment Status
                                            </label>
                                            <select
                                                value={playerData.status}
                                                onChange={(e) => setPlayerData('status', e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900"
                                            >
                                                <option value="confirmed">Confirmed</option>
                                                <option value="registered">Registered (Pending)</option>
                                                <option value="waitlisted">Waitlisted</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddPlayerOpen(false)}
                                            className="px-4 py-1.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={playerProcessing}
                                            className="px-6 py-1.5 rounded-full bg-[#1C2C1D] text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-[#2C442E] transition-all flex items-center gap-1.5"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                            <span>{playerProcessing ? 'Saving...' : (editingPlayer ? 'Update Player' : 'Save Golfer')}</span>
                                        </button>
                                    </div>

                                </form>
                            </div>
                        )}

                        {/* Search & Filter Toolbar inside Modal */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={playerSearchQuery}
                                    onChange={(e) => setPlayerSearchQuery(e.target.value)}
                                    placeholder="Search player name, ID, phone..."
                                    className="w-full pl-9 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={playerStatusFilter}
                                    onChange={(e) => setPlayerStatusFilter(e.target.value)}
                                    className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="registered">Registered</option>
                                    <option value="waitlisted">Waitlisted</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        {/* Participants Table */}
                        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                            {filteredPlayers.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#F8F9F8] border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                                                <th className="py-3 px-4">#</th>
                                                <th className="py-3 px-4">Player Name</th>
                                                <th className="py-3 px-4">Category</th>
                                                <th className="py-3 px-4 text-center">H'cap</th>
                                                <th className="py-3 px-4">Contact</th>
                                                <th className="py-3 px-4">Size</th>
                                                <th className="py-3 px-4 text-center">Status</th>
                                                <th className="py-3 px-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                                            {filteredPlayers.map((p, idx) => (
                                                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                                                        {idx + 1}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-slate-900">{p.player_name}</span>
                                                            {p.member_id && (
                                                                <span className="px-1.5 py-0.5 rounded bg-[#D4E2D2] text-[#1C2C1D] text-[9px] font-mono font-bold">
                                                                    {p.member_id}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-700">
                                                            {p.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-center font-bold text-slate-900">
                                                        {p.handicap || 0}
                                                    </td>
                                                    <td className="py-3 px-4 text-[11px] text-slate-600">
                                                        <div>{p.phone || '—'}</div>
                                                        {p.email && <div className="text-[10px] text-slate-400">{p.email}</div>}
                                                    </td>
                                                    <td className="py-3 px-4 font-bold text-slate-600">
                                                        {p.t_shirt_size || '—'}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <select
                                                            value={p.status}
                                                            onChange={(e) => handlePlayerStatusChange(p.id, e.target.value)}
                                                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer ${
                                                                p.status === 'confirmed'
                                                                    ? 'bg-[#D4E2D2] text-[#1C2C1D] border-[#BFD4BD]'
                                                                    : p.status === 'waitlisted'
                                                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                                                    : p.status === 'cancelled'
                                                                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                                                                    : 'bg-slate-100 text-slate-700 border-slate-300'
                                                            }`}
                                                        >
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="registered">Registered</option>
                                                            <option value="waitlisted">Waitlisted</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-3 px-4 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenEditPlayer(p)}
                                                                className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                                                                title="Edit Golfer"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeletePlayer(p.id, p.player_name)}
                                                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                                                title="Remove Golfer"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-8 text-center space-y-2">
                                    <Users className="w-8 h-8 text-slate-300 mx-auto" />
                                    <p className="text-xs font-bold text-slate-700">No players registered yet</p>
                                    <p className="text-[11px] text-slate-400">Click "Add Player" to enroll golfers into this tournament.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
               8. DEDICATED OFFICIAL PRINTABLE FLIGHT SHEET
               (Visible exclusively during browser print)
            ══════════════════════════════════════════════════════ */}
            {selectedTournamentForPlayers && (
                <div id="printable-flight-sheet" className="p-4 bg-white text-black font-sans">
                    
                    {/* Official Club Header */}
                    <div className="text-center pb-3 border-b-2 border-black space-y-1">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-bold text-base">
                                ⛳
                            </div>
                            <h1 className="text-2xl font-black uppercase tracking-wider text-black font-serif">
                                BOGURA GOLF CLUB
                            </h1>
                        </div>
                        <p className="text-[11px] uppercase tracking-widest font-semibold text-gray-700">
                            Majhira Cantonment, Bogura, Bangladesh &bull; Official Match Fixture
                        </p>
                        <div className="pt-1.5">
                            <span className="inline-block px-4 py-1 border-2 border-black font-extrabold text-xs uppercase tracking-widest bg-gray-100">
                                OFFICIAL TOURNAMENT FLIGHT SHEET & PARTICIPANT ROSTER
                            </span>
                        </div>
                    </div>

                    {/* Match Details Banner */}
                    <div className="my-3 p-3 border border-black grid grid-cols-4 gap-3 text-xs bg-gray-50">
                        <div>
                            <span className="font-bold block uppercase text-[9px] text-gray-600">Tournament Name:</span>
                            <span className="font-black text-sm text-black">{selectedTournamentForPlayers.title}</span>
                        </div>
                        <div>
                            <span className="font-bold block uppercase text-[9px] text-gray-600">Schedule:</span>
                            <span className="font-semibold text-black">{formatDateRange(selectedTournamentForPlayers.start_date, selectedTournamentForPlayers.end_date)}</span>
                        </div>
                        <div>
                            <span className="font-bold block uppercase text-[9px] text-gray-600">Course / Venue:</span>
                            <span className="font-semibold text-black">{selectedTournamentForPlayers.location || 'Bogura Golf Course'}</span>
                        </div>
                        <div>
                            <span className="font-bold block uppercase text-[9px] text-gray-600">Enrolled Players:</span>
                            <span className="font-black text-sm text-black">{currentTournamentRegistrations.length} Golfers</span>
                        </div>
                    </div>

                    {/* Flight Sheet Table */}
                    <table className="w-full text-left border-collapse border-2 border-black text-xs my-3">
                        <thead>
                            <tr className="bg-gray-200 border-b-2 border-black text-[10px] font-black uppercase tracking-wider">
                                <th className="border border-black p-2 w-8 text-center">#</th>
                                <th className="border border-black p-2">Golfer Name</th>
                                <th className="border border-black p-2 w-32 text-center whitespace-nowrap">Member ID</th>
                                <th className="border border-black p-2 w-24">Category</th>
                                <th className="border border-black p-2 w-14 text-center">H'cap</th>
                                <th className="border border-black p-2 w-28">Contact</th>
                                <th className="border border-black p-2 w-12 text-center">Size</th>
                                <th className="border border-black p-2 w-20 text-center">Status</th>
                                <th className="border border-black p-2 w-28">Flight / Tee</th>
                                <th className="border border-black p-2 w-28">Signature</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTournamentRegistrations.map((p, idx) => (
                                <tr key={p.id} className="border-b border-black">
                                    <td className="border border-black p-2 text-center font-bold">{idx + 1}</td>
                                    <td className="border border-black p-2 font-bold text-sm">{p.player_name}</td>
                                    <td className="border border-black p-2 font-mono font-bold text-center whitespace-nowrap">{p.member_id || ''}</td>
                                    <td className="border border-black p-2">{p.category}</td>
                                    <td className="border border-black p-2 text-center font-black">{p.handicap || 0}</td>
                                    <td className="border border-black p-2 font-mono text-[11px]">{p.phone || '—'}</td>
                                    <td className="border border-black p-2 text-center font-bold">{p.t_shirt_size || '—'}</td>
                                    <td className="border border-black p-2 text-center uppercase font-bold text-[10px]">{p.status}</td>
                                    <td className="border border-black p-2"></td>
                                    <td className="border border-black p-2"></td>
                                </tr>
                            ))}
                            {currentTournamentRegistrations.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="border border-black p-4 text-center text-gray-500 font-bold">
                                        No registered players in this flight roster yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Official Signatures Verification Footer */}
                    <div className="pt-12 grid grid-cols-3 gap-8 text-center text-xs">
                        <div>
                            <div className="border-t-2 border-black pt-1.5 font-bold uppercase tracking-wider">Tournament Secretary</div>
                            <div className="text-[10px] text-gray-600">Bogura Golf Club</div>
                        </div>
                        <div>
                            <div className="border-t-2 border-black pt-1.5 font-bold uppercase tracking-wider">Honorary General Secretary</div>
                            <div className="text-[10px] text-gray-600">Bogura Golf Club</div>
                        </div>
                        <div>
                            <div className="border-t-2 border-black pt-1.5 font-bold uppercase tracking-wider">Tournament Director / Captain</div>
                            <div className="text-[10px] text-gray-600">Bogura Golf Club</div>
                        </div>
                    </div>

                    {/* Document Meta */}
                    <div className="mt-8 pt-2 border-t border-gray-400 flex justify-between text-[10px] text-gray-500">
                        <span>Official Match Document &bull; Bogura Golf Club, Bangladesh</span>
                        <span>Generated on: {new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>

                </div>
            )}

        </AuthenticatedLayout>
    );
}
