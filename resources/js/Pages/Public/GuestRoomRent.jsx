import React, { useState, useMemo } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserDropdown from '@/Components/UserDropdown';
import { Head, usePage, Link } from '@inertiajs/react';
import { 
    Building2, 
    BedDouble, 
    Phone, 
    Search, 
    ShieldCheck, 
    Info, 
    Calendar, 
    ArrowUpRight,
    Users,
    Trophy,
    CheckCircle2
} from 'lucide-react';

export default function GuestRoomRent() {
    const { site_settings, auth } = usePage().props;
    const user = auth?.user;

    const [searchQuery, setSearchQuery] = useState('');

    const rentData = [
        {
            ser: '1.',
            authPerson: 'Def Svc Person (Serving / Pensioner) & Family',
            category: 'BGC Club Member',
            rent: '1,000.00',
            remarks: 'Member of Bogura Golf Club'
        },
        {
            ser: '2.',
            authPerson: 'Civil Def Person & Family',
            category: 'BGC Club Member',
            rent: '1,500.00',
            remarks: 'Member of Bogura Golf Club'
        },
        {
            ser: '3.',
            authPerson: 'Serving / Pensioner Govt Serving Person & Family',
            category: 'BGC Club Member',
            rent: '2,000.00',
            remarks: 'Member of Bogura Golf Club'
        },
        {
            ser: '4.',
            authPerson: 'Civil Person & Family',
            category: 'BGC Club Member',
            rent: '2,000.00',
            remarks: 'Member of Bogura Golf Club'
        },
        {
            ser: '5.',
            authPerson: 'Civil Members of Any Golf Club & Family',
            category: 'Affiliated Club Member',
            rent: '2,000.00',
            remarks: 'Reciprocal / Affiliated Golf Clubs'
        },
        {
            ser: '6.',
            authPerson: 'Def Svc Person & Family (Son/daughter under 25 yrs)',
            category: 'Non-Member Defense',
            rent: '1,500.00',
            remarks: 'Non-member of Bogura Golf Club'
        },
        {
            ser: '7.',
            authPerson: 'Civil Person & Family',
            category: 'Guest of Member',
            rent: '2,500.00',
            remarks: 'Relatives of Def Svc / Pensioner (Member of BGC)'
        },
        {
            ser: '8.',
            authPerson: 'Civil Person & Family',
            category: 'Guest of Member',
            rent: '2,500.00',
            remarks: 'Relatives of Civil Member of BGC'
        },
        {
            ser: '9.',
            authPerson: 'Foreign Nationals / Dignitaries',
            category: 'Foreign Guests',
            rent: '4,000.00',
            remarks: 'Clearance from DGFI required'
        },
        {
            ser: '10.',
            authPerson: 'Tournament Official Sponsors',
            category: 'Official Tournament',
            rent: 'Complimentary',
            remarks: 'Allocated during official tournament periods'
        }
    ];

    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return rentData;
        const q = searchQuery.toLowerCase();
        return rentData.filter(item => 
            item.authPerson.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            item.remarks.toLowerCase().includes(q) ||
            item.rent.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    // ─────────────────────────────────────────────────────────────
    // 1. MEMBER AUTHENTICATED VIEW
    // ─────────────────────────────────────────────────────────────
    if (user) {
        return (
            <AuthenticatedLayout header="Guest House Tariffs">
                <Head title={`Guest House Tariffs - ${site_settings?.site_name || 'Bogura Golf Club'}`} />

                <div className="bg-[#F8F9F8] min-h-screen text-slate-900 pb-16">
                    <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-7">
                        
                        {/* ── TOP HEADER ── */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                                    Guest House Accommodation & Tariffs
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
                                    <span>Bogura Golf Club &bull; Member Accommodation Rates</span>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1 text-[#2B402C] font-semibold">
                                        <span className="w-2 h-2 rounded-full bg-[#3D5A3E]"></span>
                                        Majhira Cantonment
                                    </span>
                                </p>
                            </div>

                            {/* Search Pill */}
                            <div className="flex items-center gap-3">
                                <div className="relative w-full md:w-80">
                                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search category or eligibility..."
                                        className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-slate-200/80 text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2C3E2D]/20 focus:border-[#2C3E2D] shadow-xs transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── 3 MILITARY OLIVE STATS CARDS ── */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                            {/* Card 1: Member Room Rates */}
                            <div className="bg-[#D4E2D2] rounded-[24px] p-5 flex flex-col justify-between border border-[#BFD4BD] shadow-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Club Member Rates</span>
                                    <div className="w-8 h-8 rounded-full bg-white text-[#1C2C1D] flex items-center justify-center shadow-xs">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-2xl sm:text-3xl font-black text-slate-900 font-display">BDT 1,000 - 2,000</p>
                                    <span className="text-[11px] font-semibold text-[#243B26] mt-0.5 block">Per Night / Room</span>
                                </div>
                            </div>

                            {/* Card 2: Guest & Civil Rates */}
                            <div className="bg-[#E2E6D5] rounded-[24px] p-5 flex flex-col justify-between border border-[#CCD3BD] shadow-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Guest & Relative Rates</span>
                                    <div className="w-8 h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs">
                                        <Users className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-2xl sm:text-3xl font-black text-slate-900 font-display">BDT 2,500 - 4,000</p>
                                    <span className="text-[11px] font-semibold text-[#35432B] mt-0.5 block">Per Night / Room</span>
                                </div>
                            </div>

                            {/* Card 3: Tournament Sponsors */}
                            <div className="bg-[#DFE5D4] rounded-[24px] p-5 flex flex-col justify-between border border-[#CBD4BD] shadow-xs">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tournament Sponsors</span>
                                    <div className="w-8 h-8 rounded-full bg-white text-[#2C442E] flex items-center justify-center shadow-xs">
                                        <Trophy className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-2xl sm:text-3xl font-black text-slate-900 font-display">Complimentary</p>
                                    <span className="text-[11px] font-semibold text-[#2B402C] mt-0.5 block">Tournament Duration</span>
                                </div>
                            </div>

                        </div>

                        {/* ── TARIFF TABLE IN CLEAN BENTO CONTAINER ── */}
                        <div className="bg-white rounded-[28px] border border-slate-200/80 shadow-xs overflow-hidden">
                            <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                                        Official Room Tariff Schedule
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Authorized tariff rates for officers, club members, affiliated guests, and sponsors.
                                    </p>
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4E2D2] text-[#1C2C1D] text-xs font-bold border border-[#BFD4BD]">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>BGC Governing Authority</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-xs sm:text-sm text-left border-collapse">
                                    <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                                        <tr>
                                            <th className="py-3.5 px-6 text-center w-16">Ser</th>
                                            <th className="py-3.5 px-6">Authorized Person / Category</th>
                                            <th className="py-3.5 px-6 text-right w-44">Tariff / Night</th>
                                            <th className="py-3.5 px-6 w-80">Remarks / Eligibility</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                                        {filteredData.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="py-4 px-6 text-center font-bold text-slate-400">
                                                    {row.ser}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <p className="font-bold text-slate-900">{row.authPerson}</p>
                                                    <span className="text-[11px] text-slate-500 font-medium">{row.category}</span>
                                                </td>
                                                <td className="py-4 px-6 text-right font-black text-slate-900 font-display text-sm sm:text-base">
                                                    {row.rent === 'Complimentary' || row.rent === 'Free' ? (
                                                        <span className="text-emerald-700 font-bold text-xs uppercase px-2.5 py-1 rounded-full bg-[#D4E2D2] border border-[#BFD4BD]">
                                                            Free
                                                        </span>
                                                    ) : (
                                                        `BDT ${row.rent}`
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-xs text-slate-500">
                                                    {row.remarks || 'Standard reservation terms apply.'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ── RESERVATION NOTICE & CONTACT BOX ── */}
                        <div className="bg-[#DFE5D4] rounded-[28px] p-6 sm:p-7 border border-[#CBD4BD] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-[#2C442E]" />
                                    <h4 className="text-sm sm:text-base font-bold text-slate-900">
                                        Guest House Booking Guidelines
                                    </h4>
                                </div>
                                <p className="text-xs text-[#2B402C] leading-relaxed max-w-2xl">
                                    Rooms must be booked in advance through the Bogura Golf Club Secretariat. Military officers and members may contact the club intercom or duty manager for direct check-in verification.
                                </p>
                            </div>

                            <Link
                                href="/contact-us"
                                className="px-5 py-2.5 rounded-full bg-[#1C2C1D] text-white text-xs font-bold hover:bg-[#2C442E] transition-colors shadow-xs shrink-0 self-start md:self-auto flex items-center gap-2"
                            >
                                <Phone className="w-3.5 h-3.5" />
                                <span>Contact Secretariat</span>
                            </Link>
                        </div>

                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // ─────────────────────────────────────────────────────────────
    // 2. GUEST PUBLIC VIEW
    // ─────────────────────────────────────────────────────────────
    return (
        <PublicLayout>
            <Head title={`Guest Room Rent - ${site_settings?.site_name || 'Bogura Golf Club'}`} />
            
            <div className="container mx-auto px-4 py-12 flex-grow max-w-5xl">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-[#0c2417] text-white p-6 md:p-8 text-center">
                        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">
                            Guest Room Rent of Bogura Golf Club
                        </h1>
                        <p className="text-xs sm:text-sm text-emerald-100/80 mt-2">
                            Official tariff schedule for guest house accommodations in Majhira Cantonment.
                        </p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm border-collapse text-left">
                            <thead className="bg-[#133321] text-white font-semibold text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 text-center w-16">Ser</th>
                                    <th className="p-4">Authorized Person</th>
                                    <th className="p-4 text-center w-36">Rent / Night</th>
                                    <th className="p-4 w-64">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rentData.map((item, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                                        <td className="p-4 text-center font-bold text-slate-400">{item.ser}</td>
                                        <td className="p-4 font-semibold text-slate-800">{item.authPerson}</td>
                                        <td className="p-4 text-center font-bold text-slate-900">
                                            {item.rent === 'Free' ? <span className="text-emerald-700 font-bold">Free</span> : `BDT ${item.rent}`}
                                        </td>
                                        <td className="p-4 text-xs text-slate-500">{item.remarks || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
