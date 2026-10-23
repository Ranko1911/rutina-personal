const STORAGE_KEYS = {
    TASKS: 'tasks_app_data_v1',
    USERS: 'tasks_app_users_v1'
};

export const storage = {
    getTasks: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.TASKS);
            if (!data) {
                const defaultTasks = [
                    {
                        id: 't-1',
                        title: 'Beber 2L de agua',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '1',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 't-2',
                        title: 'Hacer 30 min de ejercicio',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '2',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 't-3',
                        title: 'Lectura o estudio (20 min)',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    }
                ];
                storage.saveTasks(defaultTasks);
                return defaultTasks;
            }
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading tasks', error);
            return [];
        }
    },

    saveTasks: (tasks) => {
        try {
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks', error);
        }
    },

    getUsers: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.USERS);
            // Default users if none exist
            if (!data) {
                const defaultUsers = [
                    { id: '1', name: 'Mamá', color: 'hsl(340, 70%, 60%)' },
                    { id: '2', name: 'Papá', color: 'hsl(200, 70%, 60%)' },
                ];
                storage.saveUsers(defaultUsers);
                return defaultUsers;
            }
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading users', error);
            return [];
        }
    },

    saveUsers: (users) => {
        try {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        } catch (error) {
            console.error('Error saving users', error);
        }
    },

    getTheme: () => {
        try {
            const saved = localStorage.getItem('tasks_app_theme');
            if (saved) return saved;
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } catch {
            return 'light';
        }
    },

    setTheme: (theme) => {
        try {
            localStorage.setItem('tasks_app_theme', theme);
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } catch (error) {
            console.error('Error setting theme', error);
        }
    },

    exportBackup: () => {
        const payload = {
            version: '2.0',
            exportedAt: new Date().toISOString(),
            tasks: storage.getTasks(),
            users: storage.getUsers()
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().slice(0, 10);
        a.download = `HogarTasks_Backup_${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    importBackup: (jsonString) => {
        try {
            const parsed = JSON.parse(jsonString);
            if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
                throw new Error('Formato de tareas inválido');
            }
            storage.saveTasks(parsed.tasks);
            if (parsed.users && Array.isArray(parsed.users)) {
                storage.saveUsers(parsed.users);
            }
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    resetAll: () => {
        try {
            localStorage.removeItem(STORAGE_KEYS.TASKS);
            localStorage.removeItem(STORAGE_KEYS.USERS);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};
