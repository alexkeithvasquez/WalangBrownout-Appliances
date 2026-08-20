import React, { useState } from 'react';

export const StorefrontPage = () => {
  const [cartCount, setCartCount] = useState(0);

  const products = [
    { id: 1, name: 'Portable AC Unit 12k BTU', price: 24999, stock: 45 },
    { id: 2, name: 'Smart Thermostat Pro', price: 8999, stock: 12 },
    { id: 3, name: 'Carbon Air Filter', price: 1299, stock: 2 },
    { id: 4, name: 'Air Purifier 3000', price: 15999, stock: 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Storefront</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time stock availability</p>
        </div>
        <div className="relative">
          <button className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const isOutOfStock = product.stock === 0;
          const isLowStock = product.stock > 0 && product.stock < 5;

          return (
            <div key={product.id} className="card overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100/50 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white/80 flex items-center justify-center text-4xl shadow-sm">
                  {product.name.includes('AC') && '❄️'}
                  {product.name.includes('Thermostat') && '🌡️'}
                  {product.name.includes('Filter') && '💨'}
                  {product.name.includes('Purifier') && '🌀'}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-xl font-bold text-blue-600 mt-2">₱{product.price.toLocaleString()}</p>
                <p className={`text-sm mt-2 font-medium ${
                  isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {isOutOfStock ? 'Out of Stock' : isLowStock ? `Only ${product.stock} left` : `${product.stock} in stock`}
                </p>
                <button
                  onClick={() => !isOutOfStock && setCartCount(cartCount + 1)}
                  disabled={isOutOfStock}
                  className={`w-full mt-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-20 md:bottom-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2.5 border border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Live</span>
          <span className="text-gray-300">•</span>
          <span className="text-gray-400">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};