import React from "react";

// props هتيجي من الباك اند / الصفحة
// currentStep: number (1 = Shipping, 2 = Review, 3 = Payment, 4 = Success)
// savedCard: { last4, expiry }
// selectedMethod: "saved" | "new" | "wire"
// onSelectMethod: function
// cardForm: { cardholderName, cardNumber, expiryDate, cvv }
// onCardFormChange: function
// sameAsBilling: boolean
// onToggleSameAsBilling: function
const steps = ["SHIPPING", "REVIEW", "PAYMENT", "SUCCESS"];

export default function PaymentMethodForm({
  currentStep,
  savedCard,
  selectedMethod,
  onSelectMethod,
  cardForm,
  onCardFormChange,
  sameAsBilling,
  onToggleSameAsBilling,
}) {
  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-4">
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isDone = stepNum < currentStep;
          return (
            <div key={label} className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    isActive
                      ? "bg-yellow-400 text-gray-900"
                      : isDone
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {stepNum}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-yellow-600" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-10 h-px bg-gray-300 mb-5" />
              )}
            </div>
          );
        })}
      </div>

      {/* Secure Payment Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          🔒 Secure Payment
        </h3>

        <div className="space-y-3">
          {/* Saved Card */}
          <label
            className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer ${
              selectedMethod === "saved"
                ? "border-yellow-500 bg-yellow-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={selectedMethod === "saved"}
                onChange={() => onSelectMethod("saved")}
              />
              <div>
                <p className="font-semibold text-sm">Saved Credit Card</p>
                <p className="text-sm text-gray-500">
                  •••• •••• •••• {savedCard?.last4} | Exp: {savedCard?.expiry}
                </p>
              </div>
            </div>
            <span>💳</span>
          </label>

          {/* New Card */}
          <label
            className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer ${
              selectedMethod === "new"
                ? "border-yellow-500 bg-yellow-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={selectedMethod === "new"}
                onChange={() => onSelectMethod("new")}
              />
              <span className="font-semibold text-sm">
                Add New Credit/Debit Card
              </span>
            </div>
          </label>

          {selectedMethod === "new" && (
            <div className="space-y-3 pl-2">
              <div>
                <label className="text-xs font-semibold text-gray-500">
                  CARDHOLDER NAME
                </label>
                <input
                  type="text"
                  value={cardForm?.cardholderName || ""}
                  onChange={(e) =>
                    onCardFormChange("cardholderName", e.target.value)
                  }
                  className="w-full mt-1 bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500">
                  CARD NUMBER
                </label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardForm?.cardNumber || ""}
                  onChange={(e) =>
                    onCardFormChange("cardNumber", e.target.value)
                  }
                  className="w-full mt-1 bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500">
                    EXPIRY DATE
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardForm?.expiryDate || ""}
                    onChange={(e) =>
                      onCardFormChange("expiryDate", e.target.value)
                    }
                    className="w-full mt-1 bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500">
                    CVV / CVC
                  </label>
                  <input
                    type="password"
                    value={cardForm?.cvv || ""}
                    onChange={(e) => onCardFormChange("cvv", e.target.value)}
                    className="w-full mt-1 bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Wire Transfer */}
          <label
            className={`flex flex-col border rounded-lg p-4 cursor-pointer ${
              selectedMethod === "wire"
                ? "border-yellow-500 bg-yellow-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={selectedMethod === "wire"}
                onChange={() => onSelectMethod("wire")}
              />
              <span className="font-semibold text-sm">
                Direct Bank Transfer (Wire)
              </span>
              <span className="ml-auto">🏦</span>
            </div>
            {selectedMethod === "wire" && (
              <p className="text-xs text-gray-500 mt-2 pl-7">
                Payment will be processed once funds are received. Expect 1-3
                business days for confirmation.
              </p>
            )}
          </label>
        </div>
      </div>

      {/* Billing checkbox */}
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={sameAsBilling}
          onChange={onToggleSameAsBilling}
          className="accent-yellow-600 w-4 h-4"
        />
        My billing address is the same as my shipping address
      </label>
    </div>
  );
}