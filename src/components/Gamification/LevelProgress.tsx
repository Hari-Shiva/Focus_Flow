import { motion } from 'framer-motion';
import { useLevelStore, getNextLevelXP } from '../../stores/levelStore';
import { Trophy, Shield } from 'lucide-react';

export function LevelProgress() {
    const { level, xp, streakShields } = useLevelStore();
    const nextLevelXP = getNextLevelXP(level);
    const progress = (xp / nextLevelXP) * 100;

    return (
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
                <Trophy className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-sm font-bold text-stone-700 dark:text-stone-200 flex items-center gap-2">
                        Level {level}
                        {streakShields > 0 && (
                            <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                <Shield className="w-3 h-3 fill-current" />
                                {streakShields} <span className="hidden sm:inline">Shield{streakShields > 1 ? 's' : ''}</span>
                            </div>
                        )}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                        {Math.floor(xp)} / {nextLevelXP} XP
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
            </div>
        </div>
    );
}
