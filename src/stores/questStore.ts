import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Quest {
    id: string;
    title: string;
    description: string;
    target: number;
    progress: number;
    xpReward: number;
    completed: boolean;
    type: 'sessions' | 'minutes' | 'streak';
}

interface QuestState {
    dailyQuests: Quest[];
    lastRefresh: string;
    refreshQuests: () => void;
    updateProgress: (type: Quest['type'], amount: number) => void;
    claimReward: (questId: string) => number; // Returns XP earned
}

const QUEST_TEMPLATES: Omit<Quest, 'id' | 'progress' | 'completed'>[] = [
    { title: 'Early Bird', description: 'Complete 2 sessions before noon', target: 2, xpReward: 50, type: 'sessions' },
    { title: 'Focus Marathon', description: 'Focus for 90 minutes total', target: 90, xpReward: 100, type: 'minutes' },
    { title: 'Triple Threat', description: 'Complete 3 focus sessions', target: 3, xpReward: 75, type: 'sessions' },
    { title: 'Deep Work', description: 'Focus for 60 minutes total', target: 60, xpReward: 80, type: 'minutes' },
    { title: 'Quick Win', description: 'Complete 1 focus session', target: 1, xpReward: 25, type: 'sessions' },
    { title: 'Half Day Hero', description: 'Focus for 120 minutes', target: 120, xpReward: 150, type: 'minutes' },
];

function generateDailyQuests(): Quest[] {
    // Shuffle and pick 3 random quests
    const shuffled = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    return selected.map((template, index) => ({
        ...template,
        id: `quest-${Date.now()}-${index}`,
        progress: 0,
        completed: false,
    }));
}

function getTodayString(): string {
    return new Date().toISOString().split('T')[0];
}

export const useQuestStore = create<QuestState>()(
    persist(
        (set, get) => ({
            dailyQuests: generateDailyQuests(),
            lastRefresh: getTodayString(),

            refreshQuests: () => {
                const today = getTodayString();
                if (get().lastRefresh !== today) {
                    set({
                        dailyQuests: generateDailyQuests(),
                        lastRefresh: today,
                    });
                }
            },

            updateProgress: (type, amount) => {
                set((state) => ({
                    dailyQuests: state.dailyQuests.map((quest) => {
                        if (quest.type === type && !quest.completed) {
                            const newProgress = Math.min(quest.progress + amount, quest.target);
                            return {
                                ...quest,
                                progress: newProgress,
                                completed: newProgress >= quest.target,
                            };
                        }
                        return quest;
                    }),
                }));
            },

            claimReward: (questId) => {
                const quest = get().dailyQuests.find((q) => q.id === questId);
                if (quest && quest.completed) {
                    // Mark as claimed by resetting (since we don't track "claimed" separate from "completed")
                    return quest.xpReward;
                }
                return 0;
            },
        }),
        {
            name: 'quest-storage',
        }
    )
);
