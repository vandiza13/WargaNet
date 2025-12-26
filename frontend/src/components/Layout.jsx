import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

// Sesuaikan path ini dengan lokasi file Sidebar/Header kamu
// Jika ada di folder 'components/ui', gunakan './ui/Sidebar'
// Jika ada di folder 'components' langsung, gunakan './Sidebar'
import Sidebar from './Sidebar'; 
import Header from './Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Sidebar Component */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header Component */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Dynamic Page Content (Outlet) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6 pb-20 md:pb-6 scroll-smooth">
          <div className="container mx-auto max-w-7xl animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;