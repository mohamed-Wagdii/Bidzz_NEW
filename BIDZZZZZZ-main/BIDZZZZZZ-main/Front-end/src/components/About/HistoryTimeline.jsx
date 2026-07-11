import React from 'react';

const HistoryTimeline = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">A History of Distinction</h2>

        <div className="relative border-l-4 border-yellow-400 pl-8 space-y-16">
          <div>
            <div className="absolute -left-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="text-yellow-600 font-bold text-xl">2018</div>
            <h3 className="text-2xl font-semibold mt-2">Founding Vision</h3>
            <p className="text-gray-600 mt-3">
              Meen Yazweed ? was established in Dubai with a singular mission to digitize the elite auction house experience for the Middle Eastern market.
            </p>
          </div>

          <div>
            <div className="absolute -left-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="text-yellow-600 font-bold text-xl">2020</div>
            <h3 className="text-2xl font-semibold mt-2">Global Expansion</h3>
            <p className="text-gray-600 mt-3">
              Expansion into European and Asian markets, introducing cross-border logistics and multi-currency escrow service.
            </p>
          </div>

          <div>
            <div className="absolute -left-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="text-yellow-600 font-bold text-xl">2022</div>
            <h3 className="text-2xl font-semibold mt-2">The Billion Dollar Milestone</h3>
            <p className="text-gray-600 mt-3">
              Surpassed $1 Billion in total transaction volume, highlighted by the record-breaking auction of a 1963 Ferrari GTO.
            </p>
          </div>

          <div>
            <div className="absolute -left-3 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <div className="text-yellow-600 font-bold text-xl">2024</div>
            <h3 className="text-2xl font-semibold mt-2">Future of Luxury</h3>
            <p className="text-gray-600 mt-3">
              Leading the industry with AI-driven valuation models and a community of over 350,000 verified luxury collectors globally.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 bg-gradient-to-r from-gray-900 to-black text-white rounded-3xl p-16 text-center">
          <h2 className="text-4xl font-bold mb-4">Become Part of the Legacy</h2>
          <p className="text-lg mb-8 max-w-md mx-auto">
            Join an exclusive circle of collectors and gain access to the world's most coveted assets.
          </p>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-10 py-4 rounded-xl transition">
            Create Your Account
          </button>
        </div>
      </div>
    </section>
  );
};

export default HistoryTimeline;