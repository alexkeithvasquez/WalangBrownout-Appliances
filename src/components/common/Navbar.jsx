// src/components/common/Navbar.jsx
import React from 'react';

export const Navbar = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'warehouse', label: '🏭 Warehouse', icon: '🏭' },
    { id: 'storefront', label: '🛍️ Storefront', icon: '🛍️' },
    { id: 'management', label: '📈 Management', icon: '📈' },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">⚡ WalangBrownout</span>
            <span className="ml-2 text-sm text-gray-500 hidden sm:inline">Inventory System</span>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.icon}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 hidden sm:inline">Live</span>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
              A
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};