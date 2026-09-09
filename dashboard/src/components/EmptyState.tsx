import type { ReactNode } from "react";
import { PackageOpen } from "lucide-react";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="flex min-h-48 flex-col items-center justify-center gap-2 p-8 text-center"><span className="rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300"><PackageOpen size={24} /></span><h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>{description && <p className="max-w-sm text-sm text-gray-500">{description}</p>}{action}</div>;
}
