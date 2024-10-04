import { useEffect, useState } from 'react';
import { fetchData } from '../utils/fetchUsersList';
import { User } from '../utils/types';

export const useUsers = () => {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await fetchData('/api/users');
        console.log('Fetched users:', result);
        setData(result?.users);
      } catch (err: unknown) {
        console.error('Error fetching users:', err);
        const fallbackUsers: User[] = [
          {
            id: 1, first_name: 'John', last_name: 'Doe', status: 'ACTIVE',
            user_id: undefined
          },
          {
            id: 2, first_name: 'Jane', last_name: 'Smith', status: 'RESTRICTED',
            user_id: undefined
          },
        ];
        setData(fallbackUsers);
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("An unknown error occurred"));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return { data, isLoading, error };
};

