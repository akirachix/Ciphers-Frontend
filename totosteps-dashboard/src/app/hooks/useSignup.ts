import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { fetchAdmin } from "@/app/utils/signupUser";
import { z } from "zod";
import { AdminRegistrationData, AdminRegistrationState, AdminRegistrationErrorResponse } from "@/app/utils/types";

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export const useSignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [state, setState] = useState<AdminRegistrationState>({
    loading: false,
    errorMessage: '',
    successMessage: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (data: SignUpFormData) => {
    setState(prev => ({ ...prev, loading: true, errorMessage: '', successMessage: '' }));

    try {
      const validatedData = signUpSchema.parse(data);
      const adminData: AdminRegistrationData = {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        password: validatedData.password,
        role: 'admin'
      };
      await registerAdmin(adminData);
      setState(prev => ({ ...prev, successMessage: 'Registration successful!' }));
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      handleError(error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const registerAdmin = async (data: AdminRegistrationData): Promise<void> => {
    const response = await fetchAdmin(data);
    if (!response) {
      throw new Error('Registration failed');
    }
  };

  const handleError = (error: unknown) => {
    if (error instanceof z.ZodError) {
      setState(prev => ({ ...prev, errorMessage: error.errors.map(e => e.message).join(", ") }));
    } else if (error instanceof Error) {
      setState(prev => ({ ...prev, errorMessage: error.message }));
    } else if (typeof error === 'object' && error !== null && 'error' in error) {
      const errorResponse = error as AdminRegistrationErrorResponse;
      setState(prev => ({ ...prev, errorMessage: errorResponse.error }));
    } else {
      setState(prev => ({ ...prev, errorMessage: 'An unexpected error occurred. Please try again.' }));
    }
  };

  return {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    formData,
    handleChange,
    handleSubmit,
    loading: state.loading,
    errorMessage: state.errorMessage,
    successMessage: state.successMessage,
  };
};