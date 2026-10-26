import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'teal' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  icon: Icon,
  iconRight: IconRight,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 rounded-xl';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2',
    lg: 'text-sm sm:text-base px-6 py-2.5 gap-2.5',
  }[size] || 'text-xs sm:text-sm px-4 py-2 gap-2';

  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_1px_2px_rgba(79,70,229,0.25)] hover:shadow-[0_4px_12px_rgba(79,70,229,0.3)]',
    secondary: 'bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200/80',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-2xs',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
    teal: 'bg-teal-600 hover:bg-teal-700 text-white shadow-[0_1px_2px_rgba(13,148,136,0.25)] hover:shadow-[0_4px_12px_rgba(13,148,136,0.3)]',
    danger: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200',
  }[variant] || 'bg-indigo-600 hover:bg-indigo-700 text-white';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {typeof Icon === 'function' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {typeof IconRight === 'function' && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
};
