"use client";

export function SidebarSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="py-5 px-5 pb-3 border-b border-line dark:border-line-strong flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="skeleton w-24 h-3" />
          <div className="skeleton w-4 h-4 rounded-full" />
        </div>
      </div>

      {/* Topic cards */}
      <div className="flex-1 min-h-0 flex flex-col gap-3 px-5 pb-5 pt-4 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="relative flex gap-3">
            {/* Timeline dot */}
            <div className="w-8 flex-shrink-0 flex justify-center pt-3.5">
              <div className="skeleton w-3 h-3 rounded-full" />
            </div>
            {/* Card */}
            <div className="flex-1 rounded-2xl p-3.5 border border-line-strong dark:border-line">
              <div className="flex items-center justify-between mb-1">
                <div className="skeleton w-16 h-1.5" />
                <div className="skeleton w-14 h-3 rounded-full" />
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="skeleton w-3.5 h-3.5 rounded-sm" />
                <div className="skeleton h-3" style={{ width: `${70 - i * 4}%` }} />
              </div>
              <div className="skeleton w-full h-2 mb-0.5" />
              <div className="skeleton w-3/4 h-2 mb-2" />
              <div className="flex items-center gap-2 mt-2">
                <div className="skeleton w-5 h-5 rounded-full" />
                <div className="skeleton w-8 h-2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
