import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { useUserStore, AVATAR_OPTIONS } from '../stores/userStore';

interface CreateProfileProps {
    onComplete: () => void;
}

export function CreateProfile({ onComplete }: CreateProfileProps) {
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
    const { createProfile } = useUserStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            createProfile(name.trim(), selectedAvatar, 'indigo');
            onComplete();
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-stone-950 via-indigo-950 to-stone-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md bg-stone-900 rounded-2xl border border-stone-800 shadow-2xl p-8"
            >
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Focus Flow</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-xl font-semibold text-white">Create Your Profile</h2>
                        </div>
                        <p className="text-stone-400 text-sm mb-6">
                            Let's personalize your focus experience
                        </p>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-stone-300 mb-2">
                            Your Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 bg-stone-800 border border-stone-700 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            autoFocus
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-stone-300 mb-3">
                            Choose Your Avatar
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {AVATAR_OPTIONS.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setSelectedAvatar(emoji)}
                                    className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${selectedAvatar === emoji
                                            ? 'bg-indigo-500/20 ring-2 ring-indigo-500 scale-105'
                                            : 'bg-stone-800 hover:bg-stone-700 active:scale-95'
                                        }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                    >
                        Get Started 🚀
                    </button>
                </form>

                <p className="text-center text-stone-500 text-xs mt-6">
                    You can always change this later
                </p>
            </motion.div>
        </div>
    );
}
