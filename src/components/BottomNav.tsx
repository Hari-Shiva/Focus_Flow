import { motion } from 'framer-motion';
import { Clock, List, BarChart2 } from 'lucide-react';

interface BottomNavProps {
    activeTab: 'timer' | 'tasks' | 'stats';
    onTabChange: (tab: 'timer' | 'tasks' | 'stats') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    const tabs = [
        { id: 'timer', label: 'Timer', icon: Clock },
        { id: 'tasks', label: 'Tasks', icon: List },
        { id: 'stats', label: 'Stats', icon: BarChart2 },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-stone-950/80 backdrop-blur-lg border-t border-stone-200 dark:border-stone-800 md:hidden z-30">
            <div className="flex justify-around items-center">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id as any)}
                            className="relative flex flex-col items-center gap-1 p-2 w-16"
                        >
                            <motion.div
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                    color: isActive ? 'var(--color-primary)' : 'var(--color-muted)'
                                }}
                                className={`
                                    w-6 h-6 
                                    ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-stone-400'}
                                `}
                            >
                                <tab.icon className="w-full h-full" strokeWidth={isActive ? 2.5 : 2} />
                            </motion.div>
                            <span className={`text-[10px] font-medium ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-stone-400'}`}>
                                {tab.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute -top-4 w-8 h-1 bg-indigo-500 rounded-full"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
