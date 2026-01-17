import { create } from 'zustand';
import type { TimerMode, TimerSettings } from '../types';

interface TimerState {
    // Current state
    mode: TimerMode;
    timeRemaining: number; // in seconds
    isRunning: boolean;
    sessionsCompleted: number;
    activeTaskId: string | null;

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

export const useTimerStore = create<TimerState>((set, get) => {
    const settings = loadSettings();

    return {
        mode: 'work',
        timeRemaining: getInitialTime('work', settings),
        isRunning: false,
        sessionsCompleted: 0,
        activeTaskId: null,
        settings,

        setMode: (mode) => {
            const { settings } = get();
            set({
                mode,
                timeRemaining: getInitialTime(mode, settings),
                isRunning: false,
            });
        },

        setTimeRemaining: (time) => set({ timeRemaining: time }),

        tick: () => {
            const { timeRemaining, isRunning } = get();
            if (isRunning && timeRemaining > 0) {
                set({ timeRemaining: timeRemaining - 1 });

                // Session complete
                if (timeRemaining - 1 === 0) {
                    set({ isRunning: false });
                }
            }
        },

        start: () => set({ isRunning: true }),

        pause: () => set({ isRunning: false }),

        reset: () => {
            const { mode, settings } = get();
            set({
                timeRemaining: getInitialTime(mode, settings),
                isRunning: false,
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
});
