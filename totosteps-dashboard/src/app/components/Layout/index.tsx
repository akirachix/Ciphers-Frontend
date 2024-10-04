
import React from 'react';
import Sidebar from '../Sidebar';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <div className=''>
        <Sidebar />
      </div>
      <div className="flex-grow p-4">
        {children}
      </div>
    </div>
  );
}