import React from 'react';
import { Avatar } from './Avatar';

export const AvatarGroup = ({
  avatars = [],
  max = 4,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) => {
  const displayed = avatars.slice(0, max);
  const remaining = avatars.length - max;

  const countSizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
  }[size] || 'w-10 h-10 text-xs';

  return (
    <div className={`flex items-center -space-x-2.5 overflow-hidden py-0.5 ${className}`}>
      {displayed.map((item, idx) => {
        const src = typeof item === 'string' ? item : item.avatar || item.studentAvatar;
        const name = typeof item === 'string' ? 'Member' : item.name || item.studentName || 'Member';
        return (
          <Avatar
            key={idx}
            src={src}
            name={name}
            size={size}
            rounded="rounded-full"
            className="ring-2 ring-white shadow-2xs hover:z-10 transition-transform"
          />
        );
      })}
      {remaining > 0 && (
        <div
          className={`${countSizeClasses} rounded-full bg-slate-100 ring-2 ring-white text-slate-700 font-extrabold flex items-center justify-center shrink-0 shadow-2xs`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
