const AdminProductSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl border bg-white overflow-hidden">
      
      {/* Image */}
      <div className="h-44 bg-gray-200" />

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />

        <div className="flex justify-between mt-3">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>

        <div className="h-3 bg-gray-200 rounded w-1/3 mt-2" />

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <div className="h-8 bg-gray-200 rounded w-8" />
          <div className="h-8 bg-gray-200 rounded w-8" />
        </div>
      </div>

      {/* Footer actions */}
      <div className="grid grid-cols-3 border-t">
        <div className="h-10 bg-gray-200" />
        <div className="h-10 bg-gray-200 border-l" />
        <div className="h-10 bg-gray-200 border-l" />
      </div>
    </div>
  );
};

export default AdminProductSkeleton;