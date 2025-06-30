import React from 'react';
import Header from '@/layouts/Header';
import { Toaster } from '@/components/ui/toaster';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-custom-alabaster">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default MainLayout;