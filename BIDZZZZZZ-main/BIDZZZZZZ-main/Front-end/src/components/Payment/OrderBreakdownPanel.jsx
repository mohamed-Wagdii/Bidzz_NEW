import React from "react";

// props هتيجي من الباك اند
// product: { name, lot, imageUrl }
// breakdown: { hammerPrice, buyerPremium, buyerPremiumPercent, shipping, vat, totalDue }
// onPayNow: function
export default function OrderBreakdownPanel({ product, breakdown, onPayNow }) {
  return (
    <div className="bg-slate-900 text-white rounded-xl p-6 h-fit">
      <h3 className="text-lg font-semibold mb-4">Order Breakdown</h3>

      {/* Product */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-700">
        <img
          src={product?.imageUrl}
          alt={product?.name}
          className="w-14 h-14 rounded-lg object-cover"
        />
        <div>
          <p className="font-semibold text-sm">{product?.name}</p>
          <p className="text-xs text-slate-400">{product?.lot}</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3 py-4 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Hammer Price</span>
          <span className="font-semibold">{breakdown?.hammerPrice}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">
            Buyer's Premium ({breakdown?.buyerPremiumPercent}%)
          </span>
          <span className="font-semibold">{breakdown?.buyerPremium}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">White-Glove Shipping</span>
          <span className="font-semibold">{breakdown?.shipping}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">VAT / Import Duties</span>
          <span className="font-semibold">{breakdown?.vat}</span>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-4 flex justify-between items-end mb-6">
        <span className="text-xs text-slate-400 uppercase">
          Total Amount Due
        </span>
        <span className="text-2xl font-bold text-yellow-400">
          {breakdown?.totalDue}
        </span>
      </div>

      <button
        onClick={onPayNow}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
      >
        🛡️ Pay Now & Secure Asset
      </button>

      <p className="text-xs text-slate-400 text-center mt-4">
        By clicking 'Pay Now', you agree to the BidZone Terms of Sale and the
        binding nature of high-value luxury transactions.
      </p>
    </div>
  );
}