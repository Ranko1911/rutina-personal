import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export const AddTaskModal = ({ isOpen, onClose, onAdd, users }) => {
    const [title, setTitle] = useState('');
    const [periodicity, setPeriodicity] = useState('daily');
    const [customInterval, setCustomInterval] = useState(1);
    const [assignedTo, setAssignedTo] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAdd(title, periodicity, assignedTo, customInterval);
        setTitle('');
        setPeriodicity('daily');
        setAssignedTo('');
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-md)' }}>
                    <h2>Nueva Tarea</h2>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                    <div className="flex flex-col gap-md">
                        <label>
                            Título
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                style={{ width: '100%', marginTop: '4px' }}
                                autoFocus
                            />
                        </label>

                        <div className="flex gap-md">
                            <label style={{ flex: 1 }}>
                                Frecuencia
                                <select
                                    value={periodicity}
                                    onChange={e => setPeriodicity(e.target.value)}
                                    style={{ width: '100%', marginTop: '4px' }}
                                >
                                    <option value="daily">Diaria</option>
                                    <option value="weekly">Semanal</option>
                                    <option value="monthly">Mensual</option>
                                    <option value="custom">Personalizada</option>
                                    <option value="onetime">Una vez</option>
                                </select>
                            </label>

                            {periodicity === 'custom' && (
                                <label style={{ flex: 1 }}>
                                    Cada (días)
                                    <input
                                        type="number"
                                        min="1"
                                        value={customInterval}
                                        onChange={e => setCustomInterval(e.target.value)}
                                        style={{ width: '100%', marginTop: '4px' }}
                                    />
                                </label>
                            )}
                        </div>

                        <label>
                            Asignar a
                            <select
                                value={assignedTo}
                                onChange={e => setAssignedTo(e.target.value)}
                                style={{ width: '100%', marginTop: '4px' }}
                            >
                                <option value="">Sin asignar</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <button type="submit" className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        <Check size={18} /> Guardar Tarea
                    </button>
                </form>
            </div>
        </div>
    );
};
