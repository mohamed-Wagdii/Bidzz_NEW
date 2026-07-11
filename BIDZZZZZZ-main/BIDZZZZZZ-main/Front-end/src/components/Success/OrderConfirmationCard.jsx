import React from "react";

// props هتيجي من الباك اند
// orderInfo: { orderId, estimatedArrivalStart, estimatedArrivalEnd }
// product: { category, name, ref, imageUrl, price }
// onViewOrderDashboard, onBackToMarketplace: functions
export default function OrderConfirmationCard({
  orderInfo,
  product,
  onViewOrderDashboard,
  onBackToMarketplace,
}) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Order Identifier */}
        <div className="bg-gray-100 rounded-xl p-5">
          <p className="text-xs font-semibold text-gray-500">
            ORDER IDENTIFIER
          </p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            #{orderInfo?.orderId}
          </p>

          <p className="text-xs font-semibold text-gray-500 mt-4">
            ESTIMATED ARRIVAL
          </p>
          <p className="font-semibold text-gray-900 mt-1">
            {orderInfo?.estimatedArrivalStart} — {orderInfo?.estimatedArrivalEnd}
          </p>

          <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-yellow-600">
            🛡️ FULLY INSURED DELIVERY
          </div>
        </div>

        {/* Product */}
        <div className="border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-yellow-600">
            {product?.category}
          </p>
          <p className="font-semibold text-gray-900 mt-1 leading-snug">
            {product?.name}
          </p>
          <p className="text-sm text-gray-500">Ref. {product?.ref}</p>
          <img
            src={product?.imageUrl}
            alt={product?.name}
            className="w-full h-24 object-cover rounded-lg my-3"
          />
          <p className="font-bold text-gray-900">{product?.price}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={onViewOrderDashboard}
          className="bg-gray-900 hover:bg-black text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2"
        >
          View Order in Dashboard →
        </button>
        <button
          onClick={onBackToMarketplace}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 rounded-lg"
        >
          Back to Marketplace
        </button>
      </div>

      <div className="border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
        Need assistance with your delivery?{" "}
        <span className="text-yellow-600 font-semibold cursor-pointer">
          Contact Private Concierge
        </span>
      </div>
    </div>
  );
}