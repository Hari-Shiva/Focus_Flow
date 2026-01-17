import { create } from 'zustand';
import type { Task } from '../types';
import { getAllTasks, addTask, updateTask, deleteTask, saveAllTasks } from '../db/database';

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    activeTaskId: string | null;

    // Actions
    loadTasks: () => Promise<void>;
    addNewTask: (title: string, estimatedPomodoros?: number) => Promise<void>;
    toggleTaskComplete: (id: string) => Promise<void>;
    removeTask: (id: string) => Promise<void>;
    setActiveTask: (id: string | null) => void;
    incrementPomodoro: (id: string) => Promise<void>;
    reorderTasks: (fromIndex: number, toIndex: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    isLoading: false,
    activeTaskId: null,

    loadTasks: async () => {
        set({ isLoading: true });
        try {
            const tasks = await getAllTasks();
            // Sort by createdAt, uncompleted first
            const sortedTasks = tasks.sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            set({ tasks: sortedTasks, isLoading: false });
        } catch (error) {
            console.error('Failed to load tasks:', error);
            set({ isLoading: false });
        }
    },

    addNewTask: async (title: string, estimatedPomodoros?: number) => {
        console.log('[TaskStore] addNewTask called with:', title);
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            console.log('[TaskStore] Empty title, returning');
            return;
        }

        const newTask: Task = {
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: trimmedTitle,
            completed: false,
            createdAt: new Date(),
            pomodorosCompleted: 0,
            pomodorosEstimated: estimatedPomodoros,
            isActive: false,
        };
        console.log('[TaskStore] Created new task:', newTask);

        try {
            console.log('[TaskStore] Calling addTask to database...');
            await addTask(newTask);
            console.log('[TaskStore] Database add successful, updating state');
            set((state) => ({
                tasks: [newTask, ...state.tasks],
            }));
            console.log('[TaskStore] State updated with new task');
        } catch (error) {
            console.error('[TaskStore] Failed to add task:', error);
        }
    },

    toggleTaskComplete: async (id: string) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        const updatedTask: Task = {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed ? new Date() : undefined,
            isActive: false,
        };

        try {
            await updateTask(updatedTask);
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
                activeTaskId: state.activeTaskId === id ? null : state.activeTaskId,
            }));
        } catch (error) {
            console.error('Failed to toggle task:', error);
        }
    },

    removeTask: async (id: string) => {
        try {
            await deleteTask(id);
            set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
                activeTaskId: state.activeTaskId === id ? null : state.activeTaskId,
            }));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    },

    setActiveTask: (id: string | null) => {
        set((state) => ({
            tasks: state.tasks.map((t) => ({
                ...t,
                isActive: t.id === id,
            })),
            activeTaskId: id,
        }));
    },

    incrementPomodoro: async (id: string) => {
        const task = get().tasks.find((t) => t.id === id);
        if (!task) return;

        const updatedTask: Task = {
            ...task,
            pomodorosCompleted: task.pomodorosCompleted + 1,
        };

        try {
            await updateTask(updatedTask);
            set((state) => ({
                tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
            }));
        } catch (error) {
            console.error('Failed to increment pomodoro:', error);
        }
    },

    reorderTasks: async (fromIndex: number, toIndex: number) => {
        const tasks = [...get().tasks];
        const [movedTask] = tasks.splice(fromIndex, 1);
        tasks.splice(toIndex, 0, movedTask);

        set({ tasks });

        try {
            await saveAllTasks(tasks);
        } catch (error) {
            console.error('Failed to reorder tasks:', error);
        }
    },
}));
