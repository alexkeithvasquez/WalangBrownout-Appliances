import React from 'react';

export const ManagementPage = () => {
  const metrics = [
    { label: 'Holding Cost', value: '₱45,230', change: '-8%', trend: 'down' },
    { label: 'Write-off Value', value: '₱15,000', change: '+12%', trend: 'up' },
    { label: 'Stockout Frequency', value: '23', change: '-5', trend: 'down' },
    { label: 'Turnover Rate', value: '4.2x', change: '+0.5', trend: 'up' },
  ];

  const costBreakdown = [
    { category: 'Storage', amount: 18230, percentage: 40 },
    { category: 'Write-offs', amount: 15000, percentage: 33 },
    { category: 'Handling', amount: 8000, percentage: 18 },
    { category: 'Insurance', amount: 4000, percentage: 9 },
  ];

  const discrepancies = [
    { sku: 'TH-1001', name: 'Smart Thermostat Pro', system: 45, physical: 12, status: 'investigating' },
    { sku: 'AC-2003', name: 'Portable AC Unit', system: 120, physical: 118, status: 'resolved' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Management Reporting</h1>
        <p className="text-gray-500 text-sm mt-1">Inventory performance and cost analysis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="card p-6">
            <p className="text-sm text-gray-500">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
            <p className={`text-sm mt-2 ${metric.trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
              {metric.trend === 'up' ? '↑' : '↓'} {metric.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h2>
            <div className="space-y-4">
              {costBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-gray-700">{item.category}</span>
                    <span className="text-gray-600">₱{item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${
                        index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-red-500' : index === 2 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{item.percentage}% of total</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Discrepancy Alerts</h2>
            <div className="space-y-3">
              {discrepancies.map((item, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  item.status === 'investigating' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-gray-700">{item.sku}</span>
                        <span className={item.status === 'investigating' ? 'badge-critical' : 'badge-success'}>
                          {item.status === 'investigating' ? 'Investigating' : 'Resolved'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{item.name}</p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-gray-600">System: <span className="font-medium">{item.system}</span></span>
                        <span className="text-gray-600">Physical: <span className="font-medium">{item.physical}</span></span>
                        <span className="text-gray-600">Diff: <span className="font-medium text-red-600">+{item.system - item.physical}</span></span>
                      </div>
                    </div>
                    <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      item.status === 'investigating' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    } transition-colors`}>
                      {item.status === 'investigating' ? 'Investigate' : 'View'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};