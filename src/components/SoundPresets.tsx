import { motion } from 'framer-motion';
import { Coffee, Trees, Flame, Music, CloudRain } from 'lucide-react';
import { useSoundStore } from '../stores/soundStore';

const PRESET_CONFIGS = [
    { id: 'deep-focus', label: 'Deep Focus', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30' },
    { id: 'rainy-cafe', label: 'Rainy Café', icon: Coffee, color: 'text-stone-500', bg: 'bg-stone-50 dark:bg-stone-800/50' },
    { id: 'nature-zen', label: 'Nature Zen', icon: Trees, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { id: 'study-lofi', label: 'Study Lo-Fi', icon: Music, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
    { id: 'stormy-night', label: 'Stormy Night', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
];

export function SoundPresets() {
    const { activePreset, applyPreset } = useSoundStore();

    return (
        <div className="flex gap-2 pb-4 overflow-x-auto no-scrollbar mask-fade-right">
            {PRESET_CONFIGS.map((preset) => {
                const isActive = activePreset === preset.id;

                return (
                    <motion.button
                        key={preset.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => applyPreset(preset.id)}
                        className={`
                            flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap border
                            ${isActive
                                ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-800'
                                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                            }
                        `}
                    >
                        <div className={`p-1 rounded-lg ${preset.bg}`}>
                            <preset.icon className={`w-3.5 h-3.5 ${preset.color}`} />
                        </div>
                        {preset.label}
                    </motion.button>
                );
            })}
        </div>
    );
}
