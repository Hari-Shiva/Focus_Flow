import { motion } from 'framer-motion';
import { Hourglass } from 'lucide-react';
import { useAnalyticsStore } from '../../stores/analyticsStore';

export function AverageSession() {
    const { history } = useAnalyticsStore();

    // Calculate average duration of completed work sessions
    const workSessions = history.filter(s => s.mode === 'work' && s.completed);
    const totalMinutes = workSessions.reduce((acc, curr) => acc + curr.duration, 0);
    const count = workSessions.length;
    const average = count > 0 ? Math.round(totalMinutes / count) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex items-center gap-4"
        >
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                <Hourglass className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium uppercase tracking-wider">
                    Average Session
                </p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                        {average}
                    </span>
                    <span className="text-sm text-stone-500 dark:text-stone-400">min</span>
                </div>
            </div>
        </motion.div>
    );
}
