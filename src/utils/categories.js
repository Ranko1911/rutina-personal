export const CATEGORIES = {
    salud: {
        id: 'salud',
        label: 'Salud & Ejercicio',
        shortLabel: 'Salud',
        emoji: '🩺',
        color: 'hsl(150, 70%, 42%)',
        lightBg: 'hsl(150, 70%, 94%)',
        darkBg: 'hsl(150, 50%, 16%)'
    },
    higiene: {
        id: 'higiene',
        label: 'Higiene & Cuidado',
        shortLabel: 'Higiene',
        emoji: '🪥',
        color: 'hsl(195, 85%, 45%)',
        lightBg: 'hsl(195, 85%, 94%)',
        darkBg: 'hsl(195, 60%, 16%)'
    },
    nutricion: {
        id: 'nutricion',
        label: 'Nutrición & Agua',
        shortLabel: 'Nutrición',
        emoji: '🥗',
        color: 'hsl(32, 95%, 48%)',
        lightBg: 'hsl(32, 95%, 94%)',
        darkBg: 'hsl(32, 60%, 16%)'
    },
    hogar: {
        id: 'hogar',
        label: 'Hogar & Orden',
        shortLabel: 'Hogar',
        emoji: '🧹',
        color: 'hsl(275, 65%, 52%)',
        lightBg: 'hsl(275, 65%, 94%)',
        darkBg: 'hsl(275, 45%, 18%)'
    },
    mente: {
        id: 'mente',
        label: 'Mente & Estudio',
        shortLabel: 'Mente',
        emoji: '🧠',
        color: 'hsl(225, 75%, 56%)',
        lightBg: 'hsl(225, 75%, 94%)',
        darkBg: 'hsl(225, 50%, 18%)'
    }
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export const getCategoryMeta = (categoryId) => {
    return CATEGORIES[categoryId] || {
        id: 'salud',
        label: 'General',
        shortLabel: 'General',
        emoji: '⚡',
        color: 'var(--color-primary)',
        lightBg: 'var(--color-bg-app)',
        darkBg: 'var(--color-bg-app)'
    };
};

// Helper for translucent tints in both light and dark modes
export const hslWithAlpha = (hslString, alpha = 0.2) => {
    if (!hslString) return 'transparent';
    if (hslString.startsWith('hsl(')) {
        return hslString.replace('hsl(', 'hsla(').replace(')', `, ${alpha})`);
    }
    return hslString;
};
