import React, { useState, useRef, useMemo, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage, Link } from '@inertiajs/react';
import { 
    UploadCloud, 
    Image as ImageIcon, 
    FileText, 
    Trash2, 
    Edit2, 
    Copy, 
    Check, 
    X, 
    Star, 
    Folder, 
    FolderPlus, 
    FolderOpen, 
    ChevronRight, 
    Search, 
    Grid, 
    List, 
    Maximize2, 
    Trophy, 
    Sparkles, 
    HardDrive,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    RotateCw,
    FolderTree,
    MoreVertical,
    FolderEdit
} from 'lucide-react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function MediaIndex({ 
    auth, 
    media = [], 
    type = 'image', 
    tournaments = [], 
    currentTournamentId = '', 
    folders: initialFolders = []
}) {
    const { flash } = usePage().props;
    const fileInputRef = useRef(null);
    const [copiedId, setCopiedId] = useState(null);

    // Explorer Path Navigation State
    const [currentPath, setCurrentPath] = useState(''); // '' = Root
    const [history, setHistory] = useState(['']);
    const [historyIndex, setHistoryIndex] = useState(0);

    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [galleryOnly, setGalleryOnly] = useState(false);
    const [previewItem, setPreviewItem] = useState(null);

    // New Folder Modal State
    const [customFolders, setCustomFolders] = useState([]);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    // Rename Folder Modal State
    const [renamingFolder, setRenamingFolder] = useState(null); // { name, fullPath }
    const [renameNewName, setRenameNewName] = useState('');

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.015em'
    };

    // Combine all folder paths
    const allFolderPaths = useMemo(() => {
        const fromMedia = media.map(m => m.folder || 'General');
        const merged = [...initialFolders, ...customFolders, ...fromMedia];
        return Array.from(new Set(merged.filter(Boolean)));
    }, [initialFolders, customFolders, media]);

    // Navigate to a specific path
    const navigateTo = (newPath) => {
        const cleanPath = newPath.replace(/^\/+|\/+$/g, '');
        if (cleanPath === currentPath) return;

        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(cleanPath);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setCurrentPath(cleanPath);
    };

    // Back button
    const handleBack = () => {
        if (historyIndex > 0) {
            const nextIdx = historyIndex - 1;
            setHistoryIndex(nextIdx);
            setCurrentPath(history[nextIdx]);
        }
    };

    // Forward button
    const handleForward = () => {
        if (historyIndex < history.length - 1) {
            const nextIdx = historyIndex + 1;
            setHistoryIndex(nextIdx);
            setCurrentPath(history[nextIdx]);
        }
    };

    // Up to parent directory
    const handleUpOneLevel = () => {
        if (!currentPath) return;
        const segments = currentPath.split('/');
        segments.pop();
        navigateTo(segments.join('/'));
    };

    // Compute Direct Subfolders inside currentPath
    const directSubfolders = useMemo(() => {
        const subfolderMap = new Map();
        const prefix = currentPath ? `${currentPath}/` : '';

        allFolderPaths.forEach(path => {
            if (currentPath === '') {
                const directName = path.split('/')[0];
                if (directName) {
                    const fullChildPath = directName;
                    const count = media.filter(m => (m.folder || 'General').startsWith(fullChildPath)).length;
                    subfolderMap.set(directName, { name: directName, fullPath: fullChildPath, count });
                }
            } else if (path.startsWith(prefix) && path !== currentPath) {
                const rest = path.slice(prefix.length);
                const directChildName = rest.split('/')[0];
                if (directChildName) {
                    const fullChildPath = `${prefix}${directChildName}`;
                    const count = media.filter(m => (m.folder || 'General').startsWith(fullChildPath)).length;
                    subfolderMap.set(directChildName, { name: directChildName, fullPath: fullChildPath, count });
                }
            }
        });

        return Array.from(subfolderMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [allFolderPaths, currentPath, media]);

    // Compute Files directly inside currentPath
    const currentFiles = useMemo(() => {
        return media.filter(item => {
            const itemFolder = item.folder || 'General';
            
            if (searchQuery.trim()) {
                const matchesSearch = 
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    itemFolder.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (item.tournament?.title || '').toLowerCase().includes(searchQuery.toLowerCase());
                const matchesGallery = !galleryOnly || item.in_gallery;
                return matchesSearch && matchesGallery;
            }

            const matchesCurrentFolder = 
                currentPath === '' 
                    ? (itemFolder === 'General' || itemFolder === '')
                    : (itemFolder === currentPath);

            const matchesGallery = !galleryOnly || item.in_gallery;
            return matchesCurrentFolder && matchesGallery;
        });
    }, [media, currentPath, searchQuery, galleryOnly]);

    // Upload Form State
    const activeUploadFolder = currentPath || 'General';
    const { 
        data: uploadData, 
        setData: setUploadData, 
        post: postUpload, 
        processing: uploadProcessing, 
        errors: uploadErrors, 
        reset: resetUpload 
    } = useForm({
        files: [],
        type: type,
        folder: activeUploadFolder,
        tournament_id: currentTournamentId || '',
    });

    useEffect(() => {
        setUploadData('folder', currentPath || 'General');
    }, [currentPath]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadData('files', Array.from(e.target.files));
            setTimeout(() => {
                postUpload(route('media.store'), {
                    preserveScroll: true,
                    onSuccess: () => {
                        resetUpload();
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    },
                });
            }, 100);
        }
    };

    // Create New Subfolder
    const handleCreateFolder = (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;
        const cleanName = newFolderName.trim().replace(/\//g, '-');
        const fullNewFolderPath = currentPath ? `${currentPath}/${cleanName}` : cleanName;

        setCustomFolders(prev => [...prev, fullNewFolderPath]);
        setShowNewFolderModal(false);
        setNewFolderName('');
        navigateTo(fullNewFolderPath);
    };

    // Open Rename Folder Modal
    const openRenameModal = (folder, e) => {
        if (e) e.stopPropagation();
        setRenamingFolder(folder);
        setRenameNewName(folder.name);
    };

    // Submit Folder Rename
    const handleRenameSubmit = (e) => {
        e.preventDefault();
        if (!renameNewName.trim() || !renamingFolder) return;

        const cleanNewName = renameNewName.trim().replace(/\//g, '-');
        const parentPath = renamingFolder.fullPath.includes('/')
            ? renamingFolder.fullPath.substring(0, renamingFolder.fullPath.lastIndexOf('/'))
            : '';
        const newFullPath = parentPath ? `${parentPath}/${cleanNewName}` : cleanNewName;

        router.post(route('media.folders.rename'), {
            old_path: renamingFolder.fullPath,
            new_path: newFullPath,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setRenamingFolder(null);
                setRenameNewName('');
            },
        });
    };

    // Delete Folder Action
    const handleDeleteFolder = (folder, e) => {
        if (e) e.stopPropagation();
        if (confirm(`Are you sure you want to delete folder "${folder.name}" and all files inside it?`)) {
            router.post(route('media.folders.delete'), {
                folder_path: folder.fullPath,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setCustomFolders(prev => prev.filter(f => f !== folder.fullPath && !f.startsWith(folder.fullPath + '/')));
                },
            });
        }
    };

    // Edit / Move Item Form
    const [editingMedia, setEditingMedia] = useState(null);
    const { 
        data: editData, 
        setData: setEditData, 
        put: putEdit, 
        processing: editProcessing, 
        errors: editErrors, 
        reset: resetEdit 
    } = useForm({
        name: '',
        folder: '',
        tournament_id: '',
    });

    const openEditModal = (item) => {
        setEditingMedia(item);
        setEditData({
            name: item.name,
            folder: item.folder || 'General',
            tournament_id: item.tournament_id || '',
        });
    };

    const closeEditModal = () => {
        setEditingMedia(null);
        resetEdit();
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        putEdit(route('media.update', editingMedia.id), {
            preserveScroll: true,
            onSuccess: () => closeEditModal(),
        });
    };

    // Delete Item
    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            router.delete(route('media.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    // Toggle Public Gallery Feature
    const handleToggleGallery = (id) => {
        router.post(route('media.toggle-gallery', id), {}, {
            preserveScroll: true,
        });
    };

    // Copy URL
    const copyUrl = (path, id) => {
        const fullUrl = `${window.location.origin}/storage/${path}`;
        navigator.clipboard.writeText(fullUrl);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Path Breadcrumbs Array
    const pathSegments = useMemo(() => {
        if (!currentPath) return [];
        return currentPath.split('/');
    }, [currentPath]);

    return (
        <AuthenticatedLayout header="Media & Asset Library">
            <Head title="Media Explorer - Bogura Golf Club" />

            <div className="max-w-7xl mx-auto space-y-5 pb-16">
                
                {/* ── 1. WINDOWS 11 FILE EXPLORER COMMAND BAR ── */}
                <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-3.5">
                    
                    {/* Top Row: Navigation Controls, Address Bar & Search */}
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                        
                        {/* Navigation Arrows */}
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                            <button
                                onClick={handleBack}
                                disabled={historyIndex <= 0}
                                className={`p-2 rounded-xl transition-colors ${
                                    historyIndex > 0 ? 'text-slate-700 hover:bg-white hover:shadow-xs' : 'text-slate-300 cursor-not-allowed'
                                }`}
                                title="Back"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleForward}
                                disabled={historyIndex >= history.length - 1}
                                className={`p-2 rounded-xl transition-colors ${
                                    historyIndex < history.length - 1 ? 'text-slate-700 hover:bg-white hover:shadow-xs' : 'text-slate-300 cursor-not-allowed'
                                }`}
                                title="Forward"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleUpOneLevel}
                                disabled={!currentPath}
                                className={`p-2 rounded-xl transition-colors ${
                                    currentPath ? 'text-slate-700 hover:bg-white hover:shadow-xs' : 'text-slate-300 cursor-not-allowed'
                                }`}
                                title="Up to parent directory"
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Windows 11 Fluent Address / Path Bar */}
                        <div className="flex-1 flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 overflow-x-auto shadow-inner">
                            <div className="flex items-center gap-1.5 shrink-0 text-emerald-800 font-bold">
                                <HardDrive className="w-4 h-4 text-emerald-700" />
                                <button 
                                    onClick={() => navigateTo('')}
                                    className="hover:underline hover:text-emerald-950 font-bold text-slate-800"
                                >
                                    Media Drive
                                </button>
                            </div>

                            {pathSegments.map((segment, idx) => {
                                const subPath = pathSegments.slice(0, idx + 1).join('/');
                                const isLast = idx === pathSegments.length - 1;

                                return (
                                    <React.Fragment key={subPath}>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <button
                                            onClick={() => navigateTo(subPath)}
                                            className={`px-2 py-0.5 rounded-lg shrink-0 transition-colors ${
                                                isLast 
                                                    ? 'bg-emerald-100 text-emerald-950 font-extrabold' 
                                                    : 'hover:bg-slate-200 text-slate-600'
                                            }`}
                                        >
                                            {segment}
                                        </button>
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        {/* Search in Current Folder */}
                        <div className="relative w-full lg:w-64 shrink-0">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={currentPath ? `Search "${currentPath.split('/').pop()}"...` : "Search all media..."}
                                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-600 transition-all"
                            />
                        </div>

                    </div>

                    {/* Bottom Row: Windows Explorer Command Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setShowNewFolderModal(true)}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider border border-slate-200 transition-all active:scale-95 shadow-2xs"
                            >
                                <FolderPlus className="w-4 h-4 text-amber-500 fill-amber-400" />
                                <span>New Folder</span>
                            </button>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#0c2417] hover:bg-emerald-950 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
                            >
                                <UploadCloud className="w-4 h-4 text-emerald-300" />
                                <span>Upload into "{currentPath.split('/').pop() || 'Drive'}"</span>
                            </button>
                        </div>

                        {/* Right Toggles */}
                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={() => setGalleryOnly(!galleryOnly)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                                    galleryOnly 
                                        ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs' 
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                            >
                                <Star className={`w-3.5 h-3.5 ${galleryOnly ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                                <span className="hidden sm:inline">Gallery Featured</span>
                            </button>

                            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-400 hover:text-slate-700'}`}
                                    title="Large Icons Grid"
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-xs text-emerald-800' : 'text-slate-400 hover:text-slate-700'}`}
                                    title="Details List"
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── 2. DRAG & DROP UPLOAD SURFACE ── */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-5 sm:p-6 border-2 border-dashed border-emerald-300/80 hover:border-emerald-600 rounded-3xl bg-emerald-50/20 hover:bg-emerald-50/50 transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 group"
                >
                    <div className="flex items-center gap-4 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 shadow-sm flex items-center justify-center text-emerald-800 group-hover:bg-[#0c2417] group-hover:text-white transition-colors shrink-0 mx-auto sm:mx-0">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-950 transition-colors">
                                {uploadProcessing ? 'Uploading assets...' : `Drop photos here to upload directly to "${currentPath || 'Root Drive'}"`}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WEBP up to 15MB • Multi-file batch support</p>
                        </div>
                    </div>

                    <span className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700 group-hover:border-emerald-400 group-hover:text-emerald-900 shadow-2xs transition-colors shrink-0">
                        Select Files
                    </span>

                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        multiple
                        accept={type === 'image' ? "image/*" : "*/*"} 
                        onChange={handleFileChange} 
                        disabled={uploadProcessing}
                    />
                </div>

                {/* ── 3. MAIN EXPLORER VIEWPORT (SUBFOLDERS & FILES) ── */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6 min-h-[420px]">
                    
                    {/* SECTION A: SUBFOLDERS WITH RENAME & DELETE ICONS */}
                    {directSubfolders.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <span>Folders ({directSubfolders.length})</span>
                                <span className="text-[11px] font-normal lowercase">click to open • hover for actions</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                                {directSubfolders.map((folder) => (
                                    <div
                                        key={folder.fullPath}
                                        onClick={() => navigateTo(folder.fullPath)}
                                        className="group relative p-4 rounded-3xl bg-slate-50/90 hover:bg-emerald-50/50 border border-slate-200/90 hover:border-emerald-500 shadow-2xs hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 select-none"
                                    >
                                        <div className="flex items-center justify-between">
                                            {/* Windows 11 Gold Folder Icon */}
                                            <div className="w-11 h-11 rounded-2xl bg-amber-100/90 border border-amber-200 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                                                <Folder className="w-6 h-6 text-amber-500 fill-amber-400" />
                                            </div>

                                            {/* Folder Item Count Pill */}
                                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 group-hover:bg-emerald-200 group-hover:text-emerald-950 transition-colors">
                                                {folder.count}
                                            </span>
                                        </div>

                                        <div className="min-w-0 pr-1">
                                            <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-950 truncate" title={folder.name}>
                                                {folder.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                                {folder.count} {folder.count === 1 ? 'file' : 'files'}
                                            </p>
                                        </div>

                                        {/* FOLDER ACTIONS (RENAME ✏️ & DELETE 🗑️) - ALWAYS VISIBLE / HOVER */}
                                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={(e) => openRenameModal(folder, e)}
                                                className="p-1.5 rounded-lg bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 shadow-2xs transition-colors"
                                                title="Rename Folder"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => handleDeleteFolder(folder, e)}
                                                className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 shadow-2xs transition-colors"
                                                title="Delete Folder"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION B: MEDIA FILES IN THIS DIRECTORY */}
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <span>Files ({currentFiles.length})</span>
                            {currentPath && (
                                <span className="text-[11px] font-normal text-emerald-800 font-semibold">
                                    Inside: {currentPath}
                                </span>
                            )}
                        </div>

                        {currentFiles.length > 0 ? (
                            viewMode === 'grid' ? (
                                /* GRID VIEW */
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                                    {currentFiles.map((item) => (
                                        <div 
                                            key={item.id}
                                            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-emerald-500/60 transition-all duration-300 overflow-hidden group flex flex-col justify-between"
                                        >
                                            {/* Thumbnail Viewport */}
                                            <div 
                                                className="relative aspect-4/3 bg-slate-950 overflow-hidden cursor-pointer" 
                                                onClick={() => setPreviewItem(item)}
                                            >
                                                <img 
                                                    src={`/storage/${item.file_path}`} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" 
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=600&auto=format&fit=crop';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-80 transition-opacity" />

                                                {/* Gallery Star Badge */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleToggleGallery(item.id); }}
                                                    className={`absolute top-2.5 left-2.5 p-1.5 rounded-xl backdrop-blur-md transition-all shadow-sm ${
                                                        item.in_gallery 
                                                            ? 'bg-amber-400 text-slate-950 shadow-amber-500/50' 
                                                            : 'bg-black/50 text-white hover:bg-amber-400 hover:text-slate-950'
                                                    }`}
                                                    title={item.in_gallery ? "In public gallery (Click to remove)" : "Add to public gallery"}
                                                >
                                                    <Star className={`w-3.5 h-3.5 ${item.in_gallery ? 'fill-current' : ''}`} />
                                                </button>

                                                {/* Zoom Hover Icon */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md text-white flex items-center justify-center shadow-lg">
                                                        <Maximize2 className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Item Info Footer */}
                                            <div className="p-3.5 space-y-2">
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900 truncate" title={item.name}>
                                                        {item.name}
                                                    </p>
                                                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                                                        <span>{(item.size / 1024).toFixed(0)} KB</span>
                                                        {item.tournament && (
                                                            <span className="text-emerald-800 font-semibold truncate max-w-[100px]" title={item.tournament.title}>
                                                                🏆 {item.tournament.title}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Buttons Row */}
                                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                                                    <button 
                                                        onClick={() => copyUrl(item.file_path, item.id)}
                                                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 transition-colors"
                                                        title="Copy storage URL"
                                                    >
                                                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <button 
                                                        onClick={() => openEditModal(item)}
                                                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                                                        title="Move to another folder / Rename"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item.id, item.name)}
                                                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 transition-colors"
                                                        title="Delete file"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* LIST VIEW */
                                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                                    {currentFiles.map((item) => (
                                        <div key={item.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-slate-950 overflow-hidden shrink-0 cursor-pointer" onClick={() => setPreviewItem(item)}>
                                                    <img src={`/storage/${item.file_path}`} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate" title={item.name}>{item.name}</p>
                                                    <p className="text-[11px] text-slate-400">
                                                        {(item.size / 1024).toFixed(0)} KB • Folder: {item.folder || 'General'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleToggleGallery(item.id)}
                                                    className={`p-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
                                                        item.in_gallery 
                                                            ? 'bg-amber-100 text-amber-900 border-amber-300' 
                                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                                                    }`}
                                                >
                                                    <Star className={`w-3.5 h-3.5 ${item.in_gallery ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                                                    <span className="hidden sm:inline">{item.in_gallery ? 'In Gallery' : 'Feature'}</span>
                                                </button>
                                                <button 
                                                    onClick={() => copyUrl(item.file_path, item.id)}
                                                    className="p-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-200 transition-colors"
                                                    title="Copy URL"
                                                >
                                                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                                <button 
                                                    onClick={() => openEditModal(item)}
                                                    className="p-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(item.id, item.name)}
                                                    className="p-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            /* Empty Directory State */
                            directSubfolders.length === 0 && (
                                <div className="text-center py-16 text-slate-400 space-y-3">
                                    <FolderOpen className="w-14 h-14 mx-auto text-slate-300 stroke-1" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">This folder is empty</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Drag & drop photos above to add files into this directory.</p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                </div>

            </div>

            {/* ── MODAL 1: CREATE NEW FOLDER ── */}
            <Modal show={showNewFolderModal} onClose={() => setShowNewFolderModal(false)} maxWidth="md">
                <form onSubmit={handleCreateFolder} className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <FolderPlus className="w-5 h-5 text-amber-500 fill-amber-400" />
                            <h3 className="text-base font-bold text-slate-900" style={appleStyle}>
                                {currentPath ? `New Subfolder inside "${currentPath.split('/').pop()}"` : 'Create New Directory Folder'}
                            </h3>
                        </div>
                        <button type="button" onClick={() => setShowNewFolderModal(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div>
                        <InputLabel htmlFor="folder_name" value="Folder Name" />
                        <TextInput
                            id="folder_name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            className="mt-1 block w-full text-sm rounded-xl"
                            placeholder="e.g. 2026 President Cup, Fairway Views"
                            autoFocus
                            required
                        />
                        <p className="text-xs text-slate-400 mt-1.5">
                            Will be created at: <span className="font-semibold text-slate-700">{currentPath ? `${currentPath}/` : ''}{newFolderName || 'New Folder'}</span>
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                        <SecondaryButton type="button" onClick={() => setShowNewFolderModal(false)}>Cancel</SecondaryButton>
                        <PrimaryButton type="submit">Create Folder</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* ── MODAL 2: RENAME FOLDER MODAL ── */}
            <Modal show={renamingFolder !== null} onClose={() => setRenamingFolder(null)} maxWidth="md">
                <form onSubmit={handleRenameSubmit} className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Edit2 className="w-5 h-5 text-emerald-800" />
                            <h3 className="text-base font-bold text-slate-900" style={appleStyle}>
                                Rename Folder
                            </h3>
                        </div>
                        <button type="button" onClick={() => setRenamingFolder(null)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div>
                        <InputLabel htmlFor="rename_folder_name" value="New Folder Name" />
                        <TextInput
                            id="rename_folder_name"
                            value={renameNewName}
                            onChange={(e) => setRenameNewName(e.target.value)}
                            className="mt-1 block w-full text-sm rounded-xl"
                            autoFocus
                            required
                        />
                        <p className="text-xs text-slate-400 mt-1.5">
                            Current path: <span className="font-mono text-slate-600">{renamingFolder?.fullPath}</span>
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                        <SecondaryButton type="button" onClick={() => setRenamingFolder(null)}>Cancel</SecondaryButton>
                        <PrimaryButton type="submit">Save Rename</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* ── MODAL 3: MOVE / RENAME FILE ── */}
            <Modal show={editingMedia !== null} onClose={closeEditModal} maxWidth="md">
                <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Edit2 className="w-5 h-5 text-emerald-800" />
                            <h3 className="text-base font-bold text-slate-900" style={appleStyle}>File Properties & Move Directory</h3>
                        </div>
                        <button type="button" onClick={closeEditModal} className="text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="File Name / Caption" />
                            <TextInput
                                id="name"
                                value={editData.name}
                                onChange={(e) => setEditData('name', e.target.value)}
                                className="mt-1 block w-full text-sm rounded-xl"
                                required
                            />
                            <InputError message={editErrors.name} className="mt-1.5" />
                        </div>

                        <div>
                            <InputLabel htmlFor="folder" value="Destination Folder Path" />
                            <select
                                id="folder"
                                value={editData.folder}
                                onChange={(e) => setEditData('folder', e.target.value)}
                                className="mt-1 block w-full rounded-xl border-slate-200 text-sm focus:border-emerald-600 focus:ring-emerald-600 font-medium"
                            >
                                {allFolderPaths.map(f => (
                                    <option key={f} value={f}>📁 {f}</option>
                                ))}
                            </select>
                            <p className="text-[11px] text-slate-400 mt-1">Select the target album folder to move this file.</p>
                        </div>

                        <div>
                            <InputLabel htmlFor="tournament_id" value="Associated Tournament (Optional)" />
                            <select
                                id="tournament_id"
                                value={editData.tournament_id}
                                onChange={(e) => setEditData('tournament_id', e.target.value)}
                                className="mt-1 block w-full rounded-xl border-slate-200 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                            >
                                <option value="">None / General</option>
                                {tournaments.map(t => (
                                    <option key={t.id} value={t.id}>{t.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                        <SecondaryButton type="button" onClick={closeEditModal}>Cancel</SecondaryButton>
                        <PrimaryButton type="submit" disabled={editProcessing}>Save Changes</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* ── MODAL 4: HIGH-RES PHOTO LIGHTBOX MODAL ── */}
            <Modal show={previewItem !== null} onClose={() => setPreviewItem(null)} maxWidth="2xl">
                {previewItem && (
                    <div className="p-5 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="min-w-0">
                                <h3 className="text-base font-bold text-slate-900 truncate" style={appleStyle}>{previewItem.name}</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Directory: {previewItem.folder || 'General'}</p>
                            </div>
                            <button type="button" onClick={() => setPreviewItem(null)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="max-h-[60vh] rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center shadow-inner">
                            <img src={`/storage/${previewItem.file_path}`} alt={previewItem.name} className="max-h-full max-w-full object-contain" />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            <div className="text-xs text-slate-500">
                                Size: <span className="font-semibold text-slate-800">{(previewItem.size / 1024).toFixed(1)} KB</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleToggleGallery(previewItem.id)}
                                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
                                        previewItem.in_gallery 
                                            ? 'bg-amber-100 text-amber-900 border-amber-300' 
                                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                                    }`}
                                >
                                    <Star className={`w-3.5 h-3.5 ${previewItem.in_gallery ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                                    <span>{previewItem.in_gallery ? 'In Public Gallery' : 'Feature in Gallery'}</span>
                                </button>
                                <button 
                                    onClick={() => copyUrl(previewItem.file_path, previewItem.id)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                                >
                                    {copiedId === previewItem.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>Copy Link</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

        </AuthenticatedLayout>
    );
}
