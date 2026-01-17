import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Trophy, Lock, TrendingUp } from 'lucide-react';
import { useAchievementStore, ACHIEVEMENT_DEFINITIONS } from '../stores/achievementStore';
import { useHabitStore } from '../stores/habitStore';

type Category = 'all' | 'beginner' | 'consistency' | 'milestone' | 'special';

const CATEGORIES: Array<{ id: Category; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'consistency', label: 'Consistency' },
    { id: 'milestone', label: 'Milestones' },
    { id: 'special', label: 'Special' },
];

export function Achievements() {
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');
    const { achievements, isLoading } = useAchievementStore();
    const { stats, sessions } = useHabitStore();

    const filteredAchievements = useMemo(() => {
        if (selectedCategory === 'all') return achievements;
        return achievements.filter(achievement => {
            const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === achievement.id);
            return def?.category === selectedCategory;
        });
    }, [achievements, selectedCategory]);

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;

    if (isLoading) {
        return (
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Achievements</h2>
                            <p className="text-sm text-stone-600 dark:text-stone-400">
                                {unlockedCount} of {totalCount} unlocked
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                            {Math.round((unlockedCount / totalCount) * 100)}%
                        </div>
                        <div className="text-xs text-stone-500">Complete</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {CATEGORIES.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => setSelectedCategory(id)}
                        className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${selectedCategory === id
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Achievement Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredAchievements.map((achievement, index) => {
                        const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === achievement.id);
                        const progress = !achievement.unlocked && def?.getProgress
                            ? def.getProgress(stats, sessions)
                            : 100;

                        return (
                            <motion.div
                                key={achievement.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className={`glass p-5 rounded-xl relative overflow-hidden ${achievement.unlocked
                                    ? 'ring-2 ring-amber-400/50'
                                    : ''
                                    }`}
                            >
                                {/* Unlock Glow Effect */}
                                {achievement.unlocked && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-600/10 pointer-events-none" />
                                )}

                                <div className="relative">
                                    {/* Icon */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-40'}`}>
                                            {achievement.icon}
                                        </div>
                                        {achievement.unlocked ? (
                                            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                                                <Trophy className="w-3 h-3" />
                                                Unlocked
                                            </div>
                                        ) : (
                                            <Lock className="w-4 h-4 text-stone-400" />
                                        )}
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className={`font-bold mb-1 ${achievement.unlocked ? '' : 'text-stone-500 dark:text-stone-500'}`}>
                                        {achievement.title}
                                    </h3>
                                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
                                        {achievement.description}
                                    </p>

                                    {/* Progress or Unlock Date */}
                                    {achievement.unlocked ? (
                                        achievement.unlockedAt && (
                                            <div className="text-xs text-stone-500">
                                                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                                            </div>
                                        )
                                    ) : (
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-stone-500 flex items-center gap-1">
                                                    <TrendingUp className="w-3 h-3" />
                                                    Progress
                                                </span>
                                                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                                    {Math.round(progress)}%
                                                </span>
                                            </div>
                                            <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress}%` }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredAchievements.length === 0 && (
                <div className="glass p-12 rounded-2xl text-center">
                    <div className="text-6xl mb-4">🏆</div>
                    <p className="text-stone-500 dark:text-stone-400">
                        No achievements in this category yet
                    </p>
                </div>
            )}
        </div>
    );
}
