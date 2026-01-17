import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Session, Achievement, Task } from '../types';


interface FocusFlowDB extends DBSchema {
    sessions: {
        key: string;
        value: Session;
        indexes: { 'by-date': Date };
    };
    achievements: {
        key: string;
        value: Achievement;
    };
    settings: {
        key: string;
        value: any;
    };
    tasks: {
        key: string;
        value: Task;
        indexes: { 'by-created': Date };
    };
}

let db: IDBPDatabase<FocusFlowDB> | null = null;
const DB_VERSION = 3;

export async function initDatabase(): Promise<IDBPDatabase<FocusFlowDB>> {
    // Check if we have a connection but it's an outdated version
    if (db && db.version < DB_VERSION) {
        console.log('[Database] Closing outdated connection (v' + db.version + ') to upgrade to v' + DB_VERSION);
        db.close();
        db = null;
    }

    if (db) return db;

    console.log('[Database] Opening database at version', DB_VERSION);

    db = await openDB<FocusFlowDB>('focus-flow-studio', DB_VERSION, {
        upgrade(database, oldVersion, newVersion) {
            console.log('[Database] Upgrading from v' + oldVersion + ' to v' + newVersion);

            // Sessions store
            if (!database.objectStoreNames.contains('sessions')) {
                const sessionStore = database.createObjectStore('sessions', {
                    keyPath: 'id',
                });
                sessionStore.createIndex('by-date', 'date');
            }

            // Achievements store (new in v2)
            if (!database.objectStoreNames.contains('achievements')) {
                database.createObjectStore('achievements', {
                    keyPath: 'id',
                });
            }

            // Settings store
            if (!database.objectStoreNames.contains('settings')) {
                database.createObjectStore('settings');
            }

            // Tasks store (new in v3)
            if (!database.objectStoreNames.contains('tasks')) {
                console.log('[Database] Creating tasks store');
                const taskStore = database.createObjectStore('tasks', {
                    keyPath: 'id',
                });
                taskStore.createIndex('by-created', 'createdAt');
            }
        },
        blocked() {
            console.warn('[Database] Upgrade blocked by another connection. Please refresh the page.');
        },
        blocking() {
            console.log('[Database] This connection is blocking a version change. Closing...');
            if (db) {
                db.close();
                db = null;
            }
        },
    });

    console.log('[Database] Database opened successfully at version', db.version);
    return db;
}

// Session Operations
export async function addSession(session: Session): Promise<void> {
    const database = await initDatabase();
    await database.add('sessions', session);
}

export async function getAllSessions(): Promise<Session[]> {
    const database = await initDatabase();
    return database.getAll('sessions');
}

export async function getSessionsByDateRange(
    startDate: Date,
    endDate: Date
): Promise<Session[]> {
    const database = await initDatabase();
    const allSessions = await database.getAllFromIndex('sessions', 'by-date');

    return allSessions.filter(
        session => session.date >= startDate && session.date <= endDate
    );
}

export async function getTodaySessions(): Promise<Session[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return getSessionsByDateRange(today, tomorrow);
}

export async function deleteSession(id: string): Promise<void> {
    const database = await initDatabase();
    await database.delete('sessions', id);
}

// Settings Operations
export async function getSetting<T>(key: string): Promise<T | undefined> {
    const database = await initDatabase();
    return database.get('settings', key);
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
    const database = await initDatabase();
    await database.put('settings', value, key);
}

// Achievement Operations
export async function getAllAchievements(): Promise<Achievement[]> {
    const database = await initDatabase();
    return database.getAll('achievements');
}

export async function saveAchievement(achievement: Achievement): Promise<void> {
    const database = await initDatabase();
    await database.put('achievements', achievement);
}

export async function saveAllAchievements(achievements: Achievement[]): Promise<void> {
    const database = await initDatabase();
    const tx = database.transaction('achievements', 'readwrite');
    await Promise.all(achievements.map(achievement => tx.store.put(achievement)));
    await tx.done;
}

// Task Operations
export async function getAllTasks(): Promise<Task[]> {
    const database = await initDatabase();
    return database.getAll('tasks');
}

export async function addTask(task: Task): Promise<void> {
    const database = await initDatabase();
    await database.add('tasks', task);
}

export async function updateTask(task: Task): Promise<void> {
    const database = await initDatabase();
    await database.put('tasks', task);
}

export async function deleteTask(id: string): Promise<void> {
    const database = await initDatabase();
    await database.delete('tasks', id);
}

export async function saveAllTasks(tasks: Task[]): Promise<void> {
    const database = await initDatabase();
    const tx = database.transaction('tasks', 'readwrite');
    await Promise.all(tasks.map(task => tx.store.put(task)));
    await tx.done;
}
