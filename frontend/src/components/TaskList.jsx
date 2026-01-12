import { useState } from 'react';

const TaskList = ({ tasks, onToggleTask, onDeleteTask }) => {
    // State to track collapsed categories
    const [collapsedCategories, setCollapsedCategories] = useState({});

    // Group tasks by category
    const groupedTasks = tasks.reduce((acc, task) => {
        const category = task.categoria_id || 'General';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(task);
        return acc;
    }, {});

    const toggleCategory = (category) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const getCategoryIcon = (cat) => {
        switch (cat) {
            case 'Health': return '🧘';
            case 'Work': return '💼';
            case 'Home': return '🏠';
            case 'Leisure': return '🎮';
            default: return '📌';
        }
    };

    return (
        <div className="space-y-6">
            {Object.keys(groupedTasks).length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-gray-500 text-lg">No tasks yet. Add one to get started!</p>
                </div>
            ) : (
                Object.entries(groupedTasks).map(([category, categoryTasks]) => (
                    <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
                        <button
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className={`transform transition-transform duration-200 ${collapsedCategories[category] ? '-rotate-90' : 'rotate-0'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{getCategoryIcon(category)}</span>
                                    <h3 className="text-lg font-bold text-gray-700">{category}</h3>
                                </div>
                            </div>
                            <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                                {categoryTasks.length}
                            </span>
                        </button>

                        {!collapsedCategories[category] && (
                            <div className="p-4 space-y-3 bg-white border-t border-gray-100">
                                {categoryTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={`group relative p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${task.completada ? 'bg-gray-50/50' : ''}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="pt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={task.completada}
                                                    onChange={() => onToggleTask(task)}
                                                    className="w-5 h-5 text-indigo-600 rounded-md border-gray-300 focus:ring-indigo-500 cursor-pointer transition-colors"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className={`font-semibold text-gray-900 leading-tight transition-all ${task.completada ? 'line-through text-gray-400 decoration-2 decoration-gray-300' : ''}`}>
                                                        {task.titulo}
                                                    </h4>
                                                    <button
                                                        onClick={() => onDeleteTask(task.id)}
                                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all absolute top-2 right-2 sm:static sm:opacity-100"
                                                        title="Delete task"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {task.descripcion && (
                                                    <p className={`text-sm mt-1 transition-colors ${task.completada ? 'text-gray-300' : 'text-gray-500'}`}>
                                                        {task.descripcion}
                                                    </p>
                                                )}

                                                <div className="mt-3 flex items-center gap-2">
                                                    <span className={`text-[10px] px-2 py-1 rounded-md font-medium uppercase tracking-wider ${task.tipo_recurrencia === 'puntual' ? 'bg-orange-100 text-orange-700' :
                                                        task.tipo_recurrencia === 'diaria' ? 'bg-green-100 text-green-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {task.tipo_recurrencia}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default TaskList;
