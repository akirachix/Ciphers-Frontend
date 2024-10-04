export interface User {
    user_id: number;
    id: number;
    first_name: string;
    last_name: string;
    status: 'ACTIVE' | 'RESTRICTED';
  }