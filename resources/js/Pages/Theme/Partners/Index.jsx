import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { ArrowUp, ArrowDown, Trash2, Edit2, Check, X, Image as ImageIcon } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, partners }) {
    const [localPartners, setLocalPartners] = useState(partners);
    const [editingId, setEditingId] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        setLocalPartners(partners);
    }, [partners]);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: 'post',
        name: '',
        url: '',
        logo_file: null,
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingId) {
            post(route('partners.update', editingId), {
                onSuccess: () => {
                    cancelEdit();
                    router.reload({ only: ['partners'] });
                },
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            post(route('partners.store'), {
                onSuccess: () => {
                    reset();
                    setData('_method', 'post');
                    router.reload({ only: ['partners'] });
                },
                forceFormData: true,
                preserveScroll: true,
            });
        }
    };

    const handleEdit = (partner) => {
        clearErrors();
        setEditingId(partner.id);
        setData({
            _method: 'put',
            name: partner.name || '',
            url: partner.url || '',
            logo_file: null,
            is_active: partner.is_active,
        });
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        reset();
        clearErrors();
        setData('_method', 'post');
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this partner?')) {
            router.delete(route('partners.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const moveItem = (index, direction) => {
        const newItems = [...localPartners];
        if (direction === 'up' && index > 0) {
            [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
        } else if (direction === 'down' && index < newItems.length - 1) {
            [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
        }
        
        const updatedItems = newItems.map((item, idx) => ({ ...item, sort_order: idx }));
        setLocalPartners(updatedItems);

        router.post(route('partners.reorder'), {
            items: updatedItems.map(item => ({ id: item.id, sort_order: item.sort_order }))
        }, { preserveScroll: true });
    };

    const toggleActive = (item) => {
        router.post(route('partners.update', item.id), {
            _method: 'put',
            is_active: !item.is_active,
            name: item.name,
            url: item.url,
        }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Partners Settings</h2>}
        >
            <Head title="Partners Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="bg-white p-6 shadow sm:rounded-lg" ref={formRef}>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {editingId ? 'Edit Partner' : 'Add New Partner'}
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                            <div>
                                <InputLabel htmlFor="name" value="Partner Name" />
                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="url" value="Website URL (Optional)" />
                                <TextInput
                                    id="url"
                                    type="url"
                                    className="mt-1 block w-full"
                                    value={data.url}
                                    onChange={(e) => setData('url', e.target.value)}
                                    placeholder="https://..."
                                />
                                <InputError message={errors.url} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="logo_file" value="Logo Image" />
                                <input
                                    id="logo_file"
                                    type="file"
                                    accept="image/*"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                    onChange={e => setData('logo_file', e.target.files[0])}
                                />
                                <InputError message={errors.logo_file} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>
                                    {editingId ? 'Update Partner' : 'Add Partner'}
                                </PrimaryButton>
                                {editingId && (
                                    <SecondaryButton onClick={cancelEdit}>Cancel</SecondaryButton>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Current Partners</h3>
                        </div>
                        
                        <div className="divide-y divide-gray-200">
                            {localPartners.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                    <p>No partners added yet.</p>
                                </div>
                            ) : (
                                localPartners.map((item, index) => (
                                    <div key={item.id} className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${!item.is_active ? 'opacity-60' : ''}`}>
                                        
                                        <div className="flex flex-col gap-1">
                                            <button 
                                                onClick={() => moveItem(index, 'up')}
                                                disabled={index === 0}
                                                className="p-1 text-gray-400 hover:text-emerald-600 disabled:opacity-30"
                                            >
                                                <ArrowUp size={18} />
                                            </button>
                                            <button 
                                                onClick={() => moveItem(index, 'down')}
                                                disabled={index === localPartners.length - 1}
                                                className="p-1 text-gray-400 hover:text-emerald-600 disabled:opacity-30"
                                            >
                                                <ArrowDown size={18} />
                                            </button>
                                        </div>

                                        <div className="w-24 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden shrink-0">
                                            {item.logo_path ? (
                                                <img src={`/storage/${item.logo_path}`} alt={item.name} className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <span className="text-xs text-gray-400">No Logo</span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{item.name}</p>
                                            {item.url && <p className="text-sm text-gray-500 truncate">{item.url}</p>}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => toggleActive(item)}
                                                className={`p-2 rounded-full ${item.is_active ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-200'}`}
                                                title={item.is_active ? 'Deactivate' : 'Activate'}
                                            >
                                                {item.is_active ? <Check size={18} /> : <X size={18} />}
                                            </button>
                                            
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full"
                                                title="Edit"
                                            >
                                                <Edit2 size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-full"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
