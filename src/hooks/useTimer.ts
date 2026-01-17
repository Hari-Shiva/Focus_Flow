import { useEffect, useRef } from 'react';
import { useTimerStore } from '../stores/timerStore';
import { useHabitStore } from '../stores/habitStore';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { useLevelStore } from '../stores/levelStore';
import { useQuestStore } from '../stores/questStore';
import { sendNotification } from '../utils/notifications';
import { playNotificationSound } from '../utils/audio';

export function useTimer() {
    const intervalRef = useRef<number | null>(null);
    const prevTimeRef = useRef<number>(0);

    const {
        timeRemaining,
        isRunning,
        mode,
        tick,
        settings,
        completeSession
    } = useTimerStore();

    const { addSession } = useAnalyticsStore();
    const { addXP } = useLevelStore();
    const { saveSession } = useHabitStore();

    // Main timer loop
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = window.setInterval(() => {
                tick();
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, tick]);

    // Handle session completion
    useEffect(() => {
        // Session just completed (time went from 1 to 0)
        if (prevTimeRef.current === 1 && timeRemaining === 0) {
            // Play sound if enabled
            if (settings.soundEnabled) {
                playNotificationSound('complete');
            }

            // Send notification
            sendNotification(mode);

            // Calculate exact times
            const durationMinutes = mode === 'work' ? settings.workDuration :
                mode === 'break' ? settings.shortBreakDuration :
                    settings.longBreakDuration;

            const endTime = Date.now();
            const startTime = endTime - durationMinutes * 60 * 1000;

            if (mode === 'work') {
                // Award XP (1 minute = 1 XP)
                // Calculate multiplier based on streak
                const streak = useHabitStore.getState().stats.currentStreak;
                let multiplier = 1;
                if (streak >= 7) multiplier = 1.5;
                else if (streak >= 3) multiplier = 1.2;

                const { leveledUp, newLevel } = addXP(durationMinutes, multiplier);

                if (leveledUp) {
                    // TODO: Trigger special level up notification
                    console.log(`Leveled up to ${newLevel}!`);
                }

                // Update quest progress
                useQuestStore.getState().updateProgress('sessions', 1);
                useQuestStore.getState().updateProgress('minutes', durationMinutes);
            }

            // 1. Analytics Store (for charts)
            addSession({
                startTime,
                endTime,
                duration: durationMinutes,
                mode,
                completed: true,
                taskId: useTimerStore.getState().activeTaskId || undefined
            });

            // 2. Habit Store (legacy/database)
            saveSession({
                date: new Date(),
                duration: durationMinutes * 60,
                type: mode,
                completed: true,
            });

            // Transition to next session after a delay
            setTimeout(() => {
                completeSession();
            }, 1000);
        }

        prevTimeRef.current = timeRemaining;
    }, [timeRemaining, mode, saveSession, settings, addSession, addXP, completeSession]);
}
