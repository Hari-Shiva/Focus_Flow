import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
    id: string;
    name: string;
    avatar: string; // Emoji
    createdAt: Date;
    color: string; // Tailwind color class
}

interface UserState {
    profiles: UserProfile[];
    activeProfileId: string | null;

    // Actions
    createProfile: (name: string, avatar: string, color: string) => UserProfile;
    switchProfile: (id: string) => void;
    updateProfile: (id: string, updates: Partial<Pick<UserProfile, 'name' | 'avatar' | 'color'>>) => void;
    deleteProfile: (id: string) => void;
    getActiveProfile: () => UserProfile | null;
}

const AVATAR_OPTIONS = ['👤', '🧑‍💻', '👩‍🎓', '🧑‍🔬', '🦊', '🐱', '🌟', '🔥', '💎', '🎯'];
const COLOR_OPTIONS = ['indigo', 'emerald', 'amber', 'rose', 'purple', 'blue', 'pink', 'orange'];

function generateId(): string {
    return `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            profiles: [],
            activeProfileId: null,

            createProfile: (name, avatar, color) => {
                const newProfile: UserProfile = {
                    id: generateId(),
                    name,
                    avatar,
                    color,
                    createdAt: new Date(),
                };

                set((state) => ({
                    profiles: [...state.profiles, newProfile],
                    activeProfileId: state.activeProfileId || newProfile.id, // Auto-activate if first profile
                }));

                return newProfile;
            },

            switchProfile: (id) => {
                const profile = get().profiles.find((p) => p.id === id);
                if (profile) {
                    set({ activeProfileId: id });
                    // Reload page to reset all stores with new profile prefix
                    window.location.reload();
                }
            },

            updateProfile: (id, updates) => {
                set((state) => ({
                    profiles: state.profiles.map((p) =>
                        p.id === id ? { ...p, ...updates } : p
                    ),
                }));
            },

            deleteProfile: (id) => {
                const { profiles, activeProfileId } = get();

                // Don't allow deleting last profile
                if (profiles.length <= 1) return;

                const newProfiles = profiles.filter((p) => p.id !== id);
                const newActiveId = activeProfileId === id
                    ? newProfiles[0]?.id || null
                    : activeProfileId;

                set({ profiles: newProfiles, activeProfileId: newActiveId });

                // Clear profile-specific data
                const keysToRemove = Object.keys(localStorage).filter((key) =>
                    key.startsWith(`${id}-`)
                );
                keysToRemove.forEach((key) => localStorage.removeItem(key));
            },

            getActiveProfile: () => {
                const { profiles, activeProfileId } = get();
                return profiles.find((p) => p.id === activeProfileId) || null;
            },
        }),
        {
            name: 'user-profiles-storage',
        }
    )
);

export { AVATAR_OPTIONS, COLOR_OPTIONS };
