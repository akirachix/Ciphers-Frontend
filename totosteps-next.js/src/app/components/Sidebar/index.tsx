"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Users, Box } from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ReactElement;
  text: string;
  active: boolean;
}

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <nav className="bg-customPurple text-white h-screen w-[200px] flex flex-col items-center">
      <div className="p-4 flex justify-center items-center">
        <div className="w-24 h-24 relative mb-8">
          <Image
            src="/image/logo.png"
            alt="Totosteps Logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <ul className="flex-grow space-y-12">
        <NavItem href="/" icon={<Home size={24} strokeWidth={2.5} />} text="Home" active={pathname === '/'} />
        <NavItem href="/Users" icon={<Users size={24} strokeWidth={2.5} />} text="Users" active={pathname === '/Users'} />
        <NavItem href="/Resources" icon={<Box size={24} strokeWidth={2.5} />} text="Resources" active={pathname === '/Resources'} />
      </ul>
    </nav>
  );
};

const NavItem: React.FC<NavItemProps> = ({ href, icon, text, active }) => {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center w-[160px] px-4 py-2 transition-colors rounded-[5px] ${active ? 'border-white' : 'border-transparent'}`}
      >
        <span className={`mr-[20px] ${active ? 'text-customOrange' : ''}`}>
          {React.cloneElement(icon, { className: active ? 'text-customOrange' : 'text-white' })}
        </span>
        <span className={`text-base font-nunito font-bold ${active ? 'text-customOrange' : 'text-white'}`}>{text}</span>
      </Link>
    </li>
  );
};

export default Sidebar;
