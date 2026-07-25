"use client";

export function LessonViewSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="skeleton w-16 h-2" />
        <div className="skeleton w-2 h-2 rounded-full" />
        <div className="skeleton w-10 h-2" />
        <div className="skeleton w-2 h-2 rounded-full" />
        <div className="skeleton w-24 h-2" />
      </div>

      {/* Title */}
      <div>
        <div className="skeleton w-3/4 h-5 mb-2" />
        <div className="skeleton w-20 h-3" />
      </div>

      {/* Topics index */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-[#E5E7EB] dark:border-[#374151] rounded-xl p-4">
        <div className="skeleton w-24 h-3 mb-3" />
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 py-1.5 border-b border-[#F3F4F6] dark:border-[#1F2937] last:border-none">
              <div className="skeleton w-5 h-5 rounded-full flex-shrink-0" />
              <div className="skeleton h-2.5 flex-1" style={{ width: `${85 - i * 8}%` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Video placeholder */}
      <div className="skeleton w-full rounded-xl" style={{ paddingBottom: "56.25%" }} />

      {/* Text lines */}
      <div className="flex flex-col gap-2">
        <div className="skeleton w-full h-3" />
        <div className="skeleton w-11/12 h-3" />
        <div className="skeleton w-4/5 h-3" />
        <div className="skeleton w-full h-3 mt-2" />
        <div className="skeleton w-3/4 h-3" />
      </div>
    </div>
  );
}

export function TopicViewSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="skeleton w-32 h-2" />
        <div className="skeleton w-64 h-5" />
        <div className="skeleton w-full h-3 mt-1" />
        <div className="skeleton w-5/6 h-3" />
      </div>

      {/* Video */}
      <div>
        <div className="skeleton w-28 h-2.5 mb-2" />
        <div className="skeleton w-full rounded-xl" style={{ paddingBottom: "56.25%" }} />
      </div>

      {/* Lessons */}
      <div>
        <div className="skeleton w-28 h-2.5 mb-3" />
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl border border-[#F3F4F6] dark:border-[#374151]">
              <div className="skeleton w-4 h-4 rounded-full flex-shrink-0" />
              <div className="skeleton h-2.5 flex-1" style={{ width: `${90 - i * 5}%` }} />
              <div className="skeleton w-12 h-2.5 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div>
        <div className="skeleton w-36 h-2.5 mb-3" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
