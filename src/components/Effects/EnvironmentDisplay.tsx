import { motion } from 'framer-motion';
import { Sprout, Leaf, Trees, Sparkles, Crown } from 'lucide-react';
import { useEnvironmentStore, getStageInfo } from '../../stores/environmentStore';
import { fadeIn } from '../../config/animations';

const STAGE_ICONS = [
    { icon: Sprout, color: 'text-stone-400', name: 'Barren' },
    { icon: Leaf, color: 'text-emerald-500', name: 'Budding' },
    { icon: Trees, color: 'text-green-600', name: 'Flourishing' },
    { icon: Sparkles, color: 'text-cyan-500', name: 'Vibrant' },
    { icon: Crown, color: 'text-amber-500', name: 'Legendary' },
];

export default function EnvironmentDisplay() {
    const { totalFocusMinutes } = useEnvironmentStore();
    const stageInfo = getStageInfo(totalFocusMinutes);
    const StageIcon = STAGE_ICONS[stageInfo.stage].icon;
    const iconColor = STAGE_ICONS[stageInfo.stage].color;

    return (
        <motion.div
            className="card p-4"
            {...fadeIn}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stageInfo.stage >= 3 ? 'from-cyan-500/10 to-purple-500/10' : 'from-emerald-500/10 to-green-500/10'}`}>
                    <StageIcon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-sm text-stone-700 dark:text-stone-300">
                        Environment: {stageInfo.stageName}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                        {totalFocusMinutes.toLocaleString()} minutes total
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            {stageInfo.stage < 4 && (
                <div className="space-y-1">
                    <div className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${stageInfo.progress}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                        {stageInfo.minutesUntilNext} minutes to {stageInfo.nextStageName}
                    </p>
                </div>
            )}

            {stageInfo.stage === 4 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    🎉 Maximum level reached!
                </p>
            )}
        </motion.div>
    );
}
