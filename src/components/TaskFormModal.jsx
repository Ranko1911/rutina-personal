import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CATEGORY_LIST } from '../utils/categories';

export const TaskFormModal = ({ isOpen, onClose, onSave, taskToEdit = null, users = [] }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('salud');
    const [periodicity, setPeriodicity] = useState('daily');
    const [customInterval, setCustomInterval] = useState(1);
    const [assignedTo, setAssignedTo] = useState('');

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title || '');
            setCategory(taskToEdit.category || 'salud');
            setPeriodicity(taskToEdit.periodicity || 'daily');
            setCustomInterval(taskToEdit.customInterval || 1);
            setAssignedTo(taskToEdit.assignedTo || '');
        } else {
            setTitle('');
            setCategory('salud');
            setPeriodicity('daily');
            setCustomInterval(1);
            setAssignedTo('');
        }
    }, [taskToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        if (taskToEdit) {
            onSave(taskToEdit.id, {
                title: title.trim(),
                category,
                periodicity,
                customInterval,
                assignedTo
            });
        } else {
            onSave(title.trim(), periodicity, assignedTo, customInterval, category);
        }

        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--spacing-md)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-lg)' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-md)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                        {taskToEdit ? 'Editar Hábito / Tarea' : 'Nuevo Hábito / Tarea'}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', padding: '6px', borderRadius: '50%', color: 'var(--color-text-softer)' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                    <div className="flex flex-col gap-md">
                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                            Nombre del Hábito o Tarea
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Ej: Beber 2L de agua, Leer 20 mins..."
                                style={{
                                    width: '100%',
                                    marginTop: '6px',
                                    fontSize: '0.95rem',
                                    background: 'var(--color-bg-card)',
                                    color: 'var(--color-text-main)'
                                }}
                                autoFocus
                            />
                        </label>

                        {/* Category Selector Chips */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                                Área / Categoría
                            </span>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px' }}>
                                {CATEGORY_LIST.map(cat => {
                                    const isSelected = category === cat.id;
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setCategory(cat.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '7px 10px',
                                                borderRadius: 'var(--radius-sm)',
                                                border: `1.5px solid ${isSelected ? cat.color : 'var(--color-border)'}`,
                                                backgroundColor: isSelected ? `${cat.color}20` : 'var(--color-bg-card)',
                                                color: isSelected ? cat.color : 'var(--color-text-softer)',
                                                fontWeight: isSelected ? 700 : 500,
                                                fontSize: '0.82rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <span style={{ fontSize: '1.05rem' }}>{cat.emoji}</span>
                                            <span>{cat.shortLabel}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex gap-md">
                            <label style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                                Frecuencia
                                <select
                                    value={periodicity}
                                    onChange={e => setPeriodicity(e.target.value)}
                                    style={{
                                        width: '100%',
                                        marginTop: '6px',
                                        fontSize: '0.95rem',
                                        background: 'var(--color-bg-card)',
                                        color: 'var(--color-text-main)'
                                    }}
                                >
                                    <option value="daily">Diaria (Hábito continuo)</option>
                                    <option value="weekly">Semanal (1 vez por semana)</option>
                                    <option value="monthly">Mensual (1 vez por mes)</option>
                                    <option value="custom">Personalizada (Intervalo de días)</option>
                                    <option value="onetime">Puntual (Una sola vez)</option>
                                </select>
                            </label>

                            {periodicity === 'custom' && (
                                <label style={{ width: '120px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                                    Cada (días)
                                    <input
                                        type="number"
                                        min="1"
                                        max="365"
                                        value={customInterval}
                                        onChange={e => setCustomInterval(e.target.value)}
                                        style={{
                                            width: '100%',
                                            marginTop: '6px',
                                            fontSize: '0.95rem',
                                            background: 'var(--color-bg-card)',
                                            color: 'var(--color-text-main)'
                                        }}
                                    />
                                </label>
                            )}
                        </div>

                        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                            Asignar a
                            <select
                                value={assignedTo}
                                onChange={e => setAssignedTo(e.target.value)}
                                style={{
                                    width: '100%',
                                    marginTop: '6px',
                                    fontSize: '0.95rem',
                                    background: 'var(--color-bg-card)',
                                    color: 'var(--color-text-main)'
                                }}
                            >
                                <option value="">General / Sin asignar</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '8px 16px',
                                background: 'transparent',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-softer)'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px' }}
                        >
                            <Check size={18} /> {taskToEdit ? 'Guardar Cambios' : 'Crear Hábito'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Backwards compatibility export
export const AddTaskModal = (props) => <TaskFormModal {...props} onSave={props.onAdd} />;
