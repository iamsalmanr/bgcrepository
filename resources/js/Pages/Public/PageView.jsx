import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import MembershipProcedureView from './MembershipProcedureView';

export default function PageView({ page }) {
    const { site_settings } = usePage().props;

    // Delegate to custom high-fidelity view for Membership Applying Procedure
    if (page?.slug === 'membership-applying-procedure') {
        return <MembershipProcedureView page={page} />;
    }

    let isFeesData = false;
    let feesData = null;

    try {
        if (page?.content && page.content.trim().startsWith('{')) {
            const parsed = JSON.parse(page.content);
            if (parsed && parsed.is_fees_data) {
                isFeesData = true;
                feesData = parsed;
            }
        }
    } catch (e) {
        // Not valid JSON
    }

    return (
        <PublicLayout>
            <Head title={`${page.title} - ${site_settings?.site_name || 'Bogura Golf Club'}`} />
            
            <div className="bg-[#F8F9F8] min-h-screen py-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-slate-900 font-bold">{page.title}</span>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                        {/* Page Header Banner */}
                        <div className="bg-gradient-to-r from-[#162417] via-[#1C2C1D] to-[#253926] text-white p-8 sm:p-10 relative overflow-hidden">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 block mb-2">
                                Bogura Golf Club &bull; Majhira Cantonment
                            </span>
                            <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
                                {page.title}
                            </h1>
                        </div>
                        
                        {isFeesData && feesData ? (
                            <div className="p-6 md:p-10 space-y-10">
                                <h2 className="text-xl md:text-2xl font-bold text-center text-slate-900 font-display">
                                    Membership Fees & Various Charges of Bogura Golf Club
                                </h2>
                                
                                <div className="overflow-x-auto shadow-xs border border-slate-200 rounded-2xl">
                                    <table className="w-full text-xs sm:text-sm text-center border-collapse">
                                        <thead className="bg-slate-100 text-slate-700 font-bold">
                                            <tr>
                                                <th className="border border-slate-200 p-2.5" rowSpan="2">Ser</th>
                                                <th className="border border-slate-200 p-2.5 text-left" rowSpan="2">Category</th>
                                                <th className="border border-slate-200 p-2.5" rowSpan="2">Entry Fee</th>
                                                <th className="border border-slate-200 p-2.5" rowSpan="2">Monthly Subscription</th>
                                                <th className="border border-slate-200 p-2.5" colSpan="2">Green Fees (One round of 9 Hole)</th>
                                                <th className="border border-slate-200 p-2.5" rowSpan="2">Caddie 9-Hole<br/><span className="font-normal text-[11px]">(Office/Indl)</span></th>
                                                <th className="border border-slate-200 p-2.5" rowSpan="2">Ball Boy 9-Hole<br/><span className="font-normal text-[11px]">(Office/Indl)</span></th>
                                            </tr>
                                            <tr>
                                                <th className="border border-slate-200 p-2 font-normal text-xs">Non Members</th>
                                                <th className="border border-slate-200 p-2 font-normal text-xs">Members of other Clubs</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white text-slate-800 divide-y divide-slate-200">
                                            {feesData.membership_fees?.map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                    <td className="border border-slate-200 p-2.5">{i + 1}</td>
                                                    <td className="border border-slate-200 p-2.5 text-left font-medium">{row.category}</td>
                                                    <td className="border border-slate-200 p-2.5 text-right font-bold text-emerald-700">{row.entry}</td>
                                                    <td className="border border-slate-200 p-2.5 text-right font-semibold">{row.monthly}</td>
                                                    <td className="border border-slate-200 p-2.5 text-right">{row.green_non}</td>
                                                    <td className="border border-slate-200 p-2.5 text-right">{row.green_other}</td>
                                                    <td className="border border-slate-200 p-2.5 text-right">{row.caddie}</td>
                                                    <td className="border border-slate-200 p-2.5 text-right">{row.ball_boy}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <h2 className="text-xl md:text-2xl font-bold text-center text-slate-900 font-display">
                                    Other Club Charges
                                </h2>
                                <div className="overflow-x-auto shadow-xs border border-slate-200 rounded-2xl">
                                    <table className="w-full text-xs sm:text-sm text-center border-collapse">
                                        <thead className="bg-slate-100 text-slate-700 font-bold">
                                            <tr>
                                                <th className="border border-slate-200 p-2.5" rowSpan="2">Ser</th>
                                                <th className="border border-slate-200 p-2.5 text-left" rowSpan="2">Category</th>
                                                <th className="border border-slate-200 p-2.5" colSpan="2">Set Charges</th>
                                                <th className="border border-slate-200 p-2.5" rowSpan="2">Trolley<br/>Charges</th>
                                                <th className="border border-slate-200 p-2.5" rowSpan="2">Driving Range<br/>(Per 50 Balls)</th>
                                                <th className="border border-slate-200 p-2.5" rowSpan="2">Locker<br/>Charges</th>
                                                <th className="border border-slate-200 p-2.5 text-left" rowSpan="2">Remark</th>
                                            </tr>
                                            <tr>
                                                <th className="border border-slate-200 p-2 font-normal text-xs">Practice</th>
                                                <th className="border border-slate-200 p-2 font-normal text-xs">Tournament</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white text-slate-800 divide-y divide-slate-200">
                                            {feesData.other_charges?.map((row, i) => (
                                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                    <td className="border border-slate-200 p-2.5">{i + 1}</td>
                                                    <td className="border border-slate-200 p-2.5 text-left font-medium">{row.category}</td>
                                                    <td className="border border-slate-200 p-2.5 text-right">{row.practice}</td>
                                                    <td className="border border-slate-200 p-2.5 text-right">{row.tournament}</td>
                                                    <td className="border border-slate-200 p-2.5 text-right">{row.trolley}</td>
                                                    <td className="border border-slate-200 p-2.5 text-right">{row.driving}</td>
                                                    <td className="border border-slate-200 p-2.5 text-right">{row.locker}</td>
                                                    <td className="border border-slate-200 p-2.5 text-left text-xs text-slate-500">{row.remark}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div 
                                className="p-6 md:p-12 prose prose-slate max-w-none prose-headings:font-display prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-emerald-700 hover:prose-a:text-emerald-800"
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
