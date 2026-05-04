import Skeleton from "../ui/Skeleton";

const OrderSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 space-y-4">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>

        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Items */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Address */}
      <div className="border-t pt-3 space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-full" />
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
};

export default OrderSkeleton;