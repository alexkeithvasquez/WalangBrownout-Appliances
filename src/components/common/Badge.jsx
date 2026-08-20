import React from 'react';

export const Badge = ({ status, children, className }) => {
  const statusStyles = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.info} ${className}`}>
      {children}
    </span>
  );
};