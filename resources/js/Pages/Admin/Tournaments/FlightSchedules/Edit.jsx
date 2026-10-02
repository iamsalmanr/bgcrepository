import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { FileText } from 'lucide-react';

export default function Edit({ record }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: record.title || '',
        date: record.date || '',
        file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('flight-schedules.update', record.id));
    };

    return (
        <AuthenticatedLayout header="Edit Flight Schedule">
            <Head title="Edit Flight Schedule" />

            <div className="max-w-2xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="title" value="Title" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('title', e.target.value)}
                                    required={true}
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="date" value="Date" />
                                <TextInput
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('date', e.target.value)}
                                    required={false}
                                />
                                <InputError message={errors.date} className="mt-2" />
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="file" value="Attachment (Leave blank to keep current)" />
                                {record.file_path && (
                                    <div className="mb-2">
                                        <a href={`/storage/${record.file_path}`} target="_blank" className="text-emerald-600 hover:underline flex items-center text-sm">
                                            <FileText className="w-4 h-4 mr-1"/> Current Attachment
                                        </a>
                                    </div>
                                )}
                                <input
                                    id="file"
                                    type="file"
                                    onChange={(e) => setData('file', e.target.files[0])}
                                    className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 border border-slate-200 rounded-md p-1"
                                    accept=".pdf,image/*"
                                />
                                <InputError message={errors.file} className="mt-2" />
                            </div>

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing} className="bg-emerald-600 hover:bg-emerald-500">
                                    Update
                                </PrimaryButton>
                                <Link href={route('flight-schedules.index')} className="text-sm text-gray-600 hover:text-gray-900">
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
