import { AlertTriangle, X } from "lucide-react";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export function ConfirmDialog({ open, title, description, confirmLabel = "Xóa", loading = false, onCancel, onConfirm }: ConfirmDialogProps) {
    if (!open) return null;
    return <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onCancel(); }}>
        <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
            <div className="flex items-start gap-3"><div className="rounded-full bg-red-50 p-2 text-red-600"><AlertTriangle size={18} /></div><div className="min-w-0 flex-1"><h2 id="confirm-dialog-title" className="font-semibold text-gray-900">{title}</h2><p className="mt-1 text-sm text-gray-500">{description}</p></div><button type="button" aria-label="Đóng" disabled={loading} onClick={onCancel} className="rounded p-1 text-gray-400 hover:bg-gray-100"><X size={17} /></button></div>
            <div className="mt-5 flex justify-end gap-2"><button type="button" disabled={loading} onClick={onCancel} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">Hủy</button><button type="button" disabled={loading} onClick={onConfirm} className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60">{loading ? "Đang xóa..." : confirmLabel}</button></div>
        </div>
    </div>;
}
