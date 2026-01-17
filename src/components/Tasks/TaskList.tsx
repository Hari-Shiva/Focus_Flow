import { useState, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Target, Circle, Timer } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';

export function TaskList() {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const { tasks, addNewTask, toggleTaskComplete, removeTask, setActiveTask, activeTaskId } = useTaskStore();

    const handleAddTask = async () => {
        console.log('[TaskList] handleAddTask called, newTaskTitle:', newTaskTitle);
        if (newTaskTitle.trim()) {
            console.log('[TaskList] Adding task:', newTaskTitle.trim());
            await addNewTask(newTaskTitle);
            console.log('[TaskList] Task added, clearing input');
            setNewTaskTitle('');
        } else {
            console.log('[TaskList] Empty title, not adding');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            console.log('[TaskList] Enter pressed');
            handleAddTask();
        }
    };

    const incompleteTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    return (
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-indigo-500" />
                <h3 className="text-base font-semibold">Tasks</h3>
                <span className="text-xs text-stone-500 dark:text-stone-400 ml-auto">
                    {incompleteTasks.length} remaining
                </span>
            </div>

            {/* Add Task Input */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a new task..."
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddTask}
                    disabled={!newTaskTitle.trim()}
                    className="p-2 rounded-xl bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Task List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                    {incompleteTasks.map((task) => (
                        <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={`group flex items-center gap-3 p-3 rounded-xl transition-all ${task.isActive || activeTaskId === task.id
                                ? 'bg-indigo-50 dark:bg-indigo-950/50 ring-2 ring-indigo-400'
                                : 'bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800'
                                }`}
                        >
                            {/* Complete Toggle */}
                            <button
                                onClick={() => toggleTaskComplete(task.id)}
                                className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-stone-300 dark:border-stone-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors flex items-center justify-center"
                            >
                                <Circle className="w-3 h-3 text-transparent group-hover:text-indigo-400" />
                            </button>

                            {/* Task Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{task.title}</p>
                                {task.pomodorosCompleted > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-stone-500">
                                        <Timer className="w-3 h-3" />
                                        <span>{task.pomodorosCompleted} pomodoros</span>
                                    </div>
                                )}
                            </div>

                            {/* Link to Timer */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setActiveTask(activeTaskId === task.id ? null : task.id)}
                                className={`p-1.5 rounded-lg transition-colors ${activeTaskId === task.id
                                    ? 'bg-indigo-500 text-white'
                                    : 'opacity-0 group-hover:opacity-100 bg-stone-200 dark:bg-stone-700 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                                    }`}
                                title={activeTaskId === task.id ? 'Unlink from timer' : 'Link to timer'}
                            >
                                <Target className="w-3.5 h-3.5" />
                            </motion.button>

                            {/* Delete */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeTask(task.id)}
                                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 bg-stone-200 dark:bg-stone-700 hover:bg-red-100 dark:hover:bg-red-900 text-stone-500 hover:text-red-500 transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                    <div className="pt-3 border-t border-stone-200 dark:border-stone-700">
                        <p className="text-xs text-stone-500 dark:text-stone-400 mb-2">
                            Completed ({completedTasks.length})
                        </p>
                        {completedTasks.slice(0, 3).map((task) => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-3 p-2 rounded-lg opacity-60"
                            >
                                <button
                                    onClick={() => toggleTaskComplete(task.id)}
                                    className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"
                                >
                                    <Check className="w-3 h-3 text-white" />
                                </button>
                                <span className="text-sm line-through text-stone-500 truncate">
                                    {task.title}
                                </span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={() => removeTask(task.id)}
                                    className="ml-auto p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-stone-400 hover:text-red-500"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </motion.button>
                            </motion.div>
                        ))}
                        {completedTasks.length > 3 && (
                            <p className="text-xs text-stone-400 text-center pt-1">
                                +{completedTasks.length - 3} more completed
                            </p>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {tasks.length === 0 && (
                    <div className="text-center py-6 text-stone-400">
                        <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No tasks yet</p>
                        <p className="text-xs">Add a task to focus on</p>
                    </div>
                )}
            </div>
        </div>
    );
}
