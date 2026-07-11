import React from "react";

// props هتيجي من الباك اند
// summary: { hammerPrice, buyerPremium, buyerPremiumPercent, vat, totalDue }
// onProceedToShipping, onDownloadInvoice: functions هتتبعت من الصفحة أو الباك اند
export default function OrderSummaryPanel({
  summary,
  onProceedToShipping,
  onDownloadInvoice,
}) {
  return (
    <div className="space-y-6">
      {/* Order Summary Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Hammer Price</span>
            <span className="font-semibold">{summary?.hammerPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">
              Buyer's Premium ({summary?.buyerPremiumPercent}%)
            </span>
            <span className="font-semibold">{summary?.buyerPremium}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">VAT/Tax</span>
            <span className="font-semibold">{summary?.vat}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4" />

        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold">Total Amount Due</span>
          <span className="text-2xl font-bold text-yellow-600">
            {summary?.totalDue}
          </span>
        </div>

        <button
          onClick={onProceedToShipping}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg mb-3 flex items-center justify-center gap-2"
        >
          🚚 Proceed to Shipping
        </button>

        <button
          onClick={onDownloadInvoice}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
        >
          📄 Download Invoice
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Payment must be finalized within 48 hours to guarantee the secured
          asset delivery.
        </p>
      </div>

      {/* Escrow Secured Box */}
      <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
        <span className="text-yellow-600 text-xl">🛡️</span>
        <div>
          <p className="font-semibold text-sm">Escrow Secured</p>
          <p className="text-xs text-gray-500">
            Funds held safely until delivery confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}