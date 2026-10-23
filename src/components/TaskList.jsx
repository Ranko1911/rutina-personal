import React, { useState, useMemo } from 'react';
import { TaskItem } from './TaskItem';
import { Plus, Search } from 'lucide-react';
import { AddTaskModal } from './AddTaskModal';
import { CATEGORY_LIST } from '../utils/categories';

export const TaskList = ({ tasks, filterType, onAdd, onToggle, users }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedUser, setSelectedUser] = useState('all');

    const isAllTasksView = filterType === 'all' || filterType === 'custom';

    const getTitle = () => {
        if (isAllTasksView) return 'Todas las Tareas';
        if (filterType === 'daily') return 'Tareas Diarias';
        if (filterType === 'weekly') return 'Tareas Semanales';
        if (filterType === 'monthly') return 'Tareas Mensuales';
        return 'Tareas';
    };

    // Filter logic
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            // Periodicity filter
            if (filterType === 'daily' && task.periodicity !== 'daily') return false;
            if (filterType === 'weekly' && task.periodicity !== 'weekly') return false;
            if (filterType === 'monthly' && task.periodicity !== 'monthly') return false;
            // 'all' or 'custom' includes ALL periodicities

            // Category filter
            if (selectedCategory !== 'all' && (task.category || 'salud') !== selectedCategory) {
                return false;
            }

            // User filter
            if (selectedUser !== 'all') {
                if (selectedUser === 'unassigned') {
                    if (task.assignedTo) return false;
                } else {
                    if (task.assignedTo !== selectedUser) return false;
                }
            }

            // Search query
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                return task.title.toLowerCase().includes(query);
            }

            return true;
        });
    }, [tasks, filterType, selectedCategory, selectedUser, searchQuery]);

    // Sort: Incomplete first, then by title
    const sortedTasks = useMemo(() => {
        return [...filteredTasks].sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
        });
    }, [filteredTasks]);

    const completedCount = filteredTasks.filter(t => t.completed).length;

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <header className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                        {getTitle()}
                    </h1>
                    <p style={{ color: 'var(--color-text-softer)', fontSize: '0.88rem' }}>
                        {isAllTasksView 
                            ? `${tasks.length} tareas registradas en total • ${completedCount} completadas hoy`
                            : new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                        }
                    </p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setIsModalOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: '10px 18px' }}
                >
                    <Plus size={18} /> Nueva Tarea
                </button>
            </header>

            {/* Filter toolbar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 'var(--spacing-sm)',
                padding: '10px 14px',
                background: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
                    <div className="search-input-box" style={{ flex: 1, maxWidth: '320px' }}>
                        <Search size={16} color="var(--color-text-softer)" />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Buscar tarea..."
                        />
                    </div>

                    {/* Member Filter Dropdown */}
                    <select
                        value={selectedUser}
                        onChange={e => setSelectedUser(e.target.value)}
                        style={{
                            padding: '6px 12px',
                            fontSize: '0.82rem',
                            background: 'var(--color-bg-app)',
                            color: 'var(--color-text-main)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)'
                        }}
                    >
                        <option value="all">Todos los miembros</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>

                {/* Category Chips */}
                <div className="filter-chips">
                    <button
                        type="button"
                        className={`filter-chip ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        Todas
                    </button>
                    {CATEGORY_LIST.map(cat => (
                        <button
                            key={cat.id}
                            type="button"
                            className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                            style={{
                                color: selectedCategory === cat.id ? 'white' : cat.color,
                                borderColor: selectedCategory === cat.id ? cat.color : 'var(--color-border)'
                            }}
                        >
                            {cat.emoji} {cat.shortLabel}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--spacing-md)' }}>
                {sortedTasks.map(task => (
                    <TaskItem key={task.id} task={task} onToggle={onToggle} users={users} />
                ))}
                {sortedTasks.length === 0 && (
                    <div style={{
                        gridColumn: '1/-1',
                        textAlign: 'center',
                        padding: 'var(--spacing-xl)',
                        background: 'var(--color-bg-card)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-softer)'
                    }}>
                        No se encontraron tareas con los filtros aplicados.
                    </div>
                )}
            </div>

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={onAdd}
                users={users}
            />
        </div>
    );
};
