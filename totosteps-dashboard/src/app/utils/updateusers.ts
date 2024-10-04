export const getFullName = (user: User) => `${user.first_name} ${user.last_name}`;

export const fetchData = async (endpoint: string, options = {}) => {
  try {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};

import { User } from "./types";
const url = '/api/users/';

export const postUsers = async (details: User) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error posting data:', error);
    throw new Error('Failed to post data');
  }
};

export const updateUser = async (id: string, details: Partial<User>) => {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user data:', error);
    throw new Error('Failed to update user data');
  }
};

export type { User };