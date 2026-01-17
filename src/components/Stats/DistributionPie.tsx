import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAnalyticsStore } from '../../stores/analyticsStore';
import { useThemeStore, THEMES } from '../../stores/themeStore';
import { motion } from 'framer-motion';

export function DistributionPie() {
    const { history } = useAnalyticsStore();
    const { currentTheme } = useThemeStore();
    const theme = THEMES[currentTheme];

    // Aggregate data
    const totals = {
        work: 0,
        break: 0,
        longBreak: 0
    };

    history.forEach(session => {
        if (session.completed && session.mode in totals) {
            totals[session.mode as keyof typeof totals] += session.duration;
        }
    });

    // Helper to map theme colors
    const chartData = [
        { name: 'Focus', value: totals.work, color: theme.modes.work.gradients.start },
        { name: 'Short Break', value: totals.break, color: theme.modes.break.gradients.start },
        { name: 'Long Break', value: totals.longBreak, color: theme.modes.longBreak.gradients.start },
    ].filter(d => d.value > 0);

    if (chartData.length === 0) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-white dark:bg-stone-900/50 rounded-2xl border border-stone-100 dark:border-stone-800 text-stone-400 text-xs">
                No data yet
            </div>
        );
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-stone-800 p-2 rounded-lg shadow-lg border border-stone-100 dark:border-stone-700 text-xs">
                    <p className="font-semibold mb-1">{payload[0].name}</p>
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
            transition={{ delay: 0.1 }}
            className="w-full h-64 bg-white dark:bg-stone-900/50 rounded-2xl p-4 border border-stone-100 dark:border-stone-800"
        >
            <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-400 mb-4">
                Session Type
            </h3>
            <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
