import React from 'react';

export const Card = ({ children, className, title }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200/60 hover:shadow-md transition-shadow ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};