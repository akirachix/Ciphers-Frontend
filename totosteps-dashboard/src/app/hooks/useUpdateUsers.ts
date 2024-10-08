import { useState } from 'react';
import { User } from '../utils/types';

export const useUpdateUser = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitUser = async (details: User) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (details.status === 'ACTIVE') {
        details.status = 'RESTRICTED';
      } else {
        details.status = 'ACTIVE';
      }

      console.log(`User ${details.id} status updated to: ${details.status}`);
      return true; 

    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitUser, isSubmitting, error };
};