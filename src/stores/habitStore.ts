import { create } from 'zustand';
import type { Session, Stats } from '../types';
import { addSession, getAllSessions } from '../db/database';

interface HabitState {
    sessions: Session[];
    stats: Stats;
    isLoading: boolean;

    // Actions
    loadSessions: () => Promise<void>;
    saveSession: (session: Omit<Session, 'id'>) => Promise<void>;
    calculateStats: () => void;
    setDailyGoal: (minutes: number) => void;
    dailyGoal: number; // in minutes
    shieldsUsed: string[]; // Dates where shield was used
}

const calculateStreak = (sessions: Session[], shieldsUsed: string[] = []): number => {
    if (sessions.length === 0) return 0;

    // Sort by date descending
    const sortedSessions = [...sessions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if there's a session today or yesterday
    const latestSession = new Date(sortedSessions[0].date);
    latestSession.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
        (currentDate.getTime() - latestSession.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff > 1) return 0; // Streak broken

    // Count consecutive days
    const uniqueDays = new Set<string>();
    for (const session of sortedSessions) {
        if (!session.completed) continue;

        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        const dateStr = sessionDate.toISOString().split('T')[0];
        uniqueDays.add(dateStr);
    }

    const sortedDays = Array.from(uniqueDays).sort().reverse();

    for (let i = 0; i < sortedDays.length; i++) {
        if (i === 0) {
            streak = 1;
            continue;
        }

        const current = new Date(sortedDays[i]);
        const previous = new Date(sortedDays[i - 1]);
        const diff = Math.floor(
            (previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diff === 1) {
            streak++;
        } else {
            // Check if missing days are covered by shields
            // For now, simpler logic: if diff > 1, check if the days in between have shields
            // This is complex because we need to check every missing day.
            // Simplified: If just one day missing (diff === 2) and shielded, continue.
            if (diff === 2) {
                const missingDate = new Date(previous);
                missingDate.setDate(missingDate.getDate() - 1);
                const dateStr = missingDate.toISOString().split('T')[0];

                if (shieldsUsed.includes(dateStr)) {
                    streak++; // Count the shielded day? Or just bridge? Usually counts or bridges.
                    // If we count it, streak becomes continuous.
                    // Let's just bridge for now, but we need to increment streak for the *current* day (which is sortedDays[i])
                    streak++;
                    continue;
                }
            }
            break;
        }
    }

    return streak;
};

export const useHabitStore = create<HabitState>((set, get) => ({
    sessions: [],
    stats: {
        totalSessions: 0,
        totalFocusTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        todaySessions: 0,
        weekSessions: 0,
    },
    dailyGoal: 120, // Default 2 hours
    shieldsUsed: [],
    isLoading: false,

    setDailyGoal: (minutes) => set({ dailyGoal: minutes }),

    loadSessions: async () => {
        set({ isLoading: true });
        try {
            const sessions = await getAllSessions();
            set({ sessions });
            get().calculateStats();
        } catch (error) {
            console.error('Failed to load sessions:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    saveSession: async (sessionData) => {
        const session: Session = {
            ...sessionData,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        try {
            await addSession(session);
            set({ sessions: [...get().sessions, session] });
            get().calculateStats();

            // Check for achievement unlocks
            const { stats, sessions } = get();
            const { useAchievementStore } = await import('./achievementStore');
            useAchievementStore.getState().checkAchievements(stats, sessions);
        } catch (error) {
            console.error('Failed to save session:', error);
        }
    },

    calculateStats: () => {
        const { sessions } = get();

        const completedSessions = sessions.filter(s => s.completed && s.type === 'work');

        const totalSessions = completedSessions.length;
        const totalFocusTime = completedSessions.reduce(
            (sum, s) => sum + s.duration / 60,
            0
        );

        // Today's sessions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaySessions = completedSessions.filter(s => {
            const sessionDate = new Date(s.date);
            sessionDate.setHours(0, 0, 0, 0);
            return sessionDate.getTime() === today.getTime();
        }).length;

        // This week's sessions
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekSessions = completedSessions.filter(
            s => new Date(s.date) >= weekAgo
        ).length;

        // Streaks
        const currentStreak = calculateStreak(completedSessions, get().shieldsUsed);

        // Calculate longest streak (simplified - you might want to improve this)
        const longestStreak = Math.max(currentStreak, get().stats.longestStreak);

        set({
            stats: {
                totalSessions,
                totalFocusTime,
                currentStreak,
                longestStreak,
                todaySessions,
                weekSessions,
            },
        });
    },
}));
