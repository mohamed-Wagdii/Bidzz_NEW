// src/pages/Analytics/components/AnalyticsContent.jsx
import React from 'react';

const AnalyticsContent = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Revenue Growth Chart */}
      <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-semibold text-xl">Revenue Growth</h3>
            <p className="text-sm text-gray-500">Platform commissions over time</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-black rounded"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span>Projected</span>
            </div>
          </div>
        </div>
        
        {/* Placeholder for Chart - You can use Recharts, Chart.js, etc. */}
        <div className="h-80 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-gray-300">
          <p className="text-gray-400">Revenue Growth Bar + Line Chart Here</p>
          {/* <RevenueChart /> */}
        </div>
      </div>

      {/* Category Split */}
      <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="font-semibold text-xl mb-2">Category Split</h3>
        <p className="text-sm text-gray-500 mb-6">Asset distribution by value</p>
        
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-5xl font-bold">1.2k</p>
                <p className="text-sm text-gray-500">TOTAL ITEMS</p>
              </div>
            </div>
            {/* Donut Chart Placeholder */}
            <div className="w-64 h-64 rounded-full border-[40px] border-gray-200 border-r-yellow-400 border-b-blue-400 border-l-slate-700"></div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {[
            { name: "Luxury Watches", color: "bg-black", percent: "45%" },
            { name: "Fine Art", color: "bg-yellow-400", percent: "30%" },
            { name: "Vintage Cars", color: "bg-blue-300", percent: "25%" },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${item.color}`}></div>
                <span>{item.name}</span>
              </div>
              <span className="font-semibold">{item.percent}</span>
            </div>
          ))}
        </div>
      </div>

      {/* High-Value Transactions */}
      <div className="lg:col-span-12 bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="font-semibold text-xl">High-Value Transactions</h3>
          <a href="#" className="text-amber-600 hover:underline">View All Activity →</a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-600">AUCTION ITEM</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">WINNING BID</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">PARTICIPANT</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">STATUS</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg"></div>
                    <div>
                      <p className="font-medium">Patek Philippe Calatrava</p>
                      <p className="text-xs text-gray-500">ID: #AUC-29402</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 font-semibold">$42,500</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                    <span>Julian Donato</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">SETTLED</span>
                </td>
                <td className="px-6 py-5">⋯</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                      {/* Image placeholder */}
                    </div>
                    <div>
                      <p className="font-medium">Ephemeral Horizons No. 4</p>
                      <p className="text-xs text-gray-500">ID: #AUC-29408</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 font-semibold">$18,200</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-200 rounded-full"></div>
                    <span>Sarah Chen</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">IN PROGRESS</span>
                </td>
                <td className="px-6 py-5">⋯</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsContent;