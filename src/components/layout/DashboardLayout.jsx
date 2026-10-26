import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
// import { DemoBar } from './DemoBar';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ToastContainer } from '../common/Toast';
import { ChevronRight, Menu, X, LayoutDashboard, Compass, FileText, Users, PlusCircle } from 'lucide-react';

export const DashboardLayout = ({ role }) => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Clean breadcrumbs based on pathname
  const pathParts = location.pathname.split('/').filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* <DemoBar /> */}
      <Navbar />

      {/* Mobile Workspace Navigation Strip */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between sticky top-16 z-30 shadow-2xs">
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-indigo-600" />}
          <span>{role === 'student' ? 'Student Menu' : role === 'business' ? 'Business Menu' : 'Admin Menu'}</span>
        </button>

        <div className="flex items-center gap-2">
          {role === 'business' && (
            <Link
              to="/business/projects/new"
              className="text-xs font-bold bg-teal-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post</span>
            </Link>
          )}
          {role === 'student' && (
            <Link
              to="/projects"
              className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Projects</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs flex"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-72 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900 capitalize">{role} Workspace</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto" onClick={() => setMobileSidebarOpen(false)}>
              <Sidebar role={role} />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-start max-w-7xl w-full mx-auto relative">
        {/* Desktop Fixed-on-Scroll Sidebar */}
        <div className="hidden md:block shrink-0 sticky top-16 self-start z-30">
          <Sidebar role={role} />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {/* Contextual Breadcrumb Trail */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap">
            <Link to="/" className="hover:text-slate-900">
              Home
            </Link>
            {pathParts.map((part, index) => {
              const url = `/${pathParts.slice(0, index + 1).join('/')}`;
              const isLast = index === pathParts.length - 1;
              const formatted = part.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

              return (
                <React.Fragment key={url}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  {isLast ? (
                    <span className="font-bold text-slate-900">{formatted}</span>
                  ) : (
                    <Link to={url} className="hover:text-slate-900">
                      {formatted}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <Outlet />
        </main>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};
