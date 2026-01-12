import { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
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
                    {loading ? <p>Loading...</p> : <TaskList tasks={tasks} />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
