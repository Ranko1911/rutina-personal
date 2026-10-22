import React from 'react';
import { LayoutDashboard, CheckSquare, Calendar, Users, Settings, Flame, BarChart2 } from 'lucide-react';

export const Layout = ({ children, activeTab, onTabChange }) => {
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

                <div style={{ marginTop: 'auto' }}>
                    <NavItem icon={<Users size={20} />} label="Usuarios" active={activeTab === 'users'} onClick={() => onTabChange('users')} />
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
