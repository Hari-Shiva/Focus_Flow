// Timer Mode Types
export type TimerMode = 'work' | 'break' | 'longBreak';

// Session Interface
export interface Session {
    id: string;
    date: Date;
    duration: number; // in seconds
    type: TimerMode;
    completed: boolean;
}

// Sound Types
export type SoundType = 'rain' | 'forest' | 'cafe' | 'ocean' | 'fireplace' | 'whitenoise' | 'thunder' | 'birds' | 'lofi' | 'library';

export interface SoundSettings {
    [key: string]: number; // volume 0-1
}

// Timer Settings
export interface TimerSettings {
    workDuration: number; // in minutes
    shortBreakDuration: number;
    longBreakDuration: number;
    longBreakInterval: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    soundEnabled: boolean;
    stretchEnabled: boolean;
    hydrationEnabled: boolean;
}

// Stats Interface
export interface Stats {
    totalSessions: number;
    totalFocusTime: number; // in minutes
    currentStreak: number;
    longestStreak: number;
    todaySessions: number;
    weekSessions: number;
}

// Achievement Interface
export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: Date;
}

// Task Interface
export interface Task {
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
    completedAt?: Date;
    pomodorosCompleted: number;
    pomodorosEstimated?: number;
    isActive: boolean; // Currently linked to timer
}
