import React from "react";

// props هتيجي من الصفحة
// currentStep: number (1-4, هنا هيكون 4)
// title: string
// description: string
export default function SuccessHeader({ currentStep, title, description }) {
  const totalSteps = 4;

  return (
    <div className="text-center space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isDone = stepNum < currentStep;
          return (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  isActive
                    ? "bg-yellow-500 text-white"
                    : isDone
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {stepNum}
              </div>
              {stepNum < totalSteps && (
                <div className="w-10 h-px bg-gray-300" />
              )}
            </div>
          );
        })}
      </div>

      {/* Checkmark */}
      <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center mx-auto text-3xl">
        ✓
      </div>

      <div>
        <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>
        <p className="text-gray-500 max-w-md mx-auto mt-3">{description}</p>
      </div>
    </div>
  );
}