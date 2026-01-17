import { useEffect, useRef } from 'react';
import { useTimerStore } from '../stores/timerStore';
import { useNotifications } from './useNotifications';
import { useToast } from '../components/shared/ToastProvider';

export function useWellness() {
    const { isRunning, mode, settings } = useTimerStore();
    const { sendNotification } = useNotifications();
    const { showToast } = useToast();

    // Track continuous focus time in minutes
    const focusMinutesRef = useRef(0);
    const lastTickRef = useRef(Date.now());

    useEffect(() => {
        if (!isRunning || mode !== 'work') {
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            // Approximating minute counter based on real time to avoid reliance solely on timer tick
            if (now - lastTickRef.current >= 60000) {
                focusMinutesRef.current += 1;
                lastTickRef.current = now;
                checkWellness(focusMinutesRef.current);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, mode]);

    // Reset counter on mode change
    useEffect(() => {
        if (mode !== 'work') {
            focusMinutesRef.current = 0;
            lastTickRef.current = Date.now();
        }
    }, [mode]);

    const checkWellness = (minutes: number) => {
        // Stretch every 25 mins
        if (settings.stretchEnabled && minutes > 0 && minutes % 25 === 0) {
            triggerReminder(
                'Time to Stretch! 🧘',
                'Take a quick stretch to release tension.'
            );
        }

        // Hydrate every 45 mins
        if (settings.hydrationEnabled && minutes > 0 && minutes % 45 === 0) {
            triggerReminder(
                'Hydration Check 💧',
                'Have a sip of water to stay fresh.'
            );
        }
    };

    const triggerReminder = (title: string, body: string) => {
        // Desktop notification
        sendNotification(title, { body });

        // In-app toast
        showToast(title, 'info'); // Using info type for now, 'success' typically used elsewhere
    };
}
