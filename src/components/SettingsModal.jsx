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
    Copy,
    Smartphone,
    Database,
    ShieldCheck
} from 'lucide-react';
import { storage } from '../utils/storage';
import { soundFx } from '../utils/sound';

export const SettingsModal = ({ isOpen, onClose, isDark, onToggleTheme, onDataReload }) => {
    const [soundEnabled, setSoundEnabled] = useState(soundFx.isEnabled());
    const [statusMsg, setStatusMsg] = useState(null);
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const [pastedCode, setPastedCode] = useState('');
    const [isPersistent, setIsPersistent] = useState(false);

    if (!isOpen) return null;

    const showStatus = (type, text) => {
        setStatusMsg({ type, text });
        setTimeout(() => setStatusMsg(null), 4000);
    };

    const handleToggleSound = () => {
        const next = soundFx.toggle();
        setSoundEnabled(next);
        if (next) soundFx.playCheck();
    };

    const handleExport = () => {
        storage.exportBackup();
        showStatus('success', 'Copia de seguridad descargada correctamente.');
    };

    const handleCopySyncCode = () => {
        const code = storage.getSyncCode();
        if (code) {
            navigator.clipboard.writeText(code).then(() => {
                showStatus('success', '¡Código copiado al portapapeles! Pégalo en tu otro dispositivo.');
            }).catch(() => {
                showStatus('error', 'No se pudo copiar automáticamente. Usa la exportación JSON.');
            });
        }
    };

    const handleImportSyncCode = (e) => {
        e.preventDefault();
        if (!pastedCode.trim()) {
            showStatus('error', 'Pega primero un código de sincronización.');
            return;
        }
        const res = storage.importSyncCode(pastedCode);
        if (res.success) {
            setPastedCode('');
            showStatus('success', `¡Sincronización completada! Se cargaron ${res.count} hábitos.`);
            if (onDataReload) onDataReload();
        } else {
            showStatus('error', `Error al importar: ${res.error}`);
        }
    };

    const handleRequestPersistence = async () => {
        const granted = await storage.requestPersistence();
        setIsPersistent(granted);
        if (granted) {
            showStatus('success', '¡Almacenamiento persistente garantizado por el navegador!');
        } else {
            showStatus('success', 'El navegador ya gestiona tus datos de forma segura.');
        }
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
                    showStatus('success', '¡Datos importados con éxito!');
                    if (onDataReload) onDataReload();
                } else {
                    showStatus('error', `Error al importar: ${res.error}`);
                }
            }
        };
        reader.readAsText(file);
    };

    const handleReset = () => {
        storage.resetAll();
        setShowConfirmReset(false);
        showStatus('success', 'Rutina de Ancor restablecida con éxito.');
        if (onDataReload) onDataReload();
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
            <div className="card" style={{ width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
                {/* Header */}
                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Gestión de Datos Locales & Ajustes ⚙️
                        </h2>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-softer)' }}>
                            100% privado en tu navegador (Sin servidor externo)
                        </span>
                    </div>
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
                    {/* Cross-Device Instant Sync Section */}
                    <div style={{
                        padding: '12px 14px',
                        background: 'hsl(var(--primary-hue), 25%, 96%)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid hsla(var(--primary-hue), 50%, 50%, 0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                            <Smartphone size={18} /> Sincronizar Móvil / PC (En 1 Clic)
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-softer)', margin: '6px 0 10px 0' }}>
                            Lleva tus mismos hábitos de tu ordenador a tu móvil (o viceversa) copiando y pegando este código:
                        </p>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <button
                                onClick={handleCopySyncCode}
                                className="btn-primary"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 12px', fontSize: '0.82rem' }}
                            >
                                <Copy size={15} /> Copiar Código de Mis Datos
                            </button>
                        </div>

                        <form onSubmit={handleImportSyncCode} style={{ display: 'flex', gap: '6px' }}>
                            <input
                                value={pastedCode}
                                onChange={e => setPastedCode(e.target.value)}
                                placeholder="Pegar código de otro dispositivo aquí..."
                                style={{ flex: 1, fontSize: '0.8rem', padding: '6px 10px' }}
                            />
                            <button
                                type="submit"
                                style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    padding: '6px 12px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Restaurar
                            </button>
                        </form>
                    </div>

                    {/* Preferences Section */}
                    <div>
                        <h3 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-softer)', marginBottom: 'var(--spacing-xs)' }}>
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
                                    padding: '10px 14px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--color-bg-app)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-main)'
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                                    {isDark ? <Moon size={16} color="var(--color-primary)" /> : <Sun size={16} color="var(--color-warning)" />}
                                    Tema {isDark ? 'Oscuro' : 'Claro'}
                                </span>
                            </button>

                            {/* Sound Toggle */}
                            <button
                                onClick={handleToggleSound}
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
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                                    {soundEnabled ? <Volume2 size={16} color="var(--color-success)" /> : <VolumeX size={16} color="var(--color-text-softer)" />}
                                    Sonidos
                                </span>
                                <span style={{ fontSize: '0.72rem', color: soundEnabled ? 'var(--color-success)' : 'var(--color-text-softer)', fontWeight: 700 }}>
                                    {soundEnabled ? 'On' : 'Off'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Data Management Section */}
                    <div>
                        <h3 style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-softer)', marginBottom: 'var(--spacing-xs)' }}>
                            Archivos de Respaldo (.JSON)
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
                                    color: 'var(--color-text-main)',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 500 }}>
                                    <Download size={16} color="var(--color-primary)" /> Descargar Copia en Archivo JSON
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
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 500 }}>
                                    <Upload size={16} color="var(--color-primary)" /> Restaurar desde Archivo JSON
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>Subir</span>
                                <input
                                    type="file"
                                    accept=".json"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                            </label>

                            {/* Persistence Request */}
                            <button
                                onClick={handleRequestPersistence}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 14px',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--color-bg-app)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-main)',
                                    cursor: 'pointer'
                                }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 500 }}>
                                    <ShieldCheck size={16} color="var(--color-success)" /> Blindar Almacenamiento Permanente
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>Activar</span>
                            </button>
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
                                    color: 'var(--color-primary)',
                                    fontSize: '0.82rem',
                                    padding: '4px 0',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                <RotateCcw size={15} /> Restablecer a hábitos predeterminados de Ancor
                            </button>
                        ) : (
                            <div style={{
                                background: 'hsl(354, 80%, 96%)',
                                border: '1px solid hsl(354, 70%, 85%)',
                                borderRadius: 'var(--radius-md)',
                                padding: '12px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#be123c', fontWeight: 700, fontSize: '0.85rem' }}>
                                    <ShieldAlert size={16} /> ¿Reiniciar a los hábitos de Ancor?
                                </div>
                                <p style={{ fontSize: '0.78rem', color: '#881337', margin: '6px 0 10px 0' }}>
                                    Se restaurarán las rutinas completas de Salud, Higiene, Nutrición, Futuro y Hogar.
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
                                        Sí, restablecer
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
