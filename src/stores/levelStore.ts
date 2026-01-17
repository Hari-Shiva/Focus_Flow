import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LevelState {
    xp: number;
    level: number;
    // Calculate stats
    totalXP: number; // Cumulative helpful for leaderboard later
    streakShields: number;

    // Actions
    addXP: (amount: number, multiplier?: number) => { leveledUp: boolean; newLevel: number };
    resetProgress: () => void;
    addShield: (amount?: number) => void;
    useShield: () => boolean;
}

// XP required to reach next level: Level * 100 * 1.5
// Lvl 1 -> 2: 150 XP
// Lvl 2 -> 3: 300 XP (Total 450)
// Lvl 3 -> 4: 450 XP (Total 900)
export const getNextLevelXP = (level: number) => Math.floor(level * 100 * 1.5);

export const useLevelStore = create<LevelState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            totalXP: 0,

            streakShields: 0,

            addXP: (amount, multiplier = 1) => {
                const { xp, level, totalXP } = get();
                // Apply multiplier
                const finalAmount = Math.round(amount * multiplier);

                let currentXP = xp + finalAmount;
                let currentLevel = level;
                let leveledUp = false;
                let needed = getNextLevelXP(currentLevel);

                // Handle multiple level ups
                while (currentXP >= needed) {
                    currentXP -= needed;
                    currentLevel++;
                    leveledUp = true;
                    needed = getNextLevelXP(currentLevel);
                }

                // Award shield every 5 levels
                let newShields = get().streakShields;
                if (leveledUp && currentLevel % 5 === 0) {
                    newShields += 1;
                }

                set({
                    xp: currentXP,
                    level: currentLevel,
                    totalXP: totalXP + finalAmount,
                    streakShields: newShields
                });

                return { leveledUp, newLevel: currentLevel };
            },

            addShield: (amount = 1) => set((state) => ({ streakShields: state.streakShields + amount })),

            useShield: () => {
                const { streakShields } = get();
                if (streakShields > 0) {
                    set({ streakShields: streakShields - 1 });
                    return true;
                }
                return false;
            },

            resetProgress: () => set({ xp: 0, level: 1, totalXP: 0, streakShields: 0 }),
        }),
        {
            name: 'level-storage',
        }
    )
);
