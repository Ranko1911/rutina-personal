import { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { API_URL } from '../config';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/tasks`);
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleTaskAdded = (newTask) => {
        setTasks([...tasks, newTask]);
    };

    const handleToggleTask = async (taskToToggle) => {
        try {
            const updatedTask = { ...taskToToggle, completada: !taskToToggle.completada };
            const response = await fetch(`${API_URL}/api/tasks/${taskToToggle.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });

            if (response.ok) {
                const updatedTaskData = await response.json();
                setTasks(tasks.map((task) =>
                    task.id === taskToToggle.id ? updatedTaskData : task
                ));
            }
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) return;

        try {
            const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTasks(tasks.filter((task) => task.id !== taskId));
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">My Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold mb-2">Add New Task</h3>
                    <TaskForm onTaskAdded={handleTaskAdded} />
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-2">My Tasks</h3>
                    {loading ? <p>Loading...</p> : (
                        <TaskList
                            tasks={tasks}
                            onToggleTask={handleToggleTask}
                            onDeleteTask={handleDeleteTask}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
