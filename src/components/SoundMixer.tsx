import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ChevronDown, ChevronUp } from 'lucide-react';
import { useSoundStore } from '../stores/soundStore';
import type { SoundType } from '../types';
import { useSound } from '../hooks/useSound';
import { SoundPresets } from './SoundPresets';

const SOUNDS: Array<{ type: SoundType; label: string; emoji: string }> = [
    { type: 'rain', label: 'Rain', emoji: '🌧️' },
    { type: 'thunder', label: 'Thunder', emoji: '⛈️' },
    { type: 'forest', label: 'Forest', emoji: '🌲' },
    { type: 'birds', label: 'Birds', emoji: '🐦' },
    { type: 'cafe', label: 'Café', emoji: '☕' },
    { type: 'ocean', label: 'Ocean', emoji: '🌊' },
    { type: 'fireplace', label: 'Fireplace', emoji: '🔥' },
    { type: 'whitenoise', label: 'White Noise', emoji: '📻' },
    { type: 'lofi', label: 'Lo-Fi', emoji: '🎵' },
    { type: 'library', label: 'Library', emoji: '📚' },
];

export function SoundMixer() {
    const [isExpanded, setIsExpanded] = useState(true);
    const { volumes, masterVolume, setVolume, setMasterVolume, isPlaying } = useSoundStore();

    // Initialize audio elements
    useSound();

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden"
        >
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                aria-expanded={isExpanded}
                aria-label="Toggle ambient sounds panel"
            >
                <div className="flex items-center gap-3">
                    {isPlaying ? (
                        <Volume2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                        <VolumeX className="w-5 h-5 text-stone-400" />
                    )}
                    <span className="font-semibold">Ambient Sounds</span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-stone-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-stone-400" />
                )}
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 pb-4 space-y-4"
                    >
                        {/* Presets */}
                        <SoundPresets />

                        {/* Master Volume */}
                        <div className="space-y-2 pb-4 border-b border-stone-200 dark:border-stone-800">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-stone-600 dark:text-stone-400">Master Volume</span>
                                <span className="text-stone-500 tabular-nums">{Math.round(masterVolume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={masterVolume}
                                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full appearance-none cursor-pointer accent-indigo-500"
                                aria-label="Master volume"
                            />
                        </div>

                        {/* Individual Sounds */}
                        <div className="grid grid-cols-2 gap-2">
                            {SOUNDS.map(({ type, label, emoji }) => {
                                const volume = volumes[type] || 0;
                                const isActive = volume > 0;

                                return (
                                    <div
                                        key={type}
                                        className={`p-3 rounded-xl transition-all ${isActive
                                            ? 'bg-indigo-50 dark:bg-indigo-950/50 ring-1 ring-indigo-200 dark:ring-indigo-800'
                                            : 'bg-stone-50 dark:bg-stone-800/50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm">{emoji}</span>
                                                <span className="text-xs font-medium">{label}</span>
                                            </div>
                                            <span className="text-xs text-stone-500 tabular-nums">
                                                {Math.round(volume * 100)}%
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={volume}
                                            onChange={(e) => setVolume(type, parseFloat(e.target.value))}
                                            className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full appearance-none cursor-pointer accent-indigo-500"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
