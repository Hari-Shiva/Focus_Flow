import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Moon, Sun, Clock, ArrowRight, Timer, Volume2, Target, Infinity, Sparkles, TrendingUp, Settings } from 'lucide-react';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { SessionStats } from './components/SessionStats';
import { SoundMixer } from './components/SoundMixer';
import { HabitTracker } from './components/HabitTracker';
import { Achievements } from './components/Achievements';
import { AchievementNotification } from './components/AchievementNotification';
import { TaskList } from './components/Tasks/TaskList';
import { SettingsModal } from './components/SettingsModal';
import { Onboarding } from './components/Onboarding';
import { BottomNav } from './components/BottomNav';
import { StartParticles } from './components/Animations/StartParticles';
import { ToastProvider } from './components/shared/ToastProvider';
import { ProfileSelector } from './components/ProfileSelector';
import { useTimer } from './hooks/useTimer';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useNotifications } from './hooks/useNotifications';
import { useWellness } from './hooks/useWellness';
import { useHabitStore } from './stores/habitStore';
import { useSoundStore } from './stores/soundStore';
import { useAchievementStore } from './stores/achievementStore';
import { useTimerStore } from './stores/timerStore';
import { useTaskStore } from './stores/taskStore';
import { initDatabase } from './db/database';
import GradientBackground from './components/Effects/GradientBackground';
import EnvironmentDisplay from './components/Effects/EnvironmentDisplay';

function AppContent() {
    const [isDark, setIsDark] = useState(false);
    const [isAppStarted, setIsAppStarted] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showStartParticles, setShowStartParticles] = useState(false);
    const [activeTab, setActiveTab] = useState<'timer' | 'tasks' | 'stats'>('timer');
    const { isRunning, mode } = useTimerStore(); // Need to access store directly for trigger logic

    const { loadSessions } = useHabitStore();
    const { loadSettings } = useSoundStore();
    const { loadAchievements } = useAchievementStore();
    const { loadTasks } = useTaskStore();
    const { requestPermission, permission } = useNotifications();

    // Initialize hooks
    useTimer();
    useKeyboardShortcuts({ enabled: isAppStarted });
    useWellness();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

        setIsDark(shouldBeDark);
        document.documentElement.classList.toggle('dark', shouldBeDark);

        // Check if user has previously started the app
        const hasStarted = localStorage.getItem('appStarted');
        if (hasStarted === 'true') {
            setIsAppStarted(true);
        }

        // Initialize database
        initDatabase().then(() => {
            loadSessions();
            loadSettings();
            loadAchievements();
            loadTasks();
        });

        // Request notification permission
        if (permission === 'default') {
            requestPermission();
        }
    }, [loadSessions, loadSettings, loadAchievements, loadTasks, permission, requestPermission]);

    // Handle start animation
    useEffect(() => {
        if (isRunning && mode === 'work') {
            setShowStartParticles(true);
            const timer = setTimeout(() => setShowStartParticles(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [isRunning, mode]);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        document.documentElement.classList.toggle('dark', newIsDark);
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    };

    const startApp = () => {
        setIsAppStarted(true);
        localStorage.setItem('appStarted', 'true');
    };

    const features = [
        {
            icon: Infinity,
            title: 'Infinite Sessions',
            description: 'Focus as long as you want with customizable Pomodoro timers',
            color: 'from-violet-500 to-purple-600',
        },
        {
            icon: Volume2,
            title: 'Ambient Sounds',
            description: 'Curated soundscapes to boost your concentration',
            color: 'from-cyan-500 to-blue-600',
        },
        {
            icon: Target,
            title: 'Habit Tracking',
            description: 'Build consistency with visual streaks and progress',
            color: 'from-emerald-500 to-teal-600',
        },
    ];

    const stats = [
        { value: '25+', label: 'Minutes per Session' },
        { value: '∞', label: 'Unlimited Focus' },
        { value: '7', label: 'Day Streaks' },
    ];

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
            {/* Gradient Background */}
            <GradientBackground />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-sm border-b border-stone-200/50 dark:border-stone-800/50">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center gap-2 cursor-pointer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        onClick={() => setIsAppStarted(false)}
                    >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Focus Flow</span>
                    </motion.div>

                    {/* Right side buttons */}
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {!isAppStarted && (
                            <motion.button
                                onClick={startApp}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span>Open App</span>
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        )}
                        {/* Settings Button */}
                        {isAppStarted && (
                            <>
                                <ProfileSelector />
                                <motion.button
                                    onClick={() => setShowSettings(true)}
                                    className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors border border-stone-200 dark:border-stone-800"
                                    aria-label="Open settings"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Settings className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                                </motion.button>
                            </>
                        )}



                        <motion.button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors border border-stone-200 dark:border-stone-800"
                            aria-label="Toggle theme"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5 text-amber-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-indigo-600" />
                            )}
                        </motion.button>
                    </motion.div>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {!isAppStarted ? (
                    /* Landing Page */
                    <motion.main
                        key="landing"
                        className="pt-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Hero Section */}
                        <section className="px-6 py-20 md:py-32">
                            <div className="max-w-5xl mx-auto text-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
                                        <Sparkles className="w-4 h-4" />
                                        <span>Your productivity companion</span>
                                    </div>
                                </motion.div>

                                <motion.h1
                                    className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-stone-900 via-stone-700 to-stone-900 dark:from-white dark:via-stone-200 dark:to-white bg-clip-text text-transparent"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    Focus Flow Studio
                                </motion.h1>

                                <motion.p
                                    className="text-xl md:text-2xl text-stone-500 dark:text-stone-400 mb-10 max-w-2xl mx-auto"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                >
                                    The beautiful way to stay focused. Pomodoro timer meets ambient sounds and habit tracking.
                                </motion.p>

                                <motion.div
                                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <motion.button
                                        onClick={startApp}
                                        className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold shadow-2xl shadow-indigo-500/30 hover:shadow-3xl hover:shadow-indigo-500/40 transition-all"
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Timer className="w-5 h-5" />
                                        <span>Start Focusing</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>

                                    <p className="text-stone-400 dark:text-stone-500 text-sm">
                                        No sign up required • 100% free
                                    </p>
                                </motion.div>
                            </div>
                        </section>

                        {/* Features Section */}
                        <section className="px-6 py-16 bg-stone-100/50 dark:bg-stone-900/30">
                            <div className="max-w-5xl mx-auto">
                                <motion.div
                                    className="text-center mb-12"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to focus</h2>
                                    <p className="text-stone-500 dark:text-stone-400 text-lg">
                                        Powerful features designed to maximize your productivity
                                    </p>
                                </motion.div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    {features.map((feature, index) => (
                                        <motion.div
                                            key={feature.title}
                                            className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-lg shadow-stone-200/50 dark:shadow-none hover:shadow-xl transition-shadow"
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            whileHover={{ y: -4 }}
                                        >
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                                                <feature.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                            <p className="text-stone-500 dark:text-stone-400">{feature.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Stats Section */}
                        <section className="px-6 py-16">
                            <div className="max-w-5xl mx-auto">
                                <div className="grid grid-cols-3 gap-6">
                                    {stats.map((stat, index) => (
                                        <motion.div
                                            key={stat.label}
                                            className="text-center"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
                                                {stat.value}
                                            </div>
                                            <div className="text-stone-500 dark:text-stone-400 text-sm md:text-base">
                                                {stat.label}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* CTA Section */}
                        <section className="px-6 py-20">
                            <motion.div
                                className="max-w-3xl mx-auto text-center p-10 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-200 dark:border-indigo-800/30"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
                                <h2 className="text-3xl font-bold mb-4">Ready to boost your productivity?</h2>
                                <p className="text-stone-500 dark:text-stone-400 mb-8">
                                    Join thousands of focused individuals who've transformed their work habits.
                                </p>
                                <motion.button
                                    onClick={startApp}
                                    className="group flex items-center gap-3 mx-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold shadow-2xl shadow-indigo-500/30"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span>Get Started Now</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </motion.div>
                        </section>

                        {/* Footer */}
                        <footer className="py-8 px-6 border-t border-stone-200 dark:border-stone-800">
                            <div className="max-w-5xl mx-auto text-center text-stone-400 dark:text-stone-600 text-sm">
                                Focus Flow Studio — Stay focused, stay productive
                            </div>
                        </footer>
                    </motion.main>
                ) : (
                    /* Main App */
                    <motion.main
                        key="app"
                        className="pt-24 pb-20 px-4 sm:px-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="max-w-4xl mx-auto space-y-8 pb-20 md:pb-0">
                            {/* Hero: Timer Section */}
                            <motion.section
                                className={`py-8 ${activeTab === 'timer' ? 'block' : 'hidden md:block'}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <div className="flex flex-col items-center space-y-8">
                                    <TimerDisplay />
                                    <TimerControls />
                                </div>
                            </motion.section>

                            {/* Stats Overview */}
                            <motion.section
                                className={`${activeTab === 'stats' ? 'block' : 'hidden md:block'}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <SessionStats />
                            </motion.section>

                            {/* Task List */}
                            <motion.section
                                className={`${activeTab === 'tasks' ? 'block' : 'hidden md:block'}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.25 }}
                            >
                                <TaskList />
                            </motion.section>

                            {/* Bottom Grid: Habit Tracker & Sound Mixer */}
                            <motion.section
                                className={`grid md:grid-cols-2 gap-6 ${activeTab === 'stats' ? 'block' : 'hidden md:block'}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <HabitTracker />
                                <SoundMixer />
                            </motion.section>

                            {/* Environment Evolution */}
                            <motion.section
                                className={`${activeTab === 'stats' ? 'block' : 'hidden md:block'}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.45 }}
                            >
                                <EnvironmentDisplay />
                            </motion.section>

                            {/* Achievements Section */}
                            <motion.section
                                className={`${activeTab === 'stats' ? 'block' : 'hidden md:block'}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <Achievements />
                            </motion.section>
                        </div>

                        {/* Back to Landing button */}
                        <motion.div
                            className="fixed bottom-6 right-6"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <button
                                onClick={() => {
                                    setIsAppStarted(false);
                                    localStorage.removeItem('appStarted');
                                }}
                                className="p-3 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors shadow-lg text-sm"
                                title="Back to home"
                            >
                                🏠
                            </button>
                        </motion.div>

                        {/* Achievement Notifications */}
                        <AchievementNotification />

                        {/* Footer */}
                        <footer className="mt-16 py-6 px-6 border-t border-stone-200 dark:border-stone-800">
                            <div className="max-w-4xl mx-auto text-center text-stone-400 dark:text-stone-600 text-sm">
                                Focus Flow Studio — Stay focused, stay productive
                            </div>
                        </footer>
                    </motion.main>
                )}
            </AnimatePresence>
            {/* Overlays */}
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
            <Onboarding />
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            <StartParticles isActive={showStartParticles} />
        </div>
    );
}

// Wrap with ToastProvider
function App() {
    return (
        <ToastProvider>
            <AppContent />
        </ToastProvider>
    );
}

export default App;
