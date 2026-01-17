import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    type: ToastType;
    message: string;
    onClose: () => void;
}

const TOAST_CONFIG = {
    success: {
        icon: CheckCircle,
        bg: 'bg-emerald-50 dark:bg-emerald-950/50',
        border: 'border-emerald-200 dark:border-emerald-800',
        iconColor: 'text-emerald-500',
    },
    error: {
        icon: AlertCircle,
        bg: 'bg-red-50 dark:bg-red-950/50',
        border: 'border-red-200 dark:border-red-800',
        iconColor: 'text-red-500',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-50 dark:bg-blue-950/50',
        border: 'border-blue-200 dark:border-blue-800',
        iconColor: 'text-blue-500',
    },
    warning: {
        icon: AlertTriangle,
        bg: 'bg-amber-50 dark:bg-amber-950/50',
        border: 'border-amber-200 dark:border-amber-800',
        iconColor: 'text-amber-500',
    },
};

export function Toast({ type, message, onClose }: ToastProps) {
    const config = TOAST_CONFIG[type];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl ${config.bg} ${config.border} border shadow-lg backdrop-blur-sm min-w-[280px] max-w-md`}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
            <span className="flex-1 text-sm font-medium text-stone-700 dark:text-stone-200">
                {message}
            </span>
            <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-700/50 transition-colors"
            >
                <X className="w-4 h-4 text-stone-400" />
            </button>
        </motion.div>
    );
}
