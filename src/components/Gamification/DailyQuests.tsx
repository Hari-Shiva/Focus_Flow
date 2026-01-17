import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Target, Sparkles } from 'lucide-react';
import { useQuestStore } from '../../stores/questStore';
import { useLevelStore } from '../../stores/levelStore';

export function DailyQuests() {
    const { dailyQuests, refreshQuests } = useQuestStore();
    const { addXP } = useLevelStore();

    // Refresh quests on mount if new day
    useEffect(() => {
        refreshQuests();
    }, [refreshQuests]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'sessions': return Target;
            case 'minutes': return Clock;
            case 'streak': return Trophy;
            default: return Sparkles;
        }
    };

    const handleClaim = (_questId: string, xpReward: number) => {
        addXP(xpReward);
    };

    const completedCount = dailyQuests.filter(q => q.completed).length;

    return (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Daily Quests
                </h3>
                <span className="text-sm text-stone-500">
                    {completedCount}/{dailyQuests.length} Complete
                </span>
            </div>

            <div className="space-y-3">
                {dailyQuests.map((quest, index) => {
                    const Icon = getIcon(quest.type);
                    const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);

                    return (
                        <motion.div
                            key={quest.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-3 rounded-xl border transition-all ${quest.completed
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                                : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${quest.completed
                                    ? 'bg-emerald-100 dark:bg-emerald-900/50'
                                    : 'bg-stone-100 dark:bg-stone-700'
                                    }`}>
                                    <Icon className={`w-4 h-4 ${quest.completed
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-stone-500'
                                        }`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm">{quest.title}</span>
                                        <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                            +{quest.xpReward} XP
                                        </span>
                                    </div>
                                    <p className="text-xs text-stone-500 mb-2">{quest.description}</p>

                                    {/* Progress bar */}
                                    <div className="h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progressPercent}%` }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className={`h-full rounded-full ${quest.completed
                                                ? 'bg-emerald-500'
                                                : 'bg-indigo-500'
                                                }`}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs text-stone-400">
                                            {quest.progress}/{quest.target} {quest.type === 'minutes' ? 'min' : ''}
                                        </span>
                                        {quest.completed && (
                                            <button
                                                onClick={() => handleClaim(quest.id, quest.xpReward)}
                                                className="text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                                            >
                                                ✓ Completed
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
