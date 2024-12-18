'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { XCircle, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { getFullName, User } from '../utils/fetchUsersList';
import Layout from '../components/Layout';

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsersFromAPI = async () => {
    try {
      const response = await fetch('https://totosteps-29a482165136.herokuapp.com/api/users/');
      if (!response.ok) {
        throw new Error('Failed to fetch users from API');
      }
      const data = await response.json();
      return data.map((user: User) => ({ ...user, status: 'ACTIVE' }));
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users from API');
      return [];
    }
  };

  useEffect(() => {
    const initializeUsers = async () => {
      const savedUsers = localStorage.getItem('users');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        const activeUsers = parsedUsers.map((user: User) => ({ ...user, status: 'ACTIVE' }));
        setUsers(activeUsers);
        localStorage.setItem('users', JSON.stringify(activeUsers));
      } else {
        const apiUsers = await fetchUsersFromAPI();
        const filteredUsers = apiUsers.filter((user: User) => user.first_name && user.last_name);
        if (filteredUsers.length > 0) {
          setUsers(filteredUsers);
          localStorage.setItem('users', JSON.stringify(filteredUsers));
        }
      }
      setLoading(false);
    };

    initializeUsers();
  }, []);

  const saveUsersToLocalStorage = (updatedUsers: User[]) => {
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  return { users, setUsers: saveUsersToLocalStorage, loading, error };
};

const UserList: React.FC = () => {
  const { users, setUsers, loading, error } = useUsers();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [action, setAction] = useState<'RESTRICT' | 'RESTORE'>('RESTRICT');
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'RESTRICTED'>('ALL');

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getUsersPerPage = () => {
    if (windowWidth >= 1024 && windowWidth <= 1280) {
      return 5;
    }
    return 8; 
  };

  const usersPerPage = getUsersPerPage();

  const filteredUsers = users.filter(user => {
    if (filter === 'ALL') return true;
    return user.status === filter;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const restrictUser = async (userId: number) => {
    console.log(`Restricting user with ID: ${userId}`);
    try {
      const response = await fetch(`https://totosteps-29a482165136.herokuapp.com/api/users/${userId}/restrict/`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to restrict user');
      }
      return true;
    } catch (error) {
      console.error('Error restricting user:', error);
      return false;
    }
  };

  const restoreUser = async (userId: number) => {
    console.log(`Restoring user with ID: ${userId}`);
    try {
      const response = await fetch(`https://totosteps-29a482165136.herokuapp.com/api/users/${userId}/restore/`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Failed to restore user');
      }
      return true;
    } catch (error) {
      console.error('Error restoring user:', error);
      return false;
    }
  };

  const handleAction = useCallback((user: User, actionType: 'RESTRICT' | 'RESTORE') => {
    console.log(`Selected User for Action: ${JSON.stringify(user, null, 2)}`);
    setSelectedUser(user);
    setAction(actionType);
    setModalOpen(true);
  }, []);

  const handleProceed = useCallback(async () => {
    if (selectedUser) {
      console.log(`Proceeding with User ID: ${selectedUser.user_id}, Action: ${action}`);

      let success = false;

      if (action === 'RESTRICT') {
        success = await restrictUser(selectedUser.user_id);
      } else {
        success = await restoreUser(selectedUser.user_id);
      }

      if (success) {
        const updatedUsers = users.map((user) =>
          user.user_id === selectedUser.user_id
            ? { ...user, status: action === 'RESTRICT' ? 'RESTRICTED' : 'ACTIVE' } as User
            : user
        );

        setUsers(updatedUsers);

        setModalOpen(false);
        setSuccessMessage(
          `${getFullName(selectedUser)} successfully ${action === 'RESTRICT' ? 'restricted' : 'restored'}.`
        );

        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      } else {
        setSuccessMessage(`Failed to ${action.toLowerCase()} the user.`);
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
    }
  }, [selectedUser, action, users, setUsers]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <div className="w-full p-8 font-sans bg-gray-100 text-base">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center bg-[#4C0033] text-white p-6">
            <h1 className="text-2xl font-bold">Users</h1>
            <div className="flex items-center space-x-4">
              <Filter size={20} />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value as 'ALL' | 'ACTIVE' | 'RESTRICTED')}
                className="bg-white text-[#4C0033] rounded-md px-2 py-1"
              >
                <option value="ALL">All Users</option>
                <option value="ACTIVE">Active Users</option>
                <option value="RESTRICTED">Restricted Users</option>
              </select>
            </div>
          </div>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 mx-6 mt-6" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-[#4C0033]">
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.user_id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getFullName(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleAction(user, user.status === 'ACTIVE' ? 'RESTRICT' : 'RESTORE')}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          user.status === 'ACTIVE' 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {user.status === 'ACTIVE' ? 'Restrict' : 'Restore'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex justify-center items-center space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 rounded-full ${
                currentPage === i + 1 ? 'bg-[#F58220] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
            className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {modalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
              <button 
                onClick={() => setModalOpen(false)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
              <p className="mb-8 text-center text-black text-lg">
                Are you sure you want to {action.toLowerCase()} user {getFullName(selectedUser)}?
              </p>
              <div className="flex justify-center space-x-6">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceed}
                  className="px-6 py-2 bg-[#F58220] text-white rounded-md hover:bg-[#E57210] transition-colors"
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserList;