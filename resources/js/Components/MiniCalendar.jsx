import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function MiniCalendar({ events = [] }) {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDateStr, setSelectedDateStr] = useState(today.toISOString().split('T')[0]);

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const resetToToday = () => {
        const now = new Date();
        setCurrentDate(now);
        setSelectedDateStr(now.toISOString().split('T')[0]);
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const todayStr = today.toISOString().split('T')[0];

    // Filter events for selected date
    const selectedDateEvents = events.filter(e => {
        if (!e.start_date) return false;
        const eDate = e.start_date.split(' ')[0];
        return eDate === selectedDateStr;
    });

    const days = [];

    // Fill empty days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Fill days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const dateString = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        // Find events on this date
        const dayEvents = events.filter(e => {
            if (!e.start_date) return false;
            const eDate = e.start_date.split(' ')[0];
            return eDate === dateString;
        });
        
        const hasEvent = dayEvents.length > 0;
        const isToday = dateString === todayStr;
        const isSelected = dateString === selectedDateStr;

        days.push(
            <div key={i} className="flex justify-center items-center w-8 h-8 relative group">
                <button
                    type="button"
                    onClick={() => setSelectedDateStr(dateString)}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center relative cursor-pointer
                        ${isSelected 
                            ? 'bg-military-800 text-white font-black shadow-md border border-military-700 scale-105' 
                            : isToday 
                            ? 'bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-300 hover:bg-emerald-100' 
                            : hasEvent
                            ? 'bg-military-50 text-military-900 font-black hover:bg-military-100 border border-military-200/60'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
                        }
                    `}
                >
                    <span>{i}</span>
                    {hasEvent && !isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute bottom-0.5" />
                    )}
                    {hasEvent && isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 absolute bottom-0.5" />
                    )}
                </button>
                
                {/* Tooltip on hover */}
                {hasEvent && (
                    <div className="absolute z-30 hidden group-hover:block bottom-full mb-1.5 w-52 bg-slate-900 text-white border border-slate-700 shadow-2xl rounded-2xl p-2.5 text-xs text-left animate-in fade-in duration-200 pointer-events-none">
                        <div className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider mb-1">
                            {dayEvents.length} {dayEvents.length === 1 ? 'Event' : 'Events'} on Day
                        </div>
                        {dayEvents.map(e => (
                            <div key={e.id} className="truncate font-semibold text-slate-200">
                                • {e.title}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const formatSelectedHeading = () => {
        if (selectedDateStr === todayStr) return 'Upcoming Events';
        const [y, m, d] = selectedDateStr.split('-').map(Number);
        if (!y || !m || !d) return `Events for ${selectedDateStr}`;
        const dateObj = new Date(y, m - 1, d);
        return `Events for ${dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    };

    return (
        <div className="w-full select-none">
            {/* Month & Year Navigation Header */}
            <div className="flex justify-between items-center mb-4 bg-slate-50/80 p-2 rounded-2xl border border-slate-100">
                <button 
                    onClick={prevMonth} 
                    className="w-7 h-7 rounded-xl bg-white hover:bg-military-800 hover:text-white text-slate-600 border border-slate-200/80 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                    title="Previous Month"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm tracking-tight font-['Outfit']">
                        {monthName} {year}
                    </span>
                    <button 
                        onClick={resetToToday} 
                        className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 text-[10px] font-black uppercase tracking-wider hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 cursor-pointer"
                    >
                        Today
                    </button>
                </div>

                <button 
                    onClick={nextMonth} 
                    className="w-7 h-7 rounded-xl bg-white hover:bg-military-800 hover:text-white text-slate-600 border border-slate-200/80 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                    title="Next Month"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
            
            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 mb-2 place-items-center">
                {weekdays.map(day => (
                    <div key={day} className="text-[11px] font-black text-slate-400 uppercase tracking-wider w-8 text-center">
                        {day}
                    </div>
                ))}
            </div>
            
            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 place-items-center mb-4">
                {days}
            </div>
            
            {/* Upcoming / Selected Date Events List */}
            <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-military-600" />
                        {formatSelectedHeading()}
                    </h4>
                </div>

                <div className="space-y-2">
                    {selectedDateEvents.length > 0 ? (
                        selectedDateEvents.map(e => (
                            <Link 
                                key={e.id} 
                                href={route('tournaments.upcoming.public')} 
                                className="group flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/80 hover:bg-military-50/80 border border-slate-100 hover:border-military-200 transition-all duration-300"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="px-2 py-1 rounded-xl bg-military-800 text-yellow-400 text-[10px] font-black shrink-0 text-center shadow-sm">
                                        {new Date(e.start_date).getDate()} {new Date(e.start_date).toLocaleString('default', { month: 'short' })}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-extrabold text-xs text-slate-800 group-hover:text-military-900 truncate leading-snug">
                                            {e.title}
                                        </p>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-military-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                            </Link>
                        ))
                    ) : events.length > 0 ? (
                        events.slice(0, 3).map(e => (
                            <Link 
                                key={e.id} 
                                href={route('tournaments.upcoming.public')} 
                                className="group flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/80 hover:bg-military-50/80 border border-slate-100 hover:border-military-200 transition-all duration-300"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="px-2 py-1 rounded-xl bg-military-800 text-yellow-400 text-[10px] font-black shrink-0 text-center shadow-sm">
                                        {new Date(e.start_date).getDate()} {new Date(e.start_date).toLocaleString('default', { month: 'short' })}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-extrabold text-xs text-slate-800 group-hover:text-military-900 truncate leading-snug">
                                            {e.title}
                                        </p>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-military-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
                            </Link>
                        ))
                    ) : (
                        <div className="p-3 bg-slate-50 rounded-2xl text-center text-xs font-semibold text-slate-400 border border-slate-100">
                            No events scheduled
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

