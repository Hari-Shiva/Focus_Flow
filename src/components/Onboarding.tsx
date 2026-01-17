import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bell, ArrowRight, Check, Clock, List, Volume2 } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

export function Onboarding() {
    const [show, setShow] = useState(false);
    const [step, setStep] = useState(0);
    const { requestPermission } = useNotifications();

    useEffect(() => {
        const completed = localStorage.getItem('onboardingComplete');
        if (!completed) {
            // Small delay to ensure it appears after app load
            const timer = setTimeout(() => setShow(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleComplete = () => {
        localStorage.setItem('onboardingComplete', 'true');
        setShow(false);
    };

    const nextStep = () => {
        setStep(p => p + 1);
    };

    const steps = [
        // Step 0: Welcome
        {
            icon: Sparkles,
            color: 'text-amber-500',
            bg: 'bg-amber-100 dark:bg-amber-900/30',
            title: 'Welcome to Focus Flow',
            description: 'Your new favorite way to stay productive. Let\'s get you set up in seconds.',
            action: (
                <button
                    onClick={nextStep}
                    className="w-full py-3 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-semibold shadow-lg hover:translate-y-[-1px] transition-all flex items-center justify-center gap-2"
                >
                    Get Started <ArrowRight className="w-4 h-4" />
                </button>
            )
        },
        // Step 1: Permissions
        {
            icon: Bell,
            color: 'text-indigo-500',
            bg: 'bg-indigo-100 dark:bg-indigo-900/30',
            title: 'Stay in the loop',
            description: 'Enable notifications to know when your focus limits are reached.',
            action: (
                <div className="space-y-3">
                    <button
                        onClick={() => {
                            requestPermission();
                            // Auto advance if already granted or after request
                            setTimeout(nextStep, 1000);
                        }}
                        className="w-full py-3 rounded-xl bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                    >
                        <Bell className="w-4 h-4" /> Enable Notifications
                    </button>
                    <button onClick={nextStep} className="w-full py-3 text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-300">
                        Maybe later
                    </button>
                </div>
            )
        },
        // Step 2: Features Tour
        {
            icon: Clock,
            color: 'text-emerald-500',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30',
            title: 'Powerful Features',
            description: 'Everything you need to find your flow.',
            customContent: (
                <div className="space-y-3 my-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                        <Clock className="w-5 h-5 text-indigo-500" />
                        <span className="text-sm font-medium">Smart Timer</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                        <List className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-medium">Task Management</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                        <Volume2 className="w-5 h-5 text-pink-500" />
                        <span className="text-sm font-medium">Ambient Sounds</span>
                    </div>
                </div>
            ),
            action: (
                <button
                    onClick={handleComplete}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                    Let's Focus <Check className="w-4 h-4" />
                </button>
            )
        }
    ];

    const currentStep = steps[step];

    return (
        <AnimatePresence>
            {show && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex justify-center mb-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${currentStep.bg} ${currentStep.color}`}>
                                        <currentStep.icon className="w-8 h-8" />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-center mb-3 text-stone-900 dark:text-white">
                                    {currentStep.title}
                                </h2>
                                <p className="text-center text-stone-500 dark:text-stone-400 mb-8 leading-relaxed">
                                    {currentStep.description}
                                </p>

                                {currentStep.customContent}

                                {currentStep.action}

                                {/* Stepper Dots */}
                                <div className="flex justify-center gap-2 mt-8">
                                    {steps.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full transition-colors ${i === step
                                                ? 'bg-stone-900 dark:bg-white'
                                                : 'bg-stone-200 dark:bg-stone-800'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
