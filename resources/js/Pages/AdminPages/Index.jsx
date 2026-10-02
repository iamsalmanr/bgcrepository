import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';
import Modal from '@/Components/Modal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';

export default function Index({ auth, pages }) {
    const [confirmingDeletion, setConfirmingDeletion] = useState(false);
    const [pageToDelete, setPageToDelete] = useState(null);
    const { delete: destroy } = useForm();

    const confirmDeletion = (id) => {
        setPageToDelete(id);
        setConfirmingDeletion(true);
    };

    const deletePage = (e) => {
        e.preventDefault();
        destroy(route('pages.destroy', pageToDelete), {
            preserveScroll: true,
            onSuccess: () => setConfirmingDeletion(false),
        });
    };

    return (
        <AuthenticatedLayout header="Pages Manager">
            <Head title="Pages" />

            <div className="max-w-7xl mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-slate-800">All Pages</h2>
                    <Link
                        href={route('pages.create')}
                        className="bg-military-600 hover:bg-military-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Add New Page
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Slug</th>
                                    <th className="px-6 py-4 text-center">Published</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pages.map((page) => (
                                    <tr key={page.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{page.title}</td>
                                        <td className="px-6 py-4 text-slate-500">{page.slug}</td>
                                        <td className="px-6 py-4 text-center">
                                            {page.is_published ? (
                                                <span className="inline-flex items-center text-green-700 bg-green-50 px-2.5 py-1 rounded-full text-xs font-medium border border-green-200"><Check className="w-3 h-3 mr-1" /> Yes</span>
                                            ) : (
                                                <span className="inline-flex items-center text-red-700 bg-red-50 px-2.5 py-1 rounded-full text-xs font-medium border border-red-200"><X className="w-3 h-3 mr-1" /> No</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('pages.edit', page.id)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => confirmDeletion(page.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {pages.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                            No pages found. Click "Add New Page" to create one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal show={confirmingDeletion} onClose={() => setConfirmingDeletion(false)}>
                <form onSubmit={deletePage} className="p-6">
                    <h2 className="text-lg font-medium text-slate-900">
                        Are you sure you want to delete this page?
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Once deleted, it cannot be recovered.
                    </p>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={() => setConfirmingDeletion(false)}>Cancel</SecondaryButton>
                        <DangerButton className="ml-3">Delete Page</DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
