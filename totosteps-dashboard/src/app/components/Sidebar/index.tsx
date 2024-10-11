"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  icon: React.ReactElement;
  text: string;
  active: boolean;
}

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <nav className="bg-customPurple text-white h-screen w-[379px] flex flex-col items-center ">
      <div className="p-4 flex justify-center items-center">
        
        <div className="w-40 h-40 relative mb-8">
          <Image
            src="/images/logo.png"
            alt="Totosteps Logo"
            fill // Use 'fill' instead of 'layout="fill"'
            className="object-contain" // Use CSS class instead of 'objectFit="contain"'
          />
        </div>
      </div>
      <ul className="flex-grow space-y-[130px]">
        
        <NavItem href="/Users" icon={<Users size={32} strokeWidth={2.5} />} text="Users" active={pathname === '/Users'} />
        <NavItem href="/Resources" icon={<Box size={32} strokeWidth={2.5} />} text="Resources" active={pathname === '/Resources'} />
      </ul>
    </nav>
  );
};

const NavItem: React.FC<NavItemProps> = ({ href, icon, text, active }) => {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center w-[340px] px-4 py-2 transition-colors rounded-[5px] ${active ? 'border-white' : 'border-transparent'}`}
      >
        <span className={`mr-[40px] ${active ? 'text-customOrange' : ''}`}>
          {React.cloneElement(icon, { className: active ? 'text-customOrange' : 'text-white' })}
        </span>
        <span className={`text-3xl font-nunito font-bold ${active ? 'text-customOrange' : 'text-white'}`}>{text}</span>
      </Link>
    </li>
  );
};

export default Sidebar;




