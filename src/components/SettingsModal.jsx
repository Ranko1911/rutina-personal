import React, { useState } from 'react';
import {
    X,
    Download,
    Upload,
    RotateCcw,
    Moon,
    Sun,
    Volume2,
    VolumeX,
    ShieldAlert,
    Check,
    FileText
} from 'lucide-react';
import { storage } from '../utils/storage';
import { soundFx } from '../utils/sound';

export const SettingsModal = ({ isOpen, onClose, isDark, onToggleTheme, onDataReload }) => {
    const [soundEnabled, setSoundEnabled] = useState(soundFx.isEnabled());
    const [statusMsg, setStatusMsg] = useState(null);
    const [showConfirmReset, setShowConfirmReset] = useState(false);

    if (!isOpen) return null;

    const handleToggleSound = () => {
        const next = soundFx.toggle();
        setSoundEnabled(next);
        if (next) soundFx.playCheck();
    };

    const handleExport = () => {
        storage.exportBackup();
        setStatusMsg({ type: 'success', text: 'Copia de seguridad descargada correctamente.' });
        setTimeout(() => setStatusMsg(null), 4000);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result;
            if (typeof content === 'string') {
                const res = storage.importBackup(content);
                if (res.success) {
                    setStatusMsg({ type: 'success', text: '¡Datos importados con éxito!' });
                    if (onDataReload) onDataReload();
                    setTimeout(() => setStatusMsg(null), 3000);
                } else {
                    setStatusMsg({ type: 'error', text: `Error al importar: ${res.error}` });
                }
            }
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        storage.resetAll();
        setShowConfirmReset(false);
        setStatusMsg({ type: 'success', text: 'Datos reiniciados de fábrica.' });
        if (onDataReload) onDataReload();
        setTimeout(() => setStatusMsg(null), 3000);
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
            <div className="card" style={{ width: '100%', maxWidth: '520px', boxShadow: 'var(--shadow-lg)' }}>
                {/* Header */}
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-md)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Configuración & Datos ⚙️
                    </h2>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', padding: '6px', borderRadius: '50%', color: 'var(--color-text-softer)' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Status Message */}
                {statusMsg && (
                    <div style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        marginBottom: 'var(--spacing-md)',
                        background: statusMsg.type === 'success' ? 'hsl(150, 70%, 93%)' : 'hsl(354, 80%, 95%)',
                        color: statusMsg.type === 'success' ? 'hsl(150, 70%, 30%)' : 'hsl(354, 80%, 40%)',
                        border: `1px solid ${statusMsg.type === 'success' ? 'hsl(150, 60%, 80%)' : 'hsl(354, 70%, 85%)'}`
                    }}>
                        {statusMsg.text}
                    </div>
                )}

                <div className="flex flex-col gap-md">
                    {/* Preferences Section */}
                    <div>
                        <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-softer)', marginBottom: 'var(--spacing-sm)' }}>
                            Preferencias de Interfaz
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
                            {/* Theme Toggle */}
                            <button
                                onClick={onToggleTheme}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 14px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--color-bg-app)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-main)'
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600 }}>
                                    {isDark ? <Moon size={18} color="var(--color-primary)" /> : <Sun size={18} color="var(--color-warning)" />}
                                    Tema {isDark ? 'Oscuro' : 'Claro'}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-softer)' }}>Cambiar</span>
                            </button>

                            {/* Sound Toggle */}
                            <button
                                onClick={handleToggleSound}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 14px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--color-bg-app)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-main)'
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 600 }}>
                                    {soundEnabled ? <Volume2 size={18} color="var(--color-success)" /> : <VolumeX size={18} color="var(--color-text-softer)" />}
                                    Sonidos
                                </span>
                                <span style={{ fontSize: '0.75rem', color: soundEnabled ? 'var(--color-success)' : 'var(--color-text-softer)' }}>
                                    {soundEnabled ? 'Activado' : 'Silencio'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Data Management Section */}
                    <div>
                        <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-softer)', marginBottom: 'var(--spacing-sm)' }}>
                            Copia de Seguridad y Portabilidad
                        </h3>

                        <div className="flex flex-col gap-sm">
                            {/* Export */}
                            <button
                                onClick={handleExport}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 14px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--color-bg-app)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-main)'
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 500 }}>
                                    <Download size={18} color="var(--color-primary)" /> Exportar Datos a JSON
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>Descargar</span>
                            </button>

                            {/* Import */}
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px 14px',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--color-bg-app)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-main)',
                                cursor: 'pointer'
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 500 }}>
                                    <Upload size={18} color="var(--color-primary)" /> Importar Copia de Seguridad
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>Seleccionar Archivo</span>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Reset Section */}
                    <div style={{ marginTop: 'var(--spacing-xs)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)' }}>
                        {!showConfirmReset ? (
                            <button
                                onClick={() => setShowConfirmReset(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'transparent',
                                    color: 'var(--color-danger, #e11d48)',
                                    fontSize: '0.85rem',
                                    padding: '4px 0',
                                    fontWeight: 600
                                }}
                            >
                                <RotateCcw size={16} /> Reiniciar datos de fábrica
                            </button>
                        ) : (
                            <div style={{
                                background: 'hsl(354, 80%, 96%)',
                                border: '1px solid hsl(354, 70%, 85%)',
                                borderRadius: 'var(--radius-md)',
                                padding: '12px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#be123c', fontWeight: 700, fontSize: '0.88rem' }}>
                                    <ShieldAlert size={18} /> ¿Estás seguro de reiniciar todo?
                                </div>
                                <p style={{ fontSize: '0.78rem', color: '#881337', margin: '6px 0 10px 0' }}>
                                    Se borrarán todas las tareas, hábitos y miembros creados, volviendo a los ejemplos iniciales.
                                </p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={handleReset}
                                        style={{
                                            background: '#e11d48',
                                            color: 'white',
                                            padding: '6px 14px',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            borderRadius: '6px'
                                        }}
                                    >
                                        Sí, reiniciar
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmReset(false)}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid #fda4af',
                                            color: '#881337',
                                            padding: '6px 14px',
                                            fontSize: '0.8rem',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
