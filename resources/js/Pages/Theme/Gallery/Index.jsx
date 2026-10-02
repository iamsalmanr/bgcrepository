import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { ArrowUp, ArrowDown, Trash2, Edit2, Check, X, Image as ImageIcon } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Index({ auth, galleryImages, mediaImages }) {
    const [localImages, setLocalImages] = useState(galleryImages);
    const [editingImageId, setEditingImageId] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        setLocalImages(galleryImages);
    }, [galleryImages]);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: 'post',
        source: 'upload',
        image_file: null,
        media_path: '',
        title: '',
        subtitle: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingImageId) {
            post(route('gallery-images.update', editingImageId), {
                onSuccess: () => {
                    cancelEdit();
                    router.reload({ only: ['galleryImages'] });
                },
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            post(route('gallery-images.store'), {
                onSuccess: () => {
                    reset();
                    setData('_method', 'post');
                    router.reload({ only: ['galleryImages'] });
                },
                forceFormData: true,
                preserveScroll: true,
            });
        }
    };

    const handleEdit = (img) => {
        clearErrors();
        setEditingImageId(img.id);
        setData({
            _method: 'put',
            source: 'upload',
            image_file: null,
            media_path: img.image_path,
            title: img.title || '',
            subtitle: img.subtitle || '',
            is_active: img.is_active,
        });
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const cancelEdit = () => {
        setEditingImageId(null);
        reset();
        clearErrors();
        setData('_method', 'post');
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this gallery image?')) {
            router.delete(route('gallery-images.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const moveImage = (index, direction) => {
        const newImages = [...localImages];
        if (direction === 'up' && index > 0) {
            [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
        } else if (direction === 'down' && index < newImages.length - 1) {
            [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]];
        }
        
        // Update order property
        const updatedImages = newImages.map((img, idx) => ({ ...img, order: idx }));
        setLocalImages(updatedImages);

        // Save to backend
        router.post(route('gallery-images.reorder'), {
            items: updatedImages.map(img => ({ id: img.id, order: img.order }))
        }, { preserveScroll: true });
    };

    const toggleActive = (img) => {
        router.post(route('gallery-images.update', img.id), {
            _method: 'put',
            is_active: !img.is_active,
            title: img.title,
            subtitle: img.subtitle,
            media_path: img.image_path,
            source: 'media' // pseudo source to bypass validation
        }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Image Gallery Settings</h2>}
        >
            <Head title="Image Gallery Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Form Section */}
                    <div className="bg-white p-6 shadow sm:rounded-lg" ref={formRef}>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {editingImageId ? 'Edit Gallery Image' : 'Add New Gallery Image'}
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                            <div>
                                <InputLabel value="Image Source" />
                                <div className="mt-2 flex gap-4">
                                    <label className="flex items-center">
                                        <input type="radio" className="form-radio text-emerald-600 focus:ring-emerald-500" 
                                            checked={data.source === 'upload'} onChange={() => setData('source', 'upload')} />
                                        <span className="ml-2 text-sm text-gray-700">Upload New File</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input type="radio" className="form-radio text-emerald-600 focus:ring-emerald-500" 
                                            checked={data.source === 'media'} onChange={() => setData('source', 'media')} />
                                        <span className="ml-2 text-sm text-gray-700">Select from Media Library</span>
                                    </label>
                                </div>
                            </div>

                            {data.source === 'upload' && (
                                <div>
                                    <InputLabel htmlFor="image_file" value="Image File" />
                                    <input
                                        id="image_file"
                                        type="file"
                                        accept="image/*"
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                                        onChange={e => setData('image_file', e.target.files[0])}
                                    />
                                    <InputError message={errors.image_file} className="mt-2" />
                                </div>
                            )}

                            {data.source === 'media' && (
                                <div>
                                    <InputLabel htmlFor="media_path" value="Select Image" />
                                    <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-md">
                                        {mediaImages.map(media => (
                                            <div 
                                                key={media.id} 
                                                className={`cursor-pointer border-2 rounded overflow-hidden aspect-square ${data.media_path === media.file_path ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-transparent hover:border-gray-300'}`}
                                                onClick={() => setData('media_path', media.file_path)}
                                            >
                                                <img src={`/storage/${media.file_path}`} alt={media.name} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        {mediaImages.length === 0 && <p className="col-span-full text-sm text-gray-500 p-2">No images in media library.</p>}
                                    </div>
                                    <InputError message={errors.media_path} className="mt-2" />
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="title" value="Title (Optional)" />
                                    <TextInput
                                        id="title"
                                        className="mt-1 block w-full"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="subtitle" value="Subtitle (Optional)" />
                                    <TextInput
                                        id="subtitle"
                                        className="mt-1 block w-full"
                                        value={data.subtitle}
                                        onChange={(e) => setData('subtitle', e.target.value)}
                                    />
                                    <InputError message={errors.subtitle} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>
                                    {editingImageId ? 'Update Image' : 'Add Image'}
                                </PrimaryButton>
                                {editingImageId && (
                                    <SecondaryButton onClick={cancelEdit}>Cancel</SecondaryButton>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* List Section */}
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Current Gallery Images</h3>
                        </div>
                        
                        <div className="divide-y divide-gray-200">
                            {localImages.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                    <p>No images added to the gallery yet.</p>
                                </div>
                            ) : (
                                localImages.map((img, index) => (
                                    <div key={img.id} className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${!img.is_active ? 'opacity-60' : ''}`}>
                                        
                                        {/* Reorder Controls */}
                                        <div className="flex flex-col gap-1">
                                            <button 
                                                onClick={() => moveImage(index, 'up')}
                                                disabled={index === 0}
                                                className="p-1 text-gray-400 hover:text-emerald-600 disabled:opacity-30"
                                            >
                                                <ArrowUp size={18} />
                                            </button>
                                            <button 
                                                onClick={() => moveImage(index, 'down')}
                                                disabled={index === localImages.length - 1}
                                                className="p-1 text-gray-400 hover:text-emerald-600 disabled:opacity-30"
                                            >
                                                <ArrowDown size={18} />
                                            </button>
                                        </div>

                                        {/* Thumbnail */}
                                        <div className="w-32 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                                            <img src={`/storage/${img.image_path}`} alt="Gallery Image" className="w-full h-full object-cover" />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-gray-900 truncate">{img.title || '(No Title)'}</h4>
                                            <p className="text-sm text-gray-500 truncate">{img.subtitle}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => toggleActive(img)}
                                                className={`px-3 py-1 text-xs font-semibold rounded-full border ${img.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}
                                            >
                                                {img.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                            <button onClick={() => handleEdit(img)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md" title="Edit">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(img.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md" title="Delete">
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
