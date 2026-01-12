const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // We'll assume usage of uuid, or generate simple random ID

// Mock Database
let tasks = [
    {
        id: "uuid-1234",
        titulo: "Entrenar Pierna",
        descripcion: "Sentadillas y prensa",
        categoria_id: "cat-01",
        tipo_recurrencia: "semanal",
        configuracion_recurrencia: {
            dias_semana: ["Lunes", "Jueves"]
        },
        fecha_vencimiento: "2023-10-27T10:00:00Z",
        completada: false
    }
];

// Helper to generate ID if uuid package not installed (for MVP simplicity)
const generateId = () => Math.random().toString(36).substr(2, 9);

// GET All Tasks
router.get('/', (req, res) => {
    res.json(tasks);
});

// POST Create Task
router.post('/', (req, res) => {
    const newTask = {
        id: generateId(),
        ...req.body,
        completada: false
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT Update Task
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const index = tasks.findIndex(t => t.id === id);

    if (index !== -1) {
        tasks[index] = { ...tasks[index], ...req.body };
        res.json(tasks[index]);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// DELETE Task
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(t => t.id !== id);
    res.json({ message: 'Task deleted' });
});

module.exports = router;
