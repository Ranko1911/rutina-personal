import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TaskList } from './components/TaskList';
import { HabitTracker } from './components/HabitTracker';
import { Analytics } from './components/Analytics';
import { UserManagement } from './components/UserManagement';
import { SettingsModal } from './components/SettingsModal';
import { useTaskManager } from './hooks/useTaskManager';
import { useUserManager } from './hooks/useUserManager';
import { storage } from './utils/storage';

function App() {
  const [activeTab, setActiveTab] = useState('habits');
  const [theme, setTheme] = useState(() => storage.getTheme());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { tasks, addTask, updateTask, toggleTask, toggleTaskForDate, deleteTask, reloadTasks } = useTaskManager();
  const { users, addUser, removeUser, reloadUsers } = useUserManager();

  useEffect(() => {
    storage.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleDataReload = () => {
    reloadTasks();
    reloadUsers();
  };

  return (
    <>
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
      >
        {activeTab === 'users' ? (
          <UserManagement
            users={users}
            onAddUser={addUser}
            onRemoveUser={removeUser}
          />
        ) : activeTab === 'habits' ? (
          <HabitTracker
            tasks={tasks}
            users={users}
            onToggleDate={toggleTaskForDate}
            onAdd={addTask}
            onUpdate={updateTask}
            onDelete={deleteTask}
          />
        ) : activeTab === 'analytics' ? (
          <Analytics
            tasks={tasks}
            users={users}
          />
        ) : (
          <TaskList
            tasks={tasks}
            filterType={activeTab}
            onAdd={addTask}
            onToggle={toggleTask}
            users={users}
          />
        )}
      </Layout>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
        onDataReload={handleDataReload}
      />
    </>
  );
}

export default App;
