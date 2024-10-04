'use client';
import React from 'react';
import Sidebar from '../Sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow overflow-x-auto p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}


