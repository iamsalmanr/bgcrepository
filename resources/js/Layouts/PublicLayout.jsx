import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import Footer from '@/Components/Footer';
import MobileBottomNav from '@/Components/MobileBottomNav';

const MobileMenuItem = ({ item, onItemClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between">
                <a 
                    href={hasChildren ? '#' : (item.url || '#')} 
                    target={item.target} 
                    className="flex-1 py-3 px-4 rounded-xl text-[14px] font-semibold text-slate-800 hover:text-emerald-900 hover:bg-emerald-50/80 active:bg-emerald-100/60 transition-all flex items-center justify-between"
                    onClick={(e) => {
                        if (hasChildren) {
                            e.preventDefault();
                            setIsOpen(!isOpen);
                        } else if (onItemClick) {
                            onItemClick();
                        }
                    }}
                >
                    <span>{item.title}</span>
                    {hasChildren && (
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-800' : ''}`} />
                        </div>
                    )}
                </a>
            </div>
            
            {hasChildren && isOpen && (
                <div className="ml-4 pl-3 my-1 border-l-2 border-emerald-500/60 flex flex-col space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {item.children.map((child, cIdx) => (
                        <a 
                            key={cIdx} 
                            href={child.url || '#'} 
                            target={child.target} 
                            className="py-2 px-3 rounded-lg text-[13px] font-medium text-slate-600 hover:text-emerald-900 hover:bg-emerald-50/60 transition-all"
                            onClick={() => onItemClick && onItemClick()}
                        >
                            {child.title}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function PublicLayout({ children }) {
    const { auth, site_settings, menus } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.02em'
    };

    // Dynamic Menus
    const topMenu = menus?.top_bar?.items || [];
    const mobileMenu = menus?.mobile_hamburger?.items || topMenu;

    return (
        <div 
            className="min-h-screen bg-[#fafaf8] flex flex-col font-sans selection:bg-emerald-700 selection:text-white"
            style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
                letterSpacing: '-0.011em'
            }}
        >
            {/* Top Navigation Wrapper */}
            <div className="sticky top-0 z-40 pt-2 pb-2 px-3 lg:p-0 bg-transparent">
                <header className="w-full bg-[#fbfbf9]/95 backdrop-blur-md rounded-full shadow-lg border border-white/30 lg:bg-white lg:rounded-none lg:shadow-sm lg:border-none">
                    <div className="max-w-[1680px] w-full mx-auto px-3 sm:px-5 lg:px-6">
                        <div className="flex items-center justify-between py-2 md:py-3 gap-2 sm:gap-4 relative">
                            {/* Logo & Title - Left */}
                            <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 hover:opacity-90 transition-opacity z-10">
                                <ApplicationLogo className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-md shrink-0" />
                                <div className="text-left">
                                    <h1 
                                        className="font-anton text-lg sm:text-2xl 2xl:text-3xl font-bold uppercase tracking-tight text-slate-950 leading-none whitespace-nowrap" 
                                        style={{ fontFamily: '"Anton", sans-serif', letterSpacing: '-0.02em' }}
                                    >
                                        {site_settings?.site_name || 'BOGURA GOLF CLUB'}
                                    </h1>
                                </div>
                            </Link>

                            {/* Desktop Menu Links - Center */}
                            <nav className="hidden xl:flex flex-1 min-w-0 justify-center px-2 2xl:px-4 gap-1.5 2xl:gap-2.5 text-xs font-semibold text-slate-700 whitespace-nowrap overflow-hidden">
                                {topMenu.length > 0 ? topMenu.map((item, idx) => (
                                    <div key={idx} className="relative group py-1.5">
                                        <a 
                                            href={item.url || '#'} 
                                            target={item.target} 
                                            className="px-2.5 2xl:px-3.5 py-1.5 2xl:py-2 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800 transition-colors tracking-tight flex items-center shadow-2xs h-8.5 2xl:h-9 uppercase text-[10.5px] 2xl:text-[11px] font-semibold"
                                        >
                                            <span>{item.title}</span>
                                            {item.children && item.children.length > 0 && <ChevronDown className="w-3 h-3 ml-1 text-slate-400 shrink-0" />}
                                        </a>
                                        {item.children && item.children.length > 0 && (
                                            <div className="absolute top-full left-0 hidden group-hover:block bg-white shadow-xl border border-slate-100 rounded-2xl py-2 min-w-[210px] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                {item.children.map((child, cIdx) => (
                                                    <a 
                                                        key={cIdx} 
                                                        href={child.url || '#'} 
                                                        target={child.target} 
                                                        className="block px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                                                    >
                                                        {child.title}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )) : (
                                    <span className="text-slate-400 italic flex items-center h-9 text-xs">No menu assigned to Top Bar</span>
                                )}
                            </nav>
                            
                            {/* Auth Action Buttons & Mobile Hamburger - Always Visible on Right */}
                            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5 ml-auto z-10">
                                {auth?.user ? (
                                    <Link href={route('dashboard')} className="flex items-center group">
                                        <div className="bg-[#1b2a22] text-white px-3 sm:px-4.5 h-8.5 sm:h-9 rounded-full font-semibold text-[11px] sm:text-xs uppercase tracking-wider flex items-center group-hover:bg-emerald-950 transition-colors shadow-sm">
                                            <span className="hidden sm:inline">Dashboard</span>
                                            <span className="sm:hidden">Portal</span>
                                        </div>
                                        <div className="w-2.5 h-1 bg-[#1b2a22] group-hover:bg-emerald-950 transition-colors -mx-1 z-10 relative"></div>
                                        <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 bg-[#1b2a22] text-white rounded-full flex items-center justify-center group-hover:bg-emerald-950 transition-colors shadow-sm">
                                            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                                        </div>
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5">
                                        <Link 
                                            href={route('login')} 
                                            className="text-slate-700 hover:text-emerald-900 font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-colors px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-slate-100"
                                        >
                                            Log in
                                        </Link>
                                        <Link href={route('register')} className="flex items-center group">
                                            <div className="bg-[#1b2a22] text-white px-3 sm:px-4 xl:px-4.5 h-8.5 sm:h-9 rounded-full font-semibold text-[11px] sm:text-xs uppercase tracking-wider flex items-center group-hover:bg-emerald-950 transition-colors shadow-sm">
                                                <span className="hidden sm:inline">Register</span>
                                                <span className="sm:hidden">Join</span>
                                            </div>
                                            <div className="w-2 sm:w-2.5 h-1 bg-[#1b2a22] group-hover:bg-emerald-950 transition-colors -mx-1 z-10 relative"></div>
                                            <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 bg-[#1b2a22] text-white rounded-full flex items-center justify-center group-hover:bg-emerald-950 transition-colors shadow-sm">
                                                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                                            </div>
                                        </Link>
                                    </div>
                                )}

                                {/* Mobile/Tablet Menu Toggle Button (Visible when full nav is hidden) */}
                                <button 
                                    className="xl:hidden w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors focus:outline-none shrink-0" 
                                    onClick={() => setIsMobileMenuOpen(true)}
                                    aria-label="Open navigation menu"
                                >
                                    <Menu size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
            </div>

            {/* Mobile Drawer Menu (Pure Modal Overlay Sheet) */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex flex-col justify-start p-3.5 sm:p-5 overflow-y-auto animate-in fade-in duration-200 lg:hidden">
                    <div className="bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 max-w-md w-full mx-auto space-y-4 my-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <ApplicationLogo className="w-9 h-9" />
                                <span className="font-anton text-lg font-bold text-slate-900 uppercase tracking-tight" style={{ fontFamily: '"Anton", sans-serif', letterSpacing: '-0.025em' }}>
                                    {site_settings?.site_name || 'BOGURA GOLF CLUB'}
                                </span>
                            </div>
                            <button 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                                aria-label="Close menu"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Menu Items List (High Contrast Black on White) */}
                        <nav className="flex flex-col space-y-1 max-h-[55vh] overflow-y-auto pr-1">
                            {mobileMenu.map((item, idx) => (
                                <MobileMenuItem 
                                    key={idx} 
                                    item={item} 
                                    onItemClick={() => setIsMobileMenuOpen(false)} 
                                />
                            ))}
                        </nav>

                        {/* Bottom Executive Auth Pill */}
                        <div className="pt-3 border-t border-slate-100 mt-2">
                            {auth?.user ? (
                                <Link 
                                    href={route('dashboard')} 
                                    className="w-full py-3 px-4 rounded-2xl bg-[#0c2417] hover:bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span>Member Dashboard</span>
                                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2.5">
                                    <Link 
                                        href={route('login')} 
                                        className="flex-1 text-center py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs uppercase tracking-wider transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link 
                                        href={route('register')} 
                                        className="flex-1 text-center py-2.5 px-3 rounded-xl bg-[#0c2417] hover:bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span>Register</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-grow">
                {children}
            </main>

            {/* Mobile Bottom Navigation & Slide-over Sidebar */}
            <MobileBottomNav isSidebarOpen={isMobileMenuOpen} setIsSidebarOpen={setIsMobileMenuOpen} />

            {/* Footer */}
            <Footer />
        </div>
    );
}
