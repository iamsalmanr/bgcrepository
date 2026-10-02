import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Save, Trash2, ArrowUp, ArrowDown, ChevronRight, ChevronLeft } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState, useEffect } from 'react';

export default function Builder({ menu, locations }) {
    const [items, setItems] = useState(menu.items || []);
    const { data, setData, put, processing: menuProcessing } = useForm({
        name: menu.name,
        location: menu.location || '',
    });

    const [isSaving, setIsSaving] = useState(false);

    // Helper to deeply copy items
    const cloneItems = (items) => JSON.parse(JSON.stringify(items));

    // Find and update item recursively
    const updateItem = (list, path, field, value) => {
        let current = list;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]].children;
        }
        current[path[path.length - 1]][field] = value;
        return list;
    };

    const handleFieldChange = (path, field, value) => {
        setItems(updateItem(cloneItems(items), path, field, value));
    };

    // Remove item recursively
    const removeItem = (list, path) => {
        let current = list;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]].children;
        }
        current.splice(path[path.length - 1], 1);
        return list;
    };

    const handleRemove = (path) => {
        if (confirm('Are you sure?')) {
            setItems(removeItem(cloneItems(items), path));
        }
    };

    const handleAdd = (path = null) => {
        const newItem = { title: 'New Item', url: '', target: '_self', children: [] };
        let newItems = cloneItems(items);
        if (path === null) {
            newItems.push(newItem);
        } else {
            let current = newItems;
            for (let i = 0; i < path.length; i++) {
                current = current[path[i]].children;
            }
            current.push(newItem);
        }
        setItems(newItems);
    };

    const moveUp = (list, path) => {
        let current = list;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]].children;
        }
        const idx = path[path.length - 1];
        if (idx > 0) {
            const temp = current[idx];
            current[idx] = current[idx - 1];
            current[idx - 1] = temp;
        }
        return list;
    };

    const handleMoveUp = (path) => {
        setItems(moveUp(cloneItems(items), path));
    };

    const moveDown = (list, path) => {
        let current = list;
        for (let i = 0; i < path.length - 1; i++) {
            current = current[path[i]].children;
        }
        const idx = path[path.length - 1];
        if (idx < current.length - 1) {
            const temp = current[idx];
            current[idx] = current[idx + 1];
            current[idx + 1] = temp;
        }
        return list;
    };

    const handleMoveDown = (path) => {
        setItems(moveDown(cloneItems(items), path));
    };

    const saveMenuSettings = (e) => {
        e.preventDefault();
        put(route('menus.update', menu.id));
    };

    const saveStructure = () => {
        setIsSaving(true);
        router.post(route('menus.items.save', menu.id), { items }, {
            preserveScroll: true,
            onFinish: () => setIsSaving(false),
        });
    };

    const renderItems = (list, currentPath = []) => {
        return (
            <div className="space-y-3">
                {list.map((item, index) => {
                    const path = [...currentPath, index];
                    return (
                        <div key={path.join('-')} className="border border-gray-200 bg-gray-50 rounded-md">
                            <div className="p-3 flex items-start gap-4">
                                <div className="flex flex-col gap-1 mt-1">
                                    <button onClick={() => handleMoveUp(path)} disabled={index === 0} className="text-gray-400 hover:text-gray-700 disabled:opacity-30"><ArrowUp size={16} /></button>
                                    <button onClick={() => handleMoveDown(path)} disabled={index === list.length - 1} className="text-gray-400 hover:text-gray-700 disabled:opacity-30"><ArrowDown size={16} /></button>
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <InputLabel value="Title" className="text-xs" />
                                        <TextInput value={item.title} onChange={e => handleFieldChange(path, 'title', e.target.value)} className="w-full h-8 text-sm" />
                                    </div>
                                    <div>
                                        <InputLabel value="URL" className="text-xs" />
                                        <TextInput value={item.url || ''} onChange={e => handleFieldChange(path, 'url', e.target.value)} className="w-full h-8 text-sm" />
                                    </div>
                                    <div>
                                        <InputLabel value="Target" className="text-xs" />
                                        <select value={item.target || '_self'} onChange={e => handleFieldChange(path, 'target', e.target.value)} className="w-full h-8 text-sm border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm py-0">
                                            <option value="_self">Same Window (_self)</option>
                                            <option value="_blank">New Tab (_blank)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-5">
                                    <button onClick={() => handleRemove(path)} className="text-red-500 hover:text-red-700" title="Remove Item"><Trash2 size={18} /></button>
                                </div>
                            </div>

                            {/* Sub items */}
                            <div className="pl-8 pr-3 pb-3 border-t border-gray-200 mt-2 pt-3 bg-white">
                                {item.children && item.children.length > 0 && (
                                    <div className="mb-3 border-l-2 border-emerald-200 pl-4">
                                        {renderItems(item.children, path)}
                                    </div>
                                )}
                                <button onClick={() => handleAdd(path)} className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex items-center">
                                    <Plus size={14} className="mr-1" /> Add Submenu Item
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <AuthenticatedLayout header={`Menu Builder: ${menu.name}`}>
            <Head title={`Builder: ${menu.name}`} />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
                {/* Menu Settings */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Menu Settings</h3>
                        <form onSubmit={saveMenuSettings} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Menu Name" />
                                <TextInput id="name" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full" required />
                            </div>
                            <div>
                                <InputLabel htmlFor="location" value="Display Location" />
                                <select 
                                    id="location" 
                                    value={data.location} 
                                    onChange={e => setData('location', e.target.value)} 
                                    className="mt-1 block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm"
                                >
                                    <option value="">-- Not Assigned --</option>
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{loc.replace('_', ' ').toUpperCase()}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Assigning a location will replace any existing menu in that spot.</p>
                            </div>
                            <PrimaryButton disabled={menuProcessing} className="bg-gray-800 w-full justify-center">Save Settings</PrimaryButton>
                        </form>
                    </div>
                </div>

                {/* Menu Structure */}
                <div className="md:col-span-2">
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Menu Structure</h3>
                                <p className="text-sm text-gray-500">Add, reorder, and nest your menu items.</p>
                            </div>
                            <PrimaryButton onClick={saveStructure} disabled={isSaving} className="bg-emerald-600 hover:bg-emerald-500">
                                <Save size={16} className="mr-2" /> {isSaving ? 'Saving...' : 'Save Structure'}
                            </PrimaryButton>
                        </div>

                        <div className="space-y-4">
                            {items.length === 0 ? (
                                <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-gray-500 mb-4">This menu is empty.</p>
                                    <button onClick={() => handleAdd()} className="inline-flex items-center px-4 py-2 bg-emerald-50 border border-transparent rounded-md font-semibold text-xs text-emerald-700 uppercase tracking-widest hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition ease-in-out duration-150">
                                        <Plus size={16} className="mr-2" /> Add First Item
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {renderItems(items)}
                                    <div className="pt-4 border-t border-gray-200 mt-4">
                                        <button onClick={() => handleAdd()} className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800">
                                            <Plus size={16} className="mr-1" /> Add Main Item
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
