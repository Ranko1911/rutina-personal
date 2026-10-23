import React, { useState } from 'react';
import { Trash2, Plus, UserCheck, Shield } from 'lucide-react';

const AVATAR_OPTIONS = ['👩', '👨', '👧', '👦', '👵', '👴', '🧑', '⚡', '🌟', '🧘', '🏃'];

export const UserManagement = ({ users, onAddUser, onRemoveUser }) => {
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState('Salud & Bienestar');
    const [selectedAvatar, setSelectedAvatar] = useState('👩');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        onAddUser(newName.trim(), null, selectedAvatar, newRole.trim());
        setNewName('');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                    Perfiles de Usuario & Familia 👥
                </h1>
                <p style={{ color: 'var(--color-text-softer)', fontSize: '0.9rem' }}>
                    Organiza las responsabilidades y hábitos personales de salud, higiene y hogar para cada integrante.
                </p>
            </div>

            {/* Create Profile Card */}
            <div className="card" style={{ maxWidth: '600px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--spacing-md)' }}>
                    Añadir Nuevo Perfil
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                            Selecciona un Avatar:
                        </label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                            {AVATAR_OPTIONS.map(emoji => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setSelectedAvatar(emoji)}
                                    style={{
                                        fontSize: '1.2rem',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        border: `2px solid ${selectedAvatar === emoji ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                        backgroundColor: selectedAvatar === emoji ? 'var(--color-primary-light)' : 'var(--color-bg-app)',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                        <label style={{ flex: 1, minWidth: '200px', fontSize: '0.82rem', fontWeight: 600 }}>
                            Nombre del Integrante
                            <input
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                placeholder="Ej: Lucas, Carla..."
                                style={{
                                    width: '100%',
                                    marginTop: '6px',
                                    padding: '8px 12px',
                                    background: 'var(--color-bg-app)',
                                    color: 'var(--color-text-main)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-sm)'
                                }}
                            />
                        </label>

                        <label style={{ flex: 1, minWidth: '200px', fontSize: '0.82rem', fontWeight: 600 }}>
                            Rol o Enfoque
                            <input
                                value={newRole}
                                onChange={e => setNewRole(e.target.value)}
                                placeholder="Ej: Salud, Rutina diaria..."
                                style={{
                                    width: '100%',
                                    marginTop: '6px',
                                    padding: '8px 12px',
                                    background: 'var(--color-bg-app)',
                                    color: 'var(--color-text-main)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-sm)'
                                }}
                            />
                        </label>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-xs)' }}>
                        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px' }}>
                            <Plus size={16} /> Crear Perfil
                        </button>
                    </div>
                </form>
            </div>

            {/* Profiles Grid */}
            <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 'var(--spacing-md)' }}>
                    Perfiles Activos ({users.length})
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-md)' }}>
                    {users.map(user => (
                        <div
                            key={user.id}
                            className="card"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderLeft: `5px solid ${user.color}`
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        backgroundColor: `${user.color}25`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.4rem'
                                    }}
                                >
                                    {user.avatar || '👤'}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-main)' }}>
                                        {user.name}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--color-text-softer)' }}>
                                        {user.role || 'Miembro'}
                                    </div>
                                </div>
                            </div>

                            {user.id === 'admin' || user.id === 'ancor' ? (
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: 'var(--color-primary)',
                                    background: 'var(--color-primary-light)',
                                    padding: '4px 10px',
                                    borderRadius: '12px'
                                }}>
                                    <Shield size={13} /> Principal
                                </span>
                            ) : (
                                <button
                                    onClick={() => onRemoveUser(user.id)}
                                    style={{
                                        background: 'transparent',
                                        color: 'var(--color-warning)',
                                        padding: '6px',
                                        borderRadius: '6px'
                                    }}
                                    title={`Eliminar perfil de ${user.name}`}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
