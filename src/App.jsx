import React, { useState } from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { WarehousePage } from './pages/WarehousePage';
import { StorefrontPage } from './pages/StorefrontPage';
import { ManagementPage } from './pages/ManagementPage';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'warehouse', label: 'Warehouse' },
    { id: 'storefront', label: 'Storefront' },
    { id: 'management', label: 'Management' },
  ];

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'warehouse': return <WarehousePage />;
      case 'storefront': return <StorefrontPage />;
      case 'management': return <ManagementPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">WB</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">WalangBrownout</span>
              <span className="text-sm text-gray-400 hidden sm:inline">Inventory</span>
            </div>
            
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                AK
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around p-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center px-3 py-2 rounded-lg text-xs ${
                currentPage === item.id ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}
            >
              <span className="text-lg mb-0.5">
                {item.id === 'dashboard' && '📊'}
                {item.id === 'warehouse' && '🏭'}
                {item.id === 'storefront' && '🛍️'}
                {item.id === 'management' && '📈'}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;