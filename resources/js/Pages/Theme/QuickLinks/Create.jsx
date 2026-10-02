import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        button_text: '',
        url: '',
        image: null,
        is_active: true
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('quick-links.store'));
    };

    return (
        <AuthenticatedLayout header="Create Quick Link">
            <Head title="Create Quick Link" />

            <div className="max-w-3xl mx-auto py-6">
                <div className="mb-6">
                    <Link href={route('quick-links.index')} className="text-emerald-600 hover:text-emerald-700 flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Quick Links
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <form onSubmit={submit} className="p-6 space-y-6">
                        
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Image / Icon</label>
                            {imagePreview ? (
                                <div className="relative inline-block">
                                    <img src={imagePreview} alt="Preview" className="h-32 w-auto object-cover rounded-md border border-slate-200" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-emerald-500 transition-colors bg-slate-50">
                                    <div className="space-y-1 text-center">
                                        <Upload className="mx-auto h-12 w-12 text-slate-400" />
                                        <div className="flex text-sm text-slate-600 justify-center">
                                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500 px-2 py-1">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                            </label>
                                        </div>
                                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 2MB</p>
                                    </div>
                                </div>
                            )}
                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className="w-full border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="e.g. Online Monthly Subscription"
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Button Text</label>
                            <input
                                type="text"
                                className="w-full border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm"
                                value={data.button_text}
                                onChange={e => setData('button_text', e.target.value)}
                                placeholder="e.g. Subscription"
                            />
                            {errors.button_text && <p className="text-red-500 text-sm mt-1">{errors.button_text}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Destination URL</label>
                            <input
                                type="url"
                                className="w-full border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm"
                                value={data.url}
                                onChange={e => setData('url', e.target.value)}
                                placeholder="https://example.com"
                            />
                            {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_active"
                                className="rounded border-gray-300 text-emerald-600 shadow-sm focus:ring-emerald-500"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                            />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                Active (Show on homepage)
                            </label>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                Save Quick Link
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
