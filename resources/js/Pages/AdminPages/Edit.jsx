import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FeesTableEditor from './FeesTableEditor';

export default function Edit({ auth, page }) {
    const { data, setData, put, processing, errors } = useForm({
        title: page.title || '',
        content: page.content || '',
        is_published: !!page.is_published,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('pages.update', page.id));
    };

    return (
        <AuthenticatedLayout header={`Edit Page: ${page.title}`}>
            <Head title={`Edit Page - ${page.title}`} />

            <div className="max-w-7xl mx-auto py-6">
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href={route('pages.index')}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <h2 className="text-xl font-semibold text-slate-800">Edit Page</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl">
                    <form onSubmit={submit} className="p-6 md:p-8 space-y-6">
                        <div>
                            <InputLabel htmlFor="title" value="Page Title" className="font-semibold text-slate-700" />
                            <TextInput
                                id="title"
                                type="text"
                                name="title"
                                value={data.title}
                                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-military-500 focus:ring-military-500"
                                onChange={(e) => setData('title', e.target.value)}
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="content" value="Content" className="font-semibold text-slate-700" />
                            <div className="mt-1 bg-white mb-12">
                                {page.slug === 'fees' ? (
                                    <FeesTableEditor 
                                        value={data.content} 
                                        onChange={(content) => setData('content', content)} 
                                    />
                                ) : (
                                    <ReactQuill 
                                        theme="snow" 
                                        value={data.content} 
                                        onChange={(content) => setData('content', content)} 
                                        className="h-80"
                                    />
                                )}
                            </div>
                            <InputError message={errors.content} className="mt-2" />
                        </div>

                        <div className="block mt-4 pt-4 border-t border-slate-100">
                            <label className="flex items-center">
                                <Checkbox
                                    name="is_published"
                                    checked={data.is_published}
                                    onChange={(e) => setData('is_published', e.target.checked)}
                                    className="rounded border-slate-300 text-military-600 shadow-sm focus:ring-military-500"
                                />
                                <span className="ml-2 text-sm text-slate-600 font-medium">Published</span>
                            </label>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Link href={route('pages.index')} className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors">
                                Cancel
                            </Link>
                            <Button type="submit" disabled={processing} className="bg-military-600 hover:bg-military-700 text-white px-6">
                                Update Page
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
