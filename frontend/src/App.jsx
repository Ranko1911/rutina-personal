import Dashboard from './components/Dashboard';

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-600 p-4 text-white shadow">
                <h1 className="text-2xl font-bold container mx-auto">Personal Life Tracker</h1>
            </header>
            <main>
                <Dashboard />
            </main>
        </div>
    )
}

export default App
