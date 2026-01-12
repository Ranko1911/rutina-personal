const DayAssignee = () => {
    const startDate = new Date('2025-10-16');
    const today = new Date();

    // Reset time to midnight for accurate day calculation
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If days passed is odd -> Ancor, even -> Nira
    // Example: Day 1 (17th Oct) -> Odd -> Ancor
    // Example: Day 0 (16th Oct) -> Even -> Nira
    const isOdd = diffDays % 2 !== 0;
    const assignee = isOdd ? 'Ancor' : 'Nira';

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8 text-center bg-gradient-to-br from-white to-gray-50">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
                🍽️ Hoy friega los platos
            </h3>
            <div className={`text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${assignee === 'Ancor'
                ? 'from-blue-600 to-cyan-500' // Ancor colors
                : 'from-purple-600 to-pink-500' // Nira colors
                }`}>
                {assignee}
            </div>
            <p className="text-xs text-gray-400 mt-2">
                Día +{diffDays} desde el inicio
            </p>
        </div>
    );
};

export default DayAssignee;
