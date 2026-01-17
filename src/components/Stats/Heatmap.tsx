import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { useThemeStore, THEMES } from '../../stores/themeStore';
import { motion } from 'framer-motion';

export function Heatmap() {
    const { history } = useAnalyticsStore();
    const { currentTheme } = useThemeStore();
    const theme = THEMES[currentTheme];

    const today = new Date();
    const startDate = startOfMonth(today);
    const endDate = endOfMonth(today);
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    // Calculate intensity per day
    const getIntensity = (date: Date) => {
        const minutes = history
            .filter(s => s.mode === 'work' && s.completed && isSameDay(new Date(s.startTime), date))
            .reduce((acc, curr) => acc + curr.duration, 0);

        if (minutes === 0) return 0;
        if (minutes < 30) return 1;
        if (minutes < 60) return 2;
        if (minutes < 120) return 3;
        return 4;
    };

    const getOpacity = (level: number) => {
        if (level === 0) return 1;
        if (level === 1) return 0.2;
        if (level === 2) return 0.4;
        if (level === 3) return 0.7;
        return 1;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full bg-white dark:bg-stone-900/50 rounded-2xl p-4 border border-stone-100 dark:border-stone-800"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-400">
                    Monthly Consistency
                </h3>
                <span className="text-xs font-medium text-stone-400">
                    {format(today, 'MMMM yyyy')}
                </span>
            </div>

            <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className="text-[10px] text-center text-stone-300 font-medium mb-1">
                        {day}
                    </div>
                ))}

                {/* Pad start of month */}
                {Array.from({ length: startDate.getDay() }).map((_, i) => (
                    <div key={`pad-${i}`} />
                ))}

                {daysInMonth.map((day, i) => {
                    const level = getIntensity(day);
                    return (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.01 }}
                            className={`aspect-square rounded-lg ${level === 0 ? 'bg-stone-100 dark:bg-stone-800' : theme.modes.work.bg}`}
                            style={{ opacity: level === 0 ? 1 : getOpacity(level) }}
                            title={`${format(day, 'MMM d')}: Level ${level}`}
                        />
                    );
                })}
            </div>
        </motion.div>
    );
}
