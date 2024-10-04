interface User {
    id: string;
    first_name: string;
    last_name: string;
    status: 'ACTIVE' | 'RESTRICTED';
  }
  export const filterUsersWithFullName = (users: User[]) => {
    return users.filter((user) => user.first_name && user.last_name);
  };
  export const getFullName = (user: User) => `${user.first_name} ${user.last_name}`;