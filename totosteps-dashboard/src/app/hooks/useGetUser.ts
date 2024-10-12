import { useState, useEffect } from 'react';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    status: 'ACTIVE' | 'RESTRICTED';
  }
  export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const response = await fetch('https://totosteps-29a482165136.herokuapp.com/api/users/');
          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }
          const data: User[] = await response.json();
          const filteredUsers = data.filter((user: User) => user.first_name && user.last_name);
          setUsers(filteredUsers.slice(0, 6));
        } catch (error) {
          console.error('Error fetching users:', error);
          setError('Failed to load users. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }, []);
    return { users, setUsers, loading, error };
  };