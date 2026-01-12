const TaskList = ({ tasks }) => {
    return (
        <div className="space-y-2">
            {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks found.</p>
            ) : (
                tasks.map((task) => (
                    <div key={task.id} className="p-4 bg-white shadow rounded-lg flex justify-between items-center border border-gray-200">
                        <div>
                            <h4 className="font-bold">{task.titulo}</h4>
                            <p className="text-sm text-gray-600">{task.descripcion}</p>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                                {task.tipo_recurrencia}
                            </span>
                        </div>
                        <div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${task.completada ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {task.completada ? 'Completed' : 'Pending'}
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TaskList;
