import React, { useState, useMemo } from 'react';
import {
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    addWeeks,
    subWeeks,
    format,
    isToday as checkIsToday,
    subDays
} from 'date-fns';
import {
    Flame,
    Zap,
    Target,
    ChevronLeft,
    ChevronRight,
    Plus,
    Check,
    User,
    Calendar,
    Trash2,
    Award
} from 'lucide-react';
import { AddTaskModal } from './AddTaskModal';
import '../styles/habits.css';

const SPANISH_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const HabitTracker = ({ tasks, users, onToggleDate, onAdd, onDelete }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserFilter, setSelectedUserFilter] = useState('all');

    // 1. Calculate the 7 days of the currently selected week (Monday to Sunday)
    const weekDays = useMemo(() => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        const end = endOfWeek(currentDate, { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [currentDate]);

    // Navigation handlers
    const prevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    const todayStr = format(new Date(), 'yyyy-MM-dd');

    // Filter tasks by user if selected
    const filteredTasks = useMemo(() => {
        if (selectedUserFilter === 'all') return tasks;
        return tasks.filter(t => t.assignedTo === selectedUserFilter);
    }, [tasks, selectedUserFilter]);

    // 2. Metrics & Gamification Calculations
    const metrics = useMemo(() => {
        const total = filteredTasks.length;
        if (total === 0) {
            return {
                todayCompleted: 0,
                todayTotal: 0,
                todayPct: 0,
                weekChecks: 0,
                weekTotalPossible: 0,
                weekPct: 0,
                streak: 0,
                points: 0,
                level: 'Iniciado 🌱'
            };
        }

        // Today's metrics
        const todayCompleted = filteredTasks.filter(t => (t.completedDates || []).includes(todayStr)).length;
        const todayPct = Math.round((todayCompleted / total) * 100);

        // Week's metrics
        const weekDatesStr = weekDays.map(d => format(d, 'yyyy-MM-dd'));
        let weekChecks = 0;
        filteredTasks.forEach(task => {
            const dates = task.completedDates || [];
            weekDatesStr.forEach(dStr => {
                if (dates.includes(dStr)) weekChecks++;
            });
        });

        const weekTotalPossible = total * 7;
        const weekPct = Math.round((weekChecks / weekTotalPossible) * 100);

        // Streak calculation (consecutive days with at least 1 habit completed)
        let streak = 0;
        let testDate = new Date();
        const hasToday = tasks.some(t => (t.completedDates || []).includes(todayStr));
        if (!hasToday) {
            // Check if streak is alive from yesterday
            testDate = subDays(testDate, 1);
        }

        for (let i = 0; i < 60; i++) {
            const dateCheckStr = format(testDate, 'yyyy-MM-dd');
            const anyCompleted = tasks.some(t => (t.completedDates || []).includes(dateCheckStr));
            if (anyCompleted) {
                streak++;
                testDate = subDays(testDate, 1);
            } else {
                break;
            }
        }

        // Gamification Points & Level
        const points = (weekChecks * 15) + (streak * 20);
        let level = 'Iniciado 🌱';
        if (points >= 350) level = 'Modo Dios 👑';
        else if (points >= 200) level = 'Disciplina de Acero 🔥';
        else if (points >= 80) level = 'Enfocado ⚡';

        return {
            todayCompleted,
            todayTotal: total,
            todayPct,
            weekChecks,
            weekTotalPossible,
            weekPct,
            streak,
            points,
            level
        };
    }, [filteredTasks, tasks, todayStr, weekDays]);

    // SVG Donut calculation
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (metrics.weekPct / 100) * circumference;

    // Week totals per day column
    const dailyTotals = useMemo(() => {
        return weekDays.map(day => {
            const dStr = format(day, 'yyyy-MM-dd');
            const count = filteredTasks.filter(t => (t.completedDates || []).includes(dStr)).length;
            const pct = filteredTasks.length > 0 ? Math.round((count / filteredTasks.length) * 100) : 0;
            return { dStr, count, pct };
        });
    }, [weekDays, filteredTasks]);

    // Format header date range
    const weekRangeLabel = useMemo(() => {
        const start = weekDays[0];
        const end = weekDays[6];
        return `Semana del ${format(start, 'dd')} al ${format(end, 'dd/MM/yyyy')}`;
    }, [weekDays]);

    return (
        <div className="tracker-container">
            {/* Header with week navigation */}
            <div className="tracker-header">
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                        Rastreador de Hábitos & Disciplina 🕹️
                    </h1>
                    <p style={{ color: 'var(--color-text-softer)', fontSize: '0.9rem' }}>
                        Construye hábitos sólidos día a día, visualiza tus rachas y mide tu progreso.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    {/* Week Navigator */}
                    <div className="week-navigator">
                        <button className="week-nav-btn" onClick={prevWeek} title="Semana anterior">
                            <ChevronLeft size={18} />
                        </button>
                        <span className="week-nav-current">{weekRangeLabel}</span>
                        <button className="week-nav-btn" onClick={nextWeek} title="Semana siguiente">
                            <ChevronRight size={18} />
                        </button>
                        <button
                            onClick={goToToday}
                            style={{
                                fontSize: '0.75rem',
                                padding: '4px 8px',
                                background: 'transparent',
                                color: 'var(--color-primary)',
                                fontWeight: 700
                            }}
                        >
                            Hoy
                        </button>
                    </div>

                    <button
                        className="btn-primary"
                        onClick={() => setIsModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
                    >
                        <Plus size={18} /> Nuevo Hábito
                    </button>
                </div>
            </div>

            {/* Dashboard Hero: Donut & KPI Cards */}
            <div className="dashboard-grid">
                {/* Donut Chart: Cumplimiento semanal */}
                <div className="donut-card">
                    <div className="donut-wrapper">
                        <svg className="donut-svg" width="130" height="130" viewBox="0 0 130 130">
                            <circle
                                className="donut-bg"
                                cx="65"
                                cy="65"
                                r={radius}
                            />
                            <circle
                                className="donut-progress"
                                cx="65"
                                cy="65"
                                r={radius}
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                            />
                        </svg>
                        <div className="donut-text">
                            <span className="donut-percentage">{metrics.weekPct}%</span>
                            <span className="donut-sublabel">Semanal</span>
                        </div>
                    </div>
                    <div style={{ marginTop: 'var(--spacing-sm)', fontSize: '0.8rem', color: 'var(--color-text-softer)', fontWeight: 500 }}>
                        {metrics.weekChecks} de {metrics.weekTotalPossible} checks logrados
                    </div>
                </div>

                {/* KPI: Racha Activa */}
                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-label">Racha Activa</span>
                        <div className="kpi-icon-box" style={{ background: 'hsl(35, 100%, 94%)', color: 'hsl(25, 95%, 50%)' }}>
                            <Flame size={22} />
                        </div>
                    </div>
                    <div>
                        <div className="kpi-value">{metrics.streak} <span style={{ fontSize: '1rem', fontWeight: 600 }}>días</span></div>
                        <div className="kpi-footer" style={{ color: metrics.streak > 0 ? 'var(--color-success)' : 'var(--color-text-softer)' }}>
                            {metrics.streak > 0 ? '🔥 ¡Constancia imparable!' : 'Completa un hábito hoy para iniciar'}
                        </div>
                    </div>
                </div>

                {/* KPI: Objetivo de Hoy */}
                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-label">Objetivo de Hoy</span>
                        <div className="kpi-icon-box" style={{ background: 'hsl(210, 100%, 95%)', color: 'hsl(210, 100%, 50%)' }}>
                            <Target size={22} />
                        </div>
                    </div>
                    <div>
                        <div className="kpi-value">{metrics.todayCompleted} <span style={{ fontSize: '1rem', fontWeight: 600 }}>/ {metrics.todayTotal}</span></div>
                        <div className="habit-progress-bar-bg" style={{ marginTop: '8px', height: '6px' }}>
                            <div className="habit-progress-bar-fill" style={{ width: `${metrics.todayPct}%`, background: 'hsl(210, 100%, 50%)' }} />
                        </div>
                        <div className="kpi-footer" style={{ color: 'var(--color-text-softer)' }}>
                            {metrics.todayPct}% cumplido en la jornada
                        </div>
                    </div>
                </div>

                {/* KPI: Nivel y Puntos de Disciplina */}
                <div className="kpi-card">
                    <div className="kpi-top">
                        <span className="kpi-label">Puntuación de Disciplina</span>
                        <div className="kpi-icon-box" style={{ background: 'hsl(280, 100%, 95%)', color: 'hsl(280, 80%, 55%)' }}>
                            <Award size={22} />
                        </div>
                    </div>
                    <div>
                        <div className="kpi-value">{metrics.points} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>pts</span></div>
                        <div className="kpi-footer" style={{ color: 'hsl(280, 80%, 55%)', fontWeight: 700 }}>
                            {metrics.level}
                        </div>
                    </div>
                </div>
            </div>

            {/* Matrix Table: Weekly Grid */}
            <div className="matrix-card">
                <div className="matrix-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-main)' }}>
                            Matriz de Hábitos Semanal
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-softer)', background: 'var(--color-border)', padding: '2px 8px', borderRadius: '12px' }}>
                            {filteredTasks.length} {filteredTasks.length === 1 ? 'hábito' : 'hábitos'}
                        </span>
                    </div>

                    {/* Filter by assigned user */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-softer)' }}>Filtrar:</span>
                        <select
                            value={selectedUserFilter}
                            onChange={(e) => setSelectedUserFilter(e.target.value)}
                            style={{ padding: '4px 10px', fontSize: '0.85rem' }}
                        >
                            <option value="all">Todos los miembros</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="matrix-table-container">
                    <table className="matrix-table">
                        <thead>
                            <tr>
                                <th className="col-habit">Hábito / Rutina</th>
                                {weekDays.map((day, idx) => {
                                    const isToday = checkIsToday(day);
                                    return (
                                        <th key={idx} className={`col-day ${isToday ? 'is-today' : ''}`}>
                                            <div className="day-header-cell">
                                                <span className="day-name">{SPANISH_DAYS[idx]}</span>
                                                <span className="day-number">{format(day, 'd')}</span>
                                                {isToday && <span className="today-pill">HOY</span>}
                                            </div>
                                        </th>
                                    );
                                })}
                                <th style={{ minWidth: '130px', textAlign: 'center' }}>Progreso Semanal</th>
                                <th style={{ width: '40px' }}></th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredTasks.map(task => {
                                const assignedUser = users.find(u => u.id === task.assignedTo);
                                const dates = task.completedDates || [];

                                // Count completed days in this active week
                                let completedInWeek = 0;
                                weekDays.forEach(day => {
                                    const dStr = format(day, 'yyyy-MM-dd');
                                    if (dates.includes(dStr)) completedInWeek++;
                                });
                                const habitWeeklyPct = Math.round((completedInWeek / 7) * 100);

                                return (
                                    <tr key={task.id}>
                                        {/* Habit Details */}
                                        <td className="cell-habit">
                                            <div className="habit-title-box">
                                                <span className="habit-name">{task.title}</span>
                                                <div className="habit-meta">
                                                    {assignedUser ? (
                                                        <span
                                                            className="user-tag"
                                                            style={{
                                                                backgroundColor: `${assignedUser.color}20`,
                                                                color: assignedUser.color,
                                                                border: `1px solid ${assignedUser.color}50`
                                                            }}
                                                        >
                                                            <User size={10} /> {assignedUser.name}
                                                        </span>
                                                    ) : (
                                                        <span className="user-tag" style={{ background: '#f0f0f0', color: '#777' }}>
                                                            General
                                                        </span>
                                                    )}
                                                    <span>• {task.periodicity === 'daily' ? 'Diario' : task.periodicity}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 7 Days Checkboxes */}
                                        {weekDays.map((day, idx) => {
                                            const dStr = format(day, 'yyyy-MM-dd');
                                            const isChecked = dates.includes(dStr);
                                            const isToday = checkIsToday(day);

                                            return (
                                                <td key={idx} className={`cell-day ${isToday ? 'is-today' : ''}`}>
                                                    <button
                                                        type="button"
                                                        onClick={() => onToggleDate(task.id, dStr)}
                                                        className={`matrix-check-btn ${isChecked ? 'checked' : ''}`}
                                                        title={`${task.title} - ${SPANISH_DAYS[idx]} ${format(day, 'd/M')}`}
                                                    >
                                                        {isChecked && <Check size={18} strokeWidth={3} />}
                                                    </button>
                                                </td>
                                            );
                                        })}

                                        {/* Habit Weekly Progress Bar */}
                                        <td>
                                            <div className="habit-progress-bar-wrap">
                                                <div className="habit-progress-bar-bg">
                                                    <div
                                                        className="habit-progress-bar-fill"
                                                        style={{
                                                            width: `${habitWeeklyPct}%`,
                                                            background: habitWeeklyPct >= 70 ? 'var(--color-success)' : 'var(--color-primary)'
                                                        }}
                                                    />
                                                </div>
                                                <span className="habit-progress-label">{completedInWeek}/7</span>
                                            </div>
                                        </td>

                                        {/* Delete action */}
                                        <td style={{ textAlign: 'center' }}>
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(task.id)}
                                                    style={{
                                                        background: 'transparent',
                                                        color: 'var(--color-text-softer)',
                                                        padding: '4px',
                                                        borderRadius: '6px'
                                                    }}
                                                    title="Eliminar hábito"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredTasks.length === 0 && (
                                <tr>
                                    <td colSpan={10} style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-softer)' }}>
                                        No hay hábitos registrados para este filtro. ¡Pulsa "+ Nuevo Hábito" para añadir uno!
                                    </td>
                                </tr>
                            )}
                        </tbody>

                        {filteredTasks.length > 0 && (
                            <tfoot>
                                <tr className="matrix-totals-row">
                                    <td className="cell-habit">
                                        Total completados por día
                                    </td>
                                    {dailyTotals.map((item, idx) => (
                                        <td key={idx} className="cell-day">
                                            <div style={{ fontSize: '0.9rem', color: item.count > 0 ? 'var(--color-primary)' : 'var(--color-text-softer)' }}>
                                                {item.count}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-softer)', fontWeight: 500 }}>
                                                {item.pct}%
                                            </div>
                                        </td>
                                    ))}
                                    <td style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                                        {metrics.weekPct}% global
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

            {/* Modal for adding a new task / habit */}
            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={onAdd}
                users={users}
            />
        </div>
    );
};
