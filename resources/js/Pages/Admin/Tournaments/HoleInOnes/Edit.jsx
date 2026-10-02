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
        name: record.name || '',
        hole_no: record.hole_no || '',
        date: record.date || '',
        
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('hole-in-ones.update', record.id));
    };

    return (
        <AuthenticatedLayout header="Edit Hole In One Record">
            <Head title="Edit Hole In One Record" />

            <div className="max-w-2xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required={true}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="hole_no" value="Hole No" />
                                <TextInput
                                    id="hole_no"
                                    type="text"
                                    value={data.hole_no}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('hole_no', e.target.value)}
                                    required={true}
                                />
                                <InputError message={errors.hole_no} className="mt-2" />
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
                            
                            

                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing} className="bg-emerald-600 hover:bg-emerald-500">
                                    Update
                                </PrimaryButton>
                                <Link href={route('hole-in-ones.index')} className="text-sm text-gray-600 hover:text-gray-900">
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
