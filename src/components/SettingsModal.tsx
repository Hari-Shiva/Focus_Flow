import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, RotateCcw, Volume2, Play, Check, Activity, Settings, Layout, Download, Upload, Trash2 } from 'lucide-react';
import { useTimerStore } from '../stores/timerStore';
import { useThemeStore, THEMES, type ThemeId } from '../stores/themeStore';
import { useSoundStore } from '../stores/soundStore';
import { useLevelStore } from '../stores/levelStore';
import { useHabitStore } from '../stores/habitStore';
import { useAchievementStore } from '../stores/achievementStore';
import { useAnalyticsStore } from '../stores/analyticsStore';
import { playNotificationSound } from '../utils/audio';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'general' | 'sounds' | 'wellness' | 'appearance' | 'data';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { settings, updateSettings, resetSettings } = useTimerStore();
    const { currentTheme, setTheme } = useThemeStore();
    const { masterVolume, setMasterVolume } = useSoundStore();
    const [activeTab, setActiveTab] = useState<Tab>('general');

    const modalRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    const containerVariants = {
        hidden: { x: '100%', opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
        exit: { x: '100%', opacity: 0 }
    };

    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'sounds', label: 'Sounds', icon: Volume2 },
        { id: 'wellness', label: 'Wellness', icon: Activity },
        { id: 'appearance', label: 'Appearance', icon: Layout },
        { id: 'data', label: 'Data', icon: Download },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Settings Panel */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        ref={modalRef}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800">
                            <h2 className="text-2xl font-bold">Settings</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                                aria-label="Close settings"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex px-6 border-b border-stone-100 dark:border-stone-800 overflow-x-auto no-scrollbar" role="tablist">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as Tab)}
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">

                            {/* General Tab */}
                            {activeTab === 'general' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    {/* Focus Duration */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-indigo-500">
                                            <Clock className="w-5 h-5" />
                                            <h3 className="font-semibold">Timer Intervals</h3>
                                        </div>

                                        {/* Work */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Focus Duration</span>
                                                <span className="font-mono">{settings.workDuration}m</span>
                                            </div>
                                            <input
                                                type="range" min="1" max="120"
                                                value={settings.workDuration}
                                                onChange={(e) => updateSettings({ workDuration: parseInt(e.target.value) })}
                                                className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                                aria-label="Focus duration in minutes"
                                            />
                                        </div>

                                        {/* Short Break */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Short Break</span>
                                                <span className="font-mono">{settings.shortBreakDuration}m</span>
                                            </div>
                                            <input
                                                type="range" min="1" max="30"
                                                value={settings.shortBreakDuration}
                                                onChange={(e) => updateSettings({ shortBreakDuration: parseInt(e.target.value) })}
                                                className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                                aria-label="Short break duration in minutes"
                                            />
                                        </div>

                                        {/* Long Break */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Long Break</span>
                                                <span className="font-mono">{settings.longBreakDuration}m</span>
                                            </div>
                                            <input
                                                type="range" min="1" max="60"
                                                value={settings.longBreakDuration}
                                                onChange={(e) => updateSettings({ longBreakDuration: parseInt(e.target.value) })}
                                                className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                                aria-label="Long break duration in minutes"
                                            />
                                        </div>

                                        {/* Long Break Interval */}
                                        <div className="space-y-2 pt-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Long Break Interval</span>
                                                <span>Every {settings.longBreakInterval} sessions</span>
                                            </div>
                                            <input
                                                type="range" min="1" max="10"
                                                value={settings.longBreakInterval}
                                                onChange={(e) => updateSettings({ longBreakInterval: parseInt(e.target.value) })}
                                                className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                                                aria-label="Sessions before long break"
                                            />
                                        </div>
                                    </div>

                                    <div className="h-px bg-stone-100 dark:bg-stone-800" />

                                    {/* Auto-start Toggles */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Auto-start Breaks</span>
                                            <button
                                                onClick={() => updateSettings({ autoStartBreaks: !settings.autoStartBreaks })}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoStartBreaks ? 'bg-indigo-500' : 'bg-stone-200 dark:bg-stone-700'}`}
                                                aria-pressed={settings.autoStartBreaks}
                                                aria-label="Toggle auto-start breaks"
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoStartBreaks ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Auto-start Pomodoros</span>
                                            <button
                                                onClick={() => updateSettings({ autoStartPomodoros: !settings.autoStartPomodoros })}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoStartPomodoros ? 'bg-indigo-500' : 'bg-stone-200 dark:bg-stone-700'}`}
                                                aria-pressed={settings.autoStartPomodoros}
                                                aria-label="Toggle auto-start pomodoros"
                                            >
                                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoStartPomodoros ? 'translate-x-6' : 'translate-x-1'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sounds Tab */}
                            {activeTab === 'sounds' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    {/* Master Volume */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">Master Volume</h3>
                                            <span className="text-sm font-mono">{Math.round(masterVolume * 100)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.01"
                                            value={masterVolume}
                                            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                                            className="w-full h-2 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                            aria-label="Master volume"
                                        />
                                    </div>

                                    <div className="h-px bg-stone-100 dark:bg-stone-800" />

                                    {/* Notifications */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="font-medium">Timer Completion Chime</div>
                                                <div className="text-xs text-stone-500">Sound when timer ends</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => playNotificationSound('complete')}
                                                    className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-indigo-500 transition-colors"
                                                >
                                                    <Play className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.soundEnabled ? 'bg-indigo-500' : 'bg-stone-200 dark:bg-stone-700'}`}
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Wellness Tab */}
                            {activeTab === 'wellness' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 text-sm">
                                        <p className="font-medium mb-1">Wellness Coach 🧘</p>
                                        <p className="opacity-80">Reminders are active during Focus sessions only.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-stone-900 dark:text-stone-100">Stretch Reminders</h3>
                                                <p className="text-sm text-stone-500">Get a notification to stretch every 25 mins</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateSettings({ stretchEnabled: !settings.stretchEnabled })}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.stretchEnabled ? 'bg-indigo-500' : 'bg-stone-200 dark:bg-stone-700'}`}
                                                    aria-pressed={settings.stretchEnabled}
                                                    aria-label="Toggle stretch reminders"
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.stretchEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-medium text-stone-900 dark:text-stone-100">Hydration Reminders</h3>
                                                <p className="text-sm text-stone-500">Remind me to drink water every 45 mins</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateSettings({ hydrationEnabled: !settings.hydrationEnabled })}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.hydrationEnabled ? 'bg-indigo-500' : 'bg-stone-200 dark:bg-stone-700'}`}
                                                    aria-pressed={settings.hydrationEnabled}
                                                    aria-label="Toggle hydration reminders"
                                                >
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.hydrationEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Appearance Tab */}
                            {activeTab === 'appearance' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Color Theme</h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            {Object.entries(THEMES).map(([id, theme]) => (
                                                <button
                                                    key={id}
                                                    onClick={() => setTheme(id as ThemeId)}
                                                    className={`
                                            group relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all
                                            ${currentTheme === id
                                                            ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800'
                                                            : 'border-transparent bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800'
                                                        }
                                        `}
                                                >
                                                    <div className={`w-12 h-12 rounded-full shadow-sm flex items-center justify-center ${theme.modes.work.bg}`}>
                                                        {currentTheme === id && (
                                                            <Check className="w-6 h-6 text-white" strokeWidth={3} />
                                                        )}
                                                    </div>
                                                    <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                                                        {theme.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Data Tab */}
                            {activeTab === 'data' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 space-y-3">
                                        <h3 className="font-semibold text-indigo-900 dark:text-indigo-300">Backup & Restore</h3>
                                        <p className="text-sm text-indigo-700 dark:text-indigo-400">
                                            Export your data to a JSON file to keep it safe or transfer to another device.
                                        </p>
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => {
                                                    const data = {
                                                        timer: useTimerStore.getState(),
                                                        habits: useHabitStore.getState(),
                                                        theme: useThemeStore.getState(),
                                                        sound: useSoundStore.getState(),
                                                        level: useLevelStore.getState(),
                                                        achievements: useAchievementStore.getState(),
                                                        analytics: useAnalyticsStore.getState(),
                                                        timestamp: new Date().toISOString()
                                                    };
                                                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                                    const url = URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    a.download = `focus-flow-backup-${new Date().toISOString().split('T')[0]}.json`;
                                                    document.body.appendChild(a);
                                                    a.click();
                                                    document.body.removeChild(a);
                                                    URL.revokeObjectURL(url);
                                                }}
                                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2"
                                            >
                                                <Download className="w-4 h-4" /> Export Data
                                            </button>
                                            <label className="px-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-sm font-medium rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 cursor-pointer shadow-sm transition-colors flex items-center gap-2">
                                                <Upload className="w-4 h-4" /> Import Data
                                                <input
                                                    type="file"
                                                    accept=".json"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (!file) return;
                                                        const reader = new FileReader();
                                                        reader.onload = (event) => {
                                                            try {
                                                                const data = JSON.parse(event.target?.result as string);
                                                                // Basic validation
                                                                if (data.timestamp) {
                                                                    if (confirm('This will overwrite your current data. Are you sure?')) {
                                                                        alert('Import feature coming soon! (For safety, manual restore currently required)');
                                                                    }
                                                                }
                                                            } catch (err) {
                                                                alert('Invalid backup file');
                                                            }
                                                        };
                                                        reader.readAsText(file);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                                        <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
                                                    resetSettings();
                                                    useLevelStore.getState().resetProgress();
                                                    // Add other resets...
                                                    window.location.reload();
                                                }
                                            }}
                                            className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" /> Reset All Data
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer (Reset) */}
                        <div className="p-6 border-t border-stone-100 dark:border-stone-800">
                            <button
                                onClick={resetSettings}
                                className="w-full py-3 flex items-center justify-center gap-2 text-stone-500 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset Settings to Defaults
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
