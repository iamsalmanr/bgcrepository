import React, { useState, useRef, useEffect } from 'react';
import { 
    UploadCloud, 
    Crop, 
    RotateCw, 
    ZoomIn, 
    ZoomOut, 
    Trash2, 
    Check, 
    X, 
    User, 
    Sparkles, 
    RefreshCw,
    Image as ImageIcon
} from 'lucide-react';
import Modal from '@/Components/Modal';

export default function ImageCropUploader({
    currentImageUrl = null,
    onImageCropped,
    onRemoveImage,
    aspectRatio = 1, // 1:1 square for profile / portrait
    outputWidth = 600,
    outputHeight = 600,
    label = 'Profile Portrait Photo'
}) {
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

    const [selectedRawImage, setSelectedRawImage] = useState(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
    const [isRemoved, setIsRemoved] = useState(false);

    // Crop transform states
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const appleStyle = { 
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        letterSpacing: '-0.015em'
    };

    // When file selected
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                setSelectedRawImage(img);
                setZoom(1);
                setRotation(0);
                setPan({ x: 0, y: 0 });
                setIsCropModalOpen(true);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    // Draw interactive canvas during crop/zoom
    useEffect(() => {
        if (!selectedRawImage || !canvasRef.current || !isCropModalOpen) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);
        ctx.save();

        // Move to center
        ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(zoom, zoom);

        // Draw image centered
        const imgWidth = selectedRawImage.width;
        const imgHeight = selectedRawImage.height;
        const scale = Math.max(width / imgWidth, height / imgHeight);
        const drawWidth = imgWidth * scale;
        const drawHeight = imgHeight * scale;

        ctx.drawImage(selectedRawImage, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
    }, [selectedRawImage, zoom, rotation, pan, isCropModalOpen]);

    // Handle Pan dragging
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Confirm Crop & Generate Resulting Image File
    const handleApplyCrop = () => {
        if (!selectedRawImage || !canvasRef.current) return;

        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = outputWidth;
        cropCanvas.height = outputHeight;
        const cropCtx = cropCanvas.getContext('2d');

        // Scale factor from preview canvas to output dimensions
        const previewCanvas = canvasRef.current;
        const scaleX = outputWidth / previewCanvas.width;
        const scaleY = outputHeight / previewCanvas.height;

        cropCtx.save();
        cropCtx.translate(outputWidth / 2 + pan.x * scaleX, outputHeight / 2 + pan.y * scaleY);
        cropCtx.rotate((rotation * Math.PI) / 180);
        cropCtx.scale(zoom * scaleX, zoom * scaleY);

        const imgWidth = selectedRawImage.width;
        const imgHeight = selectedRawImage.height;
        const scale = Math.max(previewCanvas.width / imgWidth, previewCanvas.height / imgHeight);
        const drawWidth = imgWidth * scale;
        const drawHeight = imgHeight * scale;

        cropCtx.drawImage(selectedRawImage, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        cropCtx.restore();

        cropCanvas.toBlob((blob) => {
            if (!blob) return;
            const croppedFile = new File([blob], 'cropped_member_portrait.jpg', { type: 'image/jpeg' });
            const croppedUrl = URL.createObjectURL(blob);
            
            setPreviewUrl(croppedUrl);
            setIsRemoved(false);
            setIsCropModalOpen(false);

            if (onImageCropped) {
                onImageCropped(croppedFile);
            }
        }, 'image/jpeg', 0.92);
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        setIsRemoved(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (onRemoveImage) {
            onRemoveImage();
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{label}</span>
                <span className="text-[11px] text-slate-400">1:1 Square / Portrait Crop</span>
            </div>

            {/* Profile Avatar & Interactive Card */}
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-5">
                
                {/* Visual Avatar Preview */}
                <div className="relative group shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-white border-2 border-emerald-500/40 shadow-md flex items-center justify-center relative">
                        {previewUrl && !isRemoved ? (
                            <img src={previewUrl} alt="Member Portrait Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400">
                                <User className="w-10 h-10 stroke-1" />
                                <span className="text-[9px] font-bold uppercase mt-1">No Photo</span>
                            </div>
                        )}
                    </div>

                    {previewUrl && !isRemoved && (
                        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-md">
                            <Check className="w-3.5 h-3.5" />
                        </div>
                    )}
                </div>

                {/* Upload & Crop Action Buttons */}
                <div className="space-y-2.5 flex-1 text-center sm:text-left">
                    <div>
                        <p className="text-xs font-bold text-slate-800" style={appleStyle}>
                            {previewUrl && !isRemoved ? 'Active Portrait Photo' : 'Upload Executive Portrait'}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-normal">
                            High-resolution JPG, PNG or WEBP. Upload opens the interactive crop & zoom tool.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 rounded-xl bg-[#0c2417] hover:bg-emerald-950 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                        >
                            <UploadCloud className="w-3.5 h-3.5 text-emerald-300" />
                            <span>{previewUrl && !isRemoved ? 'Change & Crop' : 'Choose & Crop'}</span>
                        </button>

                        {previewUrl && !isRemoved && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-slate-200 text-xs font-bold uppercase tracking-wider shadow-2xs transition-colors flex items-center gap-1.5"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove Photo</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                />
            </div>

            {/* ── INTERACTIVE IMAGE CROP & ZOOM STUDIO MODAL ── */}
            <Modal show={isCropModalOpen} onClose={() => setIsCropModalOpen(false)} maxWidth="lg">
                <div className="p-6 space-y-5">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Crop className="w-5 h-5 text-emerald-800" />
                            <h3 className="text-base font-extrabold text-slate-900" style={appleStyle}>
                                Crop & Align Member Portrait
                            </h3>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => setIsCropModalOpen(false)}
                            className="text-slate-400 hover:text-slate-600 p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Canvas Viewport */}
                    <div className="relative flex flex-col items-center justify-center bg-slate-950 rounded-3xl p-4 overflow-hidden select-none">
                        <div 
                            className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-emerald-400 cursor-grab active:cursor-grabbing"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <canvas 
                                ref={canvasRef} 
                                width={256} 
                                height={256} 
                                className="w-full h-full bg-slate-900" 
                            />
                            {/* Circular Overlay Guideline */}
                            <div className="absolute inset-0 rounded-full border border-dashed border-white/40 pointer-events-none" />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 font-medium">
                            Drag image inside frame to center face • Use slider below to zoom
                        </p>
                    </div>

                    {/* Crop Controls (Zoom & Rotate) */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                        {/* Zoom Slider */}
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-bold text-slate-600 uppercase flex items-center gap-1">
                                <ZoomIn className="w-3.5 h-3.5" />
                                <span>Zoom</span>
                            </span>
                            <input
                                type="range"
                                min="0.8"
                                max="3.0"
                                step="0.05"
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="flex-1 accent-emerald-800 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-slate-700 w-10 text-right">
                                {zoom.toFixed(1)}x
                            </span>
                        </div>

                        {/* Rotate & Reset Row */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                            <button
                                type="button"
                                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
                            >
                                <RotateCw className="w-3.5 h-3.5" />
                                <span>Rotate 90°</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => { setZoom(1); setRotation(0); setPan({ x: 0, y: 0 }); }}
                                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-100 flex items-center gap-1.5"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Reset Frame</span>
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsCropModalOpen(false)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleApplyCrop}
                            className="px-5 py-2.5 rounded-xl bg-[#0c2417] hover:bg-emerald-950 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-1.5"
                        >
                            <Check className="w-4 h-4 text-emerald-300" />
                            <span>Apply & Crop</span>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
