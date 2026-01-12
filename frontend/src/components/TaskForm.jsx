import { useState } from 'react';
import { API_URL } from '../config';

const TaskForm = ({ onTaskAdded }) => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [tipoRecurrencia, setTipoRecurrencia] = useState('puntual');
    const [categoria, setCategoria] = useState('General');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTask = {
            titulo,
            descripcion,
            tipo_recurrencia: tipoRecurrencia,
            categoria_id: categoria // Using the selected category name as ID for simplicity
        };

        try {
            const response = await fetch(`${API_URL}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });
            const data = await response.json();
            onTaskAdded(data);
            setTitulo('');
            setDescripcion('');
            setCategoria('General');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Title</label>
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                    placeholder="E.g., Morning Run"
                    required
                />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Description</label>
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                    placeholder="Optional details..."
                />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Category</label>
                <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                    <option value="General">General</option>
                    <option value="Health">🧘 Health</option>
                    <option value="Work">💼 Work</option>
                    <option value="Home">🏠 Home</option>
                    <option value="Leisure">🎮 Leisure</option>
                </select>
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">Recurrence</label>
                <select
                    value={tipoRecurrencia}
                    onChange={(e) => setTipoRecurrencia(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                    <option value="puntual">One-time</option>
                    <option value="diaria">Daily</option>
                    <option value="semanal">Weekly</option>
                    <option value="mensual">Monthly</option>
                </select>
            </div>
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 mt-2"
            >
                Add Task
            </button>
        </form>
    );
};

export default TaskForm;
