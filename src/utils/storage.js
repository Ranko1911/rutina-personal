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
                    // Salud
                    {
                        id: 't-salud-1',
                        title: 'Hacer 30 min de ejercicio (fuerza / cardio)',
                        category: 'salud',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '1',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 't-salud-2',
                        title: 'Caminar 8.000 a 10.000 pasos al día',
                        category: 'salud',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '2',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 't-salud-3',
                        title: 'Dormir 7 a 8 horas de descanso reparador',
                        category: 'salud',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 't-salud-4',
                        title: 'Tomar vitaminas / suplementos matutinos',
                        category: 'salud',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '1',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    // Higiene
                    {
                        id: 't-higiene-1',
                        title: 'Cepillado dental completo (3 veces al día)',
                        category: 'higiene',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 't-higiene-2',
                        title: 'Rutina facial: limpieza, hidratante y solar',
                        category: 'higiene',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '1',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 't-higiene-3',
                        title: 'Hilo dental y enjuague bucal nocturno',
                        category: 'higiene',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '2',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 't-higiene-4',
                        title: 'Ducha y cuidado corporal',
                        category: 'higiene',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    // Nutrición
                    {
                        id: 't-nutri-1',
                        title: 'Beber 2 litros de agua',
                        category: 'nutricion',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 't-nutri-2',
                        title: 'Comer 3 porciones de fruta o verdura fresca',
                        category: 'nutricion',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '1',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    // Hogar
                    {
                        id: 't-hogar-1',
                        title: 'Ventilar habitación 15m y hacer la cama',
                        category: 'hogar',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 't-hogar-2',
                        title: 'Fregar platos y despejar cocina',
                        category: 'hogar',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '2',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    // Mente
                    {
                        id: 't-mente-1',
                        title: 'Lectura o estudio (20 min)',
                        category: 'mente',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 't-mente-2',
                        title: 'Desconexión de pantallas 30 min antes de dormir',
                        category: 'mente',
                        periodicity: 'daily',
                        customInterval: 1,
                        assignedTo: '1',
                        completed: false,
                        completedDates: [],
                        lastCompletedAt: null,
                        createdAt: new Date().toISOString()
                    }
                ];
                storage.saveTasks(defaultTasks);
                return defaultTasks;
            }
            const parsed = JSON.parse(data);
            // Ensure every task has a category assigned
            const inferCategory = (title = '') => {
                const lower = title.toLowerCase();
                if (lower.includes('agua') || lower.includes('fruta') || lower.includes('comer') || lower.includes('comida') || lower.includes('nutri')) return 'nutricion';
                if (lower.includes('diente') || lower.includes('facial') || lower.includes('skincare') || lower.includes('hilo') || lower.includes('ducha') || lower.includes('higiene')) return 'higiene';
                if (lower.includes('cama') || lower.includes('plato') || lower.includes('cocina') || lower.includes('limp') || lower.includes('lavadora') || lower.includes('hogar')) return 'hogar';
                if (lower.includes('leer') || lower.includes('lectura') || lower.includes('estudio') || lower.includes('medita') || lower.includes('pantalla') || lower.includes('mente')) return 'mente';
                return 'salud';
            };
            return parsed.map(t => ({
                ...t,
                category: t.category || inferCategory(t.title)
            }));
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
                    { id: '1', name: 'Mamá', color: 'hsl(340, 70%, 60%)', avatar: '👩', role: 'Salud & Cuidado' },
                    { id: '2', name: 'Papá', color: 'hsl(200, 70%, 60%)', avatar: '👨', role: 'Fitness & Hogar' },
                ];
                storage.saveUsers(defaultUsers);
                return defaultUsers;
            }
            const parsed = JSON.parse(data);
            return parsed.map((u, i) => ({
                ...u,
                avatar: u.avatar || (i % 2 === 0 ? '👩' : '👨'),
                role: u.role || 'Miembro'
            }));
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
