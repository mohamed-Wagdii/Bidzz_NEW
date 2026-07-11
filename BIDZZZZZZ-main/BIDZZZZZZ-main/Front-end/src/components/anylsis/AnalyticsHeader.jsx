// src/pages/Analytics/components/AnalyticsHeader.jsx
import React from 'react';

const AnalyticsHeader = () => {
  return (
    <>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive performance metrics for the current fiscal period.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2 text-sm">
            <span>📅</span>
            Last 30 Days
          </div>
          <button className="bg-black text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-gray-800">
            ↓ Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">TOTAL REVENUE</p>
          <p className="text-3xl font-bold mt-2">$4,829,102</p>
          <p className="text-green-500 text-sm mt-2 flex items-center gap-1">
            ↑ 12.5% <span className="text-gray-400">vs $4.2M last month</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">ACTIVE USERS</p>
          <p className="text-3xl font-bold mt-2">84,209</p>
          <p className="text-green-500 text-sm mt-2">+8.2%</p>
          <p className="text-xs text-gray-500">12,402 daily active</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">AUCTION SUCCESS</p>
          <p className="text-3xl font-bold mt-2">94.2%</p>
          <p className="text-red-500 text-sm mt-2">-1.4%</p>
          <p className="text-xs text-gray-500">Average sell-through rate</p>
        </div>

        <div className="bg-[#0f172a] text-white p-6 rounded-2xl shadow-sm">
          <p className="text-gray-400 text-sm">AVG. BID DELTA</p>
          <p className="text-4xl font-bold mt-2">24.5%</p>
          <p className="text-amber-400 text-sm mt-2 flex items-center gap-1">
            Premium over reserve price
          </p>
        </div>
      </div>
    </>
  );
};

export default AnalyticsHeader;