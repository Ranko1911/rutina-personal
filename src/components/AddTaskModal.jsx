import React from 'react';
import { TaskFormModal } from './TaskFormModal';

export const AddTaskModal = ({ isOpen, onClose, onAdd, users }) => {
    return (
        <TaskFormModal
            isOpen={isOpen}
            onClose={onClose}
            onSave={onAdd}
            users={users}
        />
    );
};
