import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../ui/Avatar';
import {
  LayoutDashboard,
  Compass,
  FileText,
  Users,
  UserPlus,
  Briefcase,
  UserCheck,
  Bell,
  PlusCircle,
  FolderGit2,
  ShieldAlert,
  Building,
  LogOut,
} from 'lucide-react';

export const Sidebar = ({ role }) => {
  const { notifications, currentUser, logout } = useApp();
  const navigate = useNavigate();
  const unreadCount = notifications.filter(
    (n) => !n.isRead && (!currentUser || n.userId === currentUser.id)
  ).length;

  const studentLinks = [
    { to: '/student/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/projects', label: 'Explore Briefs', icon: Compass },
    { to: '/student/applications', label: 'My Applications', icon: FileText },
    { to: '/student/teams', label: 'Squads & Teams', icon: Users },
    { to: '/student/find-teammates', label: 'Find Teammates', icon: UserPlus },
    { to: '/student/portfolio', label: 'Showcase Portfolio', icon: FolderGit2 },
    { to: '/student/profile', label: 'Profile Settings', icon: UserCheck },
    { to: '/student/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
  ];

  const businessLinks = [
    { to: '/business/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/business/projects/new', label: 'Post New Project', icon: PlusCircle, highlight: true },
    { to: '/business/projects', label: 'Active Projects', icon: Briefcase },
    { to: '/business/profile', label: 'Business Profile', icon: Building },
    { to: '/business/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Platform Console', icon: ShieldAlert },
    { to: '/projects', label: 'Projects Directory', icon: Compass },
  ];

  const links =
    role === 'student' ? studentLinks : role === 'business' ? businessLinks : adminLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 h-[calc(100vh-4rem)] flex flex-col shrink-0 select-none overflow-y-auto overscroll-contain">
      {/* Navigation Section */}
      <div className="p-4 flex-1 space-y-1">
        <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 py-2">
          {role === 'student'
            ? 'Student Workspace'
            : role === 'business'
            ? 'Business Console'
            : 'Administration'}
        </div>

        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/student/dashboard' || link.to === '/business/dashboard'}
              className={({ isActive }) =>
                `group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-2xs font-bold'
                    : link.highlight
                    ? 'text-teal-800 bg-teal-50 hover:bg-teal-100/80 font-bold border border-teal-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive
                          ? 'text-indigo-600'
                          : link.highlight
                          ? 'text-teal-700'
                          : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span className="truncate">{link.label}</span>
                  </div>

                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold bg-rose-500 text-white rounded-full leading-relaxed shadow-2xs">
                      {link.badge}
                    </span>
                  )}

                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 rounded-r-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Role Context Profile snippet at bottom of sidebar */}
      <div className="p-3 m-3 border border-slate-200/80 bg-slate-50/70 rounded-2xl">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar
            src={currentUser?.avatar}
            name={currentUser?.name || 'User'}
            size="sm"
            rounded="rounded-lg"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">{currentUser?.name}</div>
            <div className="text-[11px] text-slate-500 capitalize truncate">
              {role} Console
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/', { replace: true });
          }}
          className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-rose-200/60"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
