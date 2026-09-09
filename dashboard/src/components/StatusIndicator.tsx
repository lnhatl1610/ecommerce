import { useState } from "react";
import { Switch } from "@/components/ui/switch";

type StatusTone = "success" | "warning" | "danger" | "muted" | "info";

const textClasses: Record<StatusTone, string> = { success: "text-emerald-700", warning: "text-amber-700", danger: "text-red-700", muted: "text-gray-600", info: "text-blue-700" };

export function StatusIndicator({ label, tone = "muted" }: { label: string; tone?: StatusTone }) {
  const [active, setActive] = useState(tone === "success");
  return <span className={`inline-flex items-center gap-2 text-sm ${textClasses[tone]}`}><Switch checked={active} onChange={(event) => setActive(event.target.checked)} aria-label={label} /></span>;
}
