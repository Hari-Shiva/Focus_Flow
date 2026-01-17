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
            <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Create Your Profile
                </h3>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 mb-3"
                    autoFocus
                />

                <div className="mb-3">
                    <span className="text-sm text-stone-500 mb-2 block">Pick an avatar</span>
                    <div className="flex flex-wrap gap-2">
                        {AVATAR_OPTIONS.map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => setNewAvatar(emoji)}
                                className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${newAvatar === emoji
                                    ? 'bg-indigo-100 dark:bg-indigo-900 ring-2 ring-indigo-500'
                                    : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700'
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
                    className="w-full py-2 bg-indigo-500 text-white rounded-lg font-medium disabled:opacity-50"
                >
                    Get Started
                </button>
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
