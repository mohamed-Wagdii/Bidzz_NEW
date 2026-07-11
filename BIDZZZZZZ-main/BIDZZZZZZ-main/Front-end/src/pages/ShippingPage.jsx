import React, { useState } from "react";
import ShippingAddressForm from "../components/Shipping/ShippingAddressForm";
import OrderSummarySidebar from "../components/Shipping/OrderSummarySidebar";

// الصفحة دي بس بتنادي الـ components + بتدير الـ local form state
// الداتا الأساسية (product, costs) هتيجي من الباك اند
export default function Shipping() {
  // TODO: fetch من /api/orders/:id/shipping
  const product = null;
  const costs = null;
  const shippingMethods = [];

  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    zip: "",
    country: "",
  });
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("");

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    // TODO: navigate to Order Details page
  };

  const handleProceed = () => {
    // TODO: call API لحفظ الشحن، وبعدها navigate لصفحة Payment
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        <ShippingAddressForm
          currentStep={2}
          address={address}
          onAddressChange={handleAddressChange}
          shippingMethods={shippingMethods}
          selectedShippingMethod={selectedShippingMethod}
          onSelectShippingMethod={setSelectedShippingMethod}
          onBack={handleBack}
          onProceed={handleProceed}
        />
        <OrderSummarySidebar product={product} costs={costs} />
      </div>
    </div>
  );
}