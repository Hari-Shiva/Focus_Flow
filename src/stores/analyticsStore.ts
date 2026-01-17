import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TimerMode } from '../types';

export interface SessionRecord {
    id: string;
    startTime: number; // timestamp
    endTime: number; // timestamp
    duration: number; // in minutes
    mode: TimerMode;
    taskId?: string;
    completed: boolean; // true if finished naturally
}

interface AnalyticsState {
    history: SessionRecord[];
    addSession: (session: Omit<SessionRecord, 'id'>) => void;
    clearHistory: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>()(
    persist(
        (set) => ({
            history: [],
            addSession: (session) => set((state) => ({
                history: [
                    ...state.history,
                    { ...session, id: crypto.randomUUID() }
                ]
            })),
            clearHistory: () => set({ history: [] }),
        }),
        {
            name: 'analytics-storage',
        }
    )
);
