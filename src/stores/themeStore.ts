import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeId = 'default' | 'ocean' | 'forest' | 'sunset' | 'midnight' | 'oled';

export interface ThemeColors {
    text: string;
    ring: string; // Used for static referencing primarily
    gradients: {
        start: string;
        end: string;
        id: string; // SVG gradient ID
    };
    bg: string; // Tailwind class
}

export interface ThemeConfig {
    name: string;
    modes: {
        work: ThemeColors;
        break: ThemeColors;
        longBreak: ThemeColors;
    };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
    default: {
        name: 'Default',
        modes: {
            work: {
                text: 'text-indigo-600 dark:text-indigo-400',
                ring: 'stroke-indigo-500',
                gradients: { start: '#6366f1', end: '#a855f7', id: 'gradient-work-default' },
                bg: 'bg-indigo-500',
            },
            break: {
                text: 'text-emerald-600 dark:text-emerald-400',
                ring: 'stroke-emerald-500',
                gradients: { start: '#10b981', end: '#14b8a6', id: 'gradient-break-default' },
                bg: 'bg-emerald-500',
            },
            longBreak: {
                text: 'text-purple-600 dark:text-purple-400',
                ring: 'stroke-purple-500',
                gradients: { start: '#8b5cf6', end: '#d946ef', id: 'gradient-longBreak-default' },
                bg: 'bg-purple-500',
            },
        },
    },
    ocean: {
        name: 'Ocean',
        modes: {
            work: {
                text: 'text-blue-600 dark:text-blue-400',
                ring: 'stroke-blue-500',
                gradients: { start: '#3b82f6', end: '#06b6d4', id: 'gradient-work-ocean' },
                bg: 'bg-blue-500',
            },
            break: {
                text: 'text-cyan-600 dark:text-cyan-400',
                ring: 'stroke-cyan-500',
                gradients: { start: '#06b6d4', end: '#22d3ee', id: 'gradient-break-ocean' },
                bg: 'bg-cyan-500',
            },
            longBreak: {
                text: 'text-sky-600 dark:text-sky-400',
                ring: 'stroke-sky-500',
                gradients: { start: '#0ea5e9', end: '#38bdf8', id: 'gradient-longBreak-ocean' },
                bg: 'bg-sky-500',
            },
        },
    },
    forest: {
        name: 'Forest',
        modes: {
            work: {
                text: 'text-green-600 dark:text-green-400',
                ring: 'stroke-green-500',
                gradients: { start: '#22c55e', end: '#10b981', id: 'gradient-work-forest' },
                bg: 'bg-green-500',
            },
            break: {
                text: 'text-lime-600 dark:text-lime-400',
                ring: 'stroke-lime-500',
                gradients: { start: '#84cc16', end: '#bef264', id: 'gradient-break-forest' },
                bg: 'bg-lime-500',
            },
            longBreak: {
                text: 'text-emerald-600 dark:text-emerald-400',
                ring: 'stroke-emerald-500',
                gradients: { start: '#10b981', end: '#34d399', id: 'gradient-longBreak-forest' },
                bg: 'bg-emerald-500',
            },
        },
    },
    sunset: {
        name: 'Sunset',
        modes: {
            work: {
                text: 'text-orange-600 dark:text-orange-400',
                ring: 'stroke-orange-500',
                gradients: { start: '#f97316', end: '#f43f5e', id: 'gradient-work-sunset' },
                bg: 'bg-orange-500',
            },
            break: {
                text: 'text-amber-600 dark:text-amber-400',
                ring: 'stroke-amber-500',
                gradients: { start: '#f59e0b', end: '#fbbf24', id: 'gradient-break-sunset' },
                bg: 'bg-amber-500',
            },
            longBreak: {
                text: 'text-rose-600 dark:text-rose-400',
                ring: 'stroke-rose-500',
                gradients: { start: '#f43f5e', end: '#e11d48', id: 'gradient-longBreak-sunset' },
                bg: 'bg-rose-500',
            },
        },
    },
    midnight: {
        name: 'Midnight',
        modes: {
            work: {
                text: 'text-violet-600 dark:text-violet-400',
                ring: 'stroke-violet-500',
                gradients: { start: '#8b5cf6', end: '#6366f1', id: 'gradient-work-midnight' },
                bg: 'bg-violet-500',
            },
            break: {
                text: 'text-indigo-600 dark:text-indigo-400',
                ring: 'stroke-indigo-500',
                gradients: { start: '#6366f1', end: '#4f46e5', id: 'gradient-break-midnight' },
                bg: 'bg-indigo-500',
            },
            longBreak: {
                text: 'text-slate-600 dark:text-slate-400',
                ring: 'stroke-slate-500',
                gradients: { start: '#64748b', end: '#94a3b8', id: 'gradient-longBreak-midnight' },
                bg: 'bg-slate-500',
            },
        },
    },
    oled: {
        name: 'OLED Black',
        modes: {
            work: {
                text: 'text-white',
                ring: 'stroke-white',
                gradients: { start: '#ffffff', end: '#a1a1aa', id: 'gradient-work-oled' },
                bg: 'bg-white',
            },
            break: {
                text: 'text-emerald-400',
                ring: 'stroke-emerald-400',
                gradients: { start: '#34d399', end: '#10b981', id: 'gradient-break-oled' },
                bg: 'bg-emerald-400',
            },
            longBreak: {
                text: 'text-purple-400',
                ring: 'stroke-purple-400',
                gradients: { start: '#c084fc', end: '#a855f7', id: 'gradient-longBreak-oled' },
                bg: 'bg-purple-400',
            },
        },
    },
};

interface ThemeState {
    currentTheme: ThemeId;
    setTheme: (theme: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            currentTheme: 'default',
            setTheme: (theme) => set({ currentTheme: theme }),
        }),
        {
            name: 'theme-storage',
        }
    )
);
