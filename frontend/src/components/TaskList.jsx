const TaskList = ({ tasks, onToggleTask, onDeleteTask }) => {
    // Group tasks by category
    const groupedTasks = tasks.reduce((acc, task) => {
        const category = task.categoria_id || 'General';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(task);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {Object.keys(groupedTasks).length === 0 ? (
                <p className="text-gray-500">No tasks found.</p>
            ) : (
                Object.entries(groupedTasks).map(([category, categoryTasks]) => (
                    <div key={category} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-bold text-gray-700 mb-3 border-b pb-1">{category}</h3>
                        <div className="space-y-2">
                            {categoryTasks.map((task) => (
                                <div key={task.id} className={`p-3 bg-white shadow-sm rounded border border-gray-100 flex justify-between items-center transition-opacity ${task.completada ? 'opacity-60' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={task.completada}
                                            onChange={() => onToggleTask(task)}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                        />
                                        <div>
                                            <h4 className={`font-medium ${task.completada ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                {task.titulo}
                                            </h4>
                                            {task.descripcion && <p className="text-xs text-gray-500">{task.descripcion}</p>}
                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded mt-1 inline-block uppercase tracking-wider">
                                                {task.tipo_recurrencia}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onDeleteTask(task.id)}
                                        className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                                        title="Eliminar tarea"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TaskList;
