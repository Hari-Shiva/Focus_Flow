import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, Plus, Check } from 'lucide-react';
import { useUserStore, AVATAR_OPTIONS } from '../stores/userStore';

export function ProfileSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [newAvatar, setNewAvatar] = useState(AVATAR_OPTIONS[0]);

    const { profiles, activeProfileId, createProfile, switchProfile, getActiveProfile } = useUserStore();
    const activeProfile = getActiveProfile();

    const handleCreate = () => {
        if (newName.trim()) {
            createProfile(newName.trim(), newAvatar, 'indigo');
            setNewName('');
            setShowCreate(false);
            setIsOpen(false);
        }
    };

    const handleSwitch = (id: string) => {
        if (id !== activeProfileId) {
            switchProfile(id);
        }
        setIsOpen(false);
    };

    // Auto-create profile if none exist
    if (profiles.length === 0) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-20 bg-black/50 backdrop-blur-sm overflow-y-auto">
                <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 my-auto">
                    <h3 className="font-bold text-lg sm:text-xl mb-4 flex items-center gap-2 text-stone-900 dark:text-stone-100">
                        <User className="w-5 h-5 sm:w-6 sm:h-6" />
                        Create Your Profile
                    </h3>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-2.5 sm:py-3 text-base rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        autoFocus
                    />

                    <div className="mb-5">
                        <span className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-2.5 block">Pick an avatar</span>
                        <div className="grid grid-cols-5 gap-2">
                            {AVATAR_OPTIONS.map((emoji) => (
                                <button
                                    key={emoji}
                                    onClick={() => setNewAvatar(emoji)}
                                    className={`aspect-square rounded-lg text-xl sm:text-2xl flex items-center justify-center transition-all ${newAvatar === emoji
                                        ? 'bg-indigo-100 dark:bg-indigo-900 ring-2 ring-indigo-500 scale-105'
                                        : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95'
                                        }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleCreate}
                        disabled={!newName.trim()}
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all active:scale-[0.98]"
                    >
                        Get Started 🚀
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
                <span className="text-lg">{activeProfile?.avatar || '👤'}</span>
                <span className="font-medium text-sm max-w-[100px] truncate">
                    {activeProfile?.name || 'Profile'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-lg z-50 overflow-hidden"
                    >
                        {!showCreate ? (
                            <>
                                <div className="p-2 border-b border-stone-100 dark:border-stone-800">
                                    <span className="text-xs font-medium text-stone-500 px-2">Profiles</span>
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    {profiles.map((profile) => (
                                        <button
                                            key={profile.id}
                                            onClick={() => handleSwitch(profile.id)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                                        >
                                            <span className="text-xl">{profile.avatar}</span>
                                            <span className="flex-1 text-left font-medium truncate">
                                                {profile.name}
                                            </span>
                                            {profile.id === activeProfileId && (
                                                <Check className="w-4 h-4 text-emerald-500" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setShowCreate(true)}
                                    className="w-full flex items-center gap-3 px-4 py-3 border-t border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-indigo-600 dark:text-indigo-400"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="font-medium">Add Profile</span>
                                </button>
                            </>
                        ) : (
                            <div className="p-4 space-y-3">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Profile name"
                                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                                    autoFocus
                                />
                                <div className="flex flex-wrap gap-1">
                                    {AVATAR_OPTIONS.slice(0, 6).map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => setNewAvatar(emoji)}
                                            className={`w-8 h-8 rounded text-lg flex items-center justify-center ${newAvatar === emoji
                                                ? 'bg-indigo-100 dark:bg-indigo-900'
                                                : 'hover:bg-stone-100 dark:hover:bg-stone-800'
                                                }`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowCreate(false)}
                                        className="flex-1 py-2 text-sm font-medium text-stone-500 hover:text-stone-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreate}
                                        disabled={!newName.trim()}
                                        className="flex-1 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                    >
                                        Create
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
