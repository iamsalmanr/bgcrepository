import React, { useState, useMemo } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    ShieldCheck, 
    FileText, 
    Download, 
    Search, 
    ArrowUpRight, 
    Building2, 
    Users, 
    Award, 
    Phone, 
    Mail, 
    Calendar, 
    ChevronRight, 
    AlertCircle, 
    CreditCard, 
    Printer, 
    Clock, 
    CheckCircle2, 
    Check, 
    Info, 
    FileCheck,
    Compass,
    Sparkles,
    UserCheck,
    Briefcase,
    Globe,
    Baby,
    HeartHandshake
} from 'lucide-react';

export default function MembershipProcedureView({ page }) {
    const { site_settings } = usePage().props;
    const siteName = site_settings?.site_name || 'Bogura Golf Club';

    const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'steps' | 'security' | 'payments' | 'checklist'
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [checkedDocs, setCheckedDocs] = useState({});

    const toggleDocCheck = (id) => {
        setCheckedDocs(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const categoriesList = [
        {
            id: 'defense-civil',
            title: 'Defence Service & Civil Government Officers',
            group: 'government',
            icon: ShieldCheck,
            badge: 'Priority Clearance',
            badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            description: 'Commissioned officers of the armed forces and senior civil servants of the Government of Bangladesh.',
            requirements: [
                'Serving Defence Services Officers & Retired officers of the rank of Colonel and above, or equivalent.',
                'Serving civil government officers of the rank of Joint Secretary or equivalent and above (Serial 21 and above of Warrant of Precedence 1986).',
                'Officers serving on contract basis or part-time are not eligible.',
                'Other retired defence and civil officers may apply under the Local Bangladeshi (Civil) category.'
            ],
            clearanceType: 'Category 1 (Direct Vice President Approval)'
        },
        {
            id: 'private-civil',
            title: 'Private Service Holder / Local Bangladeshi (Civil)',
            group: 'civil',
            icon: Briefcase,
            badge: 'Corporate & Business',
            badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
            description: 'Established business owners, entrepreneurs, and senior executives in recognized multinational or national companies.',
            requirements: [
                'Must be a graduate from a recognized university.',
                'Must be a regular taxpayer with clean CIB record (minimum personal income tax of BDT 1,00,000 per annum).',
                'Senior Management level officers of reputed MNCs or National Companies with at least 7 to 8 years of professional experience.',
                'Chairman, Managing Director, Directors, or Business Owners of reputed companies with strong corporate tax track record.'
            ],
            clearanceType: 'Category 2 (Balloting Committee & DGFI Clearance)'
        },
        {
            id: 'diplomats',
            title: 'Diplomats & International Officials',
            group: 'international',
            icon: Globe,
            badge: 'Diplomatic Corp',
            badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
            description: 'Accredited diplomats, embassy officials, and personnel of international multilateral development organizations.',
            requirements: [
                'All Ambassadors, High Commissioners, and Embassy Officials of the rank of Second Secretary and above.',
                'Officials of all United Nations organizations, World Bank, Asian Development Bank (ADB), UNICEF, WHO, UNDP, IDB, etc.'
            ],
            clearanceType: 'Category 1 (Direct Vice President Approval)'
        },
        {
            id: 'expatriates',
            title: 'Non-Diplomat Expatriates',
            group: 'international',
            icon: Users,
            badge: 'Expatriate Members',
            badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
            description: 'Foreign nationals residing and actively employed in Bangladesh with approved work authorizations.',
            requirements: [
                'Foreign nationals working in Bangladesh with valid visa and official work permit.',
                'Currently employed in reputed multinational or recognized domestic commercial organizations.'
            ],
            clearanceType: 'Category 2 (Balloting Committee & DGFI Clearance)'
        },
        {
            id: 'corporate',
            title: 'Corporate Membership',
            group: 'civil',
            icon: Building2,
            badge: 'Institutional Privilege',
            badgeColor: 'bg-slate-900 text-white',
            description: 'Custom corporate packages for prominent business houses to nominate up to four senior executive members.',
            requirements: [
                'Available for 1, 2, 3, or 4 nominated corporate executives with transferable member privileges upon executive rotation.',
                'Reserved for corporations with documented annual Corporate Social Responsibility (CSR) contributions of at least BDT 5,000,000 per annum.'
            ],
            clearanceType: 'Category 2 (Balloting Committee & DGFI Clearance)'
        },
        {
            id: 'single-spouse',
            title: 'Single Spouse Membership',
            group: 'family',
            icon: HeartHandshake,
            badge: 'Heritage & Family',
            badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
            description: 'Continuation of club affiliation and recreational access for spouses of deceased permanent club members.',
            requirements: [
                'Spouse may apply within 1 year from the demise of the member.',
                'Minor children continue to receive dependent membership privileges up to 25 years of age.',
                'Golf-playing dependents attaining 25 may apply for full membership at a discounted entrance fee rate.'
            ],
            clearanceType: 'Category 1 (Direct Vice President Approval)'
        },
        {
            id: 'single-lady',
            title: 'Single Lady Member',
            group: 'family',
            icon: UserCheck,
            badge: 'Women in Golf',
            badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
            description: 'Special initiative introduced by the Executive Committee to support and encourage women in the sport of golf.',
            requirements: [
                'Admitted directly by the Executive Committee to foster female golf participation.',
                'Single membership privilege (spouse and dependents do not receive automatic club privileges under this tier).'
            ],
            clearanceType: 'Category 2 (Balloting Committee & DGFI Clearance)'
        },
        {
            id: 'dependent-children',
            title: 'Dependent Members & Children of Members',
            group: 'family',
            icon: Baby,
            badge: 'Youth Progression',
            badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            description: 'Privileges for family members and transition pathway for adult children of members to become full golfers.',
            requirements: [
                'Spouses of active members enjoy club facilities without paying separate entrance fees while the primary membership remains valid.',
                'Children remain dependent members until age 25. After 25, active golf-playing dependents may apply for full membership at special discounted fee tiers:',
                'Special entrance fees for Member Children: Up to 28 yrs (Armed Forces: BDT 2,00,000 | Civil: BDT 8,00,000) ; 28 to 30 yrs (Armed Forces: BDT 3,00,000 | Civil: BDT 10,00,000).',
                'Children above 30 years of age are no longer eligible for dependent status.'
            ],
            hasFeeTable: true,
            clearanceType: 'Category 2 (Balloting Committee & DGFI Clearance)'
        },
        {
            id: 'junior-golfers',
            title: 'Bright Junior Golfers',
            group: 'special',
            icon: Award,
            badge: 'Entrance Fee Exempted',
            badgeColor: 'bg-emerald-600 text-white',
            description: 'Merit-based admission recognizing talented junior players demonstrating exceptional golf skill.',
            requirements: [
                'Talented junior golfers holding an official certified handicap of 5 or below.',
                'Undergoes an official handicap skills test by the BGC Golf Committee.',
                'Valid up to 18 years of age with 100% Entrance Fee Exemption.'
            ],
            clearanceType: 'Category 1 (Direct Vice President Approval)'
        },
        {
            id: 'special-temporary',
            title: 'Special Temporary Member (National Athletes)',
            group: 'special',
            icon: Sparkles,
            badge: 'Entrance Fee Exempted',
            badgeColor: 'bg-emerald-600 text-white',
            description: 'Designation honoring national golf team players and certified national coaches.',
            requirements: [
                'National Golf Team Players or Certified Coaches approved by the Executive Committee on an annual basis.',
                'Entrance fee is 100% exempted as a single sports membership.'
            ],
            clearanceType: 'Category 1 (Direct Vice President Approval)'
        },
        {
            id: 'honorary',
            title: 'Honorary Member',
            group: 'special',
            icon: Award,
            badge: 'Executive Honor',
            badgeColor: 'bg-amber-500 text-white',
            description: 'Conferred by the Executive Committee to individuals of outstanding national or international stature.',
            requirements: [
                'Bangladeshi or foreign nationals with outstanding national/international contributions to sports or society.',
                'Entrance fee is 100% exempted.'
            ],
            clearanceType: 'Category 1 (Direct Vice President Approval)'
        }
    ];

    const applicationSteps = [
        {
            step: '01',
            title: 'Collect Prescribed Application Form',
            subtitle: 'Club Secretariat & Reception',
            icon: FileText,
            details: 'An individual wishing to become a member of Bogura Golf Club collects the official Membership Proposal and Description Form from the Chief Executive Officer / Club Secretariat upon payment of Tk. 1,000.00 in cash.'
        },
        {
            step: '02',
            title: 'Submit Completed Dossier & Documents',
            subtitle: 'Club Secretariat Verification',
            icon: FileCheck,
            details: 'The filled form must be submitted to the Club Secretariat along with 6 copies of recent passport photographs, permanent member recommendation, TIN certificate, last 3 years tax clearance, current tax return copy, entrance fee crossed cheque, and NID/Passport.'
        },
        {
            step: '03',
            title: 'Balloting Interview & Security Clearance',
            subtitle: 'Balloting Committee & DGFI',
            icon: ShieldCheck,
            details: 'Applications are scrutinized by the BGC Balloting Committee during monthly candidate interviews. Following committee recommendation and Vice President endorsement, security vetting is conducted by DGFI. Provisional Use Club Membership (UCM) is awarded in the interim.'
        },
        {
            step: '04',
            title: 'Official Induction Briefing & Membership Handover',
            subtitle: 'Club Captain Induction',
            icon: UserCheck,
            details: 'Upon final clearance and Vice President sign-off, the official membership credential letter is handed over in person by the Club Captain, accompanied by a comprehensive induction briefing on club bylaws, etiquette, and course regulations.'
        }
    ];

    const requiredDocuments = [
        { id: 'doc1', title: 'Official BGC Proposal & Description Form', desc: 'Duly filled in and signed by the applicant.' },
        { id: 'doc2', title: '6 Copies of Passport-Size Photographs', desc: 'Recent studio photographs with white background.' },
        { id: 'doc3', title: 'Permanent Member Recommendation', desc: 'Signed endorsement from an active permanent member of the club.' },
        { id: 'doc4', title: 'Tax Identification Number (TIN) Certificate', desc: 'Official TIN certificate issued by the National Board of Revenue.' },
        { id: 'doc5', title: 'Last 3 Years Income Tax Certificates & Acknowledgements', desc: 'Proof of consistent tax compliance and clean CIB record.' },
        { id: 'doc6', title: 'Certified True Copy of Current Year Tax Return', desc: 'Documenting minimum required personal income tax.' },
        { id: 'doc7', title: 'Crossed Cheque for Full Entrance Fee', desc: 'Payable to "Bogura Golf Club" for the applicable category.' },
        { id: 'doc8', title: 'Photocopy of National ID Card & Passport', desc: 'Clear government-issued identity documents.' }
    ];

    const filteredCategories = useMemo(() => {
        return categoriesList.filter(cat => {
            const matchesGroup = categoryFilter === 'all' || cat.group === categoryFilter;
            const matchesSearch = !searchQuery.trim() || 
                cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cat.requirements.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesGroup && matchesSearch;
        });
    }, [categoryFilter, searchQuery]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <PublicLayout>
            <Head title={`Membership Applying Procedure - ${siteName}`} />

            <div className="bg-[#F8F9F8] min-h-screen text-slate-900 pb-20">
                
                {/* ══════════════════════════════════════════════════════
                   HERO HEADER SECTION
                ══════════════════════════════════════════════════════ */}
                <div className="relative bg-gradient-to-b from-[#162417] via-[#1C2C1D] to-[#253926] text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-md">
                    {/* Background Decorative Rings */}
                    <div className="absolute inset-0 pointer-events-none opacity-10">
                        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-4 border-amber-300"></div>
                        <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full border border-white"></div>
                    </div>

                    <div className="max-w-6xl mx-auto relative z-10 space-y-6">
                        
                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-xs font-semibold text-emerald-200/80">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <span>/</span>
                            <span>Membership</span>
                            <span>/</span>
                            <span className="text-white">Applying Procedure</span>
                        </nav>

                        {/* Badges & Heading */}
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-100">
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                                <span>Official BGC Governance &bull; Majhira Cantonment</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-display">
                                Membership Applying Procedure
                            </h1>

                            <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed font-normal">
                                Comprehensive admission criteria, documentation roadmap, security clearance protocols, and official guidelines for joining Bogura Golf Club.
                            </p>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <Link
                                href="/club-form"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-102"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download Membership Forms</span>
                            </Link>

                            <Link
                                href="/contact-us"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all"
                            >
                                <Phone className="w-4 h-4 text-amber-300" />
                                <span>Contact Secretariat</span>
                            </Link>

                            <button
                                type="button"
                                onClick={handlePrint}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-colors ml-auto hidden sm:inline-flex"
                                title="Print this policy document"
                            >
                                <Printer className="w-4 h-4" />
                                <span>Print Guide</span>
                            </button>
                        </div>

                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════
                   KEY HIGHLIGHTS METRICS CARDS (4 OLIVE CARDS)
                ══════════════════════════════════════════════════════ */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                        
                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                            <div className="w-9 h-9 rounded-xl bg-[#D4E2D2] text-[#1C2C1D] flex items-center justify-center mb-3">
                                <Users className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Categories</span>
                                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">11 Classes</p>
                                <span className="text-[11px] text-slate-600 mt-1 block">Defense, Civil, Corporate & Expats</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                            <div className="w-9 h-9 rounded-xl bg-[#E2E6D5] text-[#2C442E] flex items-center justify-center mb-3">
                                <FileCheck className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Dossier</span>
                                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">8 Documents</p>
                                <span className="text-[11px] text-slate-600 mt-1 block">TIN, Tax Returns & Photos</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Verification</span>
                                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">2 Categories</p>
                                <span className="text-[11px] text-slate-600 mt-1 block">Category 1 Exemption & Cat 2 DGFI</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                                <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Secretariat</span>
                                <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Majhira Cantonment</p>
                                <span className="text-[11px] text-slate-600 mt-1 block">Form Fee: Tk. 1,000 Cash</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════
                   MAIN CONTENT AREA WITH TABS & FILTERS
                ══════════════════════════════════════════════════════ */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">
                    
                    {/* Navigation Pills Bar */}
                    <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-xs flex flex-wrap gap-1.5 items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                            <button
                                type="button"
                                onClick={() => setActiveTab('categories')}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                                    activeTab === 'categories'
                                        ? 'bg-[#1C2C1D] text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <Users className="w-4 h-4" />
                                <span>1. Eligibility Categories</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('steps')}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                                    activeTab === 'steps'
                                        ? 'bg-[#1C2C1D] text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <Compass className="w-4 h-4" />
                                <span>2. Applying Procedure</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('security')}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                                    activeTab === 'security'
                                        ? 'bg-[#1C2C1D] text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <ShieldCheck className="w-4 h-4" />
                                <span>3. Security Clearance</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('payments')}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                                    activeTab === 'payments'
                                        ? 'bg-[#1C2C1D] text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <CreditCard className="w-4 h-4" />
                                <span>4. Subscription Rules</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveTab('checklist')}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                                    activeTab === 'checklist'
                                        ? 'bg-[#1C2C1D] text-white shadow-xs'
                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                <FileCheck className="w-4 h-4" />
                                <span>5. Document Checklist</span>
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search criteria, defense, tax..."
                                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1C2C1D]/20 focus:border-[#1C2C1D]"
                            />
                        </div>
                    </div>

                    {/* ══════════════════════════════════════════════════
                       TAB 1: ELIGIBILITY CATEGORIES
                    ══════════════════════════════════════════════════ */}
                    {activeTab === 'categories' && (
                        <div className="space-y-6 animate-in fade-in duration-150">
                            
                            {/* Category Filter Buttons */}
                            <div className="flex flex-wrap items-center gap-2 pb-1">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Filter By:</span>
                                {[
                                    { id: 'all', label: 'All Categories' },
                                    { id: 'government', label: 'Defence & Civil Govt' },
                                    { id: 'civil', label: 'Civil & Corporate' },
                                    { id: 'international', label: 'Diplomats & Expats' },
                                    { id: 'family', label: 'Family & Spouses' },
                                    { id: 'special', label: 'Juniors & Honorary' }
                                ].map((pill) => (
                                    <button
                                        key={pill.id}
                                        type="button"
                                        onClick={() => setCategoryFilter(pill.id)}
                                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                                            categoryFilter === pill.id
                                                ? 'bg-[#1C2C1D] text-white shadow-2xs'
                                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                                        }`}
                                    >
                                        {pill.label}
                                    </button>
                                ))}
                            </div>

                            {/* Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {filteredCategories.map((cat) => (
                                    <div 
                                        key={cat.id} 
                                        className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                                    >
                                        <div className="space-y-4">
                                            {/* Header with Icon and Badge */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="w-11 h-11 rounded-2xl bg-[#D4E2D2] text-[#1C2C1D] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                    <cat.icon className="w-5 h-5" />
                                                </div>
                                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${cat.badgeColor}`}>
                                                    {cat.badge}
                                                </span>
                                            </div>

                                            {/* Category Title & Description */}
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                                    {cat.title}
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                    {cat.description}
                                                </p>
                                            </div>

                                            {/* Requirements List */}
                                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                                                    Eligibility Criteria
                                                </span>
                                                <ul className="space-y-2">
                                                    {cat.requirements.map((req, idx) => (
                                                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                                            <span>{req}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Special Fee Table for Dependent Children */}
                                            {cat.hasFeeTable && (
                                                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 text-xs">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead className="bg-slate-100 font-bold text-slate-700 text-[11px]">
                                                            <tr>
                                                                <th className="p-2 border-b border-slate-200">Age Limit</th>
                                                                <th className="p-2 border-b border-slate-200">Armed Forces</th>
                                                                <th className="p-2 border-b border-slate-200">Civil Members</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-200 bg-white">
                                                            <tr>
                                                                <td className="p-2 font-medium">Up to 28 Years</td>
                                                                <td className="p-2 font-bold text-emerald-700">BDT 2,00,000</td>
                                                                <td className="p-2 font-bold text-slate-900">BDT 8,00,000</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="p-2 font-medium">28 to 30 Years</td>
                                                                <td className="p-2 font-bold text-emerald-700">BDT 3,00,000</td>
                                                                <td className="p-2 font-bold text-slate-900">BDT 10,00,000</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer / Clearance Tag */}
                                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                                            <span className="flex items-center gap-1.5 text-emerald-800">
                                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                                <span>{cat.clearanceType}</span>
                                            </span>
                                            <Link href="/club-form" className="text-slate-400 hover:text-slate-900 transition-colors">
                                                Forms &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════════
                       TAB 2: STEP-BY-STEP PROCEDURE
                    ══════════════════════════════════════════════════ */}
                    {activeTab === 'steps' && (
                        <div className="space-y-6 animate-in fade-in duration-150">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900">
                                        Step-by-Step Membership Application Roadmap
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                        Follow the four sequential stages from initial form collection to official induction by the Club Captain.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                    {applicationSteps.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="bg-gradient-to-br from-[#F8F9F8] to-[#EEF2ED] rounded-2xl p-6 border border-[#D5DDD4] shadow-2xs space-y-4 relative flex flex-col justify-between"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-black text-[#1C2C1D]/30 font-display">
                                                    {item.step}
                                                </span>
                                                <div className="w-10 h-10 rounded-xl bg-white text-[#1C2C1D] flex items-center justify-center shadow-xs">
                                                    <item.icon className="w-5 h-5 text-[#2C442E]" />
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                                                    {item.subtitle}
                                                </span>
                                                <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                                                    {item.title}
                                                </h4>
                                                <p className="text-xs text-slate-700 mt-2 leading-relaxed font-medium">
                                                    {item.details}
                                                </p>
                                            </div>

                                            {idx === 0 && (
                                                <div className="pt-2">
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1C2C1D] bg-white/80 px-2.5 py-1 rounded-lg">
                                                        Fee: Tk. 1,000.00 (Cash only at Secretariat)
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Helpful Secretariat Banner */}
                                <div className="p-5 rounded-2xl bg-[#E2E6D5] border border-[#CCD3BD] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-slate-900">Need personal assistance or form delivery?</h4>
                                        <p className="text-xs text-[#2A3F2B]/90">
                                            The Club Secretariat at Majhira Cantonment is open Sunday through Thursday to assist prospective applicants.
                                        </p>
                                    </div>
                                    <Link
                                        href="/contact-us"
                                        className="px-4 py-2 rounded-xl bg-[#1C2C1D] text-white text-xs font-bold hover:bg-[#2C442E] transition-colors shrink-0 flex items-center gap-1.5"
                                    >
                                        <Phone className="w-3.5 h-3.5" />
                                        <span>Secretariat Directory</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════════
                       TAB 3: SECURITY CLEARANCE PROTOCOL
                    ══════════════════════════════════════════════════ */}
                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-in fade-in duration-150">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                {/* Category 1 Card */}
                                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs space-y-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                            Category 1
                                        </span>
                                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-extrabold text-slate-900">
                                            Exempted from DGFI Security Clearance
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Direct approval channel for serving officers, accredited diplomats, and recognized sports honorees.
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                                            Eligible Candidates for Category 1:
                                        </span>
                                        <ul className="space-y-2 text-xs text-slate-700">
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Serving Defence Officers (Colonel Equivalent & Above)</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Defence Attaché & Military Attaché</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Accredited Diplomats & UN Officials</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Single Spouses of Deceased Members</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Champion Junior Golfers (Handicap 5 or below)</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                                <span>Special Temporary & Honorary Members</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="p-4 bg-emerald-50/70 rounded-2xl text-xs text-emerald-900 font-medium">
                                        <strong>Protocol:</strong> On receipt of the application dossier, it is placed directly before the Vice President of Bogura Golf Club for final approval.
                                    </div>
                                </div>

                                {/* Category 2 Card */}
                                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                                            Category 2
                                        </span>
                                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                                            <UserCheck className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-extrabold text-slate-900">
                                            Balloting Committee & DGFI Security Clearance
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Verification procedure required for civilian, corporate, retired, and expatriate applicants.
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                                            Applicants in Category 2:
                                        </span>
                                        <ul className="space-y-2 text-xs text-slate-700">
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                                                <span>Retired Defence Service Officers</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                                                <span>Civil Government Service Officers</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                                                <span>Local Bangladeshi Civilians & Corporate Nominees</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                                                <span>Expatriate Non-Diplomats</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-amber-600 shrink-0" />
                                                <span>Single Ladies & Children of Members</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="p-4 bg-amber-50/70 rounded-2xl text-xs text-amber-900 font-medium space-y-1">
                                        <p><strong>Protocol:</strong> Applications are scrutinized by the Balloting Committee and interviewed monthly. Chairman marks recommendations, then submits to DGFI for security clearance.</p>
                                        <p className="pt-1 text-[11px] text-amber-800 font-bold">Interim Privilege: Applicants are granted Use Club Membership (UCM) while DGFI clearance is processed.</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════════
                       TAB 4: SUBSCRIPTIONS & PAYMENT SYSTEM
                    ══════════════════════════════════════════════════ */}
                    {activeTab === 'payments' && (
                        <div className="space-y-6 animate-in fade-in duration-150">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900">
                                        Monthly Subscription & Dues Policy
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                                        Regular settlement of monthly dues is mandatory to keep playing privileges active and avoid disciplinary suspensions.
                                    </p>
                                </div>

                                {/* Timeline of non-payment */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    
                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                                        <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>3 Months Overdue</span>
                                        </span>
                                        <h4 className="text-sm font-bold text-slate-900">Official Warning Letter</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            An official reminder letter is issued by the Club Secretariat to regularize outstanding subscription dues.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                                        <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            <span>6 Months Overdue</span>
                                        </span>
                                        <h4 className="text-sm font-bold text-slate-900">Membership On Hold</h4>
                                        <p className="text-xs text-slate-700 leading-relaxed">
                                            Club access and tournament playing rights are temporarily placed on hold pending complete dues settlement.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                                        <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            <span>12 Months Overdue</span>
                                        </span>
                                        <h4 className="text-sm font-bold text-slate-900">Suspension & Cancellation</h4>
                                        <p className="text-xs text-slate-700 leading-relaxed">
                                            Membership is formally suspended and subject to permanent cancellation by the Executive Committee.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                                            <CreditCard className="w-3.5 h-3.5" />
                                            <span>Reinstatement Rule</span>
                                        </span>
                                        <h4 className="text-sm font-bold text-slate-900">20% Reinstatement Fee</h4>
                                        <p className="text-xs text-slate-700 leading-relaxed">
                                            To reinstate a suspended membership, the applicant must clear all past dues plus pay 20% of the entrance fee for their category.
                                        </p>
                                    </div>

                                </div>

                                <div className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-100">
                                    Authority: Minutes of the Executive Committee Meetings of Bogura Golf Club.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════════════════════════
                       TAB 5: DOCUMENT CHECKLIST (INTERACTIVE)
                    ══════════════════════════════════════════════════ */}
                    {activeTab === 'checklist' && (
                        <div className="space-y-6 animate-in fade-in duration-150">
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-xl font-extrabold text-slate-900">
                                            Mandatory Submission Checklist
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                            Use this interactive checklist to ensure you have compiled all necessary paperwork before visiting the club.
                                        </p>
                                    </div>

                                    <span className="text-xs font-bold text-[#1C2C1D] bg-[#D4E2D2] px-3 py-1.5 rounded-xl shrink-0">
                                        {Object.values(checkedDocs).filter(Boolean).length} of {requiredDocuments.length} Ready
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                    {requiredDocuments.map((doc) => {
                                        const isChecked = Boolean(checkedDocs[doc.id]);
                                        return (
                                            <div
                                                key={doc.id}
                                                onClick={() => toggleDocCheck(doc.id)}
                                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                                                    isChecked 
                                                        ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs' 
                                                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                                                }`}
                                            >
                                                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                                    isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                                                }`}>
                                                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className={`text-xs sm:text-sm font-bold ${isChecked ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                                                        {doc.title}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                                        {doc.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#D4E2D2] rounded-2xl border border-[#BFD4BD]">
                                    <div className="space-y-0.5">
                                        <h4 className="text-sm font-bold text-[#1C2C1D]">Download printable membership proposal forms</h4>
                                        <p className="text-xs text-[#2A3F2B]/80">Available in Word and PDF format on our official Club Forms portal.</p>
                                    </div>
                                    <Link
                                        href="/club-form"
                                        className="px-5 py-2.5 rounded-xl bg-[#1C2C1D] text-white text-xs font-bold hover:bg-[#2C442E] transition-all shrink-0 flex items-center gap-1.5 shadow-xs"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Go to Club Forms</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </PublicLayout>
    );
}
