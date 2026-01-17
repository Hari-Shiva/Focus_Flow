import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Trophy, Star } from 'lucide-react';
import { useFocusScoreStore } from '../../stores/focusScoreStore';
import { useHabitStore } from '../../stores/habitStore';
import { useQuestStore } from '../../stores/questStore';

export function FocusScore() {
    const { stats } = useHabitStore();
    const { dailyQuests } = useQuestStore();
    const {
        calculateDailyScore,
        recordDailyScore,
        weeklyAverage,
        monthlyAverage,
        allTimeHigh,
    } = useFocusScoreStore();

    const completedQuests = dailyQuests.filter(q => q.completed).length;

    // Calculate today's score
    const todayScore = calculateDailyScore(
        stats.todaySessions,
        stats.todaySessions * 25, // Approximate minutes (25 min per session)
        stats.currentStreak,
        completedQuests
    );

    // Record score periodically
    useEffect(() => {
        if (todayScore > 0) {
            recordDailyScore(todayScore);
        }
    }, [todayScore, recordDailyScore]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-blue-500';
        if (score >= 40) return 'text-amber-500';
        return 'text-stone-400';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Great';
        if (score >= 40) return 'Good';
        if (score > 0) return 'Getting Started';
        return 'No Activity';
    };

    return (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Focus Score
                </h3>
                <span className="text-xs text-stone-500">Today</span>
            </div>

            {/* Main Score Display */}
            <div className="text-center py-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className={`text-6xl font-bold ${getScoreColor(todayScore)}`}
                >
                    {todayScore}
                </motion.div>
                <div className={`text-sm font-medium mt-1 ${getScoreColor(todayScore)}`}>
                    {getScoreLabel(todayScore)}
                </div>

                {/* Progress ring visualization */}
                <div className="mt-4 relative w-24 h-24 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-stone-200 dark:text-stone-700"
                        />
                        <motion.circle
                            cx="48"
                            cy="48"
                            r="42"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={264}
                            initial={{ strokeDashoffset: 264 }}
                            animate={{ strokeDashoffset: 264 - (264 * todayScore) / 100 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className={getScoreColor(todayScore)}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{todayScore}%</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <div className="text-center p-2 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                    <div className="text-lg font-bold">{weeklyAverage}</div>
                    <div className="text-xs text-stone-500">Week Avg</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                    <Star className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                    <div className="text-lg font-bold">{monthlyAverage}</div>
                    <div className="text-xs text-stone-500">Month Avg</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                    <Trophy className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                    <div className="text-lg font-bold">{allTimeHigh}</div>
                    <div className="text-xs text-stone-500">Best</div>
                </div>
            </div>
        </div>
    );
}
