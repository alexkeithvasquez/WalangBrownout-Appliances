import React from 'react';

export const DashboardPage = () => {
  const stats = [
    { label: 'Total Products', value: '156', change: '+12', trend: 'up' },
    { label: 'Low Stock Items', value: '14', change: '+3', trend: 'up' },
    { label: 'Pending Orders', value: '23', change: '-5', trend: 'down' },
    { label: 'Inventory Value', value: '₱2.4M', change: '+12%', trend: 'up' },
  ];

  const alerts = [
    { sku: 'AC-1001', name: 'Portable AC Unit 12k BTU', current: 45, reorder: 120, severity: 'critical' },
    { sku: 'FL-2024', name: 'Carbon Air Filter', current: 30, reorder: 50, severity: 'warning' },
    { sku: 'TH-3001', name: 'Smart Thermostat Pro', current: 12, reorder: 25, severity: 'warning' },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Smith', amount: '₱45,000', status: 'Processing' },
    { id: 'ORD-002', customer: 'Maria Santos', amount: '₱24,999', status: 'Shipped' },
    { id: 'ORD-003', customer: 'Robert Chen', amount: '₱67,500', status: 'Delivered' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time inventory overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card p-6">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className={`text-sm mt-2 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Reorder Alerts</h2>
              <span className="badge-critical">{alerts.length} Active</span>
            </div>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  alert.severity === 'critical' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                }`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-gray-700">{alert.sku}</span>
                        <span className={alert.severity === 'critical' ? 'badge-critical' : 'badge-warning'}>
                          {alert.severity === 'critical' ? 'Critical' : 'Warning'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{alert.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-gray-600">Current: <span className="font-medium text-red-600">{alert.current}</span></span>
                        <span className="text-gray-600">Reorder Point: <span className="font-medium">{alert.reorder}</span></span>
                      </div>
                    </div>
                    <button className="btn-primary">Reorder</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.customer}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500">Amount</span>
                    <span className="text-sm font-medium text-gray-900">{order.amount}</span>
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