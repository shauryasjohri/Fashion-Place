import clsx from 'clsx'

function Skeleton({ className }) {
  return (
    <div
      className={clsx('animate-pulse bg-gray-300 rounded', className)}
      aria-hidden="true"
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="max-w-72 rounded-lg m-2 overflow-hidden">
      <Skeleton className="w-full h-72" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function ProductListSkeleton({ count = 4 }) {
  return (
    <div className="flex flex-wrap justify-center">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function OrderItemSkeleton() {
  return (
    <div className="flex flex-col m-2 p-2 space-y-3">
      <div className="flex justify-center items-center flex-wrap gap-2">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="w-24 h-24 sm:w-32 sm:h-32" />
        ))}
      </div>
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 py-8 px-4 gap-8">
      <Skeleton className="h-96 w-full" />
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-12 w-48" />
      </div>
    </div>
  )
}

export default Skeleton
