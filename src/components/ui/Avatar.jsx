import React, { useState } from 'react';
import { User } from 'lucide-react';

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-indigo-700 text-white',
  'from-teal-500 to-emerald-700 text-white',
  'from-violet-500 to-purple-700 text-white',
  'from-blue-500 to-indigo-600 text-white',
  'from-amber-500 to-orange-600 text-white',
  'from-rose-500 to-pink-600 text-white',
];

const getInitials = (name = '') => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getGradientForName = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

export const Avatar = ({
  src,
  name = 'User',
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  status, // 'online' | 'offline' | 'busy'
  className = '',
  rounded = 'rounded-xl',
  alt,
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl font-bold',
  }[size] || 'w-10 h-10 text-sm';

  const initials = getInitials(name);
  const gradient = getGradientForName(name);

  return (
    <div className={`relative inline-flex shrink-0 select-none ${className}`}>
      {src && !hasError ? (
        <img
          src={src}
          alt={alt || name}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`${sizeClasses} ${rounded} object-cover border border-slate-200/80 shadow-2xs`}
        />
      ) : (
        <div
          className={`${sizeClasses} ${rounded} bg-gradient-to-tr ${gradient} font-bold flex items-center justify-center border border-white/20 shadow-2xs`}
          title={name}
        >
          {initials || <User className="w-1/2 h-1/2" />}
        </div>
      )}

      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
            status === 'online'
              ? 'bg-emerald-500'
              : status === 'busy'
              ? 'bg-amber-500'
              : 'bg-slate-400'
          }`}
        />
      )}
    </div>
  );
};
