import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import {
    isToday,
    isSameWeek,
    isSameMonth,
    differenceInCalendarDays,
    parseISO,
    format
} from 'date-fns';

export const useTaskManager = () => {
    const [tasks, setTasks] = useState([]);

    // Defined before usage to avoid hoisting issues
    const checkPeriodicity = (currentTasks) => {
        const now = new Date();
        const todayStr = format(now, 'yyyy-MM-dd');

        return currentTasks.map(task => {
            let completedDates = Array.isArray(task.completedDates) ? [...task.completedDates] : [];
            if (task.completed && task.lastCompletedAt && completedDates.length === 0) {
                try {
                    completedDates = [format(parseISO(task.lastCompletedAt), 'yyyy-MM-dd')];
                } catch {
                    completedDates = [];
                }
            }

            // Sync today's completion state with completedDates
            const completedToday = completedDates.includes(todayStr);

            if (!task.completed || !task.lastCompletedAt) {
                return { ...task, completed: completedToday, completedDates };
            }

            const lastCompleted = parseISO(task.lastCompletedAt);
            let shouldReset = false;

            switch (task.periodicity) {
                case 'daily':
                    shouldReset = !isToday(lastCompleted);
                    break;
                case 'weekly':
                    shouldReset = !isSameWeek(lastCompleted, now, { weekStartsOn: 1 });
                    break;
                case 'monthly':
                    shouldReset = !isSameMonth(lastCompleted, now);
                    break;
                case 'custom': {
                    const daysDiff = differenceInCalendarDays(now, lastCompleted);
                    shouldReset = daysDiff >= (task.customInterval || 1);
                    break;
                }
                default:
                    break;
            }

            if (shouldReset) {
                return { ...task, completed: false, completedDates };
            }
            return { ...task, completed: completedToday || task.completed, completedDates };
        });
    };

    useEffect(() => {
        const loadedTasks = storage.getTasks();
        const refreshedTasks = checkPeriodicity(loadedTasks);
        if (JSON.stringify(loadedTasks) !== JSON.stringify(refreshedTasks)) {
            storage.saveTasks(refreshedTasks);
        }
        setTasks(refreshedTasks);
    }, []);

    const addTask = (title, periodicity, assignedTo, customInterval = 1) => {
        const newTask = {
            id: uuidv4(),
            title,
            periodicity, // 'daily', 'weekly', 'monthly', 'custom'
            customInterval: parseInt(customInterval, 10) || 1,
            assignedTo,
            completed: false,
            completedDates: [],
            lastCompletedAt: null,
            createdAt: new Date().toISOString()
        };

        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        storage.saveTasks(updatedTasks);
    };

    const toggleTaskForDate = (taskId, dateStr) => {
        const todayStr = format(new Date(), 'yyyy-MM-dd');

        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                const dates = Array.isArray(task.completedDates) ? task.completedDates : [];
                const isCompletedForDate = dates.includes(dateStr);
                const nextDates = isCompletedForDate
                    ? dates.filter(d => d !== dateStr)
                    : [...dates, dateStr];

                const isToday = dateStr === todayStr;
                const newCompleted = isToday ? !isCompletedForDate : task.completed;
                const newLastCompletedAt = (!isCompletedForDate && isToday)
                    ? new Date().toISOString()
                    : task.lastCompletedAt;

                return {
                    ...task,
                    completedDates: nextDates,
                    completed: newCompleted,
                    lastCompletedAt: newLastCompletedAt
                };
            }
            return task;
        });

        setTasks(updatedTasks);
        storage.saveTasks(updatedTasks);
    };

    const toggleTask = (taskId) => {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        toggleTaskForDate(taskId, todayStr);
    };

    const updateTask = (taskId, fields) => {
        const updatedTasks = tasks.map(t => {
            if (t.id === taskId) {
                return {
                    ...t,
                    ...fields,
                    customInterval: fields.customInterval !== undefined ? parseInt(fields.customInterval, 10) || 1 : t.customInterval
                };
            }
            return t;
        });
        setTasks(updatedTasks);
        storage.saveTasks(updatedTasks);
    };

    const reloadTasks = () => {
        const loaded = storage.getTasks();
        const refreshed = checkPeriodicity(loaded);
        setTasks(refreshed);
    };

    const deleteTask = (taskId) => {
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        setTasks(updatedTasks);
        storage.saveTasks(updatedTasks);
    };

    return { tasks, addTask, updateTask, toggleTask, toggleTaskForDate, deleteTask, reloadTasks };
};
