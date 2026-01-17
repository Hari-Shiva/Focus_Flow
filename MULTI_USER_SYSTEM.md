# Multi-User Account System Design

> **STATUS**: This document outlines a proposed multi-user account system for Focus Flow Studio. **Implementation will only proceed upon user approval.**

---

## Overview

This document describes how to add user authentication and multiple user accounts to Focus Flow Studio, allowing multiple people to use the app on the same device or sync across devices.

---

## Proposed Architecture

### Authentication Options

| Method | Pros | Cons |
|--------|------|------|
| **Local Profiles** | No server needed, works offline | No sync between devices |
| **Firebase Auth** | Easy setup, Google/Email login | Requires Firebase project |
| **Supabase** | PostgreSQL backend, self-hostable | More complex setup |
| **Custom Backend** | Full control | Significant development effort |

### Recommended: Local Profiles (Phase 1)

For initial implementation, local profiles are recommended:

```typescript
interface UserProfile {
    id: string;
    name: string;
    avatar: string;
    createdAt: Date;
}

interface UserStore {
    profiles: UserProfile[];
    activeProfileId: string | null;
    createProfile: (name: string) => void;
    switchProfile: (id: string) => void;
    deleteProfile: (id: string) => void;
}
```

---

## Data Isolation Strategy

Each user profile would have isolated:
- Timer settings
- Achievement progress
- Session history
- Sound preferences
- Quest progress
- XP and level

### Storage Keys with User Prefix
```
user-{userId}-timer-settings
user-{userId}-achievements
user-{userId}-sessions
user-{userId}-sounds
user-{userId}-quests
user-{userId}-level
```

---

## UI Changes Required

### 1. Profile Selector
- Add avatar/name in header
- Dropdown to switch profiles
- "Add Profile" option

### 2. Profile Management Screen
- List all profiles
- Edit name/avatar
- Delete profile (with confirmation)
- Export/import profile data

### 3. Onboarding Update
- Ask for profile name on first launch
- Optional avatar selection

---

## Migration Plan

1. **Detect existing data** on app load
2. **Create default profile** using existing data
3. **Migrate all stores** to use profile prefix
4. **Clear old non-prefixed data**

---

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| Profile deletion | Require confirmation |
| Data visibility | Each profile sees only their data |
| Accidental switch | Visual indicator of active profile |

---

## Cloud Sync (Future Phase 2)

If cloud sync is desired later:

1. Add Firebase/Supabase authentication
2. Create backend API for data sync
3. Implement conflict resolution
4. Add "Sync" button in settings

---

## Files to Modify

| File | Changes |
|------|---------|
| `stores/userStore.ts` | **NEW** - User profile management |
| `stores/timerStore.ts` | Add profile prefix to storage |
| `stores/habitStore.ts` | Add profile prefix to storage |
| `stores/achievementStore.ts` | Add profile prefix to storage |
| `stores/soundStore.ts` | Add profile prefix to storage |
| `stores/questStore.ts` | Add profile prefix to storage |
| `stores/levelStore.ts` | Add profile prefix to storage |
| `components/ProfileSelector.tsx` | **NEW** - Profile dropdown |
| `components/ProfileManager.tsx` | **NEW** - Profile CRUD screen |
| `App.tsx` | Add profile selector to header |

---

## Estimated Effort

| Task | Time |
|------|------|
| UserStore implementation | 2 hours |
| Storage migration | 3 hours |
| UI components | 4 hours |
| Testing | 2 hours |
| **Total** | **~11 hours** |

---

## Next Steps

When you're ready to implement, tell me and I will:
1. Create the `userStore.ts`
2. Update all stores with profile isolation
3. Build the ProfileSelector and ProfileManager components
4. Add migration logic for existing data
