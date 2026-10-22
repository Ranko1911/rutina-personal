import React, { useState } from 'react';
import { Trash, Plus } from 'lucide-react';

export const UserManagement = ({ users, onAddUser, onRemoveUser }) => {
    const [newName, setNewName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        onAddUser(newName);
        setNewName('');
    };

    return (
        <div>
            <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Gestión de Usuarios</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', margin: '20px 0' }}>
                <input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Nombre del nuevo usuario"
                    style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={16} /> Agregar
                </button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                {users.map(user => (
                    <div key={user.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: user.color }}></div>
                            <span style={{ fontWeight: '500' }}>{user.name}</span>
                        </div>
                        {/* Prevent deleting default users if needed, or allow all */}
                        <button onClick={() => onRemoveUser(user.id)} style={{ color: 'var(--color-warning)', padding: '4px' }}>
                            <Trash size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
