const SkeletonRow = () => (
  <div className="mb-6">
    <div className="flex items-center gap-2 px-4 mb-3">
      <div className="skeleton-shimmer w-7 h-7 rounded-full" />
      <div className="skeleton-shimmer w-24 h-4 rounded" />
    </div>
    <div className="flex gap-3 px-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-36">
          <div className="skeleton-shimmer aspect-video rounded-xl" />
          <div className="skeleton-shimmer w-24 h-3 rounded mt-2" />
          <div className="skeleton-shimmer w-16 h-2 rounded mt-1" />
        </div>
      ))}
    </div>
  </div>
);

const SkeletonLoader = () => (
  <div className="pt-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </div>
);

export default SkeletonLoader;
