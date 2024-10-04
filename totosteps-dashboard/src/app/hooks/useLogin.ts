import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { userLogin } from '@/app/utils/loginUser';
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type LoginFormInputs = z.infer<typeof loginSchema>;
export const useLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      await userLogin({ email: data.email, password: data.password });
      window.location.href = '/homepage';
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return {
    showPassword,
    setShowPassword,
    loading,
    error,
    register,
    handleSubmit,
    errors,
    onSubmit
  };
};