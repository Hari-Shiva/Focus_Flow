import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { useThemeStore, THEMES } from '../../stores/themeStore';
import { subDays, format, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';

export function WeeklyChart() {
    const { history } = useAnalyticsStore();
    const { currentTheme } = useThemeStore();
    const theme = THEMES[currentTheme];

    // Prepare data for the last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
            date,
            label: format(date, 'EEE'), // Mon, Tue...
            minutes: 0,
        };
    });

    // Aggregate minutes
    history.forEach(session => {
        if (session.mode === 'work' && session.completed) {
            const sessionDate = new Date(session.startTime);
            const dayRecord = days.find(d => isSameDay(d.date, sessionDate));
            if (dayRecord) {
                dayRecord.minutes += session.duration;
            }
        }
    });

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-stone-800 p-2 rounded-lg shadow-lg border border-stone-100 dark:border-stone-700 text-xs">
                    <p className="font-semibold mb-1">{payload[0].payload.label}</p>
                    <p className="text-stone-600 dark:text-stone-300">
                        {payload[0].value} mins
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-64 bg-white dark:bg-stone-900/50 rounded-2xl p-4 border border-stone-100 dark:border-stone-800"
        >
            <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-400 mb-4">
                Weekly Focus
            </h3>
            <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={days} barSize={20}>
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#78716c' }}
                            dy={10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        <Bar
                            dataKey="minutes"
                            radius={[4, 4, 4, 4]}
                        >
                            {days.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.minutes > 0 ? theme.modes.work.gradients.start : '#e7e5e4'}
                                    className="transition-all duration-500"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
