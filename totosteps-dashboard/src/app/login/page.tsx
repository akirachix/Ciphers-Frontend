

"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Nunito } from 'next/font/google';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Cookies from 'js-cookie';
import { userLogin } from '../utils/loginUser';

const nunito = Nunito({
  subsets: ['latin'],
});

const schema = z.object({
  email: z.string().email('Invalid email').min(1,'Email is required'),
  password: z.string().min(1,'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await userLogin(data);
      console.log({ response });

      if (response.error) {
        setErrorMessage(response.error);
      } else {
        
        Cookies.set('token', response.token, { expires: 7 });  

       
        router.push("/homepage");
        setErrorMessage(null);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`flex flex-col md:flex-row h-full md:h-screen ${nunito.className}`}>
      <div className="absolute top-4 left-4 flex justify-center md:justify-start">
        <Image
          src="/images/logo_totosteps.png"
          alt="TotoSteps Logo"
          width={100}
          height={40}
          className="block md:w-[120px] md:h-[80px]"
        />
      </div>
      <div className="flex w-full md:w-1/2 items-center justify-center p-4 md:p-0">
        <Image
          src="/images/motherandchild.jpg"
          alt="Mother and child"
          width={600}
          height={700}
          objectFit="cover"
          className="md:mt-0"
        />
      </div>
      <div className="w-full md:w-1/2 flex justify-center items-center bg-[#4C0033] p-4 md:p-20">
        <div className="text-white w-full max-w-[600px] flex flex-col justify-center px-8 py-10 space-y-10">
          <h2 className="text-center font-bold" style={{ fontSize: '40px', marginBottom: '45px' }}>
            Login
          </h2>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            <div className="space-y-4">
              <label className="block text-white" style={{ fontSize: '20px' }}>Email</label>
              <input
                type="text"
                {...register("email")}
                className={`w-full max-w-[600px] h-[55px] md:h-[60px] px-4 py-3 text-black rounded-[15px] bg-white focus:outline-none ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-4">
              <label className="block text-white" style={{ fontSize: '20px' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register("password")}
                  className={`w-full h-[60px] px-3 py-2 pr-10 text-black rounded-[15px] bg-white focus:outline-none ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <AiOutlineEye size={24} /> : <AiOutlineEyeInvisible size={24} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className={`w-full max-w-[180px] h-[50px] md:h-[50px] py-3 rounded-[50px] mb-4 text-white font-bold transition duration-300
                  ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#F58220] hover:bg-orange-600'}`}
                style={{ fontSize: '20px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>
            <p className="text-center mt-6" style={{ fontSize: '20px' }}>
              Do not have an account?{' '}
              <Link href="/signup" className="text-[#F58220] hover:underline font-semibold">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}