import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, TrendingDown, Clock, Target, Award } from 'lucide-react';
import { useHabitStore } from '../../stores/habitStore';

interface MonthData {
    month: string;
    year: number;
    totalSessions: number;
    totalMinutes: number;
    avgSessionsPerDay: number;
    bestDay: string;
    bestDaySessions: number;
}

export function MonthlyReview() {
    const { sessions } = useHabitStore();

    const monthlyData = useMemo(() => {
        const months: Map<string, MonthData> = new Map();
        const dayMap: Map<string, number> = new Map();

        sessions.forEach(session => {
            if (!session.completed || session.type !== 'work') return;

            const date = new Date(session.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const dayKey = date.toISOString().split('T')[0];

            // Count per day
            dayMap.set(dayKey, (dayMap.get(dayKey) || 0) + 1);

            // Aggregate per month
            const existing = months.get(monthKey);
            if (existing) {
                existing.totalSessions++;
                existing.totalMinutes += Math.floor(session.duration / 60);
            } else {
                months.set(monthKey, {
                    month: date.toLocaleString('default', { month: 'long' }),
                    year: date.getFullYear(),
                    totalSessions: 1,
                    totalMinutes: Math.floor(session.duration / 60),
                    avgSessionsPerDay: 0,
                    bestDay: '',
                    bestDaySessions: 0,
                });
            }
        });

        // Calculate averages and best days
        const result: MonthData[] = [];

        months.forEach((data, key) => {
            const [year, month] = key.split('-').map(Number);
            const daysInMonth = new Date(year, month, 0).getDate();
            data.avgSessionsPerDay = Math.round((data.totalSessions / daysInMonth) * 10) / 10;

            // Find best day in this month
            dayMap.forEach((count, dayKey) => {
                if (dayKey.startsWith(key) && count > data.bestDaySessions) {
                    data.bestDay = new Date(dayKey).toLocaleDateString('default', { day: 'numeric', weekday: 'short' });
                    data.bestDaySessions = count;
                }
            });

            result.push(data);
        });

        // Sort by date descending
        return result.sort((a, b) => {
            const dateA = new Date(`${a.year}-${a.month}-01`);
            const dateB = new Date(`${b.year}-${b.month}-01`);
            return dateB.getTime() - dateA.getTime();
        }).slice(0, 6); // Last 6 months
    }, [sessions]);

    // Calculate trends
    const getTrend = (current: number, previous: number) => {
        if (!previous) return null;
        const diff = ((current - previous) / previous) * 100;
        return { value: Math.abs(Math.round(diff)), isUp: diff > 0 };
    };

    if (monthlyData.length === 0) {
        return (
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
                <div className="text-center text-stone-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Complete some sessions to see your monthly review!</p>
                </div>
            </div>
        );
    }

    const currentMonth = monthlyData[0];
    const previousMonth = monthlyData[1];
    const sessionTrend = previousMonth ? getTrend(currentMonth.totalSessions, previousMonth.totalSessions) : null;

    return (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    Monthly Review
                </h3>
            </div>

            {/* Current Month Highlight */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold">{currentMonth.month} {currentMonth.year}</span>
                    {sessionTrend && (
                        <span className={`flex items-center gap-1 text-sm font-medium ${sessionTrend.isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                            {sessionTrend.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {sessionTrend.value}%
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {currentMonth.totalSessions}
                        </div>
                        <div className="text-xs text-stone-500">Sessions</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {Math.floor(currentMonth.totalMinutes / 60)}h
                        </div>
                        <div className="text-xs text-stone-500">Focus Time</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            {currentMonth.avgSessionsPerDay}
                        </div>
                        <div className="text-xs text-stone-500">Avg/Day</div>
                    </div>
                </div>

                {currentMonth.bestDay && (
                    <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800 flex items-center justify-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-stone-600 dark:text-stone-400">
                            Best day: <strong>{currentMonth.bestDay}</strong> ({currentMonth.bestDaySessions} sessions)
                        </span>
                    </div>
                )}
            </div>

            {/* Previous Months */}
            {monthlyData.length > 1 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-stone-500">Previous Months</h4>
                    {monthlyData.slice(1, 4).map((month, index) => (
                        <motion.div
                            key={`${month.year}-${month.month}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50"
                        >
                            <span className="font-medium text-sm">
                                {month.month.substring(0, 3)} {month.year}
                            </span>
                            <div className="flex items-center gap-4 text-sm text-stone-500">
                                <span className="flex items-center gap-1">
                                    <Target className="w-3 h-3" />
                                    {month.totalSessions}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {Math.floor(month.totalMinutes / 60)}h
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
