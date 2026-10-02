import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { 
    Home, 
    Trophy, 
    Image as ImageIcon, 
    FileText, 
    Menu, 
    X, 
    ChevronDown, 
    Bell, 
    Phone, 
    ArrowUpRight,
    User,
    ShieldCheck,
    Newspaper
} from 'lucide-react';

const MobileMenuItem = ({ item, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    return (
        <div className="flex flex-col border-b border-slate-100 last:border-0">
            <div className="flex items-center justify-between py-1">
                <a 
                    href={hasChildren ? '#' : (item.url || '#')} 
                    target={item.target} 
                    className="py-2.5 px-3 text-xs font-bold text-slate-800 hover:text-emerald-800 uppercase tracking-wider flex-1 transition-colors rounded-xl hover:bg-slate-50"
                    onClick={(e) => {
                        if (hasChildren) {
                            e.preventDefault();
                            setIsOpen(!isOpen);
                        } else if (onClose) {
                            onClose();
                        }
                    }}
                >
                    {item.title}
                </a>
                {hasChildren && (
                    <button 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="text-slate-400 hover:text-emerald-800 p-2 transition-colors"
                        aria-label="Toggle submenu"
                    >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-800' : ''}`} />
                    </button>
                )}
            </div>
            
            {hasChildren && isOpen && (
                <div className="ml-3 pl-3 pb-2 flex flex-col space-y-1 bg-slate-50 rounded-2xl my-1 p-2 border-l-2 border-emerald-600 animate-in fade-in slide-in-from-top-1 duration-200">
                    {item.children.map((child, cIdx) => (
                        <a 
                            key={cIdx} 
                            href={child.url || '#'} 
                            target={child.target} 
                            onClick={onClose}
                            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 rounded-xl transition-colors"
                        >
                            {child.title}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function MobileBottomNav({ isSidebarOpen, setIsSidebarOpen }) {
    const { auth, site_settings, menus } = usePage().props;
    const url = typeof window !== 'undefined' ? window.location.pathname : '/';

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    // Dynamic Menus
    const topMenu = menus?.top_bar?.items || [];
    const mobileMenu = menus?.mobile_hamburger?.items || topMenu;

    const navItems = [
        { label: 'Home', href: '/', icon: Home, isActive: url === '/' },
        { label: 'Tournaments', href: '/tournament', icon: Trophy, isActive: url.includes('tournament') },
        { label: 'News', href: '/news', icon: Newspaper, isActive: url.includes('news') },
        { label: 'Gallery', href: '/photo-gallery', icon: ImageIcon, isActive: url.includes('gallery') || url.includes('photo') },
        { label: 'Forms', href: '/club-form', icon: FileText, isActive: url.includes('club-form') || url.includes('form') },
    ];

    return (
        <>
            {/* ── 1. EXPANDING PILL CAPSULE TAB BAR (Olive Theme) ── */}
            <nav 
                style={{ backgroundColor: '#182411', borderColor: 'rgba(255, 255, 255, 0.16)' }}
                className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full border px-2 py-1.5 flex items-center gap-1 sm:gap-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl text-white select-none max-w-[95vw]"
            >
                {navItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            className={`transition-all duration-300 ease-out flex items-center justify-center ${
                                item.isActive 
                                    ? 'bg-[#293c1d] text-white px-3.5 py-2 rounded-full shadow-inner border border-white/10' 
                                    : 'text-white/70 hover:text-white hover:bg-white/10 p-2.5 rounded-full'
                            }`}
                        >
                            <Icon 
                                className={`w-5 h-5 shrink-0 transition-transform duration-200 ${item.isActive ? 'text-amber-400' : 'text-white/80'}`} 
                                strokeWidth={item.isActive ? 2.3 : 1.8} 
                            />
                            {item.isActive && (
                                <span className="ml-2 text-xs font-bold tracking-tight text-white whitespace-nowrap animate-in fade-in duration-200">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}

                {/* Menu Trigger Button */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className={`transition-all duration-300 ease-out flex items-center justify-center ${
                        isSidebarOpen 
                            ? 'bg-[#293c1d] text-white px-3.5 py-2 rounded-full shadow-inner border border-white/10' 
                            : 'text-white/70 hover:text-white hover:bg-white/10 p-2.5 rounded-full'
                    }`}
                    aria-label="Open Navigation Menu"
                >
                    <Menu 
                        className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isSidebarOpen ? 'text-amber-400' : 'text-white/80'}`} 
                        strokeWidth={isSidebarOpen ? 2.3 : 1.8} 
                    />
                    {isSidebarOpen && (
                        <span className="ml-2 text-xs font-bold tracking-tight text-white whitespace-nowrap animate-in fade-in duration-200">
                            Menu
                        </span>
                    )}
                </button>
            </nav>

            {/* ── 2. EXECUTIVE SLIDE-OVER DRAWER MODAL ── */}
            {isSidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-250"
                        onClick={() => setIsSidebarOpen(false)}
                    />

                    {/* Drawer Sheet */}
                    <div className="relative z-10 w-[86%] max-w-sm bg-white text-slate-900 h-full p-5 sm:p-6 shadow-2xl overflow-y-auto flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
                        <div className="space-y-5">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <Link href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3">
                                    <ApplicationLogo className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                    <div>
                                        <h3 className="font-anton text-base sm:text-lg font-bold text-slate-900 uppercase tracking-tight leading-none" style={{ fontFamily: '"Anton", sans-serif', letterSpacing: '-0.025em' }}>
                                            {site_settings?.site_name || 'BOGURA GOLF CLUB'}
                                        </h3>
                                        <p className="text-[10px] text-emerald-800 uppercase tracking-widest font-bold">Executive Portal</p>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Auth Member Card or Login Actions */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                                {auth?.user ? (
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0 overflow-hidden border border-emerald-600/40">
                                                {auth.user.profile_picture ? (
                                                    <img src={`/storage/${auth.user.profile_picture}`} alt={auth.user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span>{auth.user.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-900 truncate">{auth.user.name}</p>
                                                <p className="text-[11px] text-emerald-800 font-semibold uppercase tracking-wider">{auth.user.role || 'Member'}</p>
                                            </div>
                                        </div>
                                        <Link 
                                            href={route('dashboard')}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="px-3.5 py-1.5 rounded-full bg-[#0c2417] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md hover:bg-emerald-950 transition-colors shrink-0"
                                        >
                                            <span>Portal</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link
                                            href={route('login')}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="w-full py-2.5 px-4 rounded-full bg-white border border-slate-200 text-center text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors uppercase tracking-wider"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className="w-full py-2.5 px-4 rounded-full bg-[#0c2417] text-white text-center text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-emerald-950 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <span>Register</span>
                                            <ArrowUpRight className="w-3 h-3 text-amber-300" />
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Quick Shortcuts */}
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    href="/notice-board"
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-emerald-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-100 transition-colors"
                                >
                                    <Bell className="w-4 h-4 text-emerald-700" />
                                    <span>Notices</span>
                                </Link>
                                <Link
                                    href="/contact-us"
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-emerald-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-100 transition-colors"
                                >
                                    <Phone className="w-4 h-4 text-emerald-700" />
                                    <span>Contact Us</span>
                                </Link>
                            </div>

                            {/* Navigation Links Accordion */}
                            <div className="space-y-1">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-2">Club Directory & Pages</p>
                                {mobileMenu.length > 0 ? (
                                    mobileMenu.map((item, idx) => (
                                        <MobileMenuItem key={idx} item={item} onClose={() => setIsSidebarOpen(false)} />
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 italic px-2 py-2">No menu assigned</p>
                                )}
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="pt-4 border-t border-slate-100 mt-6 text-center">
                            <p className="text-[11px] text-slate-400 font-medium">
                                Bogura Golf Club • Cantonment Majhira
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
