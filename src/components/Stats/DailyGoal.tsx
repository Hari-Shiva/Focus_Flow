import { motion } from 'framer-motion';
import { Target, Trophy, Edit2 } from 'lucide-react';
import { useHabitStore } from '../../stores/habitStore';
import { useState } from 'react';
import confetti from 'canvas-confetti';

export function DailyGoal() {
    const { dailyGoal, setDailyGoal } = useHabitStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(dailyGoal.toString());

    // Calculate progress
    // Actually stats.totalFocusTime is likely in hours based on calculateStats implementation. 
    // Let's re-verify: "sum + s.duration / 60" -> yes, it is in hours.
    // Ideally we'd like minutes from the store directly or calculate it here. 
    // Wait, the stats object has `todaySessions` but not `todayMinutes`.
    // We need to calculate today's minutes or fetch it.

    // Let's use the helper we saw in habitStore or calculate it if needed.
    // The store calculateStats produces `weekSessions`, `todaySessions`.
    // It doesn't seem to expose "today's focus minutes" directly in the `stats` object.
    // We might need to quickly update habitStore or compute it here. 
    // Since we can't easily access the raw sessions here without prop drilling or getting them from store.
    // Let's access sessions from store.

    const { sessions } = useHabitStore();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMinutes = sessions
        .filter(s => {
            const d = new Date(s.date);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime() && s.completed && s.type === 'work';
        })
        .reduce((acc, curr) => acc + curr.duration, 0);

    const progress = Math.min((todayMinutes / dailyGoal) * 100, 100);
    const isGoalMet = todayMinutes >= dailyGoal;

    const handleSave = () => {
        const val = parseInt(editValue);
        if (!isNaN(val) && val > 0) {
            setDailyGoal(val);
            setIsEditing(false);
            if (todayMinutes >= val) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
    };

    const circumference = 2 * Math.PI * 45; // radius 45 (approx)
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <motion.div
            className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Background Glow */}
            {isGoalMet && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/5 pointer-events-none" />
            )}

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isGoalMet ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'}`}>
                        {isGoalMet ? <Trophy className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                    </div>
                    <div>
                        <h3 className="font-semibold text-stone-900 dark:text-stone-100">Daily Goal</h3>
                        <p className="text-sm text-stone-500 dark:text-stone-400">
                            {isGoalMet ? 'Target Achieved!' : 'Keep going!'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 transition-colors"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-8 relative z-10">
                {/* Visual Progress Ring */}
                <div className="relative w-24 h-24 flex-shrink-0">
                    {/* Ring Background */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r="42"
                            fill="none"
                            stroke="currentColor"
                            className="text-stone-100 dark:text-stone-800"
                            strokeWidth="8"
                        />
                        {/* Progress */}
                        <circle
                            cx="48"
                            cy="48"
                            r="42"
                            fill="none"
                            stroke="currentColor"
                            className={`${isGoalMet ? 'text-amber-500' : 'text-indigo-500'} transition-all duration-1000 ease-out`}
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-xl font-bold font-mono">
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>

                {/* Stats & Edit */}
                <div className="flex-1">
                    {isEditing ? (
                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-stone-400 uppercase font-medium">Minutes Target</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="w-20 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSave}
                                    className="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <div className="text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                                {todayMinutes} <span className="text-lg text-stone-400 font-medium">/ {dailyGoal}m</span>
                            </div>
                            <p className="text-sm text-stone-500">
                                {Math.max(0, dailyGoal - todayMinutes)} mins left to reach your goal
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
