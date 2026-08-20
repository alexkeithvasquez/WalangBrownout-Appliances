import React, { useState } from 'react';

export const WarehousePage = () => {
  const [scanInput, setScanInput] = useState('');
  const [scans, setScans] = useState([]);

  const pickList = [
    { id: 'BATCH-001', name: 'Carbon Air Filter', location: 'Aisle 3, Shelf B', status: 'ok' },
    { id: 'BATCH-003', name: 'Carbon Air Filter', location: 'Aisle 3, Shelf A', status: 'warning' },
  ];

  const handleScan = () => {
    if (!scanInput.trim()) return;
    setScans([{ id: scanInput, time: new Date().toLocaleTimeString() }, ...scans]);
    setScanInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Warehouse Operations</h1>
        <p className="text-gray-500 text-sm mt-1">Batch management and FIFO picking</p>
      </div>

      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
          <input
            type="text"
            placeholder="Scan barcode or enter SKU..."
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
          <button onClick={handleScan} className="btn-primary">
            Scan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">FIFO Pick List</h2>
            <div className="space-y-3">
              {pickList.map((item) => (
                <div key={item.id} className={`p-4 rounded-lg border ${
                  item.status === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-green-200 bg-green-50'
                }`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-gray-700">{item.id}</span>
                        <span className={item.status === 'ok' ? 'badge-success' : 'badge-warning'}>
                          {item.status === 'ok' ? 'FIFO OK' : 'Expiring Soon'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-1">{item.name}</p>
                      <p className="text-sm text-gray-500 mt-1">📍 {item.location}</p>
                    </div>
                    <button className="btn-success">Pick</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Scans</h2>
            {scans.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No scans recorded</p>
            ) : (
              <div className="space-y-2">
                {scans.map((scan, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-mono text-sm text-gray-700">{scan.id}</span>
                    <span className="text-xs text-gray-400">{scan.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};