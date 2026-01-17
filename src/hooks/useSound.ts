import { useEffect, useRef } from 'react';
import { useSoundStore } from '../stores/soundStore';
import type { SoundType } from '../types';

// Map sound types to file paths
const SOUND_FILES: Record<SoundType, string> = {
    rain: '/sounds/Rain.mp3',
    thunder: '/sounds/Thunder.mp3',
    forest: '/sounds/Forest.mp3',
    birds: '/sounds/Birds.mp3',
    cafe: '/sounds/Cafe.mp3',
    ocean: '/sounds/Ocean.mp3',
    fireplace: '/sounds/Fireplace.mp3',
    whitenoise: '/sounds/White Noise.mp3',
    lofi: '/sounds/Lo-Fi.mp3',
    library: '/sounds/Library.mp3',
};

export function useSound() {
    const audioRef = useRef<Map<SoundType, HTMLAudioElement>>(new Map());
    const { volumes, masterVolume } = useSoundStore();

    // Initialize audio elements
    useEffect(() => {
        const soundTypes: SoundType[] = [
            'rain',
            'forest',
            'cafe',
            'ocean',
            'fireplace',
            'whitenoise',
            'thunder',
            'birds',
            'lofi',
            'library',
        ];

        soundTypes.forEach((type) => {
            if (!audioRef.current.has(type)) {
                const audio = new Audio(SOUND_FILES[type]);
                audio.loop = true; // Enable continuous looping
                audio.preload = 'auto';
                audioRef.current.set(type, audio);
            }
        });

        return () => {
            // Cleanup: stop and remove all audio elements
            audioRef.current.forEach((audio) => {
                audio.pause();
                audio.src = '';
            });
            audioRef.current.clear();
        };
    }, []);

    // Handle playback and volume changes
    useEffect(() => {
        const soundTypes: SoundType[] = [
            'rain',
            'forest',
            'cafe',
            'ocean',
            'fireplace',
            'whitenoise',
            'thunder',
            'birds',
            'lofi',
            'library',
        ];

        soundTypes.forEach((type) => {
            const audio = audioRef.current.get(type);
            if (!audio) return;

            const targetVolume = (volumes[type] || 0) * masterVolume;

            // Set volume (clamped between 0 and 1)
            audio.volume = Math.max(0, Math.min(1, targetVolume));

            // Play or pause based on volume
            if (targetVolume > 0.01) {
                // Only play if not already playing
                if (audio.paused) {
                    audio.play().catch((err) => {
                        // Handle autoplay policy restrictions
                        console.warn(`Failed to play ${type}:`, err);
                    });
                }
            } else {
                // Pause when volume is 0
                if (!audio.paused) {
                    audio.pause();
                    audio.currentTime = 0; // Reset to beginning
                }
            }
        });
    }, [volumes, masterVolume]);

    return null; // Hook doesn't need to return controls, store handles it
}
