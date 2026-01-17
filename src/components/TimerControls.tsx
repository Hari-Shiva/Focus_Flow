import { Play, Pause, SkipForward, RotateCcw, Keyboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTimerStore } from '../stores/timerStore';

const PRESETS = [
    { label: '15m', minutes: 15 },
    { label: '25m', minutes: 25 },
    { label: '30m', minutes: 30 },
    { label: '45m', minutes: 45 },
    { label: '60m', minutes: 60 },
];

export function TimerControls() {
    const { isRunning, start, pause, skip, reset, mode, updateSettings, settings } = useTimerStore();

    const handlePresetClick = (minutes: number) => {
        updateSettings({ workDuration: minutes });
        reset();
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Quick Presets */}
            {mode === 'work' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                >
                    {PRESETS.map((preset) => (
                        <motion.button
                            key={preset.minutes}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePresetClick(preset.minutes)}
                            aria-label={`Set timer to ${preset.label}`}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${settings.workDuration === preset.minutes
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                                }`}
                        >
                            {preset.label}
                        </motion.button>
                    ))}
                </motion.div>
            )}

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-4">
                {/* Reset Button */}
                <motion.button
                    whileHover={{ scale: 1.1, rotate: -90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={reset}
                    className="group relative p-4 rounded-2xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors border border-stone-200 dark:border-stone-800"
                    title="Reset timer (R)"
                    aria-label="Reset timer"
                >
                    <RotateCcw className="w-5 h-5" />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        R
                    </span>
                </motion.button>

                {/* Play/Pause Button - Primary */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isRunning ? pause : start}
                    className="group relative w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-shadow"
                    aria-label={isRunning ? "Pause timer" : "Start timer"}
                >
                    {isRunning ? (
                        <Pause className="w-8 h-8" />
                    ) : (
                        <Play className="w-8 h-8 ml-1" />
                    )}
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Space
                    </span>
                </motion.button>

                {/* Skip Button */}
                <motion.button
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={skip}
                    className="group relative p-4 rounded-2xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors border border-stone-200 dark:border-stone-800"
                    title="Skip to next session (S)"
                    aria-label="Skip to next session"
                >
                    <SkipForward className="w-5 h-5" />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        S
                    </span>
                </motion.button>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500"
            >
                <Keyboard className="w-3.5 h-3.5" />
                <span>Space to play/pause • R to reset • S to skip</span>
            </motion.div>
        </div>
    );
}

