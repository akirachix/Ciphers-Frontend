import { LoginCredentials } from "./types";

export const userLogin = async ({ email, password }: LoginCredentials) => {
  try {
    const response = await fetch('/api/login-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }
    
    return response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
