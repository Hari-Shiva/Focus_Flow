import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { getHours } from 'date-fns';

export function BestFocus() {
    const { history } = useAnalyticsStore();

    // Determine best hour
    const hourCounts: Record<number, number> = {};

    history.forEach(session => {
        if (session.mode === 'work' && session.completed) {
            const hour = getHours(new Date(session.startTime));
            hourCounts[hour] = (hourCounts[hour] || 0) + session.duration;
        }
    });

    let bestHour = -1;
    let maxDuration = -1;

    Object.entries(hourCounts).forEach(([hour, duration]) => {
        if (duration > maxDuration) {
            maxDuration = duration;
            bestHour = parseInt(hour, 10);
        }
    });

    const formatHour = (hour: number) => {
        if (hour === -1) return '--';
        const h = hour % 12 || 12;
        const ampm = hour < 12 ? 'AM' : 'PM';
        return `${h} ${ampm}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4"
        >
            <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                <Zap className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium uppercase tracking-wider">
                    Peak Focus
                </p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                        {formatHour(bestHour)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
