import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User as UserIcon, Settings, LogOut, ShieldCheck } from 'lucide-react';

export default function UserDropdown({ className = '', buttonClassName = '' }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const isMember = (user.role || 'member') === 'member';

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200/80 p-0.5 shadow-xs flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-transform ${buttonClassName}`}
                title={user.name || "User Profile"}
                aria-expanded={open}
            >
                <div className="w-full h-full rounded-full bg-[#1F2F20] text-white flex items-center justify-center text-xs sm:text-sm font-bold overflow-hidden">
                    {user.profile_picture ? (
                        <img src={`/storage/${user.profile_picture}`} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                    )}
                </div>
            </button>

            {open && (
                <div className="absolute right-0 mt-2 z-50 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate uppercase font-semibold mt-0.5">
                            {user.role || 'Member'}
                        </p>
                    </div>

                    <Link
                        href={route('profile.edit')}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>Profile & Security</span>
                    </Link>

                    {!isMember && (
                        <Link
                            href={route('settings.index')}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                            <Settings className="w-4 h-4 text-slate-400" />
                            <span>Site Settings</span>
                        </Link>
                    )}

                    <div className="pt-1 border-t border-slate-50">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            onClick={() => setOpen(false)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left"
                        >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            <span>Log Out</span>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
