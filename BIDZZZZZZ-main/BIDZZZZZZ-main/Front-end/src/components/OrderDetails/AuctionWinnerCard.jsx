import React from "react";

// props هتيجي من الباك اند - مفيش أي static data هنا
// order: { winnerName, itemName, imageUrl, status }
// specs: array of { label, value }
// timeline: { startedAt, completedAt, winnerName, winnerAvatar }
export default function AuctionWinnerCard({ order, specs, timeline }) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Congrats Banner */}
      <div className="bg-yellow-400 rounded-xl p-6 flex items-start gap-4">
        <div className="bg-yellow-600 text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0">
          🏆
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Congratulations, {order?.winnerName}!
          </h2>
          <p className="text-gray-800">
            You have successfully won the auction for the {order?.itemName}.
          </p>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative rounded-xl overflow-hidden bg-black">
        <img
          src={order?.imageUrl}
          alt={order?.itemName}
          className="w-full h-[500px] object-cover"
        />
        <span className="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full" />
          {order?.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Technical Specifications */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
          <div className="divide-y divide-gray-100">
            {specs?.map((item, i) => (
              <div key={i} className="flex justify-between py-3">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-semibold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Auction Timeline */}
        <div className="bg-slate-900 text-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Auction Timeline</h3>
          <div className="space-y-4">
            <div>
              <p className="text-yellow-400 text-sm">Started</p>
              <p className="font-semibold">{timeline?.startedAt}</p>
            </div>
            <div>
              <p className="text-yellow-400 text-sm">Completed</p>
              <p className="font-semibold">{timeline?.completedAt}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 flex items-center gap-3">
              <img
                src={timeline?.winnerAvatar}
                alt={timeline?.winnerName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-yellow-400 text-xs">Winning Participant</p>
                <p className="font-semibold">{timeline?.winnerName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}