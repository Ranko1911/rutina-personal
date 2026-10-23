import React, { useMemo } from 'react';
import { subDays, format, getDay } from 'date-fns';
import {
    TrendingUp,
    BarChart2,
    CheckCircle,
    Calendar,
    Users,
    Zap,
    Flame,
    Award,
    Activity
} from 'lucide-react';
import { CATEGORY_LIST } from '../utils/categories';
import '../styles/analytics.css';

const SPANISH_WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const ORDERED_WEEKDAYS = [
    { idx: 1, name: 'Lunes' },
    { idx: 2, name: 'Martes' },
    { idx: 3, name: 'Miércoles' },
    { idx: 4, name: 'Jueves' },
    { idx: 5, name: 'Viernes' },
    { idx: 6, name: 'Sábado' },
    { idx: 0, name: 'Domingo' }
];

export const Analytics = ({ tasks, users }) => {
    // 1. Calculate historical metrics
    const stats = useMemo(() => {
        let totalCompletions = 0;
        const allCompletedDates = [];

        tasks.forEach(task => {
            const dates = task.completedDates || [];
            totalCompletions += dates.length;
            dates.forEach(d => allCompletedDates.push(d));
        });

        // 2. Heatmap data: Last 28 days
        const today = new Date();
        const last28Days = [];
        for (let i = 27; i >= 0; i--) {
            const dayDate = subDays(today, i);
            const dateStr = format(dayDate, 'yyyy-MM-dd');
            const checksCount = allCompletedDates.filter(d => d === dateStr).length;
            last28Days.push({
                dateStr,
                dayNumber: format(dayDate, 'd'),
                dayMonth: format(dayDate, 'dd/MM'),
                count: checksCount
            });
        }

        // 3. Day of week distribution (Lunes a Domingo)
        const dayDistribution = ORDERED_WEEKDAYS.map(({ idx, name }) => {
            const count = allCompletedDates.filter(dStr => {
                const parts = dStr.split('-');
                if (parts.length === 3) {
                    const parsed = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
                    return parsed.getDay() === idx;
                }
                return false;
            }).length;
            return { idx, name, count };
        });

        const maxDayCount = Math.max(...dayDistribution.map(d => d.count), 1);
        const bestDay = [...dayDistribution].sort((a, b) => b.count - a.count)[0];

        // 4. Performance by member
        const memberStats = users.map(user => {
            const userTasks = tasks.filter(t => t.assignedTo === user.id);
            let userChecks = 0;
            userTasks.forEach(t => {
                userChecks += (t.completedDates || []).length;
            });
            return {
                id: user.id,
                name: user.name,
                color: user.color,
                tasksCount: userTasks.length,
                completionsCount: userChecks
            };
        });

        // Add "General" for unassigned
        const unassignedTasks = tasks.filter(t => !t.assignedTo);
        let unassignedChecks = 0;
        unassignedTasks.forEach(t => {
            unassignedChecks += (t.completedDates || []).length;
        });
        if (unassignedTasks.length > 0) {
            memberStats.push({
                id: 'unassigned',
                name: 'Sin Asignar',
                color: '#8E8E8E',
                tasksCount: unassignedTasks.length,
                completionsCount: unassignedChecks
            });
        }

        // 5. Category distribution
        const categoryStats = CATEGORY_LIST.map(cat => {
            const catTasks = tasks.filter(t => (t.category || 'salud') === cat.id);
            let checks = 0;
            catTasks.forEach(t => {
                checks += (t.completedDates || []).length;
            });
            return {
                ...cat,
                tasksCount: catTasks.length,
                completionsCount: checks
            };
        });
        const maxCategoryChecks = Math.max(...categoryStats.map(c => c.completionsCount), 1);

        // 6. Frequency breakdown
        const periodicityStats = {
            daily: tasks.filter(t => t.periodicity === 'daily').length,
            weekly: tasks.filter(t => t.periodicity === 'weekly').length,
            monthly: tasks.filter(t => t.periodicity === 'monthly').length,
            custom: tasks.filter(t => t.periodicity === 'custom' || t.periodicity === 'onetime').length
        };

        return {
            totalCompletions,
            last28Days,
            dayDistribution,
            maxDayCount,
            bestDay: bestDay.count > 0 ? bestDay.name : 'Aún sin datos',
            memberStats,
            periodicityStats,
            categoryStats,
            maxCategoryChecks
        };
    }, [tasks, users]);

    return (
        <div className="analytics-container">
            {/* Header */}
            <div className="analytics-header">
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                        Analíticas & Rendimiento 📈
                    </h1>
                    <p style={{ color: 'var(--color-text-softer)', fontSize: '0.9rem' }}>
                        Patrones de constancia, impacto por miembro del hogar y hábitos más consistentes.
                    </p>
                </div>
            </div>

            {/* Top KPI Cards */}
            <div className="analytics-grid-kpis">
                <div className="analytics-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-softer)', fontWeight: 500 }}>
                            Total Hábitos Activos
                        </span>
                        <div style={{ padding: '8px', borderRadius: '10px', background: 'hsl(var(--primary-hue), 60%, 95%)', color: 'var(--color-primary)' }}>
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                        {tasks.length}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-softer)' }}>
                        Distribuidos en {users.length} integrantes
                    </span>
                </div>

                <div className="analytics-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-softer)', fontWeight: 500 }}>
                            Checks Históricos Totales
                        </span>
                        <div style={{ padding: '8px', borderRadius: '10px', background: 'hsl(150, 70%, 93%)', color: 'hsl(150, 70%, 40%)' }}>
                            <Zap size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                        {stats.totalCompletions}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'hsl(150, 70%, 40%)', fontWeight: 600 }}>
                        Acciones de disciplina registradas
                    </span>
                </div>

                <div className="analytics-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-softer)', fontWeight: 500 }}>
                            Día Más Productivo
                        </span>
                        <div style={{ padding: '8px', borderRadius: '10px', background: 'hsl(35, 100%, 93%)', color: 'hsl(35, 95%, 45%)' }}>
                            <Flame size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>
                        {stats.bestDay}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-softer)' }}>
                        Mayor volumen de hábitos completados
                    </span>
                </div>

                <div className="analytics-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-softer)', fontWeight: 500 }}>
                            Miembro Más Activo
                        </span>
                        <div style={{ padding: '8px', borderRadius: '10px', background: 'hsl(280, 80%, 95%)', color: 'hsl(280, 80%, 50%)' }}>
                            <Award size={20} />
                        </div>
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {stats.memberStats[0]?.name || 'N/A'}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'hsl(280, 80%, 50%)', fontWeight: 600 }}>
                        {stats.memberStats[0]?.completionsCount || 0} checks completados
                    </span>
                </div>
            </div>

            {/* Mid Section: Heatmap & Weekday Distribution */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'var(--spacing-md)' }}>
                {/* Heatmap: Últimos 28 Días */}
                <div className="analytics-card">
                    <div className="analytics-card-title">
                        <Calendar size={18} color="var(--color-primary)" />
                        Mapa de Constancia (Últimos 28 Días)
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-softer)' }}>
                        Registro visual continuo día a día para identificar vacíos de disciplina y rachas activas.
                    </p>

                    <div className="heatmap-container">
                        <div className="heatmap-grid">
                            {stats.last28Days.map((item, idx) => {
                                let lvlClass = 'heatmap-level-0';
                                if (item.count >= 3) lvlClass = 'heatmap-level-3';
                                else if (item.count === 2) lvlClass = 'heatmap-level-2';
                                else if (item.count === 1) lvlClass = 'heatmap-level-1';

                                return (
                                    <div
                                        key={idx}
                                        className={`heatmap-day-cell ${lvlClass}`}
                                        title={`${item.dayMonth}: ${item.count} hábitos completados`}
                                    >
                                        <span>{item.dayNumber}</span>
                                        <span style={{ fontSize: '0.62rem', opacity: 0.85 }}>{item.count > 0 ? `+${item.count}` : '·'}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', fontSize: '0.72rem', color: 'var(--color-text-softer)', marginTop: '8px' }}>
                            <span>Menos</span>
                            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'hsl(var(--primary-hue), 10%, 96%)', border: '1px solid var(--color-border)' }}></span>
                            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'hsl(150, 60%, 85%)' }}></span>
                            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'hsl(150, 65%, 65%)' }}></span>
                            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'hsl(150, 70%, 45%)' }}></span>
                            <span>Más</span>
                        </div>
                    </div>
                </div>

                {/* Weekday Distribution Bar Chart */}
                <div className="analytics-card">
                    <div className="analytics-card-title">
                        <BarChart2 size={18} color="var(--color-primary)" />
                        Completados por Día de la Semana
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-softer)' }}>
                        Descubre qué días de la semana la familia u hogar es más constante.
                    </p>

                    <div style={{ marginTop: 'var(--spacing-xs)' }}>
                        {stats.dayDistribution.map(day => {
                            const pct = Math.round((day.count / stats.maxDayCount) * 100);
                            return (
                                <div key={day.idx} className="weekday-bar-row">
                                    <span className="weekday-bar-label">{day.name.slice(0, 3)}</span>
                                    <div className="weekday-bar-track">
                                        <div
                                            className="weekday-bar-fill"
                                            style={{
                                                width: `${pct}%`,
                                                background: day.name === stats.bestDay && day.count > 0
                                                    ? 'hsl(35, 95%, 50%)'
                                                    : 'var(--color-primary)'
                                            }}
                                        />
                                    </div>
                                    <span className="weekday-bar-val">{day.count} chk</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Member Performance & Frequency Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-md)' }}>
                {/* Member Ranking */}
                <div className="analytics-card">
                    <div className="analytics-card-title">
                        <Users size={18} color="var(--color-primary)" />
                        Rendimiento por Integrante
                    </div>
                    <div className="user-rank-list">
                        {stats.memberStats.map(member => (
                            <div key={member.id} className="user-rank-item">
                                <div className="user-badge-large">
                                    <div className="user-avatar-circle" style={{ backgroundColor: member.color }}>
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div>{member.name}</div>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-softer)' }}>
                                            {member.tasksCount} tareas asignadas
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                                        {member.completionsCount}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-softer)' }}>
                                        checks realizados
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Performance Breakdown */}
                <div className="analytics-card">
                    <div className="analytics-card-title">
                        <Activity size={18} color="var(--color-primary)" />
                        Hábitos por Área de Vida
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-softer)' }}>
                        Constancia en Salud, Higiene, Nutrición, Hogar y Mente.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'var(--spacing-sm)' }}>
                        {stats.categoryStats.map(cat => {
                            const pct = Math.round((cat.completionsCount / stats.maxCategoryChecks) * 100);
                            return (
                                <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span>{cat.emoji}</span>
                                            <span>{cat.label}</span>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-softer)', fontWeight: 500 }}>
                                                ({cat.tasksCount} {cat.tasksCount === 1 ? 'hábito' : 'hábitos'})
                                            </span>
                                        </span>
                                        <span style={{ color: cat.color, fontWeight: 700 }}>
                                            {cat.completionsCount} checks
                                        </span>
                                    </div>
                                    <div style={{ height: '7px', background: 'var(--color-border)', borderRadius: '99px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                height: '100%',
                                                width: `${pct}%`,
                                                backgroundColor: cat.color,
                                                borderRadius: '99px',
                                                transition: 'width 0.4s ease'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Periodicity Breakdown */}
                <div className="analytics-card">
                    <div className="analytics-card-title">
                        <TrendingUp size={18} color="var(--color-primary)" />
                        Distribución por Periodicidad
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'hsl(var(--primary-hue), 15%, 98%)', borderRadius: '8px' }}>
                            <span style={{ fontWeight: 600 }}>Hábitos Diarios</span>
                            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{stats.periodicityStats.daily}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'hsl(var(--primary-hue), 15%, 98%)', borderRadius: '8px' }}>
                            <span style={{ fontWeight: 600 }}>Tareas Semanales</span>
                            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{stats.periodicityStats.weekly}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'hsl(var(--primary-hue), 15%, 98%)', borderRadius: '8px' }}>
                            <span style={{ fontWeight: 600 }}>Tareas Mensuales</span>
                            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{stats.periodicityStats.monthly}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'hsl(var(--primary-hue), 15%, 98%)', borderRadius: '8px' }}>
                            <span style={{ fontWeight: 600 }}>Personalizadas / Puntuales</span>
                            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{stats.periodicityStats.custom}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
