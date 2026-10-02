import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Edit2, Trash2, ListTree } from 'lucide-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';

export default function Index({ menus }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });
    
    const { delete: destroy } = useForm();
    const [isCreating, setIsCreating] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('menus.store'), {
            onSuccess: () => {
                reset();
                setIsCreating(false);
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this menu? This will delete all its items.')) {
            destroy(route('menus.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Theme Customization: Menus">
            <Head title="Menus" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-6">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <p className="mt-2 text-sm text-gray-700">
                            Create and manage menus for different locations on your website.
                        </p>
                    </div>
                    <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                        <button
                            onClick={() => setIsCreating(!isCreating)}
                            className="block rounded-md bg-emerald-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 flex items-center"
                        >
                            <Plus className="h-4 w-4 mr-1" /> Create New Menu
                        </button>
                    </div>
                </div>

                {isCreating && (
                    <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border border-emerald-100">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Create Menu</h3>
                        <form onSubmit={submit} className="flex items-end gap-4">
                            <div className="flex-1">
                                <InputLabel htmlFor="name" value="Menu Name" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="e.g. Main Navigation"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <PrimaryButton disabled={processing} className="bg-emerald-600 hover:bg-emerald-500">
                                Save
                            </PrimaryButton>
                            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                                Cancel
                            </button>
                        </form>
                    </div>
                )}

                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Menu Name</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Theme Location</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Items Count</th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {menus.map((menu) => (
                                            <tr key={menu.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {menu.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {menu.location ? (
                                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                                            {menu.location.replace('_', ' ').toUpperCase()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Not assigned</span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {menu.items_count}
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <div className="flex justify-end gap-3">
                                                        <Link href={route('menus.builder', menu.id)} className="text-indigo-600 hover:text-indigo-900 flex items-center">
                                                            <ListTree className="h-4 w-4 mr-1" />
                                                            Builder
                                                        </Link>
                                                        <button onClick={() => handleDelete(menu.id)} className="text-red-600 hover:text-red-900 ml-4">
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">, {menu.name}</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {menus.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="py-8 text-center text-gray-500 text-sm">
                                                    No menus created yet. Click "Create New Menu" to get started.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
