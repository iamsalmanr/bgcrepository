import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import UserDropdown from '@/Components/UserDropdown';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Users, 
    Settings, 
    Menu, 
    X, 
    LogOut, 
    User as UserIcon, 
    MonitorPlay, 
    ChevronRight, 
    ChevronDown,
    Image as ImageIcon, 
    Bell, 
    Network, 
    FileText, 
    Contact, 
    Trophy,
    Flag,
    Calendar,
    Sparkles,
    ShieldCheck,
    ClipboardList,
    Newspaper
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, site_settings } = usePage().props;
    const user = auth?.user || {};
    const impersonator = auth?.impersonator;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeFlyout, setActiveFlyout] = useState(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const flyoutTimeoutRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userRole = user.role || 'member';
    const isMember = userRole === 'member';

    const navigation = [
        { 
            name: 'Dashboard', 
            href: route('dashboard'), 
            icon: LayoutGrid, 
            active: route().current('dashboard'), 
            roles: ['super_admin', 'admin', 'member'] 
        },
        
        // Member Quick Links
        { 
            name: 'Tournaments & Matches', 
            href: '/tournament', 
            icon: Trophy, 
            active: route().current('tournaments.*') || route().current('tournament-results.*'), 
            roles: ['member'] 
        },
        { 
            name: 'My Scorecards', 
            href: route('scorecards.index'), 
            icon: ClipboardList, 
            active: route().current('scorecards.*'), 
            roles: ['member'] 
        },
        { 
            name: 'Notice Board', 
            href: '/notice-board', 
            icon: Bell, 
            active: route().current('notices.*'), 
            roles: ['member'] 
        },
        { 
            name: 'Photo Gallery', 
            href: route('gallery'), 
            icon: ImageIcon, 
            active: route().current('gallery') || route().current('gallery.*'), 
            roles: ['member'] 
        },
        { 
            name: 'Golf News', 
            href: '/news', 
            icon: Newspaper, 
            active: route().current('news.*'), 
            roles: ['member'] 
        },
        { 
            name: 'Club Forms & Downloads', 
            href: '/club-form', 
            icon: FileText, 
            active: route().current('forms.*'), 
            roles: ['member'] 
        },
        { 
            name: 'Guest House Tariff', 
            href: '/guest-room-rent', 
            icon: Contact, 
            active: false, 
            roles: ['member'] 
        },

        // Admin Management Links
        { 
            name: 'Members', 
            href: route('users.index'), 
            icon: Users, 
            active: route().current('users.*') || route().current('members.*'), 
            roles: ['super_admin', 'admin'] 
        },
        { 
            name: 'Tournaments', 
            id: 'tournaments',
            icon: Trophy,
            active: route().current('tournaments.*') || route().current('tournament-results.*') || route().current('hole-in-ones.*') || route().current('winner-lists.*') || route().current('flight-schedules.*') || route().current('scorecards.*'), 
            roles: ['super_admin', 'admin'],
            children: [
                { name: 'Manage Tournaments', href: route('tournaments.index'), active: route().current('tournaments.index') },
                { name: 'Scorecards & Rounds', href: route('scorecards.index'), active: route().current('scorecards.*') },
                { name: 'Tournament Results', href: route('tournament-results.index'), active: route().current('tournament-results.*') },
                { name: 'Hole In One Records', href: route('hole-in-ones.index'), active: route().current('hole-in-ones.*') },
                { name: 'List of Winners', href: route('winner-lists.index'), active: route().current('winner-lists.*') },
                { name: 'Flight Schedules', href: route('flight-schedules.index'), active: route().current('flight-schedules.*') },
            ]
        },
        { 
            name: 'Notices', 
            href: route('notices.index'), 
            icon: Bell, 
            active: route().current('notices.*'), 
            roles: ['super_admin', 'admin'] 
        },
        { 
            name: 'News', 
            href: '/news', 
            icon: Newspaper, 
            active: route().current('news.*'), 
            roles: ['super_admin', 'admin'] 
        },
        { 
            name: 'Forms', 
            href: route('forms.index'), 
            icon: FileText, 
            active: route().current('forms.*'), 
            roles: ['super_admin', 'admin'] 
        },
        { 
            name: 'Committees', 
            href: route('committee-members.index'), 
            icon: Network, 
            active: route().current('committee-members.*'), 
            roles: ['super_admin', 'admin'] 
        },
        { 
            name: 'Media', 
            id: 'media',
            icon: ImageIcon, 
            active: route().current('media.*') || route().current('gallery') || route().current('gallery.*'),
            roles: ['super_admin', 'admin'],
            children: [
                { name: 'Media Library', href: route('media.index'), active: route().current('media.*') },
                { name: 'Photo Gallery', href: route('gallery'), active: route().current('gallery') || route().current('gallery.*') },
            ]
        },
        { 
            name: 'Theme', 
            id: 'theme',
            icon: MonitorPlay, 
            active: route().current('menus.*') || route().current('hero-slides.*') || route().current('homepage-sections.*') || route().current('gallery-images.*') || route().current('partners.*') || route().current('quick-links.*') || route().current('footer-settings.*'),
            roles: ['super_admin', 'admin'],
            children: [
                { name: 'Menus', href: route('menus.index'), active: route().current('menus.*') },
                { name: 'Hero Slides', href: route('hero-slides.index'), active: route().current('hero-slides.*') },
                { name: 'Homepage Sections', href: route('homepage-sections.index'), active: route().current('homepage-sections.*') },
                { name: 'Gallery Images', href: route('gallery-images.index'), active: route().current('gallery-images.*') },
                { name: 'Partners', href: route('partners.index'), active: route().current('partners.*') },
                { name: 'Quick Links', href: route('quick-links.index'), active: route().current('quick-links.*') },
                { name: 'Footer', href: route('footer-settings.index'), active: route().current('footer-settings.*') },
            ]
        },
        { 
            name: 'Contact Info', 
            href: route('contact-directory.index'), 
            icon: Contact, 
            active: route().current('contact-directory.*'), 
            roles: ['super_admin', 'admin'] 
        },
        { 
            name: 'Pages', 
            href: route('pages.index'), 
            icon: FileText, 
            active: route().current('pages.*'), 
            roles: ['super_admin'] 
        },
        { 
            name: 'Settings', 
            id: 'settings',
            href: route('settings.index'), 
            icon: Settings, 
            active: route().current('settings.*'), 
            roles: ['super_admin'],
            children: [
                { name: 'General Settings', href: route('settings.index'), active: route().current('settings.index') },
                { name: 'Footer Social Links', href: route('settings.index') + '?tab=social', active: false },
                { name: 'Google Login Setup', href: route('settings.index') + '?tab=google', active: false },
            ]
        },
    ];

    const [mobileExpanded, setMobileExpanded] = useState({});
    const toggleMobileSubmenu = (id) => {
        setMobileExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleMouseEnter = (itemId) => {
        if (flyoutTimeoutRef.current) clearTimeout(flyoutTimeoutRef.current);
        setActiveFlyout(itemId);
    };

    const handleMouseLeave = () => {
        flyoutTimeoutRef.current = setTimeout(() => {
            setActiveFlyout(null);
        }, 200);
    };

    const filteredNav = navigation.filter(item => item.roles.includes(userRole));

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex">
            {/* ══════════════════════════════════════════════════════
               MOBILE SIDEBAR OVERLAY & DRAWER
            ══════════════════════════════════════════════════════ */}
            <div 
                className={`fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 lg:hidden transition-opacity ${
                    sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`} 
                onClick={() => setSidebarOpen(false)} 
            />

            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white text-slate-900 transform transition-transform duration-300 lg:hidden flex flex-col shadow-2xl border-r border-slate-100 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-3">
                        <ApplicationLogo className="w-10 h-10 object-contain shrink-0" />
                        <span className="font-anton text-xl font-bold uppercase tracking-tight text-slate-900 leading-none" style={{ fontFamily: '"Anton", sans-serif', letterSpacing: '-0.02em' }}>
                            {site_settings?.site_name || 'BOGURA GOLF CLUB'}
                        </span>
                    </Link>
                    <button 
                        type="button" 
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto py-5">
                    {filteredNav.map((item) => (
                        <div key={item.name}>
                            {item.children ? (
                                <>
                                    <button
                                        onClick={() => toggleMobileSubmenu(item.id)}
                                        className={`group flex w-full items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-2xl transition-all ${
                                            item.active
                                                ? 'bg-slate-900 text-white shadow-xs'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4 shrink-0" />
                                            <span>{item.name}</span>
                                        </div>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded[item.id] ? 'rotate-180' : ''}`} />
                                    </button>

                                    {mobileExpanded[item.id] && (
                                        <div className="mt-1.5 space-y-1 pl-4 pr-1 border-l-2 border-[#1C2C1D]/20 ml-5 py-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={`flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                                                        child.active
                                                            ? 'bg-[#1C2C1D] text-white shadow-xs'
                                                            : 'text-slate-600 hover:bg-[#D4E2D2]/40 hover:text-[#1C2C1D]'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-1.5 h-1.5 rounded-full ${child.active ? 'bg-amber-300' : 'bg-slate-300'}`} />
                                                        <span>{child.name}</span>
                                                    </div>
                                                    <ChevronRight className="w-3 h-3 text-slate-300" />
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-2xl transition-all ${
                                        item.active
                                            ? 'bg-slate-900 text-white shadow-xs'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    <item.icon className="w-4 h-4 shrink-0" />
                                    <span>{item.name}</span>
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-2 py-1.5">
                        <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                            {user.profile_picture ? (
                                <img src={`/storage/${user.profile_picture}`} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span>{user.name.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                        </div>
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button" 
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Log Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════
               DESKTOP MINIMALIST ICON DOCK (Matches Inspiration Image)
            ══════════════════════════════════════════════════════ */}
            <aside className="hidden lg:flex w-20 shrink-0 flex-col items-center justify-between py-6 bg-white border-r border-slate-100 sticky top-0 h-screen z-40">
                
                {/* Top Brand Icon */}
                <div className="flex flex-col items-center">
                    <Link 
                        href="/" 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center p-1 hover:scale-105 transition-transform"
                        title={site_settings?.site_name || "Bogura Golf Club"}
                    >
                        <ApplicationLogo className="w-11 h-11 object-contain" />
                    </Link>
                </div>

                {/* Center Vertical Navigation Icon Stack */}
                <nav className="flex flex-col items-center space-y-3 my-auto py-4">
                    {filteredNav.map((item) => {
                        const hasChildren = item.children && item.children.length > 0;
                        const isFlyoutOpen = activeFlyout === (item.id || item.name);

                        return (
                            <div 
                                key={item.name} 
                                className="relative group"
                                onMouseEnter={() => handleMouseEnter(item.id || item.name)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {hasChildren ? (
                                    <button
                                        type="button"
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                                            item.active
                                                ? 'bg-slate-900 text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                        title={item.name}
                                    >
                                        <item.icon className="w-5 h-5 stroke-[2]" />
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                                            item.active
                                                ? 'bg-slate-900 text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                        title={item.name}
                                    >
                                        <item.icon className="w-5 h-5 stroke-[2]" />
                                    </Link>
                                )}

                                {/* Flyout Tooltip / Submenu for Desktop */}
                                {hasChildren ? (
                                    isFlyoutOpen && (
                                        <div className="absolute left-16 top-0 z-50 w-60 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                                            <div className="flex items-center gap-2 px-3 py-2 bg-[#E2E6D5] rounded-xl text-[#1C2C1D] mb-1.5 border border-[#CCD3BD]/60">
                                                <item.icon className="w-4 h-4 text-[#2C442E] shrink-0" />
                                                <span className="text-[11px] font-black uppercase tracking-wider">{item.name}</span>
                                            </div>
                                            <div className="space-y-0.5 max-h-80 overflow-y-auto pr-0.5">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className={`group flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                                                            child.active
                                                                ? 'bg-[#1C2C1D] text-white shadow-xs'
                                                                : 'text-slate-700 hover:bg-[#D4E2D2]/50 hover:text-[#1C2C1D]'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                                child.active ? 'bg-amber-300' : 'bg-slate-300 group-hover:bg-[#1C2C1D]'
                                                            }`} />
                                                            <span className="truncate">{child.name}</span>
                                                        </div>
                                                        <ChevronRight className={`w-3 h-3 shrink-0 ${child.active ? 'text-white' : 'text-slate-300 group-hover:text-[#1C2C1D]'}`} />
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <div className="absolute left-16 top-1/2 -translate-y-1/2 z-50 hidden group-hover:block bg-[#1C2C1D] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap pointer-events-none border border-white/10">
                                        {item.name}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Bottom User Avatar with Upward/Flyout Context Menu */}
                <div className="relative" ref={userMenuRef}>
                    <button 
                        type="button"
                        onClick={() => setUserMenuOpen(prev => !prev)}
                        className="w-11 h-11 rounded-full p-0.5 border border-slate-200 hover:border-slate-400 transition-colors shadow-2xs hover:scale-105"
                        title={user.name}
                    >
                        <div className="w-full h-full rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                            {user.profile_picture ? (
                                <img src={`/storage/${user.profile_picture}`} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                            )}
                        </div>
                    </button>

                    {/* Popover Menu positioned above/right of avatar so it is 100% visible */}
                    {userMenuOpen && (
                        <div className="absolute left-16 bottom-0 z-50 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                            <div className="px-3.5 py-2 border-b border-slate-100">
                                <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                                <p className="text-[10px] text-slate-400 truncate uppercase font-semibold">{user.role}</p>
                            </div>
                            <Link
                                href={route('profile.edit')}
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                <UserIcon className="w-4 h-4 text-slate-400" />
                                <span>Profile & Security</span>
                            </Link>
                            {!isMember && (
                                <Link
                                    href={route('settings.index')}
                                    onClick={() => setUserMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                >
                                    <Settings className="w-4 h-4 text-slate-400" />
                                    <span>Site Settings</span>
                                </Link>
                            )}
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                onClick={() => setUserMenuOpen(false)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left"
                            >
                                <LogOut className="w-4 h-4 text-rose-500" />
                                <span>Log Out</span>
                            </Link>
                        </div>
                    )}
                </div>
            </aside>

            {/* ══════════════════════════════════════════════════════
               MAIN CONTENT WRAPPER
            ══════════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
                
                {/* Impersonation Floating Sticky Banner */}
                {impersonator && (
                    <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 text-white px-4 sm:px-8 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between shadow-md sticky top-0 z-40 border-b border-amber-500">
                        <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-200 animate-ping"></span>
                            <span>
                                Viewing as Member: <strong className="underline decoration-white/70 underline-offset-2">{user.name}</strong> ({user.email}) &bull; <span className="opacity-90 font-normal">Admin Impersonation Mode</span>
                            </span>
                        </div>
                        <Link
                            href={route('impersonate.leave')}
                            method="post"
                            as="button"
                            className="px-3.5 py-1.5 rounded-xl bg-white text-amber-950 font-extrabold text-xs uppercase tracking-wider hover:bg-amber-100 transition-all shadow-xs shrink-0"
                        >
                            Return to Admin
                        </Link>
                    </div>
                )}

                {/* Mobile Top Bar */}
                <header className="lg:hidden bg-white border-b border-slate-100 sticky top-0 z-30 px-4 h-16 flex items-center justify-between">
                    <button
                        type="button"
                        className="p-2 -ml-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-50"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" />
                    </button>

                    <Link href="/" className="font-anton text-[1.65rem] sm:text-3xl font-bold uppercase tracking-tight text-slate-900 leading-none" style={{ fontFamily: '"Anton", sans-serif', letterSpacing: '-0.02em' }}>
                        {site_settings?.site_name || 'BOGURA GOLF CLUB'}
                    </Link>

                    <UserDropdown buttonClassName="w-9 h-9" />
                </header>

                {/* Page View Body */}
                <main className={`flex-1 ${isMember ? 'pb-20 lg:pb-0' : ''}`}>
                    {children}
                </main>

                {/* Member Mobile Bottom Navigation Bar */}
                {isMember && (
                    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-1.5 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
                        <Link
                            href={route('dashboard')}
                            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
                                route().current('dashboard')
                                    ? 'text-[#1C2C1D] font-extrabold'
                                    : 'text-slate-500 font-medium hover:text-slate-900'
                            }`}
                        >
                            <div className={`p-1 rounded-xl transition-all ${
                                route().current('dashboard') ? 'bg-[#D4E2D2] text-[#1C2C1D]' : ''
                            }`}>
                                <LayoutGrid className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] tracking-tight">Dashboard</span>
                        </Link>

                        <Link
                            href="/tournament"
                            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
                                route().current('tournaments.*')
                                    ? 'text-[#1C2C1D] font-extrabold'
                                    : 'text-slate-500 font-medium hover:text-slate-900'
                            }`}
                        >
                            <div className={`p-1 rounded-xl transition-all ${
                                route().current('tournaments.*') ? 'bg-[#D4E2D2] text-[#1C2C1D]' : ''
                            }`}>
                                <Trophy className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] tracking-tight">Matches</span>
                        </Link>

                        <Link
                            href={route('scorecards.index')}
                            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
                                route().current('scorecards.*')
                                    ? 'text-[#1C2C1D] font-extrabold'
                                    : 'text-slate-500 font-medium hover:text-slate-900'
                            }`}
                        >
                            <div className={`p-1 rounded-xl transition-all ${
                                route().current('scorecards.*') ? 'bg-[#D4E2D2] text-[#1C2C1D]' : ''
                            }`}>
                                <ClipboardList className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] tracking-tight">Scorecards</span>
                        </Link>

                        <Link
                            href="/notice-board"
                            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
                                route().current('notices.*')
                                    ? 'text-[#1C2C1D] font-extrabold'
                                    : 'text-slate-500 font-medium hover:text-slate-900'
                            }`}
                        >
                            <div className={`p-1 rounded-xl transition-all ${
                                route().current('notices.*') ? 'bg-[#D4E2D2] text-[#1C2C1D]' : ''
                            }`}>
                                <Bell className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] tracking-tight">Notices</span>
                        </Link>

                        <Link
                            href={route('profile.edit')}
                            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-2xl transition-all ${
                                route().current('profile.*')
                                    ? 'text-[#1C2C1D] font-extrabold'
                                    : 'text-slate-500 font-medium hover:text-slate-900'
                            }`}
                        >
                            <div className={`p-1 rounded-xl transition-all ${
                                route().current('profile.*') ? 'bg-[#D4E2D2] text-[#1C2C1D]' : ''
                            }`}>
                                <UserIcon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] tracking-tight">Profile</span>
                        </Link>
                    </nav>
                )}
            </div>
        </div>
    );
}
