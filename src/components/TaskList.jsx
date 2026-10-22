import React, { useState } from 'react';
import { TaskItem } from './TaskItem';
import { Plus } from 'lucide-react';
import { AddTaskModal } from './AddTaskModal';

export const TaskList = ({ tasks, filterType, onAdd, onToggle, users }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter logic
    const filteredTasks = tasks.filter(task => {
        if (filterType === 'daily') return task.periodicity === 'daily';
        if (filterType === 'weekly') return task.periodicity === 'weekly';
        if (filterType === 'monthly') return task.periodicity === 'monthly';
        // Include one-time tasks in custom/all view
        if (filterType === 'custom') return task.periodicity === 'custom' || task.periodicity === 'onetime';
        return true;
    });

    // Sort: Incomplete first, then by title
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });

    return (
        <div style={{ height: '100%' }}>
            <header className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1 style={{ textTransform: 'capitalize' }}>
                        {filterType === 'custom' ? 'Todas las Tareas' : `Tareas ${filterType === 'weekly' ? 'Semanales' : filterType === 'monthly' ? 'Mensuales' : 'Diarias'}`}
                    </h1>
                    <p style={{ color: 'var(--color-text-softer)' }}>
                        {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Plus size={20} /> Nueva Tarea
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-md)' }}>
                {sortedTasks.map(task => (
                    <TaskItem key={task.id} task={task} onToggle={onToggle} users={users} />
                ))}
                {sortedTasks.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-softer)' }}>
                        No hay tareas pendientes en esta vista.
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
