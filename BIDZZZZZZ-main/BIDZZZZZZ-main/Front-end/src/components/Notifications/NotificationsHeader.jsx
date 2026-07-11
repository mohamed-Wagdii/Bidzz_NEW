import React from "react";

// props هتيجي من الصفحة
// filters: array of { id, label }
// activeFilter: string (id)
// onFilterChange: function
export default function NotificationsHeader({
  filters,
  activeFilter,
  onFilterChange,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Activity Center</h1>
        <p className="text-gray-500 mt-1">
          Stay updated with your live auctions and account movements.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {filters?.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              activeFilter === filter.id
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}