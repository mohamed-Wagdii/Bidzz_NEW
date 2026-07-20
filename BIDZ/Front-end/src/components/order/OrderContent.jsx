// src/pages/OrderDetails/components/OrderContent.jsx
import React from 'react';

const OrderContent = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Watch Image */}
      <div className="lg:col-span-7 bg-white rounded-2xl overflow-hidden shadow">
        <div className="relative">
          <div className="absolute top-4 right-4 bg-green-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Auction Ended
          </div>
          <img 
            src="/images/patek-nautilus.jpg" 
            alt="Patek Philippe Nautilus" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow">
        <h3 className="text-2xl font-semibold mb-6">Order Summary</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Hammer Price</span>
            <span className="font-semibold">$85,000.00</span>
          </div>
          <div className="flex justify-between">
            <span>Buyer's Premium (10%)</span>
            <span className="font-semibold">$8,500.00</span>
          </div>
          <div className="flex justify-between">
            <span>VAT/Tax</span>
            <span className="font-semibold">$0.00</span>
          </div>
          
          <hr className="my-4" />
          
          <div className="flex justify-between text-xl font-bold">
            <span>Total Amount Due</span>
            <span className="text-amber-600">$93,500.00</span>
          </div>
        </div>

        <button className="w-full bg-amber-800 hover:bg-amber-900 text-white py-4 rounded-xl mt-8 flex items-center justify-center gap-2 font-semibold">
          🚚 Proceed to Shipping
        </button>

        <button className="w-full border border-gray-300 hover:bg-gray-50 py-4 rounded-xl mt-3 flex items-center justify-center gap-2">
          📄 Download Invoice
        </button>

        <p className="text-sm text-gray-500 text-center mt-4">
          Payment must be finalized within 48 hours
        </p>
      </div>

      {/* Technical Specifications + Timeline */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {/* Technical Specs */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h4 className="font-semibold text-lg mb-4">Technical Specifications</h4>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Reference Number</span>
              <span>5711/1A-010</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Movement</span>
              <span>Automatic</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Case Material</span>
              <span>Stainless Steel</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Power Reserve</span>
              <span>45 Hours</span>
            </div>
          </div>
        </div>

        {/* Auction Timeline */}
        <div className="bg-[#0f172a] text-white p-6 rounded-2xl shadow">
          <h4 className="font-semibold text-lg mb-4">Auction Timeline</h4>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 bg-yellow-400 rounded-full"></div>
              <div>
                <p className="font-medium">Started</p>
                <p className="text-sm text-gray-400">Oct 12, 2023 • 09:00 AM</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 mt-2 bg-yellow-400 rounded-full"></div>
              <div>
                <p className="font-medium">Completed</p>
                <p className="text-sm text-gray-400">Oct 19, 2023 • 06:00 PM</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-[#1e2937] p-4 rounded-xl">
            <p className="text-sm text-gray-400 mb-1">Winning Participant</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
              <div>
                <p className="font-medium">Julian Vane</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderContent;