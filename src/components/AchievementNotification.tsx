import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Trophy, X } from 'lucide-react';
import { useAchievementStore } from '../stores/achievementStore';

export function AchievementNotification() {
    const { achievements, newlyUnlocked, clearNewlyUnlocked } = useAchievementStore();

    useEffect(() => {
        if (newlyUnlocked.length > 0) {
            // Auto-dismiss after 5 seconds
            const timer = setTimeout(() => {
                clearNewlyUnlocked();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [newlyUnlocked, clearNewlyUnlocked]);

    const unlockedAchievements = achievements.filter(a => newlyUnlocked.includes(a.id));

    return (
        <div className="fixed top-20 right-6 z-50 space-y-3 pointer-events-none">
            <AnimatePresence>
                {unlockedAchievements.map((achievement, index) => (
                    <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        transition={{ delay: index * 0.2 }}
                        className="pointer-events-auto"
                    >
                        <div className="glass p-4 rounded-xl shadow-2xl border-2 border-amber-400/50 bg-white dark:bg-stone-900 min-w-[320px] max-w-[400px]">
                            {/* Celebration Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-xl pointer-events-none" />

                            <div className="relative flex items-start gap-4">
                                {/* Icon with Glow */}
                                <motion.div
                                    className="text-5xl relative"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        repeat: 2,
                                        ease: 'easeInOut'
                                    }}
                                >
                                    <div className="absolute inset-0 bg-amber-400 blur-xl opacity-60 rounded-full" />
                                    <div className="relative">{achievement.icon}</div>
                                </motion.div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2">
                                            <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                                                Achievement Unlocked!
                                            </span>
                                        </div>
                                        <button
                                            onClick={clearNewlyUnlocked}
                                            className="p-1 hover:bg-stone-200 dark:hover:bg-stone-800 rounded transition-colors"
                                            aria-label="Dismiss"
                                        >
                                            <X className="w-4 h-4 text-stone-500" />
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">
                                        {achievement.title}
                                    </h3>
                                    <p className="text-sm text-stone-600 dark:text-stone-400">
                                        {achievement.description}
                                    </p>
                                </div>
                            </div>

                            {/* Sparkle Effect */}
                            <motion.div
                                className="absolute -top-1 -right-1"
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'linear'
                                }}
                            >
                                <span className="text-2xl">✨</span>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
