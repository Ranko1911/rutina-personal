import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { TaskList } from './components/TaskList';
import { HabitTracker } from './components/HabitTracker';
import { Analytics } from './components/Analytics';
import { UserManagement } from './components/UserManagement';
import { useTaskManager } from './hooks/useTaskManager';
import { useUserManager } from './hooks/useUserManager';

function App() {
  const [activeTab, setActiveTab] = useState('habits');
  const { tasks, addTask, toggleTask, toggleTaskForDate, deleteTask } = useTaskManager();
  const { users, addUser, removeUser } = useUserManager();

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
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
  );
}

export default App;
