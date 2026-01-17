import { motion } from 'framer-motion';
import { Flame, Target, Clock, BarChart3 } from 'lucide-react';
import { useHabitStore } from '../stores/habitStore';
import { formatDuration } from '../utils/formatTime';
import { WeeklyChart } from './Stats/WeeklyChart';
import { DistributionPie } from './Stats/DistributionPie';
import { Heatmap } from './Stats/Heatmap';
import { LevelProgress } from './Gamification/LevelProgress';
import { BestFocus } from './Stats/BestFocus';
import { AverageSession } from './Stats/AverageSession';
import { DailyGoal } from './Stats/DailyGoal';
import { StreaksCalendar } from './Stats/StreaksCalendar';
import { DailyQuests } from './Gamification/DailyQuests';
import { MonthlyReview } from './Stats/MonthlyReview';
import { FocusScore } from './Stats/FocusScore';

export function SessionStats() {
    const { stats } = useHabitStore();

    const statItems = [
        {
            icon: Target,
            label: 'Today',
            value: stats.todaySessions,
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
        },
        {
            icon: Flame,
            label: 'Streak',
            value: `${stats.currentStreak}d`,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50 dark:bg-orange-950/50',
        },
        {
            icon: Clock,
            label: 'Total Time',
            value: formatDuration(Math.floor(stats.totalFocusTime)),
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
        },
    ];

    return (
        <div className="space-y-4 sm:space-y-6 w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-stone-400" />
                <h2 className="text-lg font-semibold text-stone-700 dark:text-stone-200">
                    Analytics
                </h2>
            </div>

            {/* Level Progress */}
            <LevelProgress />

            {/* Focus Score */}
            <FocusScore />

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
                {statItems.map((item, index) => (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-stone-50 dark:bg-stone-900/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white dark:hover:bg-stone-800 transition-colors border border-transparent hover:border-stone-100 dark:hover:border-stone-700"
                    >
                        <div className={`p-2.5 rounded-full mb-3 ${item.bgColor}`}>
                            <item.icon className={`w-5 h-5 ${item.color}`} />
                        </div>
                        <div className="text-2xl font-bold tracking-tight mb-0.5 text-stone-900 dark:text-stone-100">
                            {item.value}
                        </div>
                        <div className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                            {item.label}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Daily Goal & Heatmap */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <DailyGoal />
                </div>
                <div className="md:col-span-1">
                    <Heatmap />
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <WeeklyChart />
                <DistributionPie />
            </div>

            {/* Additional Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BestFocus />
                <AverageSession />
            </div>

            {/* Streaks Calendar */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4">
                <StreaksCalendar />
            </div>

            {/* Daily Quests */}
            <DailyQuests />

            {/* Monthly Review */}
            <MonthlyReview />
        </div>
    );
}
