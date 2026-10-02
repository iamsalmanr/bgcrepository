import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { FileText, Trophy } from 'lucide-react';

export default function WinnerLists({ records }) {
    return (
        <PublicLayout>
            <Head title="List of Winners" />

            <div className="relative h-64 sm:h-80 bg-military-900 flex items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                <div className="relative z-10 px-4 flex flex-col items-center">
                    <Trophy className="h-12 w-12 text-emerald-400 mb-4" />
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white mb-4 shadow-sm">List of Winners</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 relative z-20 pb-20">
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6 sm:p-10">
                    {records && records.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead>
                                    <tr className="bg-slate-50">
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider rounded-tl-lg">S/L</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Title</th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider rounded-tr-lg">Attachment</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {records.map((record, index) => (
                                        <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{record.title || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{record.date || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {record.file_path ? (
                                                    <a href={`/storage/${record.file_path}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 bg-military-50 text-military-700 rounded-md hover:bg-military-100 transition-colors text-xs font-semibold border border-military-100">
                                                        <FileText className="w-3.5 h-3.5 mr-1.5" /> View
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <Trophy className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900 mb-1">No list of winners found</h3>
                            <p className="text-slate-500">Check back later for updates.</p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
