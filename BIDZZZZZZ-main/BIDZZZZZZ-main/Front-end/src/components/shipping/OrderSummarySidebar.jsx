import React from "react";

// props هتيجي من الباك اند
// product: { lot, name, imageUrl, winningBid }
// costs: { winningBid, buyerPremium, buyerPremiumPercent, shipping, importDutiesLabel, totalAmount }
export default function OrderSummarySidebar({ product, costs }) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-100 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

        {/* Product */}
        <div className="flex items-start gap-3 pb-4 border-b border-gray-200">
          <img
            src={product?.imageUrl}
            alt={product?.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <p className="text-xs font-semibold text-yellow-600">
              LOT #{product?.lot}
            </p>
            <p className="font-semibold text-sm leading-snug">
              {product?.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Winning Bid: {product?.winningBid}
            </p>
          </div>
        </div>

        {/* Costs */}
        <div className="space-y-3 py-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Winning Bid</span>
            <span className="font-semibold">{costs?.winningBid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">
              Buyer's Premium ({costs?.buyerPremiumPercent}%)
            </span>
            <span className="font-semibold">{costs?.buyerPremium}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Shipping (Insured)</span>
            <span className="font-semibold">{costs?.shipping}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Est. Import Duties</span>
            <span className="bg-slate-900 text-yellow-400 text-xs font-semibold px-2 py-1 rounded">
              {costs?.importDutiesLabel}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 flex justify-between items-end">
          <span className="font-semibold">Total Amount</span>
          <div className="text-right">
            <p className="text-2xl font-bold">{costs?.totalAmount}</p>
            <p className="text-xs text-gray-400">EXCLUDING FINAL LOCAL TAXES</p>
          </div>
        </div>
      </div>

      {/* Authenticity Guarantee */}
      <div className="bg-gray-100 rounded-xl p-4 flex items-start gap-3">
        <span className="text-yellow-600 text-xl">🛡️</span>
        <div>
          <p className="font-semibold text-xs">BIDZONE AUTHENTICITY GUARANTEE</p>
          <p className="text-xs text-gray-500 mt-1">
            This item has been physically inspected by our horological experts
            and includes a certificate of authenticity.
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        By proceeding, you agree to BidZone's{" "}
        <span className="underline">Global Shipping Terms</span> and{" "}
        <span className="underline">Conditions of Sale</span>.
      </p>
    </div>
  );
}