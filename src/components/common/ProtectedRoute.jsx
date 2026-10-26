import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/**
 * ProtectedRoute
 * - Redirects unauthenticated users to /login
 * - Prevents unauthorized role access and redirects to user's authorized dashboard
 * - Preserves public routes and passes through authorized access
 */
export const ProtectedRoute = ({ allowedRole, children }) => {
  const { currentUser, addToast } = useApp();
  const location = useLocation();
  const warnedRef = useRef(false);

  // 1. Unauthenticated users -> redirect to /login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 2. Prevent unauthorized role access
  const isAllowed = allowedRole ? currentUser.role === allowedRole : true;

  useEffect(() => {
    if (!isAllowed && !warnedRef.current) {
      warnedRef.current = true;
      if (addToast) {
        addToast(
          'Access Restricted',
          `Your account (${currentUser.role}) does not have access to ${allowedRole} pages. Redirected to your workspace.`,
          'warning'
        );
      }
    }
  }, [isAllowed, allowedRole, currentUser, addToast]);

  if (!isAllowed) {
    const roleDashboardMap = {
      student: '/student/dashboard',
      business: '/business/dashboard',
      admin: '/admin/dashboard',
    };
    const redirectPath = roleDashboardMap[currentUser.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
