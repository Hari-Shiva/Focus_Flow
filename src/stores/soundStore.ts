import { create } from 'zustand';
import type { SoundType, SoundSettings } from '../types';

interface SoundState {
    volumes: SoundSettings;
    masterVolume: number;
    isPlaying: boolean;
    activePreset: string | null;

    // Actions
    setVolume: (sound: SoundType, volume: number) => void;
    setMasterVolume: (volume: number) => void;
    toggleSound: (sound: SoundType) => void;
    toggleAllSounds: () => void;
    applyPreset: (presetId: string) => void;
    loadSettings: () => void;
}

const DEFAULT_VOLUMES: SoundSettings = {
    rain: 0,
    forest: 0,
    cafe: 0,
    ocean: 0,
    fireplace: 0,
    whitenoise: 0,
    thunder: 0,
    birds: 0,
    lofi: 0,
    library: 0,
};

const PRESETS: Record<string, SoundSettings> = {
    'deep-focus': { ...DEFAULT_VOLUMES, whitenoise: 0.5, fireplace: 0.2 },
    'rainy-cafe': { ...DEFAULT_VOLUMES, rain: 0.6, cafe: 0.4, thunder: 0.2 },
    'nature-zen': { ...DEFAULT_VOLUMES, forest: 0.5, birds: 0.4, ocean: 0.3 },
    'study-lofi': { ...DEFAULT_VOLUMES, lofi: 0.6, library: 0.2 },
    'stormy-night': { ...DEFAULT_VOLUMES, rain: 0.7, thunder: 0.5, fireplace: 0.3 },
};

export const useSoundStore = create<SoundState>((set, get) => ({
    volumes: DEFAULT_VOLUMES,
    masterVolume: 0.7,
    isPlaying: false,
    activePreset: null,

    setVolume: (sound, volume) => {
        const newVolumes = { ...get().volumes, [sound]: volume };
        set({ volumes: newVolumes, activePreset: null }); // Custom changes clear preset

        // Save to localStorage
        localStorage.setItem('soundVolumes', JSON.stringify(newVolumes));

        // Update playing state
        const hasActiveSound = Object.values(newVolumes).some(v => v > 0);
        set({ isPlaying: hasActiveSound });
    },

    setMasterVolume: (volume) => {
        set({ masterVolume: volume });
        localStorage.setItem('masterVolume', volume.toString());
    },

    toggleSound: (sound) => {
        const currentVolume = get().volumes[sound];
        get().setVolume(sound, currentVolume > 0 ? 0 : 0.5);
    },

    applyPreset: (presetId) => {
        const preset = PRESETS[presetId];
        if (preset) {
            set({ volumes: preset, activePreset: presetId, isPlaying: true });
            localStorage.setItem('soundVolumes', JSON.stringify(preset));
        }
    },

    toggleAllSounds: () => {
        const { isPlaying, volumes } = get();

        if (isPlaying) {
            // Mute all
            const muted = Object.keys(volumes).reduce((acc, key) => {
                acc[key] = 0;
                return acc;
            }, {} as SoundSettings);
            set({ volumes: muted, isPlaying: false });
        } else {
            // Set to default levels
            const unmuted: SoundSettings = {
                rain: 0.4,
                forest: 0.3,
                cafe: 0,
                ocean: 0.3,
                fireplace: 0,
                whitenoise: 0,
                thunder: 0,
                birds: 0.2,
                lofi: 0,
                library: 0,
            };
            set({ volumes: unmuted, isPlaying: true });
        }
    },

    loadSettings: () => {
        const savedVolumes = localStorage.getItem('soundVolumes');
        const savedMaster = localStorage.getItem('masterVolume');

        if (savedVolumes) {
            const volumes = JSON.parse(savedVolumes);
            const hasActiveSound = Object.values(volumes).some((v: any) => v > 0);
            set({ volumes, isPlaying: hasActiveSound });
        }

        if (savedMaster) {
            set({ masterVolume: parseFloat(savedMaster) });
        }
    },
}));
