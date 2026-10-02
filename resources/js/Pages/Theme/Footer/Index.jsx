import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Save, Plus, Trash2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Helper to safely parse JSON settings
const safeParse = (jsonString, fallback) => {
    if (!jsonString) return fallback;
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return fallback;
    }
};

export default function FooterSettings() {
    const { site_settings } = usePage().props;

    const [usefulLinks, setUsefulLinks] = useState(safeParse(site_settings?.footer_useful_links, [
        { id: '1', title: 'Home', url: '/' },
        { id: '2', title: 'About Us', url: '/about' },
        { id: '3', title: 'Contact Us', url: '/contact-us' },
        { id: '4', title: 'Privacy Policy', url: '#' },
    ]));

    const [socialLinks, setSocialLinks] = useState(safeParse(site_settings?.footer_social_links, [
        { id: '1', platform: 'f', url: '#' },
        { id: '2', platform: 'G+', url: '#' },
        { id: '3', platform: 't', url: '#' },
    ]));

    const [paymentMethods, setPaymentMethods] = useState(safeParse(site_settings?.footer_payment_methods, [
        { id: '1', name: 'VISA' },
        { id: '2', name: 'MasterCard' },
        { id: '3', name: 'bKash' },
        { id: '4', name: 'Nagad' },
    ]));

    const { data, setData, post, processing, errors } = useForm({
        footer_about_us: site_settings?.footer_about_us || 'Bogura Golf Club (BGC) is a short but very attractive course for Golfers in Bangladesh. It is being run under the supervision of Club President.',
        footer_contact_phone_civil: site_settings?.footer_contact_phone_civil || '+88 02 12345678',
        footer_contact_phone_army: site_settings?.footer_contact_phone_army || '+88 02 1234',
        footer_contact_email: site_settings?.footer_contact_email || 'bgc_bd@yahoo.com',
        footer_copyright: site_settings?.footer_copyright || 'All Rights Reserved by Bogura Golf Club © ' + new Date().getFullYear() + ' | Designed & Developed with Laravel & React',
        footer_useful_links: [],
        footer_social_links: [],
        footer_payment_methods: []
    });

    const handleDragEnd = (result, list, setList) => {
        if (!result.destination) return;
        const items = Array.from(list);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setList(items);
    };

    const addItem = (list, setList, defaultItem) => {
        setList([...list, { id: Date.now().toString(), ...defaultItem }]);
    };

    const removeItem = (list, setList, id) => {
        setList(list.filter(item => item.id !== id));
    };

    const updateItem = (list, setList, id, field, value) => {
        setList(list.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Populate form data with current lists before submitting
        data.footer_useful_links = usefulLinks.map(({id, ...rest}) => rest);
        data.footer_social_links = socialLinks.map(({id, ...rest}) => rest);
        data.footer_payment_methods = paymentMethods.map(({id, ...rest}) => rest);
        
        post(route('footer-settings.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout header="Manage Footer">
            <Head title="Footer Settings" />

            <div className="max-w-5xl mx-auto py-6 space-y-6">
                
                <form onSubmit={submit} className="space-y-6">
                    {/* General Text Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                            <h3 className="font-semibold text-slate-800">General Text & Contact Information</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">About Us Description</label>
                                <textarea
                                    className="w-full border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm"
                                    rows="3"
                                    value={data.footer_about_us}
                                    onChange={e => setData('footer_about_us', e.target.value)}
                                ></textarea>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Civil Phone</label>
                                    <input
                                        type="text"
                                        className="w-full border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm"
                                        value={data.footer_contact_phone_civil}
                                        onChange={e => setData('footer_contact_phone_civil', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Army Phone</label>
                                    <input
                                        type="text"
                                        className="w-full border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm"
                                        value={data.footer_contact_phone_army}
                                        onChange={e => setData('footer_contact_phone_army', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm"
                                        value={data.footer_contact_email}
                                        onChange={e => setData('footer_contact_email', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Copyright & Credit Text</label>
                                <input
                                    type="text"
                                    className="w-full border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm"
                                    value={data.footer_copyright}
                                    onChange={e => setData('footer_copyright', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Useful Links List Builder */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-800">Useful Links</h3>
                            <button type="button" onClick={() => addItem(usefulLinks, setUsefulLinks, { title: '', url: '' })} className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
                                <Plus className="w-4 h-4"/> Add Link
                            </button>
                        </div>
                        <div className="p-6">
                            <DragDropContext onDragEnd={(res) => handleDragEnd(res, usefulLinks, setUsefulLinks)}>
                                <Droppable droppableId="useful_links">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                            {usefulLinks.map((link, index) => (
                                                <Draggable key={link.id} draggableId={link.id} index={index}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                                                            <div {...provided.dragHandleProps} className="text-slate-400 hover:text-slate-600 cursor-grab">
                                                                <GripVertical className="w-5 h-5"/>
                                                            </div>
                                                            <div className="flex-1 grid grid-cols-2 gap-3">
                                                                <input type="text" placeholder="Link Title" className="border-slate-300 rounded text-sm w-full" value={link.title} onChange={e => updateItem(usefulLinks, setUsefulLinks, link.id, 'title', e.target.value)} />
                                                                <input type="text" placeholder="URL" className="border-slate-300 rounded text-sm w-full" value={link.url} onChange={e => updateItem(usefulLinks, setUsefulLinks, link.id, 'url', e.target.value)} />
                                                            </div>
                                                            <button type="button" onClick={() => removeItem(usefulLinks, setUsefulLinks, link.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    </div>

                    {/* Social Links List Builder */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-800">Connect With Us (Social Icons)</h3>
                            <button type="button" onClick={() => addItem(socialLinks, setSocialLinks, { platform: '', url: '' })} className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
                                <Plus className="w-4 h-4"/> Add Social
                            </button>
                        </div>
                        <div className="p-6">
                            <DragDropContext onDragEnd={(res) => handleDragEnd(res, socialLinks, setSocialLinks)}>
                                <Droppable droppableId="social_links">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                            {socialLinks.map((link, index) => (
                                                <Draggable key={link.id} draggableId={link.id} index={index}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                                                            <div {...provided.dragHandleProps} className="text-slate-400 hover:text-slate-600 cursor-grab">
                                                                <GripVertical className="w-5 h-5"/>
                                                            </div>
                                                            <div className="flex-1 grid grid-cols-2 gap-3">
                                                                <input type="text" placeholder="Icon Text (e.g. 'f', 'G+')" className="border-slate-300 rounded text-sm w-full" value={link.platform} onChange={e => updateItem(socialLinks, setSocialLinks, link.id, 'platform', e.target.value)} />
                                                                <input type="text" placeholder="URL" className="border-slate-300 rounded text-sm w-full" value={link.url} onChange={e => updateItem(socialLinks, setSocialLinks, link.id, 'url', e.target.value)} />
                                                            </div>
                                                            <button type="button" onClick={() => removeItem(socialLinks, setSocialLinks, link.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    </div>

                    {/* Pay By Tags Builder */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-800">Pay By Badges</h3>
                            <button type="button" onClick={() => addItem(paymentMethods, setPaymentMethods, { name: '' })} className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
                                <Plus className="w-4 h-4"/> Add Badge
                            </button>
                        </div>
                        <div className="p-6">
                            <DragDropContext onDragEnd={(res) => handleDragEnd(res, paymentMethods, setPaymentMethods)}>
                                <Droppable droppableId="payment_methods">
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                            {paymentMethods.map((method, index) => (
                                                <Draggable key={method.id} draggableId={method.id} index={index}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-lg shadow-sm">
                                                            <div {...provided.dragHandleProps} className="text-slate-400 hover:text-slate-600 cursor-grab">
                                                                <GripVertical className="w-5 h-5"/>
                                                            </div>
                                                            <div className="flex-1">
                                                                <input type="text" placeholder="Badge Name (e.g. 'VISA')" className="border-slate-300 rounded text-sm w-full" value={method.name} onChange={e => updateItem(paymentMethods, setPaymentMethods, method.id, 'name', e.target.value)} />
                                                            </div>
                                                            <button type="button" onClick={() => removeItem(paymentMethods, setPaymentMethods, method.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 pb-12">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            Save Footer Settings
                        </button>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    );
}
