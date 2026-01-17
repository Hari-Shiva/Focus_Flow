import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Clock, Flame, ArrowRight, Coffee } from 'lucide-react';
import { useHabitStore } from '../stores/habitStore';
import { useTimerStore } from '../stores/timerStore';
import { formatDuration } from '../utils/formatTime';
import { Confetti } from './Animations/Confetti';

interface SessionCompleteModalProps {
    isOpen: boolean;
    onContinue: () => void;
    onTakeBreak: () => void;
    sessionType: 'work' | 'break' | 'longBreak';
    sessionDuration: number; // in seconds
}

export function SessionCompleteModal({
    isOpen,
    onContinue,
    onTakeBreak,
    sessionType,
    sessionDuration,
}: SessionCompleteModalProps) {
    const { stats } = useHabitStore();
    const { sessionsCompleted } = useTimerStore();

    const isWorkSession = sessionType === 'work';

    const statItems = [
        {
            icon: Clock,
            label: 'Session Time',
            value: formatDuration(sessionDuration),
            color: 'text-indigo-500',
        },
        {
            icon: Trophy,
            label: 'Sessions Today',
            value: stats.todaySessions.toString(),
            color: 'text-amber-500',
        },
        {
            icon: Flame,
            label: 'Current Streak',
            value: `${stats.currentStreak}d`,
            color: 'text-orange-500',
        },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Confetti for work sessions */}
                    {isWorkSession && <Confetti isActive={true} />}

                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onContinue}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
                    >
                        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
                            {/* Header */}
                            <div className="p-6 pb-4 text-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                                    className="text-6xl mb-3"
                                >
                                    {isWorkSession ? '🎉' : '☕'}
                                </motion.div>
                                <h2 className="text-2xl font-bold mb-1">
                                    {isWorkSession
                                        ? 'Great Work!'
                                        : sessionType === 'break'
                                            ? 'Break Complete'
                                            : 'Long Break Over'}
                                </h2>
                                <p className="text-stone-500 dark:text-stone-400">
                                    {isWorkSession
                                        ? "You've completed another focus session!"
                                        : 'Ready to get back to work?'}
                                </p>
                            </div>

                            {/* Stats */}
                            {isWorkSession && (
                                <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800">
                                    <div className="grid grid-cols-3 gap-4">
                                        {statItems.map((item, index) => (
                                            <motion.div
                                                key={item.label}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 + index * 0.1 }}
                                                className="text-center"
                                            >
                                                <item.icon className={`w-5 h-5 mx-auto mb-1 ${item.color}`} />
                                                <div className="text-lg font-bold">{item.value}</div>
                                                <div className="text-xs text-stone-500 dark:text-stone-400">
                                                    {item.label}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Session Counter */}
                            <div className="px-6 py-3 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-200 dark:border-stone-800">
                                <div className="flex items-center justify-center gap-2 text-sm">
                                    <Trophy className="w-4 h-4 text-amber-500" />
                                    <span className="text-stone-600 dark:text-stone-400">
                                        Total sessions completed: <strong>{sessionsCompleted}</strong>
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 pt-4 flex gap-3">
                                {isWorkSession ? (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={onTakeBreak}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors font-medium"
                                        >
                                            <Coffee className="w-4 h-4" />
                                            Take a Break
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={onContinue}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25"
                                        >
                                            Continue
                                            <ArrowRight className="w-4 h-4" />
                                        </motion.button>
                                    </>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={onContinue}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25"
                                    >
                                        Start Focus Session
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
