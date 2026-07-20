import React from "react";

// props هتيجي من الباك اند / الصفحة
// currentStep: number (1 = Order, 2 = Shipping, 3 = Payment, 4 = Complete)
// address: { fullName, street, city, zip, country }
// onAddressChange: function
// shippingMethods: array of { id, name, description, price }
// selectedShippingMethod: string (id)
// onSelectShippingMethod: function
// onBack, onProceed: functions
const steps = ["Order", "Shipping", "Payment", "Complete"];

export default function ShippingAddressForm({
  currentStep,
  address,
  onAddressChange,
  shippingMethods,
  selectedShippingMethod,
  onSelectShippingMethod,
  onBack,
  onProceed,
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
                    isDone
                      ? "bg-gray-900 text-white"
                      : isActive
                      ? "bg-white border-2 border-gray-900 text-gray-900"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isDone ? "✓" : stepNum}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive || isDone ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-16 h-px bg-gray-300 mb-5" />
              )}
            </div>
          );
        })}
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          🚚 Shipping Address
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={address?.fullName || ""}
              onChange={(e) => onAddressChange("fullName", e.target.value)}
              className="w-full mt-1 bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              value={address?.street || ""}
              onChange={(e) => onAddressChange("street", e.target.value)}
              className="w-full mt-1 bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                value={address?.city || ""}
                onChange={(e) => onAddressChange("city", e.target.value)}
                className="w-full mt-1 bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                ZIP / Postal Code
              </label>
              <input
                type="text"
                value={address?.zip || ""}
                onChange={(e) => onAddressChange("zip", e.target.value)}
                className="w-full mt-1 bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              value={address?.country || ""}
              onChange={(e) => onAddressChange("country", e.target.value)}
              className="w-full mt-1 bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select country</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Egypt">Egypt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipping Method */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          📦 Shipping Method
        </h3>

        <div className="space-y-3">
          {shippingMethods?.map((method) => (
            <label
              key={method.id}
              className={`flex items-start justify-between border rounded-lg p-4 cursor-pointer ${
                selectedShippingMethod === method.id
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  className="mt-1"
                  checked={selectedShippingMethod === method.id}
                  onChange={() => onSelectShippingMethod(method.id)}
                />
                <div>
                  <p className="font-semibold text-sm">{method.name}</p>
                  <p className="text-sm text-gray-500">
                    {method.description}
                  </p>
                </div>
              </div>
              <span className="font-semibold text-yellow-600 whitespace-nowrap">
                {method.price}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          ← Back to Order Details
        </button>
        <button
          onClick={onProceed}
          className="bg-gray-900 hover:bg-black text-white font-semibold px-6 py-3 rounded-lg"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}