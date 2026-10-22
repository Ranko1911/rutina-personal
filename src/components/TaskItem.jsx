import React from 'react';
import { Check, Clock, User } from 'lucide-react';
import clsx from 'clsx';

export const TaskItem = ({ task, onToggle, users }) => {
    const assignedUser = users.find(u => u.id === task.assignedTo);

    // Custom logic for due date display if needed
    const getDueText = () => {
        if (!task.lastCompletedAt) return 'Pendiente';
        if (task.periodicity === 'daily') return 'Completado hoy';
        // ... logic for others ...
        return 'Completado';
    };

    return (
        <div
            className={clsx('card', { 'completed': task.completed })}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-md)',
                opacity: task.completed ? 0.7 : 1,
                transition: 'all 0.3s ease',
                borderLeft: `4px solid ${assignedUser ? assignedUser.color : 'transparent'}`
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <button
                    onClick={() => onToggle(task.id)}
                    style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: `2px solid ${task.completed ? 'var(--color-success)' : 'var(--color-border)'}`,
                        backgroundColor: task.completed ? 'var(--color-success)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        padding: 0
                    }}
                >
                    {task.completed && <Check size={16} />}
                </button>

                <div>
                    <h3 style={{
                        fontSize: '1rem',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'var(--color-text-softer)' : 'var(--color-text-main)'
                    }}>
                        {task.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', fontSize: '0.8rem', color: 'var(--color-text-softer)' }}>
                        {assignedUser && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f0f0f0', padding: '2px 8px', borderRadius: '10px' }}>
                                <User size={12} /> {assignedUser.name}
                            </span>
                        )}
                        {task.periodicity === 'custom' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} /> Cada {task.customInterval} días
                            </span>
                        )}
                        {task.periodicity === 'onetime' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} /> Una vez
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
