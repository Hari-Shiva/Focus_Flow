import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FocusScoreState {
    dailyScores: Record<string, number>; // dateString -> score
    weeklyAverage: number;
    monthlyAverage: number;
    allTimeHigh: number;

    // Actions
    calculateDailyScore: (sessions: number, minutes: number, streak: number, questsCompleted: number) => number;
    recordDailyScore: (score: number) => void;
    getScoreForDate: (date: string) => number;
    recalculateAverages: () => void;
}

// Score calculation weights
const WEIGHTS = {
    sessions: 10,      // 10 points per session
    minutes: 0.5,      // 0.5 points per minute
    streak: 5,         // 5 points per streak day
    quests: 15,        // 15 points per quest completed
    maxDaily: 100,     // Cap at 100
};

function getTodayString(): string {
    return new Date().toISOString().split('T')[0];
}

export const useFocusScoreStore = create<FocusScoreState>()(
    persist(
        (set, get) => ({
            dailyScores: {},
            weeklyAverage: 0,
            monthlyAverage: 0,
            allTimeHigh: 0,

            calculateDailyScore: (sessions, minutes, streak, questsCompleted) => {
                const rawScore =
                    (sessions * WEIGHTS.sessions) +
                    (minutes * WEIGHTS.minutes) +
                    (Math.min(streak, 7) * WEIGHTS.streak) + // Cap streak bonus at 7 days
                    (questsCompleted * WEIGHTS.quests);

                return Math.min(Math.round(rawScore), WEIGHTS.maxDaily);
            },

            recordDailyScore: (score) => {
                const today = getTodayString();
                const { dailyScores, allTimeHigh } = get();

                set({
                    dailyScores: { ...dailyScores, [today]: score },
                    allTimeHigh: Math.max(allTimeHigh, score),
                });

                get().recalculateAverages();
            },

            getScoreForDate: (date) => {
                return get().dailyScores[date] || 0;
            },

            recalculateAverages: () => {
                const { dailyScores } = get();
                const scores = Object.entries(dailyScores);

                if (scores.length === 0) {
                    set({ weeklyAverage: 0, monthlyAverage: 0 });
                    return;
                }

                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(weekAgo.getDate() - 7);
                const monthAgo = new Date(today);
                monthAgo.setDate(monthAgo.getDate() - 30);

                const weeklyScores = scores.filter(([date]) => new Date(date) >= weekAgo);
                const monthlyScores = scores.filter(([date]) => new Date(date) >= monthAgo);

                const weeklyAvg = weeklyScores.length > 0
                    ? Math.round(weeklyScores.reduce((acc, [, s]) => acc + s, 0) / weeklyScores.length)
                    : 0;

                const monthlyAvg = monthlyScores.length > 0
                    ? Math.round(monthlyScores.reduce((acc, [, s]) => acc + s, 0) / monthlyScores.length)
                    : 0;

                set({ weeklyAverage: weeklyAvg, monthlyAverage: monthlyAvg });
            },
        }),
        { name: 'focus-score-storage' }
    )
);
