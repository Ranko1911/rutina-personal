import React from 'react';
import { LayoutDashboard, CheckSquare, Calendar, Users, Settings, Flame, BarChart2, Sun, Moon } from 'lucide-react';

export const Layout = ({ children, activeTab, onTabChange, isDark, onToggleTheme, onOpenSettings }) => {
    return (
        <div className="layout" style={{ display: 'flex', minHeight: '100vh' }}>
            <aside style={{
                width: '250px',
                backgroundColor: 'var(--color-bg-card)',
                borderRight: '1px solid var(--color-border)',
                padding: 'var(--spacing-lg) var(--spacing-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-xl)',
                position: 'sticky',
                top: 0,
                height: '100vh'
            }}>
                <div className="logo" style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Flame size={24} color="var(--color-primary)" /> HogarTasks
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    <NavItem
                        icon={<Flame size={20} />}
                        label="Rastreador de Hábitos"
                        active={activeTab === 'habits'}
                        onClick={() => onTabChange('habits')}
                    />
                    <NavItem
                        icon={<BarChart2 size={20} />}
                        label="Analíticas"
                        active={activeTab === 'analytics'}
                        onClick={() => onTabChange('analytics')}
                    />
                    <NavItem icon={<LayoutDashboard size={20} />} label="Tareas Diarias" active={activeTab === 'daily'} onClick={() => onTabChange('daily')} />
                    <NavItem icon={<Calendar size={20} />} label="Semanales" active={activeTab === 'weekly'} onClick={() => onTabChange('weekly')} />
                    <NavItem icon={<Calendar size={20} />} label="Mensuales" active={activeTab === 'monthly'} onClick={() => onTabChange('monthly')} />
                    <NavItem icon={<CheckSquare size={20} />} label="Todas/Custom" active={activeTab === 'custom'} onClick={() => onTabChange('custom')} />
                </nav>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)' }}>
                    <NavItem icon={<Users size={20} />} label="Usuarios" active={activeTab === 'users'} onClick={() => onTabChange('users')} />
                    
                    {/* Theme and Settings Controls */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <button
                            onClick={onToggleTheme}
                            title={`Cambiar a tema ${isDark ? 'claro' : 'oscuro'}`}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                padding: '8px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                background: 'var(--color-bg-app)',
                                color: 'var(--color-text-main)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-sm)'
                            }}
                        >
                            {isDark ? <Sun size={16} color="var(--color-warning)" /> : <Moon size={16} color="var(--color-primary)" />}
                            {isDark ? 'Claro' : 'Oscuro'}
                        </button>

                        <button
                            onClick={onOpenSettings}
                            title="Configuración y Copias de Seguridad"
                            style={{
                                width: '38px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '8px',
                                background: 'var(--color-bg-app)',
                                color: 'var(--color-text-softer)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-sm)'
                            }}
                        >
                            <Settings size={18} />
                        </button>
                    </div>

                    {/* Local Data Storage Status Indicator */}
                    <button
                        onClick={onOpenSettings}
                        title="Tus datos se guardan automáticamente en este navegador de forma 100% privada. Pulsa para sincronizar o respaldar."
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '6px 10px',
                            marginTop: '2px',
                            background: 'var(--color-bg-app)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '0.72rem',
                            color: 'var(--color-text-softer)'
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }}></span>
                            <span style={{ fontWeight: 600 }}>Datos en Local</span>
                        </span>
                        <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Sincronizar</span>
                    </button>
                </div>
            </aside>

            <main style={{ flex: 1, padding: 'var(--spacing-xl)', overflowY: 'auto' }}>
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-md)',
            backgroundColor: active ? 'var(--color-primary-light)' : 'transparent',
            color: active ? 'var(--color-primary-dark)' : 'var(--color-text-softer)',
            fontWeight: active ? '600' : 'normal',
            width: '100%',
            textAlign: 'left'
        }}
    >
        {icon}
        {label}
    </button>
);
