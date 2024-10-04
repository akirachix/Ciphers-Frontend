"use client"
import Resources from '../Resources/page';
import { useState } from 'react';


export const usePostResource = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addResource = async (resource: { id: string; title: string }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await Resources(resource);
      console.log('Resource posted successfully:', result);
      return true;
    } catch (err) {
      console.error('Error posting resource:', err);
      setError((err as Error).message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { addResource, isSubmitting, error };
};