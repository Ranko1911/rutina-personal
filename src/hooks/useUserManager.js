import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

export const useUserManager = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers(storage.getUsers());
    }, []);

    const addUser = (name, color) => {
        const newUser = {
            id: uuidv4(),
            name,
            color: color || `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
        };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        storage.saveUsers(updatedUsers);
    };

    const removeUser = (userId) => {
        const updatedUsers = users.filter(u => u.id !== userId);
        setUsers(updatedUsers);
        storage.saveUsers(updatedUsers);
    };

    const reloadUsers = () => {
        setUsers(storage.getUsers());
    };

    return { users, addUser, removeUser, reloadUsers };
};
