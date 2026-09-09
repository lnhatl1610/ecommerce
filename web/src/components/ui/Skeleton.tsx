export function Skeleton({ className = "h-4 w-full" }: { className?: string }) { return <div aria-hidden className={`animate-pulse rounded bg-stone-200 ${className}`}/>; }
