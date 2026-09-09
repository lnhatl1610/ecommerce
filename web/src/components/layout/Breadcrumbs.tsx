import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
export function Breadcrumbs({ current }: { current: string }) { return <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-sm text-stone-500"><Link to="/">Home</Link><ChevronRight size={14}/><span className="text-stone-900">{current}</span></nav>; }
