import Skeleton from "../ui/Skeleton";

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">

      {/* Image */}
      <Skeleton className="h-40 w-full rounded-xl" />

      {/* Title */}
      <Skeleton className="h-4 w-3/4" />

      {/* Price */}
      <Skeleton className="h-4 w-1/3" />

      {/* Button */}
      <Skeleton className="h-10 w-full rounded-lg" />

    </div>
  );
};

export default ProductSkeleton;