import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserDropdown from '@/Components/UserDropdown';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { 
    Users, 
    Plus, 
    Search, 
    Key, 
    LogIn, 
    Pencil, 
    Trash2, 
    CheckCircle2, 
    XCircle, 
    Shield, 
    ShieldCheck, 
    Phone, 
    Mail, 
    Eye, 
    Lock, 
    X, 
    Check, 
    RefreshCw, 
    Sparkles,
    UserCheck,
    UserX,
    Building,
    LayoutGrid,
    List,
    ArrowUpRight,
    Copy,
    Clock
} from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

export default function Index({ users, filters = {}, stats = {} }) {
    const authUser = usePage().props.auth.user;
    const { delete: destroy } = useForm();

    const [search, setSearch] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

    // Password Reset Modal State
    const [passwordModalUser, setPasswordModalUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [resetProcessing, setResetProcessing] = useState(false);
    const [resetError, setResetError] = useState('');
    const [copiedPass, setCopiedPass] = useState(false);

    // Create Member Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { 
        data: createData, 
        setData: setCreateData, 
        post: postCreate, 
        processing: createProcessing, 
        errors: createErrors, 
        reset: resetCreate, 
        clearErrors: clearCreateErrors 
    } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'member',
        phone: '',
        mobile: '',
        rank_designation: '',
        profession: '',
        organization: '',
        is_active: true,
    });

    const isSuperAdmin = authUser?.role === 'super_admin';

    const openCreateModal = () => {
        clearCreateErrors();
        resetCreate();
        // Generate random initial password
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
        let pass = 'BGC#';
        for (let i = 0; i < 6; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCreateData('password', pass);
        setIsCreateModalOpen(true);
    };

    const generateRandomPasswordForCreate = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
        let pass = 'BGC#';
        for (let i = 0; i < 6; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCreateData('password', pass);
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        postCreate(route('users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateModalOpen(false);
                resetCreate();
                router.reload({ only: ['users', 'stats'] });
            },
        });
    };

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    const handleFilterChange = (newSearch, newRole, newStatus) => {
        router.get(route('users.index'), {
            search: newSearch,
            role: newRole,
            status: newStatus,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        handleFilterChange(search, selectedRole, selectedStatus);
    };

    const handleRoleTab = (role) => {
        setSelectedRole(role);
        handleFilterChange(search, role, selectedStatus);
    };

    const handleStatusTab = (status) => {
        setSelectedStatus(status);
        handleFilterChange(search, selectedRole, status);
    };

    const handleToggleStatus = (user) => {
        if (user.id === authUser.id) {
            alert('You cannot disable your own active account.');
            return;
        }
        router.post(route('users.toggle-status', user.id), {}, {
            preserveScroll: true,
        });
    };

    const handleVerifyMember = (user) => {
        router.post(route('users.verify', user.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['users', 'stats'] });
            },
        });
    };

    const handleImpersonate = (user) => {
        if (user.id === authUser.id) {
            alert('You are already logged in as yourself.');
            return;
        }
        if (confirm(`You are about to sign in and view the portal as "${user.name}". Proceed?`)) {
            router.post(route('users.impersonate', user.id));
        }
    };

    const openPasswordModal = (user) => {
        setPasswordModalUser(user);
        setNewPassword('');
        setResetError('');
        setCopiedPass(false);
    };

    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
        let pass = 'BGC#';
        for (let i = 0; i < 6; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewPassword(pass);
        setCopiedPass(false);
    };

    const handleCopyPassword = () => {
        if (newPassword) {
            navigator.clipboard.writeText(newPassword);
            setCopiedPass(true);
            setTimeout(() => setCopiedPass(false), 2000);
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            setResetError('Password must be at least 6 characters.');
            return;
        }
        setResetProcessing(true);
        router.post(route('users.reset-password', passwordModalUser.id), {
            new_password: newPassword,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setResetProcessing(false);
                setPasswordModalUser(null);
                setNewPassword('');
            },
            onError: (err) => {
                setResetProcessing(false);
                setResetError(err.new_password || 'Failed to update password.');
            }
        });
    };

    const handleDelete = (user) => {
        if (user.id === authUser.id) {
            alert('You cannot delete your own account.');
            return;
        }
        if (confirm(`Are you sure you want to permanently delete member account "${user.name}" (${user.email})?`)) {
            destroy(route('users.destroy', user.id), {
                preserveScroll: true,
            });
        }
    };

    const userList = users?.data || [];

    return (
        <AuthenticatedLayout header="Manage Members">
            <Head title="Member Directory & Credentials - Bogura Golf Club" />

            <div className="bg-[#F8F9F8] min-h-screen text-slate-900 pb-16">
                <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-7">
                    
                    {/* ── TOP HEADER ── */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                                Member Accounts & Credentials
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
                                <span>Bogura Golf Club &bull; Member Directory & Access Control</span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1 text-[#2B402C] font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-[#3D5A3E]"></span>
                                    {stats.total || userList.length} Registered Accounts
                                </span>
                            </p>
                        </div>

                        {/* Top Right Controls: Add Button & UserDropdown */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={openCreateModal}
                                className="px-5 py-2.5 rounded-full bg-[#1C2C1D] hover:bg-[#2C442E] text-white font-bold text-xs uppercase tracking-wider shadow-xs flex items-center gap-2 transition-all shrink-0 active:scale-95"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add New Member</span>
                            </button>
                        </div>
                    </div>

                    {/* ── 4 MILITARY OLIVE STATS CARDS ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        
                        {/* Card 1: Total Members */}
                        <button
                            type="button"
                            onClick={() => handleRoleTab('all')}
                            className={`rounded-[24px] p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                selectedRole === 'all' && selectedStatus === 'all'
                                    ? 'bg-[#D4E2D2] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-md scale-[1.02]'
                                    : 'bg-[#D4E2D2] border-[#BFD4BD] hover:shadow-sm'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Roll</span>
                                <div className="w-8 h-8 rounded-full bg-white text-[#1C2C1D] flex items-center justify-center shadow-xs">
                                    <Users className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-3xl font-black text-slate-900 font-display">{stats.total || userList.length}</p>
                                <span className="text-[11px] font-semibold text-[#243B26] mt-0.5 block">All Registered Users</span>
                            </div>
                        </button>

                        {/* Card 2: Active Members */}
                        <button
                            type="button"
                            onClick={() => { handleRoleTab('member'); handleStatusTab('active'); }}
                            className={`rounded-[24px] p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                selectedRole === 'member' && selectedStatus === 'active'
                                    ? 'bg-[#E2E6D5] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-md scale-[1.02]'
                                    : 'bg-[#E2E6D5] border-[#CCD3BD] hover:shadow-sm'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Members</span>
                                <div className="w-8 h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs">
                                    <UserCheck className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-3xl font-black text-slate-900 font-display">{stats.active || 0}</p>
                                <span className="text-[11px] font-semibold text-[#35432B] mt-0.5 block">Portal Enabled</span>
                            </div>
                        </button>

                        {/* Card 3: Pending Verification */}
                        <button
                            type="button"
                            onClick={() => { handleRoleTab('member'); handleStatusTab('pending'); }}
                            className={`rounded-[24px] p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                selectedStatus === 'pending'
                                    ? 'bg-amber-100 border-amber-600 ring-2 ring-amber-500/30 shadow-md scale-[1.02]'
                                    : 'bg-[#FAF7E8] border-[#E8E2BD] hover:shadow-sm'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Pending Verification</span>
                                <div className="w-8 h-8 rounded-full bg-white text-amber-700 flex items-center justify-center shadow-xs">
                                    <Clock className={`w-4 h-4 ${stats.pending > 0 ? 'animate-pulse text-amber-600' : ''}`} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-black text-slate-900 font-display">{stats.pending || 0}</p>
                                    {stats.pending > 0 && (
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                                    )}
                                </div>
                                <span className="text-[11px] font-semibold text-amber-800 mt-0.5 block">Awaiting Admin Verification</span>
                            </div>
                        </button>

                        {/* Card 4: Administrators */}
                        <button
                            type="button"
                            onClick={() => handleRoleTab('admin')}
                            className={`rounded-[24px] p-5 flex flex-col justify-between text-left transition-all duration-200 border ${
                                selectedRole === 'admin'
                                    ? 'bg-[#DFE5D4] border-[#1C2C1D] ring-2 ring-[#1C2C1D]/20 shadow-md scale-[1.02]'
                                    : 'bg-[#DFE5D4] border-[#CBD4BD] hover:shadow-sm'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Secretariat & Admins</span>
                                <div className="w-8 h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-3xl font-black text-slate-900 font-display">{stats.admins || 0}</p>
                                <span className="text-[11px] font-semibold text-[#2B402C] mt-0.5 block">System Authority</span>
                            </div>
                        </button>

                    </div>

                    {/* ── TOOLBAR: SEARCH, ROLE TABS, STATUS PILLS & VIEW TOGGLE ── */}
                    <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                        
                        {/* Live Search */}
                        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, email, phone, or member ID..."
                                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-medium placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] shadow-xs transition-all"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => { setSearch(''); handleFilterChange('', selectedRole, selectedStatus); }}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </form>

                        {/* Filter Pills & View Mode */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            
                            {/* Role Pills */}
                            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80">
                                <button
                                    onClick={() => handleRoleTab('all')}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        selectedRole === 'all' ? 'bg-[#1C2C1D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    All Roles
                                </button>
                                <button
                                    onClick={() => handleRoleTab('member')}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        selectedRole === 'member' ? 'bg-[#1C2C1D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Members ({stats.members || 0})
                                </button>
                                <button
                                    onClick={() => handleRoleTab('admin')}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        selectedRole === 'admin' ? 'bg-[#1C2C1D] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Admins ({stats.admins || 0})
                                </button>
                            </div>

                            {/* Status Pills */}
                            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80">
                                <button
                                    onClick={() => handleStatusTab('all')}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        selectedStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    All Status
                                </button>
                                <button
                                    onClick={() => handleStatusTab('active')}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        selectedStatus === 'active' ? 'bg-[#D4E2D2] text-[#1C2C1D] border border-[#BFD4BD] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Active ({stats.active || 0})
                                </button>
                                <button
                                    onClick={() => handleStatusTab('pending')}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                                        selectedStatus === 'pending' ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    {stats.pending > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />}
                                    <span>Pending ({stats.pending || 0})</span>
                                </button>
                                <button
                                    onClick={() => handleStatusTab('disabled')}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                        selectedStatus === 'disabled' ? 'bg-rose-100 text-rose-800 border border-rose-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Disabled
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
                                    title="Grid Bento View"
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

                    {/* ── 3. MEMBER DIRECTORY: GRID VIEW ── */}
                    {viewMode === 'grid' ? (
                        userList.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {userList.map((user) => {
                                    const isActive = user.is_active !== false && user.is_active !== 0;
                                    const isCurrentUser = user.id === authUser.id;
                                    const memberId = user.member_id || ('BGC-26' + String(user.id).padStart(4, '0'));

                                    return (
                                        <div
                                            key={user.id}
                                            className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5 group"
                                        >
                                            {/* Top: Avatar, Name, Member ID, Status Pill */}
                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="relative w-12 h-12 rounded-2xl bg-[#1C2C1D] text-white font-bold flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                                                            {user.profile_picture ? (
                                                                <img 
                                                                    src={`/storage/${user.profile_picture}`} 
                                                                    alt={user.name} 
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-base font-black">{user.name.charAt(0).toUpperCase()}</span>
                                                            )}
                                                            {/* Active dot indicator */}
                                                            <span className={`absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                                                isActive ? 'bg-emerald-500' : 'bg-rose-500'
                                                            }`} />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#1C2C1D] transition-colors truncate">
                                                                    {user.name}
                                                                </h3>
                                                                {isCurrentUser && (
                                                                    <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-extrabold uppercase shrink-0">
                                                                        You
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-[11px] font-mono font-bold text-[#1C2C1D] bg-[#D4E2D2] px-2.5 py-0.5 rounded-full border border-[#BFD4BD] inline-block mt-0.5">
                                                                {memberId}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Role Badge */}
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shrink-0 ${
                                                        user.role === 'super_admin' ? 'bg-purple-50 text-purple-900 border-purple-200' :
                                                        user.role === 'admin' ? 'bg-[#DFE5D4] text-[#1C2C1D] border-[#CBD4BD]' :
                                                        'bg-slate-100 text-slate-700 border-slate-200'
                                                    }`}>
                                                        {user.role?.replace('_', ' ') || 'Member'}
                                                    </span>
                                                </div>

                                                {/* Rank & Organization */}
                                                {(user.rank_designation || user.organization) && (
                                                    <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 font-medium flex items-center gap-1.5 truncate">
                                                        <ShieldCheck className="w-3.5 h-3.5 text-[#2C442E] shrink-0" />
                                                        <span className="truncate">
                                                            {[user.rank_designation, user.organization].filter(Boolean).join(' • ')}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Contact Details */}
                                                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                                                    <div className="flex items-center gap-2 truncate">
                                                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="truncate font-medium">{user.email}</span>
                                                    </div>
                                                    {(user.phone || user.mobile) && (
                                                        <div className="flex items-center gap-2 truncate">
                                                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                            <span className="truncate font-medium">{user.phone || user.mobile}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bottom Action Controls */}
                                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                                                {/* Verification & Status Badges */}
                                                {!isActive && user.role === 'member' ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleVerifyMember(user)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all active:scale-95"
                                                            title="Verify this member and grant dashboard access"
                                                        >
                                                            <UserCheck className="w-3.5 h-3.5" />
                                                            <span>Verify Member</span>
                                                        </button>
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                                                            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                                                            <span>Pending</span>
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(user)}
                                                        disabled={isCurrentUser}
                                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                                                            isActive 
                                                                ? 'bg-[#D4E2D2] text-[#1C2C1D] border border-[#BFD4BD] hover:bg-[#C2D6BF]' 
                                                                : 'bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200'
                                                        } ${isCurrentUser ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                                                        title={isCurrentUser ? 'Cannot disable self' : 'Toggle portal access'}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#1C2C1D]' : 'bg-rose-600'}`} />
                                                        <span>{isActive ? 'Active' : 'Disabled'}</span>
                                                    </button>
                                                )}

                                                {/* Action Buttons Group */}
                                                <div className="flex items-center gap-1.5">
                                                    {/* Impersonate */}
                                                    {!isCurrentUser && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleImpersonate(user)}
                                                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#1C2C1D] hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                                                            title="View Portal As This Member"
                                                        >
                                                            <LogIn className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {/* Password Reset */}
                                                    <button
                                                        type="button"
                                                        onClick={() => openPasswordModal(user)}
                                                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#1C2C1D] hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                                                        title="Reset Password"
                                                    >
                                                        <Key className="w-3.5 h-3.5" />
                                                    </button>

                                                    {/* Edit */}
                                                    <Link
                                                        href={route('users.edit', user.id)}
                                                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#1C2C1D] hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                                                        title="Edit Member Profile"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </Link>

                                                    {/* Delete */}
                                                    {!isCurrentUser && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(user)}
                                                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                                                            title="Delete Member"
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
                            <div className="bg-white rounded-[28px] border border-slate-200/80 p-12 text-center max-w-xl mx-auto space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#D4E2D2] text-[#1C2C1D] flex items-center justify-center mx-auto shadow-xs">
                                    <Users className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">No Members Found</h3>
                                    <p className="text-xs text-slate-500 mt-1">
                                        No account records match the selected filter criteria.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedRole('all'); setSelectedStatus('all'); setSearch(''); handleFilterChange('', 'all', 'all'); }}
                                    className="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )
                    ) : (
                        /* ── 4. MEMBER DIRECTORY: TABLE VIEW ── */
                        <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs whitespace-nowrap">
                                    <thead className="bg-slate-50/80 text-slate-700 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4">Member / User</th>
                                            <th className="px-6 py-4">Contact Info</th>
                                            <th className="px-6 py-4 text-center">Role</th>
                                            <th className="px-6 py-4 text-center">Portal Access</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                                        {userList.length > 0 ? (
                                            userList.map((user) => {
                                                const isActive = user.is_active !== false && user.is_active !== 0;
                                                const isCurrentUser = user.id === authUser.id;
                                                const memberId = user.member_id || ('BGC-26' + String(user.id).padStart(4, '0'));

                                                return (
                                                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors group">
                                                        
                                                        {/* Member Details */}
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3.5">
                                                                <div className="w-10 h-10 rounded-2xl bg-[#1C2C1D] text-white font-bold flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                                                                    {user.profile_picture ? (
                                                                        <img 
                                                                            src={`/storage/${user.profile_picture}`} 
                                                                            alt={user.name} 
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <span>{user.name.charAt(0).toUpperCase()}</span>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 space-y-0.5">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="font-bold text-slate-900 text-sm group-hover:text-[#1C2C1D] transition-colors">
                                                                            {user.name}
                                                                        </p>
                                                                        {isCurrentUser && (
                                                                            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] font-extrabold uppercase">
                                                                                You
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                                        <span className="font-mono font-bold text-[#1C2C1D]">
                                                                            {memberId}
                                                                        </span>
                                                                        {user.rank_designation && (
                                                                            <span>&bull; {user.rank_designation}</span>
                                                                        )}
                                                                        {user.organization && (
                                                                            <span>&bull; {user.organization}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        {/* Contact Details */}
                                                        <td className="px-6 py-4 space-y-0.5">
                                                            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                                <span>{user.email}</span>
                                                            </div>
                                                            {(user.phone || user.mobile) && (
                                                                <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                                                                    <Phone className="w-3 h-3 text-slate-400" />
                                                                    <span>{user.phone || user.mobile}</span>
                                                                </div>
                                                            )}
                                                        </td>

                                                        {/* Role Pill */}
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                                                                user.role === 'super_admin' ? 'bg-purple-50 text-purple-900 border-purple-200' :
                                                                user.role === 'admin' ? 'bg-[#DFE5D4] text-[#1C2C1D] border-[#CBD4BD]' :
                                                                'bg-slate-100 text-slate-700 border-slate-200'
                                                            }`}>
                                                                {user.role === 'super_admin' ? <ShieldCheck className="w-3 h-3 text-purple-700" /> :
                                                                 user.role === 'admin' ? <Shield className="w-3 h-3 text-[#2C442E]" /> :
                                                                 <Users className="w-3 h-3 text-slate-600" />}
                                                                <span>{user.role?.replace('_', ' ') || 'Member'}</span>
                                                            </span>
                                                        </td>

                                                        {/* Account Status Switch */}
                                                        <td className="px-6 py-4 text-center">
                                                            {!isActive && user.role === 'member' ? (
                                                                <div className="inline-flex items-center gap-1.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleVerifyMember(user)}
                                                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all active:scale-95"
                                                                        title="Verify and activate member dashboard access"
                                                                    >
                                                                        <UserCheck className="w-3.5 h-3.5" />
                                                                        <span>Verify</span>
                                                                    </button>
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                                                                        <Clock className="w-3 h-3 text-amber-600" />
                                                                        <span>Pending</span>
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleToggleStatus(user)}
                                                                    disabled={isCurrentUser}
                                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                                                                        isActive 
                                                                            ? 'bg-[#D4E2D2] text-[#1C2C1D] border border-[#BFD4BD] hover:bg-[#C2D6BF]' 
                                                                            : 'bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200'
                                                                    } ${isCurrentUser ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                                                                    title={isCurrentUser ? 'Cannot disable self' : 'Toggle access'}
                                                                >
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#1C2C1D]' : 'bg-rose-600'}`} />
                                                                    <span>{isActive ? 'Active' : 'Disabled'}</span>
                                                                </button>
                                                            )}
                                                        </td>

                                                        {/* Action Buttons */}
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-1.5">
                                                                {!isCurrentUser && (
                                                                    <button
                                                                        onClick={() => handleImpersonate(user)}
                                                                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#1C2C1D] hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                                                                        title="View portal as this member"
                                                                    >
                                                                        <LogIn className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}

                                                                <button
                                                                    onClick={() => openPasswordModal(user)}
                                                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#1C2C1D] hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                                                                    title="Assign / Reset Password"
                                                                >
                                                                    <Key className="w-3.5 h-3.5" />
                                                                </button>

                                                                <Link
                                                                    href={route('users.edit', user.id)}
                                                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#1C2C1D] hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                                                                    title="Edit Profile"
                                                                >
                                                                    <Pencil className="w-3.5 h-3.5" />
                                                                </Link>

                                                                {!isCurrentUser && (
                                                                    <button
                                                                        onClick={() => handleDelete(user)}
                                                                        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-700 flex items-center justify-center transition-colors shadow-2xs"
                                                                        title="Delete Member"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>

                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-slate-400 space-y-2">
                                                    <Users className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                                                    <p className="text-sm font-semibold text-slate-600">No member records found</p>
                                                    <p className="text-xs text-slate-400">Try adjusting your search criteria or role filters.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ── 5. ASSIGN / RESET PASSWORD MODAL ── */}
            {passwordModalUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full border border-slate-100 shadow-2xl space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#D4E2D2] text-[#1C2C1D] flex items-center justify-center shrink-0">
                                    <Key className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                                        Assign / Reset Password
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium">
                                        For {passwordModalUser.name}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPasswordModalUser(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                    New Access Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="new_password"
                                        type="text"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-4 pr-24 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                        placeholder="Enter password..."
                                        required
                                        autoFocus
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        {newPassword && (
                                            <button
                                                type="button"
                                                onClick={handleCopyPassword}
                                                className="p-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                                                title="Copy Password"
                                            >
                                                {copiedPass ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={generateRandomPassword}
                                            className="px-2 py-1 text-[10px] font-bold text-[#1C2C1D] bg-[#D4E2D2] hover:bg-[#C2D6BF] rounded-lg transition-colors flex items-center gap-1"
                                            title="Generate Secure Password"
                                        >
                                            <Sparkles className="w-3 h-3" />
                                            <span>Generate</span>
                                        </button>
                                    </div>
                                </div>
                                {resetError && (
                                    <p className="text-rose-600 text-xs mt-1.5 font-medium">{resetError}</p>
                                )}
                            </div>

                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                The member will immediately be able to sign in with this new password. Ensure they are informed securely.
                            </p>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setPasswordModalUser(null)}
                                    className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={resetProcessing}
                                    className="px-6 py-2.5 rounded-full bg-[#1C2C1D] hover:bg-[#2C442E] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Key className="w-3.5 h-3.5" />
                                    <span>{resetProcessing ? 'Saving...' : 'Set Password'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── 6. CREATE MEMBER MODAL ── */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
                    <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-2xl w-full border border-slate-100 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#D4E2D2] text-[#1C2C1D] flex items-center justify-center shrink-0 font-bold">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                                        Register New Member
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Create a member account with login credentials & permissions.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            {/* Full Name & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Full Name / Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={createData.name}
                                        onChange={(e) => setCreateData('name', e.target.value)}
                                        placeholder="e.g. Major General John Doe"
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                        required
                                    />
                                    <InputError message={createErrors.name} className="mt-1" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Official Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={createData.email}
                                        onChange={(e) => setCreateData('email', e.target.value)}
                                        placeholder="member@boguragolf.com"
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                        required
                                    />
                                    <InputError message={createErrors.email} className="mt-1" />
                                </div>
                            </div>

                            {/* Password & Role */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Login Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={createData.password}
                                            onChange={(e) => setCreateData('password', e.target.value)}
                                            className="w-full pl-3.5 pr-24 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={generateRandomPasswordForCreate}
                                            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-bold text-[#1C2C1D] bg-[#D4E2D2] hover:bg-[#C2D6BF] rounded-lg transition-colors flex items-center gap-1"
                                            title="Generate Password"
                                        >
                                            <Sparkles className="w-3 h-3" />
                                            <span>Generate</span>
                                        </button>
                                    </div>
                                    <InputError message={createErrors.password} className="mt-1" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Account Role & Privileges
                                    </label>
                                    {isSuperAdmin ? (
                                        <select
                                            value={createData.role}
                                            onChange={(e) => setCreateData('role', e.target.value)}
                                            className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                        >
                                            <option value="member">Club Member</option>
                                            <option value="admin">Administrator</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                    ) : (
                                        <div className="px-3.5 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-700 flex items-center justify-between">
                                            <span>Club Member (Standard)</span>
                                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Numbers */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Landline (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={createData.phone}
                                        onChange={(e) => setCreateData('phone', e.target.value)}
                                        placeholder="+880..."
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Mobile Number (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={createData.mobile}
                                        onChange={(e) => setCreateData('mobile', e.target.value)}
                                        placeholder="0171..."
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Rank & Organization */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Rank / Designation
                                    </label>
                                    <input
                                        type="text"
                                        value={createData.rank_designation}
                                        onChange={(e) => setCreateData('rank_designation', e.target.value)}
                                        placeholder="e.g. Brigadier Gen"
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Profession
                                    </label>
                                    <input
                                        type="text"
                                        value={createData.profession}
                                        onChange={(e) => setCreateData('profession', e.target.value)}
                                        placeholder="e.g. Military"
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                        Unit / Org
                                    </label>
                                    <input
                                        type="text"
                                        value={createData.organization}
                                        onChange={(e) => setCreateData('organization', e.target.value)}
                                        placeholder="e.g. 11 Div"
                                        className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Active Toggle */}
                            <div className="p-3.5 rounded-2xl bg-[#D4E2D2]/30 border border-[#BFD4BD] flex items-center justify-between">
                                <div>
                                    <span className="text-xs font-bold text-slate-900 block">Active Portal Login</span>
                                    <span className="text-[11px] text-slate-500">Allow member to log in immediately upon creation.</span>
                                </div>
                                <label className="flex items-center cursor-pointer gap-2 select-none">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only"
                                            checked={createData.is_active}
                                            onChange={(e) => setCreateData('is_active', e.target.checked)}
                                        />
                                        <div className={`block w-9 h-5 rounded-full transition-colors ${createData.is_active ? 'bg-[#1C2C1D]' : 'bg-slate-300'}`}></div>
                                        <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${createData.is_active ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </label>
                            </div>

                            {/* Modal Actions */}
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={createProcessing}
                                    className="px-6 py-2 rounded-full bg-[#1C2C1D] hover:bg-[#2C442E] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>{createProcessing ? 'Creating...' : 'Create Member'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
