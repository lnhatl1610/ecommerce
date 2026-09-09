import { MoreHorizontal, Pencil, Settings2, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

export type RowAction = {
    label: string;
    onSelect: () => void;
    tone?: "default" | "danger";
};

type RowActionsMenuProps = {
    label: string;
    actions: RowAction[];
};

export function RowActionsMenu({ label, actions }: RowActionsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, right: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const updatePosition = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({ top: rect.bottom + 8, right: Math.max(12, window.innerWidth - rect.right) });
    };

    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && !triggerRef.current?.contains(event.target as Node)) setIsOpen(false);
        };
        const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
        document.addEventListener("mousedown", closeOnOutsideClick);
        document.addEventListener("keydown", closeOnEscape);
        return () => { document.removeEventListener("mousedown", closeOnOutsideClick); document.removeEventListener("keydown", closeOnEscape); };
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        updatePosition();
        const reposition = () => updatePosition();
        window.addEventListener("scroll", reposition, true);
        window.addEventListener("resize", reposition);
        return () => { window.removeEventListener("scroll", reposition, true); window.removeEventListener("resize", reposition); };
    }, [isOpen]);

    const actionIcon = (action: RowAction) => action.tone === "danger" ? <Trash2 size={16} /> : action.label.toLowerCase().includes("sửa") || action.label.toLowerCase().includes("edit") ? <Pencil size={16} /> : <Settings2 size={16} />;
    const menu = isOpen ? createPortal(<div ref={menuRef} role="menu" aria-label={`Tùy chọn cho ${label}`} style={{ top: position.top, right: position.right }} className="fixed z-[100] w-52 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 text-left shadow-[0_12px_35px_rgba(15,23,42,0.16)] ring-1 ring-black/5 animate-in fade-in zoom-in-95"><p className="px-3 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">Tùy chọn</p>{actions.map((action) => <button key={action.label} role="menuitem" type="button" onClick={() => { setIsOpen(false); action.onSelect(); }} className={`flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${action.tone === "danger" ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100"}`}>{actionIcon(action)}<span>{action.label}</span></button>)}</div>, document.body) : null;
    return <div className="inline-flex"><button ref={triggerRef} type="button" onClick={() => { updatePosition(); setIsOpen((current) => !current); }} aria-label={`Tùy chọn ${label}`} aria-expanded={isOpen} aria-haspopup="menu" title="Mở tùy chọn" className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${isOpen ? "border-gray-300 bg-gray-100 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900"}`}><MoreHorizontal size={19} /></button>{menu}</div>;
}
