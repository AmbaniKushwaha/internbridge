import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = true,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-200 ${
        hover
          ? 'hover:border-slate-300 hover:shadow-[0_10px_25px_-5px_rgba(15,23,42,0.06),0_8px_10px_-6px_rgba(15,23,42,0.03)]'
          : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
