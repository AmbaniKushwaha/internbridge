import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // 'success' | 'indigo' | 'teal' | 'warning' | 'danger' | 'default'
  size = 'sm', // 'xs' | 'sm'
  className = '',
}) => {
  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-[11px] px-2 py-0.5',
  }[size] || 'text-[11px] px-2 py-0.5';

  const variantClasses = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
    teal: 'bg-teal-50 text-teal-700 border border-teal-200/80',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    default: 'bg-slate-100 text-slate-700 border border-slate-200/80',
  }[variant] || 'bg-slate-100 text-slate-700 border border-slate-200/80';

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-md tracking-tight ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
