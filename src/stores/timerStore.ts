import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimerMode, TimerSettings } from '../types';

interface TimerState {
    // Current state
    mode: TimerMode;
    timeRemaining: number; // in seconds
    isRunning: boolean;
    sessionsCompleted: number;
    activeTaskId: string | null;
    lastTickTimestamp: number | null; // timestamp when timer was last updated

    // Settings
    settings: TimerSettings;

    // Actions
    setMode: (mode: TimerMode) => void;
    setTimeRemaining: (time: number) => void;
    tick: () => void;
    start: () => void;
    pause: () => void;
    reset: () => void;
    skip: () => void;
    completeSession: () => void;
    updateSettings: (settings: Partial<TimerSettings>) => void;
    resetSettings: () => void;
    setActiveTask: (taskId: string | null) => void;
}

const DEFAULT_SETTINGS: TimerSettings = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true,
    stretchEnabled: true,
    hydrationEnabled: true,
};

// Load settings from localStorage
const loadSettings = (): TimerSettings => {
    const saved = localStorage.getItem('timerSettings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
};

const getInitialTime = (mode: TimerMode, settings: TimerSettings): number => {
    switch (mode) {
        case 'work':
            return settings.workDuration * 60;
        case 'break':
            return settings.shortBreakDuration * 60;
        case 'longBreak':
            return settings.longBreakDuration * 60;
    }
};

export const useTimerStore = create<TimerState>()(persist(
    (set, get) => {
        const settings = loadSettings();

        return {
            mode: 'work',
            timeRemaining: getInitialTime('work', settings),
            isRunning: false,
            sessionsCompleted: 0,
            activeTaskId: null,
            lastTickTimestamp: null,
            settings,

            setMode: (mode) => {
                const { settings } = get();
                set({
                    mode,
                    timeRemaining: getInitialTime(mode, settings),
                    isRunning: false,
                    lastTickTimestamp: null,
                });
            },

            setTimeRemaining: (time) => set({ timeRemaining: time }),

            tick: () => {
                const { timeRemaining, isRunning } = get();
                if (isRunning && timeRemaining > 0) {
                    const newTime = timeRemaining - 1;
                    set({
                        timeRemaining: newTime,
                        lastTickTimestamp: Date.now()
                    });

                    // Session complete
                    if (newTime === 0) {
                        set({ isRunning: false, lastTickTimestamp: null });
                    }
                }
            },

            start: () => set({ isRunning: true, lastTickTimestamp: Date.now() }),

            pause: () => set({ isRunning: false, lastTickTimestamp: null }),

            reset: () => {
                const { mode, settings } = get();
                set({
                    timeRemaining: getInitialTime(mode, settings),
                    isRunning: false,
                    lastTickTimestamp: null,
                });
            },

            skip: () => {
                const { mode, sessionsCompleted, settings } = get();
                let nextMode: TimerMode;

                if (mode === 'work') {
                    // Determine if it's time for long break
                    if ((sessionsCompleted + 1) % settings.longBreakInterval === 0) {
                        nextMode = 'longBreak';
                    } else {
                        nextMode = 'break';
                    }
                } else {
                    nextMode = 'work';
                }

                get().setMode(nextMode);

                // Auto-start if enabled
                const shouldAutoStart =
                    (nextMode === 'work' && settings.autoStartPomodoros) ||
                    (nextMode !== 'work' && settings.autoStartBreaks);

                if (shouldAutoStart) {
                    set({ isRunning: true });
                }
            },

            completeSession: () => {
                const { mode } = get();

                // Only count work sessions
                if (mode === 'work') {
                    set({ sessionsCompleted: get().sessionsCompleted + 1 });
                }

                // Auto-skip to next session
                get().skip();
            },

            updateSettings: (newSettings) => {
                const updated = { ...get().settings, ...newSettings };
                set({ settings: updated });
                localStorage.setItem('timerSettings', JSON.stringify(updated));
            },

            resetSettings: () => {
                set({ settings: DEFAULT_SETTINGS });
                localStorage.setItem('timerSettings', JSON.stringify(DEFAULT_SETTINGS));
            },

            setActiveTask: (taskId) => set({ activeTaskId: taskId }),
        };
    },
    {
        name: 'timer-storage',
        partialize: (state) => ({
            mode: state.mode,
            timeRemaining: state.timeRemaining,
            isRunning: state.isRunning,
            sessionsCompleted: state.sessionsCompleted,
            activeTaskId: state.activeTaskId,
            lastTickTimestamp: state.lastTickTimestamp,
        }),
        // Handle state restoration properly
        onRehydrateStorage: () => (state) => {
            if (state && state.isRunning && state.lastTickTimestamp) {
                // Calculate elapsed time since last tick
                const now = Date.now();
                const elapsedSeconds = Math.floor((now - state.lastTickTimestamp) / 1000);

                // Update time remaining
                const newTimeRemaining = Math.max(0, state.timeRemaining - elapsedSeconds);

                // If timer would have expired, set to 0 and stop
                if (newTimeRemaining === 0) {
                    state.timeRemaining = 0;
                    state.isRunning = false;
                    state.lastTickTimestamp = null;
                } else {
                    state.timeRemaining = newTimeRemaining;
                    state.lastTickTimestamp = now;
                }
            }
        },
    }
));
