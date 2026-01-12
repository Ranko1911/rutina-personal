import TaskList from './TaskList';
import TaskForm from './TaskForm';
import DayAssignee from './DayAssignee';
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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                        Life Tracker
                    </h2>
                    <p className="text-gray-500 text-lg">Organize your routines and achieve your goals</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="sticky top-8">
                            <DayAssignee />
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    New Task
                                </h3>
                                <TaskForm onTaskAdded={handleTaskAdded} />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 xl:col-span-9">
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 min-h-[500px]">
                            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b pb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                My Tasks
                            </h3>
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <TaskList
                                    tasks={tasks}
                                    onToggleTask={handleToggleTask}
                                    onDeleteTask={handleDeleteTask}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
