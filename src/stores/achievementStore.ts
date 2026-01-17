import { create } from 'zustand';
import type { Achievement, Stats, Session } from '../types';
import { getAllAchievements, saveAllAchievements } from '../db/database';

// Achievement unlock condition checker type
type UnlockChecker = (stats: Stats, sessions: Session[]) => boolean;
type ProgressCalculator = (stats: Stats, sessions: Session[]) => number;

interface AchievementDefinition {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'beginner' | 'consistency' | 'milestone';
    checkUnlock: UnlockChecker;
    getProgress?: ProgressCalculator; // 0-100
}

interface AchievementState {
    achievements: Achievement[];
    newlyUnlocked: string[]; // IDs of achievements just unlocked
    isLoading: boolean;

    // Actions
    loadAchievements: () => Promise<void>;
    checkAchievements: (stats: Stats, sessions: Session[]) => void;
    clearNewlyUnlocked: () => void;
}

// Define all achievements
const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
    // === BEGINNER === (4 achievements)
    {
        id: 'first-focus',
        title: 'First Focus',
        description: 'Complete your first focus session',
        icon: '🎯',
        category: 'beginner',
        checkUnlock: (stats) => stats.totalSessions >= 1,
        getProgress: (stats) => Math.min(stats.totalSessions * 100, 100),
    },
    {
        id: 'hot-streak',
        title: 'Hot Streak',
        description: 'Complete 3 sessions in a single day',
        icon: '🔥',
        category: 'beginner',
        checkUnlock: (stats) => stats.todaySessions >= 3,
        getProgress: (stats) => Math.min((stats.todaySessions / 3) * 100, 100),
    },
    {
        id: 'week-one',
        title: 'Week One',
        description: 'Maintain a 7-day streak',
        icon: '📅',
        category: 'beginner',
        checkUnlock: (stats) => stats.currentStreak >= 7,
        getProgress: (stats) => Math.min((stats.currentStreak / 7) * 100, 100),
    },
    {
        id: 'perfect-day',
        title: 'Perfect Day',
        description: 'Complete 8 or more sessions in one day',
        icon: '💯',
        category: 'beginner',
        checkUnlock: (stats) => stats.todaySessions >= 8,
        getProgress: (stats) => Math.min((stats.todaySessions / 8) * 100, 100),
    },

    // === CONSISTENCY === (6 achievements)
    {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🌟',
        category: 'consistency',
        checkUnlock: (stats) => stats.currentStreak >= 7,
        getProgress: (stats) => Math.min((stats.currentStreak / 7) * 100, 100),
    },
    {
        id: 'two-weeks-strong',
        title: 'Two Weeks Strong',
        description: 'Maintain a 14-day streak',
        icon: '💪',
        category: 'consistency',
        checkUnlock: (stats) => stats.currentStreak >= 14,
        getProgress: (stats) => Math.min((stats.currentStreak / 14) * 100, 100),
    },
    {
        id: 'month-master',
        title: 'Month Master',
        description: 'Maintain a 30-day streak',
        icon: '🏆',
        category: 'consistency',
        checkUnlock: (stats) => stats.currentStreak >= 30,
        getProgress: (stats) => Math.min((stats.currentStreak / 30) * 100, 100),
    },
    {
        id: 'two-month-champion',
        title: 'Two Month Champion',
        description: 'Maintain a 60-day streak',
        icon: '👑',
        category: 'consistency',
        checkUnlock: (stats) => stats.currentStreak >= 60,
        getProgress: (stats) => Math.min((stats.currentStreak / 60) * 100, 100),
    },
    {
        id: '100-day-rocket',
        title: '100 Day Rocket',
        description: 'Maintain a 100-day streak',
        icon: '🚀',
        category: 'consistency',
        checkUnlock: (stats) => stats.currentStreak >= 100,
        getProgress: (stats) => Math.min((stats.currentStreak / 100) * 100, 100),
    },
    {
        id: 'year-legend',
        title: 'Year Legend',
        description: 'Maintain a 365-day streak',
        icon: '⭐',
        category: 'consistency',
        checkUnlock: (stats) => stats.currentStreak >= 365,
        getProgress: (stats) => Math.min((stats.currentStreak / 365) * 100, 100),
    },

    // === MILESTONES === (8 achievements)
    {
        id: 'novice',
        title: 'Novice',
        description: 'Complete 10 total sessions',
        icon: '🎓',
        category: 'milestone',
        checkUnlock: (stats) => stats.totalSessions >= 10,
        getProgress: (stats) => Math.min((stats.totalSessions / 10) * 100, 100),
    },
    {
        id: 'scholar',
        title: 'Scholar',
        description: 'Complete 25 total sessions',
        icon: '📚',
        category: 'milestone',
        checkUnlock: (stats) => stats.totalSessions >= 25,
        getProgress: (stats) => Math.min((stats.totalSessions / 25) * 100, 100),
    },
    {
        id: 'apprentice',
        title: 'Apprentice',
        description: 'Complete 50 total sessions',
        icon: '🎖️',
        category: 'milestone',
        checkUnlock: (stats) => stats.totalSessions >= 50,
        getProgress: (stats) => Math.min((stats.totalSessions / 50) * 100, 100),
    },
    {
        id: 'professional',
        title: 'Professional',
        description: 'Complete 100 total sessions',
        icon: '💼',
        category: 'milestone',
        checkUnlock: (stats) => stats.totalSessions >= 100,
        getProgress: (stats) => Math.min((stats.totalSessions / 100) * 100, 100),
    },
    {
        id: 'expert',
        title: 'Expert',
        description: 'Complete 250 total sessions',
        icon: '🌠',
        category: 'milestone',
        checkUnlock: (stats) => stats.totalSessions >= 250,
        getProgress: (stats) => Math.min((stats.totalSessions / 250) * 100, 100),
    },
    {
        id: 'master',
        title: 'Master',
        description: 'Complete 500 total sessions',
        icon: '🎯',
        category: 'milestone',
        checkUnlock: (stats) => stats.totalSessions >= 500,
        getProgress: (stats) => Math.min((stats.totalSessions / 500) * 100, 100),
    },
    {
        id: 'grandmaster',
        title: 'Grandmaster',
        description: 'Complete 1000 total sessions',
        icon: '👨‍🎓',
        category: 'milestone',
        checkUnlock: (stats) => stats.totalSessions >= 1000,
        getProgress: (stats) => Math.min((stats.totalSessions / 1000) * 100, 100),
    },
    {
        id: 'legend',
        title: 'Legend',
        description: 'Complete 2500 total sessions',
        icon: '🏅',
        category: 'milestone',
        checkUnlock: (stats) => stats.totalSessions >= 2500,
        getProgress: (stats) => Math.min((stats.totalSessions / 2500) * 100, 100),
    },


];

// Initialize achievements from definitions
function initializeAchievements(): Achievement[] {
    return ACHIEVEMENT_DEFINITIONS.map(def => ({
        id: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        unlocked: false,
    }));
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
    achievements: [],
    newlyUnlocked: [],
    isLoading: false,

    loadAchievements: async () => {
        set({ isLoading: true });
        try {
            const saved = await getAllAchievements();

            if (saved.length === 0) {
                // First time - initialize with all achievements locked
                const initial = initializeAchievements();
                await saveAllAchievements(initial);
                set({ achievements: initial });
            } else {
                // Merge saved achievements with definitions (in case new achievements were added)
                const achievementMap = new Map(saved.map(a => [a.id, a]));
                const merged = ACHIEVEMENT_DEFINITIONS.map(def => {
                    const existing = achievementMap.get(def.id);
                    return existing || {
                        id: def.id,
                        title: def.title,
                        description: def.description,
                        icon: def.icon,
                        unlocked: false,
                    };
                });
                set({ achievements: merged });

                // Save any new achievements
                if (merged.length > saved.length) {
                    await saveAllAchievements(merged);
                }
            }
        } catch (error) {
            console.error('Failed to load achievements:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    checkAchievements: (stats: Stats, sessions: Session[]) => {
        const { achievements } = get();
        const newlyUnlocked: string[] = [];
        const updated = achievements.map(achievement => {
            // Already unlocked, skip
            if (achievement.unlocked) return achievement;

            // Find definition
            const def = ACHIEVEMENT_DEFINITIONS.find(d => d.id === achievement.id);
            if (!def) return achievement;

            // Check if should be unlocked
            if (def.checkUnlock(stats, sessions)) {
                newlyUnlocked.push(achievement.id);
                return {
                    ...achievement,
                    unlocked: true,
                    unlockedAt: new Date(),
                };
            }

            return achievement;
        });

        if (newlyUnlocked.length > 0) {
            set({ achievements: updated, newlyUnlocked });
            // Persist to database
            saveAllAchievements(updated).catch(err =>
                console.error('Failed to save achievements:', err)
            );
        }
    },

    clearNewlyUnlocked: () => set({ newlyUnlocked: [] }),
}));

// Export achievement definitions for UI to calculate progress
export { ACHIEVEMENT_DEFINITIONS };
