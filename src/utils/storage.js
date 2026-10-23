const STORAGE_KEYS = {
    TASKS: 'tasks_app_ancor_v3',
    USERS: 'tasks_app_users_ancor_v3'
};

export const DEFAULT_USERS = [
    { id: 'admin', name: 'Admin', color: 'hsl(230, 75%, 60%)', avatar: '🛡️', role: 'Administrador' },
    { id: 'ancor', name: 'Ancor', color: 'hsl(155, 75%, 45%)', avatar: '⚡', role: '25 años • Fitness & Futuro' }
];

export const DEFAULT_TASKS = [
    // 1. Salud & Fitness (Objetivo: Ponerse en forma)
    {
        id: 't-ancor-salud-1',
        title: 'Entrenamiento de fuerza / Gimnasio (tarde 17:00)',
        category: 'salud',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-salud-2',
        title: 'Caminar 8.000 a 10.000 pasos al día',
        category: 'salud',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-salud-3',
        title: 'Dormir 7.5 - 8h (acostarse antes de las 23:00)',
        category: 'salud',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-salud-4',
        title: 'Movilidad y estiramientos post-jornada (10 min)',
        category: 'salud',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-salud-5',
        title: 'Creatina, hidratación y suplementación matutina',
        category: 'salud',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },

    // 2. Higiene & Cuidado Personal
    {
        id: 't-ancor-higiene-1',
        title: 'Cepillado dental (desayuno, almuerzo post-trabajo y noche)',
        category: 'higiene',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-higiene-2',
        title: 'Hilo dental y enjuague bucal antes de dormir',
        category: 'higiene',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-higiene-3',
        title: 'Skincare matutino: limpieza facial + protector solar (antes de 7:30)',
        category: 'higiene',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-higiene-4',
        title: 'Ducha reparadora y cuidado personal tras entrenar',
        category: 'higiene',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },

    // 3. Nutrición & Hidratación (Jornada 7:30 - 15:30)
    {
        id: 't-ancor-nutri-1',
        title: 'Beber 2.5L a 3L de agua (botella en el trabajo)',
        category: 'nutricion',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-nutri-2',
        title: 'Cubrir objetivo diario de proteína (1.6 - 2g/kg)',
        category: 'nutricion',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-nutri-3',
        title: 'Comida limpia y saludable (cero ultraprocesados en el trabajo)',
        category: 'nutricion',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-nutri-4',
        title: 'Dejar preparado el tupper saludable para la jornada de mañana',
        category: 'nutricion',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },

    // 4. Mente, Enfoque en el Futuro & Finanzas
    {
        id: 't-ancor-mente-1',
        title: 'Bloque de avance en proyectos de futuro / estudio (45 min tarde)',
        category: 'mente',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-mente-2',
        title: 'Lectura formativa o desarrollo personal (20 min)',
        category: 'mente',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-mente-3',
        title: 'Cero pantallas 30 min antes de dormir',
        category: 'mente',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-mente-4',
        title: 'Revisión financiera semanal y plan de ahorro / inversión',
        category: 'mente',
        periodicity: 'weekly',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },

    // 5. Hogar & Disciplina
    {
        id: 't-ancor-hogar-1',
        title: 'Ventilar habitación 15m y cama hecha antes de salir a trabajar (7:15)',
        category: 'hogar',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-hogar-2',
        title: 'Cocina despejada y fregadero limpio tras cenar',
        category: 'hogar',
        periodicity: 'daily',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    },
    {
        id: 't-ancor-hogar-3',
        title: 'Planificación de comidas, colada y orden semanal (Domingo)',
        category: 'hogar',
        periodicity: 'weekly',
        customInterval: 1,
        assignedTo: 'ancor',
        completed: false,
        completedDates: [],
        lastCompletedAt: null,
        createdAt: new Date().toISOString()
    }
];

export const storage = {
    getTasks: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.TASKS);
            if (!data) {
                storage.saveTasks(DEFAULT_TASKS);
                return DEFAULT_TASKS;
            }
            const parsed = JSON.parse(data);
            return parsed.map(t => ({
                ...t,
                category: t.category || 'salud'
            }));
        } catch (error) {
            console.error('Error reading tasks', error);
            return DEFAULT_TASKS;
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
            if (!data) {
                storage.saveUsers(DEFAULT_USERS);
                return DEFAULT_USERS;
            }
            const parsed = JSON.parse(data);
            // Verify users are Admin and Ancor
            const hasAncor = parsed.some(u => u.name.toLowerCase() === 'ancor');
            if (!hasAncor || parsed.length > 2) {
                storage.saveUsers(DEFAULT_USERS);
                return DEFAULT_USERS;
            }
            return parsed;
        } catch (error) {
            console.error('Error reading users', error);
            return DEFAULT_USERS;
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
            version: '3.0',
            exportedAt: new Date().toISOString(),
            tasks: storage.getTasks(),
            users: storage.getUsers()
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().slice(0, 10);
        a.download = `HogarTasks_Ancor_${dateStr}.json`;
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

    // Generates a compact base64-encoded string for 1-click copy/paste sync between devices without a backend
    getSyncCode: () => {
        try {
            const payload = {
                v: 3,
                tasks: storage.getTasks(),
                users: storage.getUsers(),
                exportedAt: new Date().toISOString()
            };
            const json = JSON.stringify(payload);
            return btoa(encodeURIComponent(json));
        } catch (error) {
            console.error('Error generating sync code', error);
            return null;
        }
    },

    // Imports a compact sync code pasted from another device
    importSyncCode: (syncCode) => {
        try {
            if (!syncCode || typeof syncCode !== 'string') {
                throw new Error('El código de sincronización está vacío');
            }
            const json = decodeURIComponent(atob(syncCode.trim()));
            const data = JSON.parse(json);
            if (!data.tasks || !Array.isArray(data.tasks)) {
                throw new Error('El código no contiene hábitos válidos');
            }
            storage.saveTasks(data.tasks);
            if (data.users && Array.isArray(data.users)) {
                storage.saveUsers(data.users);
            }
            return { success: true, count: data.tasks.length };
        } catch (error) {
            return { success: false, error: error.message || 'Código de sincronización corrupto o no válido' };
        }
    },

    // Request persistent storage from the browser so browser cleanup tools don't purge data
    requestPersistence: async () => {
        try {
            if (navigator.storage && navigator.storage.persist) {
                const isPersisted = await navigator.storage.persist();
                return isPersisted;
            }
            return false;
        } catch {
            return false;
        }
    },

    resetAll: () => {
        try {
            localStorage.removeItem(STORAGE_KEYS.TASKS);
            localStorage.removeItem(STORAGE_KEYS.USERS);
            storage.saveTasks(DEFAULT_TASKS);
            storage.saveUsers(DEFAULT_USERS);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};
