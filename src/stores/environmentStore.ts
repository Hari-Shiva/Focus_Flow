import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EnvironmentState {
    energy: number; // 0-100 per stage
    stage: 0 | 1 | 2 | 3 | 4; // Barren(0) → Budding(1) → Flourishing(2) → Vibrant(3) → Legendary(4)
    totalFocusMinutes: number; // Lifetime focus time
    unlockedThemes: string[];
    selectedTheme: string;
}

interface EnvironmentActions {
    addEnergy: (minutes: number) => void;
    setTheme: (theme: string) => void;
    unlockTheme: (theme: string) => void;
    reset: () => void;
}

// Stage thresholds in total focus minutes
const STAGE_THRESHOLDS = [
    { stage: 0, name: 'Barren', minMinutes: 0 },
    { stage: 1, name: 'Budding', minMinutes: 500 },
    { stage: 2, name: 'Flourishing', minMinutes: 1500 },
    { stage: 3, name: 'Vibrant', minMinutes: 3500 },
    { stage: 4, name: 'Legendary', minMinutes: 7000 },
] as const;

export function getStageInfo(totalMinutes: number) {
    // Find current stage
    let currentStage = 0;
    let nextStage = 1;

    for (let i = STAGE_THRESHOLDS.length - 1; i >= 0; i--) {
        if (totalMinutes >= STAGE_THRESHOLDS[i].minMinutes) {
            currentStage = STAGE_THRESHOLDS[i].stage;
            nextStage = Math.min(i + 1, STAGE_THRESHOLDS.length - 1);
            break;
        }
    }

    const currentThreshold = STAGE_THRESHOLDS[currentStage];
    const nextThreshold = STAGE_THRESHOLDS[nextStage];

    // Calculate progress within current stage
    const stageStart = currentThreshold.minMinutes;
    const stageEnd = nextThreshold.minMinutes;
    const stageRange = stageEnd - stageStart;
    const stageProgress = stageRange > 0 ? Math.min(100, ((totalMinutes - stageStart) / stageRange) * 100) : 100;

    return {
        stage: currentStage as 0 | 1 | 2 | 3 | 4,
        stageName: currentThreshold.name,
        progress: Math.round(stageProgress),
        minutesUntilNext: currentStage === 4 ? 0 : Math.max(0, stageEnd - totalMinutes),
        nextStageName: currentStage === 4 ? 'MAX' : nextThreshold.name,
    };
}

const initialState: EnvironmentState = {
    energy: 0,
    stage: 0,
    totalFocusMinutes: 0,
    unlockedThemes: ['default'],
    selectedTheme: 'default',
};

export const useEnvironmentStore = create<EnvironmentState & EnvironmentActions>()(
    persist(
        (set, get) => ({
            ...initialState,

            addEnergy: (minutes: number) => {
                const { totalFocusMinutes } = get();
                const newTotal = totalFocusMinutes + minutes;
                const oldStageInfo = getStageInfo(totalFocusMinutes);
                const newStageInfo = getStageInfo(newTotal);

                set({
                    totalFocusMinutes: newTotal,
                    energy: newStageInfo.progress,
                    stage: newStageInfo.stage,
                });

                // Check if stage up occurred
                if (newStageInfo.stage > oldStageInfo.stage) {
                    // Stage up! Could trigger notification here
                    console.log(`🎉 Environment evolved to ${newStageInfo.stageName}!`);
                }
            },

            setTheme: (theme: string) => {
                const { unlockedThemes } = get();
                if (unlockedThemes.includes(theme)) {
                    set({ selectedTheme: theme });
                }
            },

            unlockTheme: (theme: string) => {
                const { unlockedThemes } = get();
                if (!unlockedThemes.includes(theme)) {
                    set({ unlockedThemes: [...unlockedThemes, theme] });
                }
            },

            reset: () => set(initialState),
        }),
        {
            name: 'environment-storage',
        }
    )
);
