import { motion } from 'framer-motion';
import { useHabitStore } from '../../stores/habitStore';

interface DayData {
    date: string;
    sessions: number;
    minutes: number;
}

export function StreaksCalendar() {
    const { sessions } = useHabitStore();

    // Generate last 12 weeks of data
    const today = new Date();
    const weeks: DayData[][] = [];

    for (let w = 11; w >= 0; w--) {
        const week: DayData[] = [];
        for (let d = 0; d < 7; d++) {
            const date = new Date(today);
            date.setDate(date.getDate() - (w * 7 + (6 - d)));
            const dateStr = date.toISOString().split('T')[0];

            // Count sessions for this day
            const daySessions = sessions.filter(s => {
                const sessionDate = new Date(s.date).toISOString().split('T')[0];
                return sessionDate === dateStr;
            });

            week.push({
                date: dateStr,
                sessions: daySessions.length,
                minutes: daySessions.reduce((acc, s) => acc + Math.floor(s.duration / 60), 0),
            });
        }
        weeks.push(week);
    }

    const getIntensity = (sessions: number): string => {
        if (sessions === 0) return 'bg-stone-100 dark:bg-stone-800';
        if (sessions === 1) return 'bg-emerald-200 dark:bg-emerald-900';
        if (sessions === 2) return 'bg-emerald-300 dark:bg-emerald-700';
        if (sessions <= 4) return 'bg-emerald-400 dark:bg-emerald-600';
        return 'bg-emerald-500 dark:bg-emerald-500';
    };

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-lg">Focus Activity</h3>

            <div className="flex gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-1 mr-1 text-xs text-stone-400">
                    {dayLabels.map((label, i) => (
                        <div key={i} className="h-3 flex items-center justify-end pr-1">
                            {i % 2 === 1 ? label : ''}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="flex gap-1 overflow-x-auto">
                    {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-1">
                            {week.map((day, di) => (
                                <motion.div
                                    key={day.date}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: (wi * 7 + di) * 0.005 }}
                                    className={`w-3 h-3 rounded-sm ${getIntensity(day.sessions)} cursor-pointer`}
                                    title={`${day.date}: ${day.sessions} sessions, ${day.minutes} min`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 text-xs text-stone-500">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-stone-100 dark:bg-stone-800" />
                    <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900" />
                    <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-700" />
                    <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-600" />
                    <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
