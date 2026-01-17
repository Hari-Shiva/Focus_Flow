import { useEffect, useCallback } from 'react';
import { useTimerStore } from '../stores/timerStore';
import { useSoundStore } from '../stores/soundStore';

interface KeyboardShortcuts {
    enabled?: boolean;
}

export function useKeyboardShortcuts({ enabled = true }: KeyboardShortcuts = {}) {
    const { isRunning, start, pause, reset, skip } = useTimerStore();
    const { masterVolume, setMasterVolume } = useSoundStore();

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Don't trigger shortcuts when typing in input fields
        if (
            event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement ||
            event.target instanceof HTMLSelectElement
        ) {
            return;
        }

        // Don't trigger on modifier key combos (except for our shortcuts)
        if (event.ctrlKey || event.altKey || event.metaKey) {
            return;
        }

        switch (event.code) {
            case 'Space':
                event.preventDefault();
                if (isRunning) {
                    pause();
                } else {
                    start();
                }
                break;

            case 'KeyR':
                event.preventDefault();
                reset();
                break;

            case 'KeyS':
                event.preventDefault();
                skip();
                break;

            case 'KeyM':
                event.preventDefault();
                // Toggle mute
                if (masterVolume > 0) {
                    setMasterVolume(0);
                } else {
                    setMasterVolume(0.5);
                }
                break;

            default:
                break;
        }
    }, [isRunning, start, pause, reset, skip, masterVolume, setMasterVolume]);

    useEffect(() => {
        if (!enabled) return;

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enabled, handleKeyDown]);

    return {
        shortcuts: [
            { key: 'Space', action: 'Play/Pause' },
            { key: 'R', action: 'Reset' },
            { key: 'S', action: 'Skip' },
            { key: 'M', action: 'Mute/Unmute' },
        ],
    };
}
