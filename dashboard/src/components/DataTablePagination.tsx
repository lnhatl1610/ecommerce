import { ChevronLeft, ChevronRight } from "lucide-react";

type DataTablePaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export function DataTablePagination({ currentPage, totalPages, onPageChange }: DataTablePaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1);

    return <nav className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3" aria-label="Phân trang bảng">
        <span className="text-sm text-gray-500">Trang {currentPage} / {totalPages}</span>
        <div className="flex items-center gap-1">
            <button type="button" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Trang trước"><ChevronLeft size={17} /></button>
            {pages.map((page, index) => <span key={page} className="contents">{index > 0 && page - pages[index - 1] > 1 && <span className="px-1 text-gray-400" aria-hidden="true">…</span>}<button type="button" onClick={() => onPageChange(page)} aria-current={page === currentPage ? "page" : undefined} className={`h-9 min-w-9 rounded-md px-2 text-sm font-medium ${page === currentPage ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{page}</button></span>)}
            <button type="button" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Trang sau"><ChevronRight size={17} /></button>
        </div>
    </nav>;
}
