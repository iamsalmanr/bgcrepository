import React, { useState, useEffect, useRef } from 'react';
import Modal from '@/Components/Modal';
import { 
    Move, 
    ZoomIn, 
    ZoomOut, 
    RotateCcw, 
    Check, 
    X, 
    Sparkles, 
    Sliders, 
    Focus, 
    HelpCircle,
    Eye,
    ChevronUp,
    ChevronDown,
    Crosshair
} from 'lucide-react';
import axios from 'axios';

export default function CommitteePhotoAdjustModal({
    isOpen = false,
    onClose = () => {},
    member = null,
    onSaveSuccess = () => {}
}) {
    if (!member) return null;

    // Parse initial position & scale
    const parseInitial = () => {
        let x = 50;
        let y = 50;
        if (member.image_position) {
            const parts = member.image_position.split(' ');
            if (parts[0]) x = parseInt(parts[0], 10);
            if (parts[1]) y = parseInt(parts[1], 10);
            if (isNaN(x)) x = 50;
            if (isNaN(y)) y = 50;
        }
        const s = member.image_scale ? parseInt(member.image_scale, 10) : 100;
        return { x, y, scale: isNaN(s) ? 100 : s };
    };

    const [posX, setPosX] = useState(50);
    const [posY, setPosY] = useState(50);
    const [scale, setScale] = useState(100);
    const [showGrid, setShowGrid] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // Dragging state
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ startMouseX: 0, startMouseY: 0, startPosX: 50, startPosY: 50 });
    const previewBoxRef = useRef(null);

    useEffect(() => {
        if (isOpen && member) {
            const init = parseInitial();
            setPosX(init.x);
            setPosY(init.y);
            setScale(init.scale);
            setErrorMessage(null);
            setIsSaving(false);
        }
    }, [isOpen, member]);

    // Mouse drag handlers
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartRef.current = {
            startMouseX: e.clientX,
            startMouseY: e.clientY,
            startPosX: posX,
            startPosY: posY
        };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartRef.current.startMouseX;
        const dy = e.clientY - dragStartRef.current.startMouseY;
        
        // Dragging down should reveal top of image (so posY decreases)
        // Dragging right should reveal left of image (so posX decreases)
        const sensitivity = 0.32;
        const newX = Math.round(Math.max(0, Math.min(100, dragStartRef.current.startPosX - dx * sensitivity)));
        const newY = Math.round(Math.max(0, Math.min(100, dragStartRef.current.startPosY - dy * sensitivity)));
        
        setPosX(newX);
        setPosY(newY);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch drag handlers
    const handleTouchStart = (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            setIsDragging(true);
            dragStartRef.current = {
                startMouseX: touch.clientX,
                startMouseY: touch.clientY,
                startPosX: posX,
                startPosY: posY
            };
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const touch = e.touches[0];
        const dx = touch.clientX - dragStartRef.current.startMouseX;
        const dy = touch.clientY - dragStartRef.current.startMouseY;
        
        const sensitivity = 0.35;
        const newX = Math.round(Math.max(0, Math.min(100, dragStartRef.current.startPosX - dx * sensitivity)));
        const newY = Math.round(Math.max(0, Math.min(100, dragStartRef.current.startPosY - dy * sensitivity)));
        
        setPosX(newX);
        setPosY(newY);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Mouse wheel zoom
    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 5 : -5;
        setScale(prev => Math.max(50, Math.min(250, prev + delta)));
    };

    // Preset handlers
    const applyPreset = (x, y, s = scale) => {
        setPosX(x);
        setPosY(y);
        if (s !== undefined) setScale(s);
    };

    const handleReset = () => {
        setPosX(50);
        setPosY(50);
        setScale(100);
    };

    // Save changes to backend
    const handleSave = async () => {
        setIsSaving(true);
        setErrorMessage(null);

        const positionStr = `${posX}% ${posY}%`;

        try {
            const response = await axios.put(route('committee-members.position', member.id), {
                image_position: positionStr,
                image_scale: scale
            });

            setIsSaving(false);
            const updatedMember = {
                ...member,
                image_position: positionStr,
                image_scale: scale
            };
            onSaveSuccess(updatedMember);
            onClose();
        } catch (err) {
            console.error('Failed to save image position:', err);
            setIsSaving(false);
            setErrorMessage(err.response?.data?.message || 'Failed to save image settings. Please try again.');
        }
    };

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.015em'
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="xl">
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
                
                {/* ── Modal Header ── */}
                <div className="px-6 py-4 bg-military-900 text-white flex items-center justify-between border-b border-military-800 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-military-800 border border-military-700 flex items-center justify-center text-emerald-400 shadow-inner">
                            <Focus className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-bold text-white tracking-tight" style={appleStyle}>
                                    Recenter & Resize Member Photo
                                </h3>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                                    Admin Tool
                                </span>
                            </div>
                            <p className="text-xs text-military-200 truncate max-w-sm">
                                {member.name} • <span className="text-emerald-400 font-semibold">{member.designation || 'Member'}</span>
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 rounded-full bg-military-800/80 hover:bg-military-700 text-military-300 hover:text-white flex items-center justify-center transition-colors"
                        title="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* ── Scrollable Body ── */}
                <div className="p-6 overflow-y-auto space-y-6 select-none">
                    
                    {/* Error Alert */}
                    {errorMessage && (
                        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between">
                            <span>{errorMessage}</span>
                            <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700 font-bold ml-2">✕</button>
                        </div>
                    )}

                    {/* ── Interactive Viewport Canvas ── */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            {/* Card-accurate Preview Container */}
                            <div 
                                ref={previewBoxRef}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onWheel={handleWheel}
                                className={`w-64 h-64 sm:w-72 sm:h-72 bg-military-50 rounded-2xl shadow-xl overflow-hidden relative border-2 ${
                                    isDragging ? 'border-emerald-500 cursor-grabbing' : 'border-slate-300 cursor-grab hover:border-emerald-400'
                                } transition-all duration-150`}
                            >
                                {/* Member Image with Position & Scale */}
                                <img 
                                    src={`/storage/${member.image_path}`} 
                                    alt={member.name}
                                    draggable={false}
                                    style={{
                                        objectPosition: `${posX}% ${posY}%`,
                                        transform: `scale(${scale / 100})`,
                                        transformOrigin: `${posX}% ${posY}%`,
                                    }}
                                    className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-[object-position] duration-75"
                                />

                                {/* Realistic card dark gradient at bottom */}
                                <div className="absolute inset-0 bg-gradient-to-t from-military-900/80 via-transparent to-transparent opacity-60 pointer-events-none"></div>

                                {/* Guidelines Overlay (Togglable) */}
                                {showGrid && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        {/* Center Crosshairs */}
                                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-400/40 border-r border-dashed border-emerald-400/40"></div>
                                        <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-400/40 border-b border-dashed border-emerald-400/40"></div>
                                        
                                        {/* Circular Portrait Safe Zone */}
                                        <div className="absolute inset-4 rounded-full border border-dashed border-white/50 shadow-inner"></div>

                                        {/* Golden Ratio Head Focus Area */}
                                        <div className="absolute left-1/4 right-1/4 top-6 h-28 rounded-2xl border border-dotted border-amber-300/40 flex items-center justify-center">
                                            <span className="text-[9px] font-bold text-amber-200/60 uppercase tracking-widest bg-black/20 px-1.5 py-0.5 rounded">
                                                Head Zone
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Floating Drag Indicator */}
                                <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1.5 pointer-events-none shadow-sm">
                                    <Move className="w-3 h-3 text-emerald-400" />
                                    <span>Drag to pan • Scroll to zoom</span>
                                </div>

                                {/* Current Coords Badge */}
                                <div className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-mono pointer-events-none shadow-sm flex items-center gap-2">
                                    <span>X: {posX}%</span>
                                    <span>•</span>
                                    <span>Y: {posY}%</span>
                                    <span>•</span>
                                    <span className="text-emerald-300 font-bold">{scale}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Toggle Grid Guideline */}
                        <div className="mt-3 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowGrid(!showGrid)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                                    showGrid 
                                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                <Crosshair className="w-3.5 h-3.5" />
                                <span>{showGrid ? 'Hide Alignment Grid' : 'Show Alignment Grid'}</span>
                            </button>
                        </div>
                    </div>

                    {/* ── One-Click Quick Presets ── */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                <span>Quick Alignment Presets</span>
                            </span>
                            <span className="text-[11px] text-slate-400 font-normal">Click to test instant framing</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {/* Head Focus */}
                            <button
                                type="button"
                                onClick={() => applyPreset(50, 15)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border text-left flex flex-col justify-between ${
                                    posX === 50 && posY === 15 
                                        ? 'bg-military-800 text-white border-military-900 shadow-sm' 
                                        : 'bg-white hover:bg-military-50 text-slate-800 border-slate-200/90'
                                }`}
                            >
                                <span className="flex items-center gap-1">
                                    <span className="text-amber-400">👑</span> Focus Head/Cap
                                </span>
                                <span className="text-[10px] opacity-70 mt-0.5">Y: 15% (Fix top cut)</span>
                            </button>

                            {/* Upper Mid */}
                            <button
                                type="button"
                                onClick={() => applyPreset(50, 30)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border text-left flex flex-col justify-between ${
                                    posX === 50 && posY === 30 
                                        ? 'bg-military-800 text-white border-military-900 shadow-sm' 
                                        : 'bg-white hover:bg-military-50 text-slate-800 border-slate-200/90'
                                }`}
                            >
                                <span>Upper Chest</span>
                                <span className="text-[10px] opacity-70 mt-0.5">Y: 30%</span>
                            </button>

                            {/* True Center */}
                            <button
                                type="button"
                                onClick={() => applyPreset(50, 50)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border text-left flex flex-col justify-between ${
                                    posX === 50 && posY === 50 
                                        ? 'bg-military-800 text-white border-military-900 shadow-sm' 
                                        : 'bg-white hover:bg-military-50 text-slate-800 border-slate-200/90'
                                }`}
                            >
                                <span>True Center</span>
                                <span className="text-[10px] opacity-70 mt-0.5">X: 50%, Y: 50%</span>
                            </button>

                            {/* Reset Default */}
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/90 transition-all flex items-center justify-center gap-1.5"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reset All</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Fine Tuning Sliders ── */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                <Sliders className="w-3.5 h-3.5 text-military-700" />
                                <span>Precise Tuning Sliders</span>
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                                Drag sliders or canvas to adjust
                            </span>
                        </div>

                        {/* Zoom / Size Slider */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                <span className="flex items-center gap-1.5">
                                    <ZoomIn className="w-4 h-4 text-military-700" />
                                    <span>Resize / Zoom Level</span>
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <button 
                                        type="button"
                                        onClick={() => setScale(prev => Math.max(50, prev - 5))}
                                        className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center shadow-2xs"
                                        title="-5%"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-mono font-bold text-military-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                        {scale}%
                                    </span>
                                    <button 
                                        type="button"
                                        onClick={() => setScale(prev => Math.min(250, prev + 5))}
                                        className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center shadow-2xs"
                                        title="+5%"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <input 
                                type="range" 
                                min="50" 
                                max="250" 
                                step="1" 
                                value={scale} 
                                onChange={(e) => setScale(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
                                <span>50% (Zoom Out)</span>
                                <span>100% (Standard)</span>
                                <span>250% (Close-Up)</span>
                            </div>
                        </div>

                        {/* Vertical (Y) Position Slider */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                <span className="flex items-center gap-1.5">
                                    <ChevronUp className="w-4 h-4 text-military-700" />
                                    <span>Vertical Position (Y)</span>
                                </span>
                                <span className="font-mono font-bold text-military-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                                    {posY}% {posY < 40 ? '↑ Top' : posY > 60 ? '↓ Bottom' : '• Mid'}
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                step="1" 
                                value={posY} 
                                onChange={(e) => setPosY(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
                                <span>0% (Show Very Top)</span>
                                <span>50% (Center)</span>
                                <span>100% (Show Bottom)</span>
                            </div>
                        </div>

                        {/* Horizontal (X) Position Slider */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                                <span className="flex items-center gap-1.5">
                                    <Move className="w-3.5 h-3.5 text-military-700" />
                                    <span>Horizontal Position (X)</span>
                                </span>
                                <span className="font-mono font-bold text-military-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                                    {posX}%
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                step="1" 
                                value={posX} 
                                onChange={(e) => setPosX(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-800"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
                                <span>0% (Left)</span>
                                <span>50% (Center)</span>
                                <span>100% (Right)</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── Modal Footer Actions ── */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-6 py-2.5 rounded-xl bg-[#0c2417] hover:bg-emerald-950 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin"></div>
                                    <span>Saving to Database...</span>
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    <span>Save Photo Alignment</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </Modal>
    );
}
