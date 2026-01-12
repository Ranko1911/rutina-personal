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
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded-lg border border-gray-200">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="General">General</option>
                    <option value="Health">Salud</option>
                    <option value="Work">Trabajo</option>
                    <option value="Home">Hogar</option>
                    <option value="Leisure">Ocio</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Recurrence</label>
                <select
                    value={tipoRecurrencia}
                    onChange={(e) => setTipoRecurrencia(e.target.value)}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="puntual">Puntual</option>
                    <option value="diaria">Diaria</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                </select>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Add Task
            </button>
        </form>
    );
};

export default TaskForm;
