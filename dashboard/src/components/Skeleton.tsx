export function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`} />;
}

export function DashboardSkeleton() {
  return <div className="space-y-5" aria-label="Đang tải dữ liệu" role="status"><div className="grid grid-cols-1 gap-4 md:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-24" />)}</div><div className="grid gap-5 lg:grid-cols-2">{Array.from({ length: 2 }, (_, index) => <Skeleton key={index} className="h-64" />)}</div></div>;
}
