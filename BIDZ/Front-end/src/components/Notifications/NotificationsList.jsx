import React from "react";

// props هتيجي من الباك اند
// notifications: array of {
//   id, type: "won" | "outbid" | "refund",
//   imageUrl, badgeText, title, description, timeAgo,
//   action: { label, type: "button" | "link" }
// }
// onActionClick: function(notificationId)
// onShowOlder: function
// hasMore: boolean

const typeStyles = {
  won: {
    border: "border-l-4 border-yellow-400",
    badgeBg: "bg-yellow-100 text-yellow-700",
  },
  outbid: {
    border: "border-l-4 border-red-400",
    badgeBg: "bg-red-100 text-red-600",
  },
  refund: {
    border: "border-l-4 border-transparent",
    badgeBg: "bg-gray-100 text-gray-600",
  },
};

function NotificationAction({ action, onClick }) {
  if (!action) return null;

  if (action.type === "link") {
    return (
      <button
        onClick={onClick}
        className="text-sm font-semibold text-gray-900 underline whitespace-nowrap"
      >
        {action.label}
      </button>
    );
  }

  const isPrimary = action.style === "primary";

  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap ${
        isPrimary
          ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
          : "bg-gray-900 hover:bg-black text-white"
      }`}
    >
      {action.label}
    </button>
  );
}

export default function NotificationsList({
  notifications,
  onActionClick,
  onShowOlder,
  hasMore,
}) {
  return (
    <div className="space-y-4 mt-8">
      {notifications?.map((item) => {
        const style = typeStyles[item.type] || typeStyles.refund;
        return (
          <div
            key={item.id}
            className={`bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 ${style.border}`}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0"
            />

            <div className="flex-1 min-w-0">
              <span
                className={`inline-block text-xs font-semibold px-2 py-1 rounded ${style.badgeBg}`}
              >
                {item.badgeText}
              </span>
              <h3 className="font-semibold text-gray-900 mt-1">
                {item.title}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {item.description}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3 shrink-0">
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {item.timeAgo}
              </span>
              <NotificationAction
                action={item.action}
                onClick={() => onActionClick(item.id)}
              />
            </div>
          </div>
        );
      })}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onShowOlder}
            className="flex items-center gap-2 border border-gray-300 rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            ▾ Show Older Notifications
          </button>
        </div>
      )}
    </div>
  );
}