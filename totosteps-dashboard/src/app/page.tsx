'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
const MainPage = () => {
  const router = useRouter();
  useEffect(() => {
    const isLoggedIn = getCookie('isLoggedIn');
    if (isLoggedIn) {
      router.push('/homepage');
    } else {
      router.push('/login');
    }
  }, [router]);
  return null
};
export default MainPage;




