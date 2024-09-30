
"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Nunito } from "next/font/google";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSignUp } from "../hooks/useSignup";

const nunito = Nunito({
  subsets: ["latin"],
});

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

type FormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    formData,
    handleChange,
    handleSubmit: signUp,
    loading,
    errorMessage,
    successMessage,
  } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: formData,
  });

  const onSubmit = handleSubmit(async (data: FormData) => {
    await signUp(data);
  });

  return (
    <div className={`flex flex-col md:flex-row h-full md:h-screen bg-white ${nunito.className}`}>
      <div className="absolute top-4 left-4 flex justify-center md:justify-start">
        <Image
          src="/images/logo_totosteps.png" 
          alt="TotoSteps Logo"
          width={100}
          height={40}
          className="block md:w-[100px] md:h-[70px]"
        />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center p-2 md:p-0">
        <Image
          src="/images/motherandchild.jpg"
          alt="Mother and child"
          width={600}
          height={700}
          objectFit="cover"
          className="responsive-image"
        />
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center bg-[#4C0033] p-3 md:p-8 responsive-form">
        <div className="text-white w-full max-w-[450px] flex flex-col justify-center px-4 py-4 space-y-10">
          <h2 className="text-center font-bold md:text-base sm:text-xl" style={{ fontSize: '40px' }}>Create Account</h2>
          
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          
          <form className="space-y-8" onSubmit={onSubmit}>
            <div className="space-y-1">
              <label className="block text-white md:text-xl" style={{ fontSize: '24px' }}>First Name</label>
              <input
                type="text"
                className="w-full h-[50px] px-3 py-2 text-black rounded-[10px] bg-white focus:outline-none"
                placeholder="Enter first name"
                {...register("firstName")}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-white md:text-xl" style={{ fontSize: '24px' }}>Last Name</label>
              <input
                type="text"
                className="w-full h-[50px] px-3 py-2 text-black rounded-[15px] bg-white focus:outline-none"
                placeholder="Enter last name"
                {...register("lastName")}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-white md:text-xl" style={{ fontSize: '24px' }}>Email</label>
              <input
                type="email"
                className="w-full h-[50px] px-3 py-2 text-black rounded-[15px] bg-white focus:outline-none"
                placeholder="zarthur@gmail.com"
                {...register("email")}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-white md:text-xl" style={{ fontSize: '24px' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full h-[50px] px-3 py-2 pr-10 text-black rounded-[15px] bg-white focus:outline-none"
                  placeholder="Enter password"
                  {...register("password")}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-white md:text-xl" style={{ fontSize: '24px' }}>Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full h-[50px] px-3 py-2 pr-10 text-black rounded-[15px] bg-white focus:outline-none"
                  placeholder="Confirm password"
                  {...register("confirmPassword")}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full max-w-[150px] h-[40px] bg-[#F58220] py-2 rounded-[50px] text-white font-bold hover:bg-orange-600 transition duration-300"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </div>

            <p className="text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-[#F58220] hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}