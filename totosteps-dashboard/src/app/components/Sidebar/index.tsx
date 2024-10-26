"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Users, ChartPie, Box, Home, LogOut } from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ReactElement;
  text: string;
  active: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showSignOutDropdown, setShowSignOutDropdown] = useState(false);

  const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowSignOutDropdown(true);
  };

  const handleYesClick = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    router.push('/login');
  };

  return (
    <nav className="bg-[#4C0033] text-white h-screen w-[280px] flex flex-col items-center relative">
      <div className="p-6 flex justify-center items-center">
        <div className="w-32 h-32 relative mb-4">
          <Image
            src="/images/logo.png"
            alt="Totosteps Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <ul className="flex-grow space-y-3 w-full px-3">
        <NavItem href="/Home" icon={<Home size={20} />} text="Home" active={pathname === '/Home'} />
        <NavItem href="/Users" icon={<Users size={20} />} text="Users" active={pathname === '/Users'} />
        <NavItem href="/Milestones" icon={<ChartPie size={20} />} text="Milestones" active={pathname === '/Milestones'} />
        <NavItem href="/Resources" icon={<Box size={20} />} text="Resources" active={pathname === '/Resources'} />
        <NavItem href="#" icon={<LogOut size={20} />} text="Logout" active={false} onClick={handleLogoutClick} />
      </ul>

      {/* Logout Modal - Positioned at bottom */}
      {showSignOutDropdown && (
        <div className="fixed bottom-8 left-4 w-[260px] bg-white rounded-lg shadow-lg">
          <div className="p-5">
            <p className="text-[#4C0033] text-base font-semibold text-center mb-4">
              Are you sure you want to sign out?
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="bg-[#F58220] text-white px-5 py-2 rounded hover:bg-opacity-90 transition-colors duration-200"
                onClick={handleYesClick}
              >
                Yes
              </button>
              <button
                className="bg-gray-200 text-[#4C0033] px-5 py-2 rounded hover:bg-gray-300 transition-colors duration-200"
                onClick={() => setShowSignOutDropdown(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavItem: React.FC<NavItemProps> = ({ href, icon, text, active, onClick }) => {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center w-full px-4 py-2.5 transition-colors rounded-md ${
          active ? 'bg-[#F58220]' : 'hover:bg-[#F58220] hover:bg-opacity-20'
        }`}
        onClick={onClick}
      >
        <span className={`mr-3 ${active ? 'text-white' : 'text-gray-300'}`}>
          {React.cloneElement(icon, { className: active ? 'text-white' : 'text-gray-300' })}
        </span>
        <span className={`text-base font-semibold ${active ? 'text-white' : 'text-gray-300'}`}>{text}</span>
      </Link>
    </li>
  );
};

export default Sidebar;