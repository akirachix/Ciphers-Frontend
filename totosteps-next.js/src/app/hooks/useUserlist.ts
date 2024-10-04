import { useState, useEffect, useCallback } from 'react';
import { User, fetchData } from '@/app/utils/fetchUsersList';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await fetchData("");
      setUsers(fetchedUsers.users);
    } catch (err) {
      console.error('Error in useUsers hook:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, loading, error, refetch: loadUsers };
};