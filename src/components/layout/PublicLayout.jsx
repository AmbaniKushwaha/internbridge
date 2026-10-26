import React from 'react';
import { Outlet } from 'react-router-dom';
// import { DemoBar } from './DemoBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ToastContainer } from '../common/Toast';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* <DemoBar /> */}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};
