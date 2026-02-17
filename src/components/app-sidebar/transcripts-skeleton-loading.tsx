import React from "react";

function TranscriptsSkeletonLoading() {
  return (
    <div className="space-y-1 px-1 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2 rounded-md"
        >
          {/* Icon */}
          <div className="h-5 w-5 rounded-md bg-gray-200 dark:bg-gray-700" />

          {/* Text */}
          <div className="flex-1">
            <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default TranscriptsSkeletonLoading;
