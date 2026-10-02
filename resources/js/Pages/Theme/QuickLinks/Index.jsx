import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Edit, Trash2, GripVertical, Check, X, Image as ImageIcon } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableRow({ link, handleToggleActive, handleDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: link.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        position: 'relative',
    };

    return (
        <tr ref={setNodeRef} style={style} className={`hover:bg-slate-50/50 transition-colors ${isDragging ? 'bg-emerald-50 shadow-lg' : ''}`}>
            <td className="px-6 py-4 whitespace-nowrap w-10">
                <div {...attributes} {...listeners} className="cursor-grab hover:text-emerald-600">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {link.image_path ? (
                    <img src={`/storage/${link.image_path}`} alt={link.title} className="h-10 w-10 rounded object-cover" />
                ) : (
                    <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-5 h-5" />
                    </div>
                )}
            </td>
            <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap">
                {link.title}
            </td>
            <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                {link.button_text || <span className="text-slate-400 italic">None</span>}
            </td>
            <td className="px-6 py-4 text-slate-600 whitespace-nowrap max-w-[200px] truncate">
                {link.url || <span className="text-slate-400 italic">None</span>}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <button
                    onClick={() => handleToggleActive(link)}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        link.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                    {link.is_active ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                    {link.is_active ? 'Active' : 'Hidden'}
                </button>
            </td>
            <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                <Link
                    href={route('quick-links.edit', link.id)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                </Link>
                <button
                    onClick={() => handleDelete(link.id)}
                    className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors"
                >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                </button>
            </td>
        </tr>
    );
}

export default function Index({ quickLinks }) {
    const [items, setItems] = useState(quickLinks || []);

    useEffect(() => {
        setItems(quickLinks || []);
    }, [quickLinks]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                
                const newItems = arrayMove(items, oldIndex, newIndex);
                
                // Update sort_order for all items
                const updatedItems = newItems.map((item, index) => ({
                    ...item,
                    sort_order: index
                }));

                // Send to backend
                router.post(route('quick-links.reorder'), {
                    items: updatedItems.map(item => ({
                        id: item.id,
                        sort_order: item.sort_order
                    }))
                }, { preserveScroll: true });

                return updatedItems;
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this link?')) {
            router.delete(route('quick-links.destroy', id));
        }
    };

    const handleToggleActive = (link) => {
        router.post(route('quick-links.toggle-active', link.id), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout header="Manage Quick Links">
            <Head title="Quick Links" />

            <div className="max-w-7xl mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-slate-800 flex items-center gap-2">
                        Homepage Quick Links
                    </h2>
                    <Link
                        href={route('quick-links.create')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Add Quick Link
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-10"></th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Image</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Button Text</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Link URL</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                <SortableContext
                                    items={items.map(item => item.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {items.map((link) => (
                                        <SortableRow 
                                            key={link.id} 
                                            link={link} 
                                            handleToggleActive={handleToggleActive}
                                            handleDelete={handleDelete} 
                                        />
                                    ))}
                                </SortableContext>
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                                            No quick links found. Add your first one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </DndContext>
                </div>
                <p className="text-sm text-slate-500 mt-4 text-center">
                    Drag and drop rows using the grip icon to reorder how they appear on the homepage.
                </p>
            </div>
        </AuthenticatedLayout>
    );
}
