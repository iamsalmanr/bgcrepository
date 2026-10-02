import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export default function ConfirmationModal({
    isOpen = false,
    onClose = () => {},
    onConfirm = () => {},
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger', // 'danger' | 'warning' | 'success' | 'info'
    loading = false,
}) {
    if (!isOpen) return null;

    const typeStyles = {
        danger: {
            iconBg: 'bg-rose-100 text-rose-700 border-rose-200',
            buttonBg: 'bg-rose-600 hover:bg-rose-700 text-white',
            Icon: AlertTriangle,
        },
        warning: {
            iconBg: 'bg-amber-100 text-amber-800 border-amber-200',
            buttonBg: 'bg-amber-800 hover:bg-amber-900 text-white',
            Icon: AlertTriangle,
        },
        success: {
            iconBg: 'bg-[#D4E2D2] text-[#1C2C1D] border-[#BFD4BD]',
            buttonBg: 'bg-[#1C2C1D] hover:bg-[#2C442E] text-white',
            Icon: CheckCircle2,
        },
        info: {
            iconBg: 'bg-slate-100 text-slate-800 border-slate-200',
            buttonBg: 'bg-[#1C2C1D] hover:bg-[#2C442E] text-white',
            Icon: Info,
        },
    }[type] || {
        iconBg: 'bg-rose-100 text-rose-700 border-rose-200',
        buttonBg: 'bg-rose-600 hover:bg-rose-700 text-white',
        Icon: AlertTriangle,
    };

    const { iconBg, buttonBg, Icon } = typeStyles;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-[28px] sm:rounded-[32px] max-w-md w-full border border-slate-200/80 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150 relative">
                
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="absolute right-4 top-4 sm:right-5 sm:top-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${iconBg}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 pr-6">
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
                            {title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 sm:px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-5 sm:px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all active:scale-95 disabled:opacity-50 ${buttonBg}`}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
