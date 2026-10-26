import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../ui/Avatar';
import {
  Layers,
  Bell,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Compass,
  Users,
  FolderGit2,
  Building,
  PlusCircle,
  FileText,
  Briefcase,
  UserPlus,
  Shield,
  HelpCircle,
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, notifications, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(
    (n) => !n.isRead && (!currentUser || n.userId === currentUser.id)
  ).length;
  const userNotifications = notifications
    .filter((n) => !currentUser || n.userId === currentUser.id)
    .slice(0, 5);

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'student') return '/student/dashboard';
    if (currentUser.role === 'business') return '/business/dashboard';
    return '/admin/dashboard';
  };

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/', { replace: true });
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Role tag styling helper
  const getRoleBadge = (role) => {
    switch (role) {
      case 'student':
        return {
          label: 'Student',
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
        };
      case 'business':
        return {
          label: 'Business',
          classes: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
          dot: 'bg-indigo-500',
        };
      case 'admin':
        return {
          label: 'Admin',
          classes: 'bg-amber-50 text-amber-800 border-amber-200/80',
          dot: 'bg-amber-500',
        };
      default:
        return {
          label: 'Visitor',
          classes: 'bg-slate-100 text-slate-600 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  const roleBadge = currentUser ? getRoleBadge(currentUser.role) : null;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Brand Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-white shadow-sm group-hover:shadow-[0_2px_12px_rgba(79,70,229,0.35)] transition-all">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-slate-900 text-xl">
              Intern<span className="text-indigo-600">Bridge</span>
            </span>
          </Link>

          {/* Desktop Navigation Links — Separated Strictly by User Role */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
            {/* GUEST NAVIGATION */}
            {!currentUser && (
              <>
                <Link
                  to="/projects"
                  className={`hover:text-indigo-600 transition-colors whitespace-nowrap ${
                    isActive('/projects') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  Explore Projects
                </Link>
                <Link
                  to="/how-it-works"
                  className={`hover:text-indigo-600 transition-colors whitespace-nowrap ${
                    isActive('/how-it-works') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  How It Works
                </Link>
              </>
            )}

            {/* STUDENT NAVIGATION */}
            {currentUser?.role === 'student' && (
              <>
                <Link
                  to="/student/dashboard"
                  className={`hover:text-indigo-600 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive('/student/dashboard') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  <span>Dashboard</span>
                </Link>
                {/* <Link
                  to="/projects"
                  className={`hover:text-indigo-600 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive('/projects') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  <Compass className="w-4 h-4 text-slate-400" />
                  <span>Explore Projects</span>
                </Link> */}
                {/* <Link
                  to="/student/applications"
                  className={`hover:text-indigo-600 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive('/student/applications') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>My Applications</span>
                </Link> */}
                {/* <Link
                  to="/student/teams"
                  className={`hover:text-indigo-600 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive('/student/teams') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Squads & Teams</span>
                </Link> */}
                {/* <Link
                  to="/student/find-teammates"
                  className={`hover:text-indigo-600 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive('/student/find-teammates') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-slate-400" />
                  <span>Find Teammates</span>
                </Link> */}
              </>
            )}

            {/* BUSINESS NAVIGATION */}
            {currentUser?.role === 'business' && (
              <>
                <Link
                  to="/business/dashboard"
                  className={`hover:text-indigo-600 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive('/business/dashboard') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/business/projects"
                  className={`hover:text-indigo-600 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive('/business/projects') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>Active Projects</span>
                </Link>
                <Link
                  to="/projects"
                  className={`hover:text-indigo-600 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive('/projects') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  <Compass className="w-4 h-4 text-slate-400" />
                  <span>Market Briefs</span>
                </Link>
                <Link
                  to="/business/profile"
                  className={`hover:text-indigo-600 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive('/business/profile') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>Company Profile</span>
                </Link>
              </>
            )}

            {/* ADMIN NAVIGATION */}
            {currentUser?.role === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`hover:text-indigo-600 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive('/admin/dashboard') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span>Admin Console</span>
                </Link>
                <Link
                  to="/projects"
                  className={`hover:text-indigo-600 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                    isActive('/projects') ? 'text-indigo-600 font-bold' : ''
                  }`}
                >
                  <Compass className="w-4 h-4 text-slate-400" />
                  <span>Public Projects</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Action & User Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Business Quick Action: "+ Post Project" */}
            {currentUser?.role === 'business' && (
              <Link
                to="/business/projects/new"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition-all shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Project</span>
              </Link>
            )}

            {/* Student Quick Action: "Find Projects" */}
            {/* {currentUser?.role === 'student' && (
              <Link
                to="/projects"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 rounded-xl transition-all border border-indigo-200/70"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>Explore Briefs</span>
              </Link>
            )} */}

            {currentUser ? (
              <div className="flex items-center gap-2.5">
                {/* Notifications trigger */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setUserDropdownOpen(false);
                    }}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl relative cursor-pointer transition-colors"
                    aria-label="View notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                    )}
                  </button>

                  {/* Dropdown popup */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">Notifications</span>
                        <Link
                          to={
                            currentUser.role === 'student'
                              ? '/student/notifications'
                              : '/business/notifications'
                          }
                          onClick={() => setNotifDropdownOpen(false)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          View all ({notifications.length})
                        </Link>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {userNotifications.length === 0 ? (
                          <div className="py-8 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          userNotifications.map((n) => (
                            <Link
                              key={n.id}
                              to={n.link || '#'}
                              onClick={() => setNotifDropdownOpen(false)}
                              className={`block px-4 py-3 text-xs hover:bg-slate-50 transition-colors ${
                                !n.isRead ? 'bg-indigo-50/30' : ''
                              }`}
                            >
                              <div className="font-semibold text-slate-900 flex items-center justify-between">
                                <span className="truncate pr-2">{n.title}</span>
                                {!n.isRead && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                                )}
                              </div>
                              <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                                {n.message}
                              </p>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile menu */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(!userDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs"
                  >
                    <Avatar
                      src={currentUser.avatar}
                      name={currentUser.name}
                      size="xs"
                      rounded="rounded-lg"
                    />
                    <div className="hidden sm:flex flex-col text-left leading-tight">
                      <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 capitalize">
                        {currentUser.role}
                      </span>
                    </div>
                    {/* Role Pill */}
                    <span
                      className={`hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${roleBadge?.classes}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${roleBadge?.dot}`} />
                      {roleBadge?.label}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {currentUser.name}
                          </div>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border capitalize ${roleBadge?.classes}`}
                          >
                            {roleBadge?.label}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {currentUser.email}
                        </div>
                      </div>

                      <div className="py-1 text-xs">
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors font-semibold"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          <span>Console Dashboard</span>
                        </Link>

                        {/* Student Dropdown Functionality */}
                        {currentUser.role === 'student' && (
                          <>
                            <Link
                              to="/student/applications"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            >
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span>My Applications</span>
                            </Link>
                            <Link
                              to="/student/teams"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            >
                              <Users className="w-4 h-4 text-slate-400" />
                              <span>Squads & Teams</span>
                            </Link>
                            <Link
                              to="/student/find-teammates"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            >
                              <UserPlus className="w-4 h-4 text-slate-400" />
                              <span>Find Teammates</span>
                            </Link>
                            <Link
                              to="/student/portfolio"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            >
                              <FolderGit2 className="w-4 h-4 text-slate-400" />
                              <span>Portfolio Showcase</span>
                            </Link>
                            <Link
                              to="/student/profile"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            >
                              <UserIcon className="w-4 h-4 text-slate-400" />
                              <span>Profile Settings</span>
                            </Link>
                          </>
                        )}

                        {/* Business Dropdown Functionality */}
                        {currentUser.role === 'business' && (
                          <>
                            <Link
                              to="/business/projects/new"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-teal-800 bg-teal-50/70 hover:bg-teal-100 font-bold transition-colors"
                            >
                              <PlusCircle className="w-4 h-4 text-teal-700" />
                              <span>Post New Project</span>
                            </Link>
                            <Link
                              to="/business/projects"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            >
                              <Briefcase className="w-4 h-4 text-slate-400" />
                              <span>Active Projects</span>
                            </Link>
                            <Link
                              to="/business/profile"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            >
                              <Building className="w-4 h-4 text-slate-400" />
                              <span>Company Profile</span>
                            </Link>
                            <Link
                              to="/business/notifications"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            >
                              <Bell className="w-4 h-4 text-slate-400" />
                              <span>Notifications</span>
                            </Link>
                          </>
                        )}

                        {/* Admin Dropdown Functionality */}
                        {currentUser.role === 'admin' && (
                          <>
                            <Link
                              to="/admin/dashboard"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors font-semibold"
                            >
                              <Shield className="w-4 h-4 text-slate-400" />
                              <span>System Administration</span>
                            </Link>
                            <Link
                              to="/projects"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                            >
                              <Compass className="w-4 h-4 text-slate-400" />
                              <span>Public Projects Feed</span>
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1 text-xs">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left font-semibold"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs"
                >
                  Join InternBridge
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation — Strictly Separated by User Role */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-150">
          {currentUser && (
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar
                  src={currentUser.avatar}
                  name={currentUser.name}
                  size="sm"
                  rounded="rounded-lg"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-500 capitalize">
                    {currentUser.role} Account
                  </div>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${roleBadge?.classes}`}
              >
                {roleBadge?.label}
              </span>
            </div>
          )}

          <nav className="flex flex-col gap-1.5 text-sm font-semibold">
            {/* GUEST MOBILE NAVIGATION */}
            {!currentUser && (
              <>
                <Link
                  to="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center justify-between"
                >
                  <span>Explore Projects</span>
                  <Compass className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  to="/how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center justify-between"
                >
                  <span>How It Works</span>
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                </Link>
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg text-xs font-bold text-slate-800 bg-slate-100"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg text-xs font-bold text-white bg-indigo-600"
                  >
                    Join InternBridge
                  </Link>
                </div>
              </>
            )}

            {/* STUDENT MOBILE NAVIGATION */}
            {currentUser?.role === 'student' && (
              <>
                <Link
                  to="/student/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-between"
                >
                  <span>Student Dashboard</span>
                  <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                </Link>
                <Link
                  to="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Explore Projects</span>
                  <Compass className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  to="/student/applications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>My Applications</span>
                  <FileText className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  to="/student/teams"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Squads & Teams</span>
                  <Users className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  to="/student/find-teammates"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Find Teammates</span>
                  <UserPlus className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  to="/student/portfolio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Showcase Portfolio</span>
                  <FolderGit2 className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  to="/student/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Profile Settings</span>
                  <UserIcon className="w-4 h-4 text-slate-400" />
                </Link>
              </>
            )}

            {/* BUSINESS MOBILE NAVIGATION */}
            {currentUser?.role === 'business' && (
              <>
                <Link
                  to="/business/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg bg-teal-50 text-teal-800 font-bold flex items-center justify-between"
                >
                  <span>Business Dashboard</span>
                  <LayoutDashboard className="w-4 h-4 text-teal-700" />
                </Link>
                <Link
                  to="/business/projects/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg bg-teal-700 text-white font-bold flex items-center justify-between shadow-xs"
                >
                  <span>+ Post New Project</span>
                  <PlusCircle className="w-4 h-4 text-white" />
                </Link>
                <Link
                  to="/business/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Active Projects</span>
                  <Briefcase className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  to="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Market Briefs</span>
                  <Compass className="w-4 h-4 text-slate-400" />
                </Link>
                <Link
                  to="/business/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Company Profile</span>
                  <Building className="w-4 h-4 text-slate-400" />
                </Link>
              </>
            )}

            {/* ADMIN MOBILE NAVIGATION */}
            {currentUser?.role === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg bg-amber-50 text-amber-900 font-bold flex items-center justify-between"
                >
                  <span>Admin Console</span>
                  <Shield className="w-4 h-4 text-amber-700" />
                </Link>
                <Link
                  to="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>Public Projects Review</span>
                  <Compass className="w-4 h-4 text-slate-400" />
                </Link>
              </>
            )}

            {currentUser && (
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2.5 rounded-lg text-rose-600 hover:bg-rose-50 font-bold flex items-center justify-between text-left cursor-pointer"
                >
                  <span>Sign Out</span>
                  <LogOut className="w-4 h-4 text-rose-500" />
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
