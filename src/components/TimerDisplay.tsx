import { motion } from 'framer-motion';
import { useTimerStore } from '../stores/timerStore';
import { formatTime } from '../utils/formatTime';
import type { TimerMode } from '../types';
import { useThemeStore, THEMES } from '../stores/themeStore';
import { FlipNumber } from './Effects/FlipNumber';
import { StartParticles } from './Effects/StartParticles';
import { useState, useEffect } from 'react';

const MODE_LABELS: Record<TimerMode, string> = {
    work: 'Focus Time',
    break: 'Short Break',
    longBreak: 'Long Break',
};

export function TimerDisplay() {
    const { mode, timeRemaining, settings, sessionsCompleted, isRunning } = useTimerStore();
    const { currentTheme } = useThemeStore();
    const theme = THEMES[currentTheme];
    const [shouldShowParticles, setShouldShowParticles] = useState(false);

    // Trigger particles only on distinct start
    useEffect(() => {
        if (isRunning) {
            setShouldShowParticles(true);
            const timer = setTimeout(() => setShouldShowParticles(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [isRunning]);

    const totalTime = mode === 'work'
        ? settings.workDuration * 60
        : mode === 'break'
            ? settings.shortBreakDuration * 60
            : settings.longBreakDuration * 60;

    const progress = ((totalTime - timeRemaining) / totalTime) * 100;
    const circumference = 2 * Math.PI * 140;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const config = theme.modes[mode];
    const gradient = config.gradients;

    return (
        <div className="flex flex-col items-center relative">
            <StartParticles trigger={shouldShowParticles} />

            {/* Timer Circle */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{
                    scale: isRunning ? [1, 1.02, 1] : 1,
                    opacity: 1
                }}
                transition={{
                    duration: isRunning ? 4 : 0.5,
                    repeat: isRunning ? Infinity : 0,
                    ease: "easeInOut"
                }}
                className="relative z-10"
            >
                <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-500 ${config.bg}`} />

                <svg className="relative w-72 h-72 sm:w-80 sm:h-80 transform -rotate-90" viewBox="0 0 320 320">
                    <defs>
                        {Object.values(theme.modes).map((m) => (
                            <linearGradient key={m.gradients.id} id={m.gradients.id} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={m.gradients.start} />
                                <stop offset="100%" stopColor={m.gradients.end} />
                            </linearGradient>
                        ))}
                    </defs>

                    {/* Background circle */}
                    <circle
                        cx="160"
                        cy="160"
                        r="140"
                        className="stroke-stone-200 dark:stroke-stone-800"
                        strokeWidth="8"
                        fill="none"
                    />

                    {/* Progress circle */}
                    <motion.circle
                        cx="160"
                        cy="160"
                        r="140"
                        stroke={`url(#${gradient.id})`}
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.5, ease: 'linear' }}
                    />
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        key={mode}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center"
                    >
                        <p className={`text-sm font-medium mb-1 ${config.text}`}>
                            {MODE_LABELS[mode]}
                        </p>
                        <div className={`flex justify-center text-6xl sm:text-7xl font-bold tabular-nums tracking-tight ${config.text}`}>
                            {formatTime(timeRemaining).split('').map((char, i) => (
                                char === ':' ? (
                                    <span key={i} className="mx-0.5">:</span>
                                ) : (
                                    <FlipNumber key={i} value={char} />
                                )
                            ))}
                        </div>
                        {mode === 'work' && (
                            <p className="text-sm text-stone-500 dark:text-stone-400 mt-2">
                                Session {sessionsCompleted % settings.longBreakInterval + 1} of {settings.longBreakInterval}
                            </p>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            {/* Session Progress Dots */}
            {sessionsCompleted > 0 && (
                <div className="flex items-center gap-2 mt-6">
                    {Array.from({ length: settings.longBreakInterval }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className={`w-2.5 h-2.5 rounded-full transition-colors ${i < sessionsCompleted % settings.longBreakInterval
                                ? config.bg
                                : 'bg-stone-200 dark:bg-stone-700'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
