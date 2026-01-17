import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useHabitStore } from '../stores/habitStore';
import type { Session } from '../types';

export function HabitTracker() {
    const { sessions } = useHabitStore();
    const [weekData, setWeekData] = useState<Array<{ date: Date; count: number }>>([]);

    useEffect(() => {
        const days: Array<{ date: Date; count: number }> = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const count = sessions.filter((s: Session) => {
                const sessionDate = new Date(s.date);
                sessionDate.setHours(0, 0, 0, 0);
                return (
                    sessionDate.getTime() === date.getTime() &&
                    s.completed &&
                    s.type === 'work'
                );
            }).length;

            days.push({ date, count });
        }

        setWeekData(days);
    }, [sessions]);

    const maxCount = Math.max(...weekData.map(d => d.count), 1);

    return (
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <h3 className="text-base font-semibold mb-4">This Week</h3>

            <div className="grid grid-cols-7 gap-2">
                {weekData.map(({ date, count }, index) => {
                    const intensity = count === 0 ? 0 : (count / maxCount);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const isToday = new Date().toDateString() === date.toDateString();

                    return (
                        <motion.div
                            key={date.toISOString()}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: index * 0.04 }}
                            className="flex flex-col items-center gap-1.5"
                        >
                            <div
                                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${isToday ? 'ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-stone-900' : ''
                                    }`}
                                style={{
                                    backgroundColor:
                                        intensity === 0
                                            ? 'rgb(245 245 244)' // stone-100
                                            : `rgba(99, 102, 241, ${0.2 + intensity * 0.6})`,
                                    color: intensity > 0.5 ? 'white' : undefined,
                                }}
                                title={`${count} sessions on ${date.toLocaleDateString()}`}
                            >
                                {count > 0 && count}
                            </div>
                            <span className={`text-xs ${isToday ? 'font-semibold text-indigo-600 dark:text-indigo-400' : 'text-stone-500'}`}>
                                {dayName}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {weekData.reduce((sum, d) => sum + d.count, 0) === 0 && (
                <p className="text-sm text-center text-stone-400 dark:text-stone-500 mt-4">
                    Complete a focus session to start tracking 🎯
                </p>
            )}
        </div>
    );
}
