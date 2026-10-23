# 📘 Documentación Oficial de HogarTasks (TasksHelper)

Bienvenido a la documentación de **HogarTasks**, la aplicación de productividad, gamificación y gestión de hábitos y tareas para el hogar.

---

## 📑 Índice de Contenidos
1. [Guía de Uso](#1-guía-de-uso)
   * [1.1. Rastreador de Hábitos Semanal (Matriz L-D)](#11-rastreador-de-hábitos-semanal-matriz-l-d)
   * [1.2. Dashboard de Gamificación y Niveles](#12-dashboard-de-gamificación-y-niveles)
   * [1.3. Gestión y Asignación de Tareas](#13-gestión-y-asignación-de-tareas)
   * [1.4. Gestión de Miembros del Hogar](#14-gestión-de-miembros-del-hogar)
2. [Guía de Configuración y Desarrollo](#2-guía-de-configuración-y-desarrollo)
   * [2.1. Requisitos Previos](#21-requisitos-previos)
   * [2.2. Instalación y Puesta en Marcha](#22-instalación-y-puesta-en-marcha)
   * [2.3. Estructura de Almacenamiento (localStorage)](#23-estructura-de-almacenamiento-localstorage)
   * [2.4. Personalización del Sistema de Diseño (CSS)](#24-personalización-del-sistema-de-diseño-css)
   * [2.5. Ajuste de Reglas de Reseteo Automático](#25-ajuste-de-reglas-de-reseteo-automático)
3. [Apartado de Analíticas & Rendimiento](#3-apartado-de-analíticas--rendimiento)
   * [3.1. Métricas Principales (KPIs)](#31-métricas-principales-kpis)
   * [3.2. Mapa de Constancia (Últimos 28 Días)](#32-mapa-de-constancia-últimos-28-días)
   * [3.3. Rendimiento por Día de la Semana](#33-rendimiento-por-día-de-la-semana)
   * [3.4. Distribución por Integrante y Periodicidad](#34-distribución-por-integrante-y-periodicidad)

---

## 1. Guía de Uso

### 1.1. Rastreador de Hábitos Semanal (Matriz L-D)
La pantalla principal actúa como una matriz visual inspirada en metodologías de alto rendimiento (*No Excuses*):
* **Marcar / Desmarcar Días**: Haz clic en cualquier casilla correspondiente al día de la semana (Lunes a Domingo) para registrar que has completado el hábito ese día.
* **Indicador HOY**: La columna correspondiente al día actual se resalta automáticamente con una insignia morada para evitar confusiones.
* **Progreso por Hábito**: La barra a la derecha de cada hábito calcula en tiempo real cuántos días de la semana has cumplido ($X/7$ días y %). Si superas el 70%, la barra cambiará automáticamente a verde éxito.
* **Navegación Temporal**: Usa las flechas `<` y `>` para revisar semanas pasadas o planificar semanas futuras. Pulsa el botón **"Hoy"** para regresar inmediatamente a la semana en curso.
* **Filtro por Integrante**: En la cabecera de la matriz puedes filtrar para ver únicamente los hábitos de un miembro específico o de todos.

### 1.2. Dashboard de Gamificación y Niveles
En la parte superior de la vista de hábitos se calculan en vivo tus estadísticas:
* **Gráfico Donut Circular SVG**: Representa el porcentaje de efectividad de la semana actual ($Total\ Checks\ Logrados / Total\ Checks\ Posibles$).
* **Racha Activa (Streaks 🔥)**: Mide los días consecutivos en los que se ha cumplido al menos un hábito. ¡Mantén la racha para no perder el fuego!
* **Objetivo de Hoy 🎯**: Te indica cuántos hábitos tienes completados sobre el total de la jornada ($X / Y$).
* **Puntuación y Niveles de Disciplina ⚡**:
  * Cada check otorga **15 puntos**.
  * Cada día de racha activa suma **20 puntos extra**.
  * **Rangos de Nivel**:
    * `< 80 pts`: *Iniciado 🌱*
    * `80 - 199 pts`: *Enfocado ⚡*
    * `200 - 349 pts`: *Disciplina de Acero 🔥*
    * `350+ pts`: *Modo Dios 👑*

### 1.3. Gestión y Asignación de Tareas
* **Crear Hábito / Tarea**: Haz clic en el botón superior **"+ Nuevo Hábito"** o **"+ Nueva Tarea"**.
* **Campos del Formulario**:
  1. *Título*: Nombre claro del hábito o tarea (ej. "Beber 2L de agua", "Limpiar cocina").
  2. *Frecuencia*:
     * **Diaria**: Se reinicia al empezar cada nuevo día natural.
     * **Semanal**: Se reinicia cada Lunes.
     * **Mensual**: Se reinicia el primer día de cada mes.
     * **Personalizada**: Permite fijar un intervalo específico de $X$ días.
     * **Una vez**: Tarea puntual sin reseteo.
  3. *Asignar a*: Selecciona el miembro del hogar responsable o déjalo "Sin asignar" para tareas colectivas.
* **Listas Específicas**: Además de la matriz, cuentas con las pestañas laterales (*Diarias*, *Semanales*, *Mensuales*, *Todas/Custom*) para ver las tareas en tarjetas individuales con ordenación automática (incompletas arriba).

### 1.4. Gestión de Miembros del Hogar
* Accede a la pestaña **"Usuarios"** en la barra lateral.
* Puedes añadir nuevos integrantes introduciendo su nombre.
* La aplicación les asigna un color HSL único y un avatar distintivo para identificar visualmente sus tareas en toda la plataforma.

### 1.5. Tema Oscuro / Claro y Accesibilidad
* Usa el botón de alternancia rápida en la parte inferior del menú lateral (**Claro / Oscuro**) o accede a la ventana de **Configuración**.
* La preferencia se guarda automáticamente y adapta de forma inmediata todas las paletas, tablas y contrastes de color.

### 1.6. Feedback Auditivo y Celebraciones (Confeti)
* **Chime Sonoro**: Cada vez que marcas un hábito, el sintetizador nativo Web Audio emite un tono sutil y agradable.
* **Celebración 100%**: Cuando completas todos los hábitos de la jornada, se dispara una fanfarria armónica y una lluvia de confeti en pantalla.
* Los efectos sonoros pueden silenciarse o activarse en cualquier momento desde la ventana de Configuración.

### 1.7. Copias de Seguridad e Importación (JSON)
* Haz clic en el icono de engranaje (**⚙️ Configuración**) en la barra lateral.
* **Exportar Datos a JSON**: Genera una descarga inmediata con todas tus tareas, histórico de fechas completadas y usuarios configurados.
* **Importar Copia de Seguridad**: Carga cualquier archivo JSON previamente exportado para restaurar tu progreso o migrar de dispositivo.
* **Reinicio de Fábrica**: Opción protegida para restablecer la aplicación con hábitos de ejemplo.

### 1.8. Búsqueda y Edición de Hábitos
* **Búsqueda en tiempo real**: Utiliza el campo de búsqueda integrado en la cabecera de la matriz para filtrar al instante por título.
* **Filtros por frecuencia**: Filtra rápidamente entre *Todos, Diarios, Semanales o Mensuales*.
* **Editar Hábito**: Pulsa el icono de lápiz en cualquier fila para corregir el nombre, reasignar responsable o modificar la frecuencia sin perder el historial.

---

## 2. Guía de Configuración y Desarrollo

### 2.1. Requisitos Previos
* **Node.js**: Versión 18.x, 20.x o superior.
* **NPM**: Versión 9.x o superior.
* Navegador moderno compatible con ES Modules (Chrome, Edge, Firefox, Safari).

### 2.2. Instalación y Puesta en Marcha
1. **Instalar dependencias**:
   ```bash
   npm install
   ```
2. **Ejecutar servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Por defecto estará disponible en: `http://localhost:5173/`
3. **Construir para producción**:
   ```bash
   npm run build
   ```
4. **Previsualizar compilación de producción**:
   ```bash
   npm run preview
   ```

### 2.3. Estructura de Almacenamiento (localStorage)
La persistencia de datos reside completamente en el cliente mediante `localStorage` bajo dos claves versionadas:
* `tasks_app_data_v1`: Array con los objetos de tarea.
  ```json
  {
    "id": "uuid",
    "title": "Hacer ejercicio",
    "periodicity": "daily",
    "customInterval": 1,
    "assignedTo": "user-id",
    "completed": true,
    "completedDates": ["2026-10-22", "2026-10-23"],
    "lastCompletedAt": "2026-10-23T08:30:00.000Z",
    "createdAt": "2026-10-20T10:00:00.000Z"
  }
  ```
* `tasks_app_users_v1`: Array con los miembros configurados (`id`, `name`, `color`).

> 💡 **Copia de seguridad**: Puedes exportar o resetear estos datos desde las herramientas de desarrollador del navegador (`Application > Local Storage`).

### 2.4. Personalización del Sistema de Diseño (CSS)
Las variables de color, espaciado, sombras y tipografías están centralizadas en `src/styles/variables.css`:
* **Paleta Primaria (HSL)**: Modifica `--primary-hue: 250;` para cambiar el color temático de toda la aplicación (ej. `210` para azul, `150` para esmeralda, `25` para naranja).
* **Modo Oscuro**: La clase `.dark` define las variables para fondo (`--color-bg-app`), tarjetas (`--color-bg-card`) y bordes.

### 2.5. Ajuste de Reglas de Reseteo Automático
La lógica de control de reseteo está encapsulada en `src/hooks/useTaskManager.js`:
* Las comparaciones temporales utilizan funciones nativas de `date-fns`: `isToday`, `isSameWeek(..., { weekStartsOn: 1 })`, `isSameMonth` y `differenceInCalendarDays`.

---

## 3. Apartado de Analíticas & Rendimiento

El nuevo apartado de **Analíticas** (`src/components/Analytics.jsx`) procesa todo el histórico registrado para extraer patrones de productividad:

### 3.1. Métricas Principales (KPIs)
* **Total Hábitos Activos**: Cantidad de rutinas vigentes en el sistema.
* **Checks Históricos Totales**: Suma acumulada de todas las acciones de disciplina completadas desde el inicio.
* **Día Más Productivo**: Día de la semana (Lunes a Domingo) que concentra el mayor volumen de tareas completadas.
* **Miembro Más Activo**: Integrante del hogar con mayor número de acciones registradas.

### 3.2. Mapa de Constancia (Últimos 28 Días)
* Inspirado en los mapas de calor de contribución (GitHub style).
* Muestra las últimas 4 semanas en una cuadrícula continua:
  * **Gris suave (Nivel 0)**: 0 hábitos completados.
  * **Verde menta (Nivel 1)**: 1 hábito completado.
  * **Verde medio (Nivel 2)**: 2 hábitos completados.
  * **Verde intenso con brillo (Nivel 3)**: 3 o más hábitos completados.
* Al pasar el ratón por cada celda, muestra la fecha y el total de hábitos completados.

### 3.3. Rendimiento por Día de la Semana
* Gráfico de barras horizontales comparativas de Lunes a Domingo.
* Permite descubrir qué días son los más flojos para reforzarlos o qué días la familia está más sincronizada.
* El día líder se resalta en color naranja fuego.

### 3.4. Distribución por Integrante y Periodicidad
* **Ranking por Integrante**: Tarjetas con avatar coloreado, tareas bajo su responsabilidad y número de checks acumulados.
* **Desglose por Frecuencia**: Balance entre hábitos de impacto diario, tareas semanales de mantenimiento del hogar y compromisos mensuales.
