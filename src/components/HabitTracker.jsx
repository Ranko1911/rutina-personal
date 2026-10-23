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
    Award,
    Search,
    Edit3,
    Sparkles,
    Layers
} from 'lucide-react';
import { TaskFormModal } from './TaskFormModal';
import { soundFx } from '../utils/sound';
import { launchConfetti } from '../utils/confetti';
import { CATEGORY_LIST, getCategoryMeta } from '../utils/categories';
import '../styles/habits.css';

const SPANISH_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const MOTIVATIONAL_QUOTES = [
    "“Somos lo que hacemos día a día. De modo que la excelencia no es un acto sino un hábito.” — Aristóteles",
    "“La disciplina es el puente entre las metas y los logros.” — Jim Rohn",
    "“No cuentes los días, haz que los días cuenten.” — Muhammad Ali",
    "“La motivación te pone en marcha; el hábito te mantiene constante.” — Jim Ryun",
    "“Los pequeños hábitos repetidos diariamente producen transformaciones extraordinarias.” — James Clear"
];

export const HabitTracker = ({ tasks, users, onToggleDate, onAdd, onUpdate, onDelete }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [selectedUserFilter, setSelectedUserFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [periodicityFilter, setPeriodicityFilter] = useState('all');
    const [groupByCategory, setGroupByCategory] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Week calculation (Monday to Sunday)
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

    // Quote of the day (based on current day of month)
    const quoteOfTheDay = useMemo(() => {
        const dayOfMonth = new Date().getDate();
        return MOTIVATIONAL_QUOTES[dayOfMonth % MOTIVATIONAL_QUOTES.length];
    }, []);

    // Filter tasks by user, category, periodicity, and search query
    const filteredTasks = useMemo(() => {
        return tasks.filter(t => {
            const matchUser = selectedUserFilter === 'all' || t.assignedTo === selectedUserFilter;
            const matchPeriod = periodicityFilter === 'all' || t.periodicity === periodicityFilter;
            const matchCategory = categoryFilter === 'all' || (t.category || 'salud') === categoryFilter;
            const matchSearch = !searchQuery.trim() || t.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchUser && matchPeriod && matchCategory && matchSearch;
        });
    }, [tasks, selectedUserFilter, periodicityFilter, categoryFilter, searchQuery]);

    // Metrics & Gamification Calculations
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

        const todayCompleted = filteredTasks.filter(t => (t.completedDates || []).includes(todayStr)).length;
        const todayPct = Math.round((todayCompleted / total) * 100);

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

        // Streak calculation
        let streak = 0;
        let testDate = new Date();
        const hasToday = tasks.some(t => (t.completedDates || []).includes(todayStr));
        if (!hasToday) {
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

    // Handle check click with sensory feedback
    const handleToggleCheck = (taskId, dStr) => {
        soundFx.playCheck();
        onToggleDate(taskId, dStr);

        const targetTask = tasks.find(t => t.id === taskId);
        const wasChecked = (targetTask?.completedDates || []).includes(dStr);

        // If completing a task today reaches 100% of all tasks, trigger celebration
        if (!wasChecked && dStr === todayStr) {
            const upcomingCompleted = metrics.todayCompleted + 1;
            if (upcomingCompleted >= metrics.todayTotal && metrics.todayTotal > 0) {
                soundFx.playCelebration();
                launchConfetti();
            }
        }
    };

    const handleOpenEdit = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const handleSaveTask = (...args) => {
        if (taskToEdit && onUpdate) {
            onUpdate(args[0], args[1]);
        } else {
            onAdd(args[0], args[1], args[2], args[3], args[4]);
        }
        setTaskToEdit(null);
    };

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

    const weekRangeLabel = useMemo(() => {
        const start = weekDays[0];
        const end = weekDays[6];
        return `Semana del ${format(start, 'dd')} al ${format(end, 'dd/MM/yyyy')}`;
    }, [weekDays]);

    return (
        <div className="tracker-container">
            {/* Motivation Quote Banner */}
            <div className="motivation-banner">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="var(--color-primary)" /> {quoteOfTheDay}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-softer)', fontWeight: 600 }}>
                    HogarTasks Pro
                </span>
            </div>

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
                        onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}
                    >
                        <Plus size={18} /> Nuevo Hábito
                    </button>
                </div>
            </div>

            {/* Profile Selector Bar */}
            <div className="profile-selector-bar">
                <div className="profile-selector-label">
                    <User size={15} /> Perfil:
                </div>
                <div className="profile-chips">
                    <button
                        type="button"
                        className={`profile-chip ${selectedUserFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedUserFilter('all')}
                    >
                        <span className="profile-chip-avatar" style={{ backgroundColor: 'hsla(var(--primary-hue), 70%, 50%, 0.15)' }}>✨</span>
                        <div className="profile-chip-info">
                            <span className="profile-chip-name">Vista Global</span>
                            <span className="profile-chip-sub">Todos los hábitos</span>
                        </div>
                        <span className="profile-chip-badge">{tasks.length}</span>
                    </button>
                    {users.map(u => {
                        const uTasks = tasks.filter(t => t.assignedTo === u.id);
                        const uTodayCompleted = uTasks.filter(t => (t.completedDates || []).includes(todayStr)).length;
                        const isSelected = selectedUserFilter === u.id;
                        return (
                            <button
                                key={u.id}
                                type="button"
                                className={`profile-chip ${isSelected ? 'active' : ''}`}
                                onClick={() => setSelectedUserFilter(u.id)}
                                style={{
                                    borderColor: isSelected ? u.color : undefined,
                                    backgroundColor: isSelected ? `${u.color}18` : undefined
                                }}
                            >
                                <span className="profile-chip-avatar" style={{ backgroundColor: `${u.color}25` }}>
                                    {u.avatar || '👤'}
                                </span>
                                <div className="profile-chip-info">
                                    <span className="profile-chip-name" style={{ color: isSelected ? u.color : undefined }}>
                                        {u.name}
                                    </span>
                                    <span className="profile-chip-sub">
                                        {uTodayCompleted}/{uTasks.length} hoy
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Ancor Custom Profile Focus Banner */}
            {(selectedUserFilter === 'ancor' || selectedUserFilter === 'all') && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    background: 'linear-gradient(90deg, hsla(155, 75%, 45%, 0.12), hsla(210, 80%, 55%, 0.12))',
                    border: '1.5px solid hsla(155, 75%, 45%, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    flexWrap: 'wrap',
                    gap: '12px',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.8rem' }}>⚡</span>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '1.02rem', color: 'var(--color-text-main)' }}>
                                Rutina & Hábitos de Ancor (25 años)
                            </div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--color-text-softer)' }}>
                                ⏰ Jornada Laboral: <strong>07:30 a 15:30</strong> (Lunes a Viernes) • 🎯 Enfoque: <strong>Fitness, Salud e Higiene & Construcción de Futuro</strong>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.78rem', fontWeight: 600 }}>
                        <span style={{ background: 'var(--color-bg-card)', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--color-border)', color: 'hsl(150, 70%, 42%)' }}>
                            🏋️‍♂️ Ponerse en forma
                        </span>
                        <span style={{ background: 'var(--color-bg-card)', padding: '4px 10px', borderRadius: '12px', border: '1px solid var(--color-border)', color: 'hsl(225, 75%, 56%)' }}>
                            🚀 Enfoque en el Futuro
                        </span>
                    </div>
                </div>
            )}

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

                {/* KPI: Puntuación de Disciplina */}
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

            {/* Matrix Card */}
            <div className="matrix-card">
                {/* Header bar with member filter */}
                <div className="matrix-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-main)' }}>
                            Matriz de Hábitos Semanal
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-softer)', background: 'var(--color-border)', padding: '2px 8px', borderRadius: '12px' }}>
                            {filteredTasks.length} {filteredTasks.length === 1 ? 'hábito' : 'hábitos'}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-softer)' }}>Filtrar Miembro:</span>
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

                {/* Search and Category Toolbar */}
                <div className="matrix-toolbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flexWrap: 'wrap', flex: 1 }}>
                        <div className="search-input-box">
                            <Search size={16} color="var(--color-text-softer)" />
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Buscar hábito..."
                            />
                        </div>

                        {/* Category Filter Chips */}
                        <div className="filter-chips">
                            <button
                                className={`filter-chip ${categoryFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setCategoryFilter('all')}
                            >
                                Todas las áreas
                            </button>
                            {CATEGORY_LIST.map(cat => {
                                const isActive = categoryFilter === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        className={`filter-chip ${isActive ? 'active' : ''}`}
                                        onClick={() => setCategoryFilter(cat.id)}
                                        style={isActive ? { backgroundColor: cat.color, borderColor: cat.color, color: 'white' } : {}}
                                    >
                                        <span>{cat.emoji}</span> {cat.shortLabel}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                            type="button"
                            onClick={() => setGroupByCategory(prev => !prev)}
                            className={`filter-chip ${groupByCategory ? 'active' : ''}`}
                            title="Alternar vista agrupada por categorías de vida"
                            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                            <Layers size={13} /> {groupByCategory ? 'Agrupado' : 'Sin agrupar'}
                        </button>
                    </div>
                </div>

                {/* Table */}
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
                                <th style={{ width: '70px', textAlign: 'center' }}>Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={10} style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-softer)' }}>
                                        No se encontraron hábitos con los filtros aplicados.
                                    </td>
                                </tr>
                            ) : groupByCategory && categoryFilter === 'all' ? (
                                CATEGORY_LIST.map(cat => {
                                    const catTasks = filteredTasks.filter(t => (t.category || 'salud') === cat.id);
                                    if (catTasks.length === 0) return null;
                                    return (
                                        <React.Fragment key={cat.id}>
                                            <tr className="category-section-header">
                                                <td colSpan={10}>
                                                    <div
                                                        className="category-header-pill"
                                                        style={{
                                                            color: cat.color,
                                                            backgroundColor: `${cat.color}15`,
                                                            border: `1px solid ${cat.color}35`
                                                        }}
                                                    >
                                                        <span style={{ fontSize: '1rem' }}>{cat.emoji}</span>
                                                        <span>{cat.label.toUpperCase()}</span>
                                                        <span className="category-count">({catTasks.length} {catTasks.length === 1 ? 'hábito' : 'hábitos'})</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            {catTasks.map(task => {
                                                const assignedUser = users.find(u => u.id === task.assignedTo);
                                                const dates = task.completedDates || [];
                                                const catMeta = getCategoryMeta(task.category);

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
                                                                    <span
                                                                        className="category-badge"
                                                                        style={{
                                                                            backgroundColor: `${catMeta.color}18`,
                                                                            color: catMeta.color,
                                                                            border: `1px solid ${catMeta.color}35`
                                                                        }}
                                                                    >
                                                                        {catMeta.emoji} {catMeta.shortLabel}
                                                                    </span>
                                                                    {assignedUser ? (
                                                                        <span
                                                                            className="user-tag"
                                                                            style={{
                                                                                backgroundColor: `${assignedUser.color}20`,
                                                                                color: assignedUser.color,
                                                                                border: `1px solid ${assignedUser.color}50`
                                                                            }}
                                                                        >
                                                                            <span style={{ fontSize: '0.85rem' }}>{assignedUser.avatar || '👤'}</span> {assignedUser.name}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="user-tag" style={{ background: 'var(--color-bg-app)', color: 'var(--color-text-softer)' }}>
                                                                            ✨ Familia
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
                                                                        onClick={() => handleToggleCheck(task.id, dStr)}
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

                                                        {/* Actions (Edit and Delete) */}
                                                        <td style={{ textAlign: 'center' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                                <button
                                                                    onClick={() => handleOpenEdit(task)}
                                                                    style={{
                                                                        background: 'transparent',
                                                                        color: 'var(--color-text-softer)',
                                                                        padding: '6px',
                                                                        borderRadius: '6px'
                                                                    }}
                                                                    title="Editar hábito"
                                                                >
                                                                    <Edit3 size={15} />
                                                                </button>
                                                                {onDelete && (
                                                                    <button
                                                                        onClick={() => onDelete(task.id)}
                                                                        style={{
                                                                            background: 'transparent',
                                                                            color: 'var(--color-text-softer)',
                                                                            padding: '6px',
                                                                            borderRadius: '6px'
                                                                        }}
                                                                        title="Eliminar hábito"
                                                                    >
                                                                        <Trash2 size={15} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                filteredTasks.map(task => {
                                    const assignedUser = users.find(u => u.id === task.assignedTo);
                                    const dates = task.completedDates || [];
                                    const catMeta = getCategoryMeta(task.category);

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
                                                        <span
                                                            className="category-badge"
                                                            style={{
                                                                backgroundColor: `${catMeta.color}18`,
                                                                color: catMeta.color,
                                                                border: `1px solid ${catMeta.color}35`
                                                            }}
                                                        >
                                                            {catMeta.emoji} {catMeta.shortLabel}
                                                        </span>
                                                        {assignedUser ? (
                                                            <span
                                                                className="user-tag"
                                                                style={{
                                                                    backgroundColor: `${assignedUser.color}20`,
                                                                    color: assignedUser.color,
                                                                    border: `1px solid ${assignedUser.color}50`
                                                                }}
                                                            >
                                                                <span style={{ fontSize: '0.85rem' }}>{assignedUser.avatar || '👤'}</span> {assignedUser.name}
                                                            </span>
                                                        ) : (
                                                            <span className="user-tag" style={{ background: 'var(--color-bg-app)', color: 'var(--color-text-softer)' }}>
                                                                ✨ Familia
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
                                                            onClick={() => handleToggleCheck(task.id, dStr)}
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

                                            {/* Actions (Edit and Delete) */}
                                            <td style={{ textAlign: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                    <button
                                                        onClick={() => handleOpenEdit(task)}
                                                        style={{
                                                            background: 'transparent',
                                                            color: 'var(--color-text-softer)',
                                                            padding: '6px',
                                                            borderRadius: '6px'
                                                        }}
                                                        title="Editar hábito"
                                                    >
                                                        <Edit3 size={15} />
                                                    </button>
                                                    {onDelete && (
                                                        <button
                                                            onClick={() => onDelete(task.id)}
                                                            style={{
                                                                background: 'transparent',
                                                                color: 'var(--color-text-softer)',
                                                                padding: '6px',
                                                                borderRadius: '6px'
                                                            }}
                                                            title="Eliminar hábito"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}

                            {filteredTasks.length === 0 && (
                                <tr>
                                    <td colSpan={10} style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-softer)' }}>
                                        No se encontraron hábitos con los filtros aplicados.
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

            {/* Task / Habit Modal */}
            <TaskFormModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }}
                onSave={handleSaveTask}
                taskToEdit={taskToEdit}
                users={users}
            />
        </div>
    );
};
