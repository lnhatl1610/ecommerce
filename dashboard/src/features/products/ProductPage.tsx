import { useCallback, useEffect, useState } from "react";
import type * as React from "react";
import { Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { productService } from "./services/productService";
import { categoryService } from "./services/categoryService";
import type { Category, CreateProductVariant, Product, ProductStatus, ProductVariant, UpdateProductVariant } from "./types/product.types";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/Skeleton";
import { showToast } from "@/components/toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { DataTablePagination } from "@/components/DataTablePagination";
import { RowActionsMenu } from "@/components/RowActionsMenu";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type ProductForm = {
    name: string;
    description: string;
    categoryId: string;
    basePrice: string;
    thumbnail: string;
    status: ProductStatus;
};

const emptyForm: ProductForm = {
    name: "", description: "", categoryId: "", basePrice: "", thumbnail: "", status: "DRAFT",
};

const formatPrice = (price: number) => new Intl.NumberFormat("vi-VN", {
    style: "currency", currency: "VND", maximumFractionDigits: 0,
}).format(price);

export const ProductPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<ProductStatus | "">("");
    const [categoryId, setCategoryId] = useState("");
    const [pageSize, setPageSize] = useState(20);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [form, setForm] = useState<ProductForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [variantProduct, setVariantProduct] = useState<Product | null>(null);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadProducts = useCallback(async () => {
        setIsLoading(true); setError("");
        try {
            const response = await productService.getProducts({ search: search || undefined, status: status || "ALL", categoryId: categoryId || undefined, page, limit: pageSize });
            setProducts(response.data.data.items);
            setSelectedProductIds((current) => current.filter((id) => response.data.data.items.some((product) => product.id === id)));
            setTotalPages(response.data.data.totalPages);
        } catch {
            setError("Không thể tải danh sách sản phẩm.");
        } finally { setIsLoading(false); }
    }, [search, status, categoryId, page, pageSize]);

    useEffect(() => {
        void loadProducts();
    }, [loadProducts]);

    useEffect(() => {
        void categoryService.getCategories().then((response) => setCategories(response.data.data)).catch(() => undefined);
    }, []);

    const openCreate = () => { setEditingId(null); setIsFormOpen(true); setForm({ ...emptyForm, categoryId: categories[0]?.id ?? "" }); };
    const openEdit = (product: Product) => {
        setEditingId(product.id);
        setIsFormOpen(true);
        setForm({ name: product.name, description: product.description, categoryId: product.categoryId, basePrice: String(product.basePrice), thumbnail: product.thumbnail ?? "", status: product.status });
    };
    const closeForm = () => { setEditingId(null); setIsFormOpen(false); setForm(emptyForm); };

    const saveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); setError("");
        if (!form.name.trim()) { setError("Vui lòng nhập tên sản phẩm."); return; }
        if (!form.description.trim()) { setError("Vui lòng nhập mô tả sản phẩm."); return; }
        if (!form.categoryId) { setError("Vui lòng chọn danh mục sản phẩm."); return; }
        if (!Number.isFinite(Number(form.basePrice)) || Number(form.basePrice) <= 0) { setError("Giá sản phẩm phải lớn hơn 0."); return; }
        setIsSaving(true);
        const payload = { ...form, basePrice: Number(form.basePrice), thumbnail: form.thumbnail || undefined };
        try {
            if (editingId) await productService.updateProduct({ ...payload, id: editingId });
            else await productService.createProduct(payload);
            closeForm(); showToast(editingId ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm."); await loadProducts();
        } catch (error: unknown) {
            const response = (error as { response?: { data?: { message?: string; error?: string } } }).response;
            setError(response?.data?.message ?? response?.data?.error ?? (error instanceof Error ? error.message : "Không thể lưu sản phẩm."));
        }
        finally { setIsSaving(false); }
    };

    const uploadThumbnail = async (file: File) => {
        if (!(["image/png", "image/jpeg", "image/webp"] as string[]).includes(file.type)) { setError("Chỉ hỗ trợ ảnh PNG, JPG hoặc WebP."); return; }
        if (file.size > 5 * 1024 * 1024) { setError("Ảnh không được vượt quá 5MB."); return; }
        setIsUploading(true); setError("");
        try {
            const thumbnail = await productService.uploadThumbnail(file);
            setForm((current) => ({ ...current, thumbnail }));
        }
        catch (error: unknown) { setError(error instanceof Error ? error.message : "Không thể upload ảnh. Kiểm tra cấu hình Cloudinary."); }
        finally { setIsUploading(false); }
    };

    const removeProduct = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try { await productService.deleteProduct(deleteTarget.id); setDeleteTarget(null); showToast("Đã xóa sản phẩm."); await loadProducts(); }
        catch { setError("Không thể xóa sản phẩm."); }
        finally { setDeleting(false); }
    };

    const toggleProductSelection = (productId: string) => {
        setSelectedProductIds((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
    };

    const toggleAllProducts = () => {
        setSelectedProductIds((current) => current.length === products.length ? [] : products.map((product) => product.id));
    };

    const toggleProductStatus = async (product: Product) => {
        const nextStatus: ProductStatus = product.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
        setProducts((current) => current.map((item) => item.id === product.id ? { ...item, status: nextStatus } : item));
        try {
            await productService.updateProduct({ id: product.id, status: nextStatus });
            showToast(nextStatus === "ACTIVE" ? "Đã bật bán sản phẩm." : "Đã tắt bán sản phẩm.");
        } catch {
            setProducts((current) => current.map((item) => item.id === product.id ? { ...item, status: product.status } : item));
            setError("Không thể cập nhật trạng thái sản phẩm.");
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h1 className="text-xl font-bold text-gray-900">Products</h1><p className="text-sm text-gray-500">Quản lý danh mục sản phẩm</p></div>
                <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"><Plus size={16} /> Thêm sản phẩm</button>
            </div>

            <div className="flex flex-wrap gap-3 rounded-lg border bg-white p-3">
                <label className="relative min-w-56 flex-1"><Search className="absolute left-3 top-2.5 text-gray-400" size={16} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Tìm theo tên sản phẩm..." className="w-full rounded-md border py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-gray-300" /></label>
                <select value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setPage(1); }} className="filter-control"><option value="">Tất cả danh mục</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
                <select value={status} onChange={(event) => { setStatus(event.target.value as ProductStatus | ""); setPage(1); }} className="filter-control"><option value="">Tất cả trạng thái</option><option value="ACTIVE">Đang bán</option><option value="DRAFT">Nháp</option><option value="ARCHIVED">Đã lưu trữ</option></select>
                <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="filter-control" aria-label="Số dòng mỗi trang"><option value={10}>10 dòng</option><option value={20}>20 dòng</option><option value={50}>50 dòng</option></select>
                <button aria-label="Làm mới" onClick={() => void loadProducts()} className="reset-control"><RefreshCw size={17} /></button>
            </div>
            {error && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
            <div className="overflow-x-auto rounded-lg border bg-white">
                {isLoading ? <div className="space-y-3 p-6"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div> : <><Table className="min-w-[980px]"><TableHeader><TableRow><TableHead className="w-12"><Checkbox aria-label="Chọn tất cả sản phẩm" checked={products.length > 0 && selectedProductIds.length === products.length} indeterminate={selectedProductIds.length > 0 && selectedProductIds.length < products.length} onChange={toggleAllProducts} /></TableHead><TableHead className="w-[280px]">Sản phẩm</TableHead><TableHead>Danh mục</TableHead><TableHead>Giá</TableHead><TableHead>Tồn kho</TableHead><TableHead>Trạng thái</TableHead><TableHead className="text-right">Tùy chọn</TableHead></TableRow></TableHeader><TableBody>
                    {products.map((product) => <TableRow key={product.id} data-state={selectedProductIds.includes(product.id) ? "selected" : undefined}><TableCell><Checkbox aria-label={`Chọn ${product.name}`} checked={selectedProductIds.includes(product.id)} onChange={() => toggleProductSelection(product.id)} /></TableCell><TableCell className="w-[280px]"><div className="flex min-w-0 items-center gap-3">{product.thumbnail ? <img src={product.thumbnail} alt={`${product.name} thumbnail`} className="h-10 w-10 shrink-0 rounded-full object-cover" /> : <div className="h-10 w-10 shrink-0 rounded-full bg-gray-100" />}<div className="min-w-0"><div className="truncate font-medium" title={product.name}>{product.name}</div><div className="truncate text-xs text-gray-400" title={product.slug}>{product.slug}</div></div></div></TableCell><TableCell>{product.category?.name ?? categories.find((category) => category.id === product.categoryId)?.name ?? "—"}</TableCell><TableCell>{formatPrice(product.basePrice)}</TableCell><TableCell><div className="text-sm font-medium">{(product.variants ?? []).reduce((sum, variant) => sum + variant.stockQuantity, 0)} sản phẩm</div><div className="text-xs text-gray-500">{product.variants?.length ?? 0} biến thể</div></TableCell><TableCell><div className={product.status === "ACTIVE" ? "font-medium text-emerald-700" : "font-medium text-gray-500"}>{product.status === "ACTIVE" ? "Đang bán" : product.status === "DRAFT" ? "Nháp" : "Đã lưu trữ"}</div><Switch checked={product.status === "ACTIVE"} onChange={() => void toggleProductStatus(product)} aria-label={`${product.status === "ACTIVE" ? "Tắt bán" : "Bật bán"} ${product.name}`} /></TableCell><TableCell className="text-right"><RowActionsMenu label={product.name} actions={[{ label: "Quản lý biến thể", onSelect: () => setVariantProduct(product) }, { label: "Sửa", onSelect: () => openEdit(product) }, { label: "Xóa", tone: "danger", onSelect: () => setDeleteTarget(product) }]} /></TableCell></TableRow>)}
                    {!products.length && <TableRow><TableCell colSpan={7}><EmptyState title="Chưa có sản phẩm" description="Thử thay đổi bộ lọc hoặc thêm sản phẩm đầu tiên." action={<button type="button" onClick={openCreate} className="mt-2 text-sm text-blue-600 hover:underline">Thêm sản phẩm</button>} /></TableCell></TableRow>}
                </TableBody></Table><DataTablePagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></>}
            </div>

            {isFormOpen && <ProductForm categories={categories} form={form} setForm={setForm} isEditing={editingId !== null} isSaving={isSaving} isUploading={isUploading} onUpload={uploadThumbnail} onSubmit={saveProduct} onClose={closeForm} />}
            {variantProduct && <VariantDialog product={variantProduct} onClose={() => setVariantProduct(null)} onChanged={() => void loadProducts()} />}
            <ConfirmDialog open={Boolean(deleteTarget)} title="Xóa sản phẩm?" description={deleteTarget ? `Sản phẩm “${deleteTarget.name}” sẽ bị xóa khỏi danh sách.` : ""} loading={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={() => void removeProduct()} />
        </div>
    );
};

function ProductForm({ categories, form, setForm, isEditing, isSaving, isUploading, onUpload, onSubmit, onClose }: { categories: Category[]; form: ProductForm; setForm: React.Dispatch<React.SetStateAction<ProductForm>>; isEditing: boolean; isSaving: boolean; isUploading: boolean; onUpload: (file: File) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; onClose: () => void }) {
    const update = (key: keyof ProductForm, value: string) => setForm((current) => ({ ...current, [key]: value }));
    return <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 p-4"><form onSubmit={onSubmit} className="w-full max-w-lg space-y-4 rounded-lg bg-white p-5 shadow-xl"><div className="flex items-center justify-between"><h2 className="font-semibold">{isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h2><button type="button" onClick={onClose} aria-label="Đóng"><X size={18} /></button></div><label className="block text-sm font-medium">Tên sản phẩm<input required value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Ví dụ: Áo sơ mi nam" className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-normal" /></label><label className="block text-sm font-medium">Mô tả<textarea required value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Mô tả sản phẩm" rows={3} className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-normal" /></label><div className="grid grid-cols-2 gap-3"><label className="text-sm font-medium">Giá cơ bản<input required min="0.01" type="number" value={form.basePrice} onChange={(event) => update("basePrice", event.target.value)} placeholder="0" className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-normal" /></label><label className="text-sm font-medium">Danh mục<select required value={form.categoryId} onChange={(event) => update("categoryId", event.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-normal"><option value="">— Chọn danh mục —</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><div className="col-span-2 space-y-2"><label className="block text-sm font-medium">Ảnh thumbnail</label><div className="flex gap-2"><input type="url" value={form.thumbnail} onChange={(event) => update("thumbnail", event.target.value)} placeholder="URL ảnh hoặc upload bên cạnh" className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm font-normal" /><label className="cursor-pointer rounded-md border px-3 py-2 text-sm hover:bg-gray-50">{isUploading ? "Đang upload..." : "Upload"}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={isUploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void onUpload(file); }} className="hidden" /></label></div>{form.thumbnail && <img src={form.thumbnail} alt="Thumbnail preview" className="h-20 w-20 rounded-md object-cover" />}</div><label className="text-sm font-medium">Trạng thái<select value={form.status} onChange={(event) => update("status", event.target.value)} className="mt-1 w-full rounded-md border px-3 py-2 text-sm font-normal"><option value="DRAFT">Nháp</option><option value="ACTIVE">Đang bán</option><option value="ARCHIVED">Đã lưu trữ</option></select></label></div><div className="flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-md border px-3 py-2 text-sm">Hủy</button><button disabled={isSaving || isUploading || !categories.length} className="rounded-md bg-gray-900 px-3 py-2 text-sm text-white disabled:opacity-50">{isSaving ? "Đang lưu..." : !categories.length ? "Chưa có danh mục" : "Lưu"}</button></div></form></div>;
}

function VariantDialog({ product, onClose, onChanged }: { product: Product; onClose: () => void; onChanged: () => void }) {
    const [variants, setVariants] = useState<ProductVariant[]>(product.variants ?? []);
    const [form, setForm] = useState({ sku: "", price: "", stockQuantity: "", attributes: "" });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const reset = () => { setEditingId(null); setForm({ sku: "", price: "", stockQuantity: "", attributes: "" }); };
    const edit = (variant: ProductVariant) => { setEditingId(variant.id); setForm({ sku: variant.sku, price: String(variant.price), stockQuantity: String(variant.stockQuantity), attributes: JSON.stringify(variant.attributes) }); };
    const save = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); setSaving(true); setError("");
        try {
            const attributes = form.attributes.trim() ? JSON.parse(form.attributes) as Record<string, string | number | boolean | null> : {};
            const payload = { sku: form.sku, price: Number(form.price), stockQuantity: Number(form.stockQuantity), attributes };
            const response = editingId ? await productService.updateVariant(product.id, { ...payload, id: editingId } as UpdateProductVariant) : await productService.createVariant(product.id, payload as CreateProductVariant);
            if (editingId) setVariants((current) => current.map((item) => item.id === editingId ? response.data.data : item)); else setVariants((current) => [...current, response.data.data]);
            reset(); onChanged();
        } catch { setError("Không thể lưu variant. Kiểm tra SKU, giá, tồn kho và JSON attributes."); } finally { setSaving(false); }
    };
    const remove = async (variant: ProductVariant) => { if (!window.confirm(`Xóa variant ${variant.sku}?`)) return; try { await productService.deleteVariant(product.id, variant.id); setVariants((current) => current.filter((item) => item.id !== variant.id)); onChanged(); } catch { setError("Không thể xóa variant."); } };
    return <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4"><div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-5 shadow-xl"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold">Variants · {product.name}</h2><p className="text-sm text-gray-500">Quản lý SKU, giá và tồn kho</p></div><button onClick={onClose} aria-label="Đóng" className="rounded p-2 hover:bg-gray-100"><X size={18} /></button></div>{error && <p className="mb-3 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mb-5 overflow-hidden rounded border"><Table><TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Giá</TableHead><TableHead>Tồn kho</TableHead><TableHead>Attributes</TableHead><TableHead /></TableRow></TableHeader><TableBody>{variants.map((variant) => <TableRow key={variant.id}><TableCell className="font-mono text-xs">{variant.sku}</TableCell><TableCell>{formatPrice(variant.price)}</TableCell><TableCell><span className={variant.stockQuantity === 0 ? "font-semibold text-red-600" : variant.stockQuantity < 5 ? "font-semibold text-amber-600" : ""}>{variant.stockQuantity}</span></TableCell><TableCell className="max-w-48 truncate text-xs text-gray-500">{JSON.stringify(variant.attributes)}</TableCell><TableCell className="text-right"><button onClick={() => edit(variant)} className="mr-2 rounded p-1.5 text-gray-600 hover:bg-gray-100" aria-label={`Sửa ${variant.sku}`}><Pencil size={16} /></button><button onClick={() => void remove(variant)} className="rounded p-1.5 text-red-600 hover:bg-red-50" aria-label={`Xóa ${variant.sku}`}><Trash2 size={16} /></button></TableCell></TableRow>)}{!variants.length && <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-gray-500">Chưa có variant.</TableCell></TableRow>}</TableBody></Table></div><form onSubmit={(event) => void save(event)} className="grid gap-3 rounded border bg-gray-50 p-4 sm:grid-cols-2"><h3 className="sm:col-span-2 font-medium">{editingId ? "Sửa variant" : "Thêm variant"}</h3><label className="text-sm">SKU<input required value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} className="mt-1 w-full rounded border bg-white px-3 py-2" /></label><label className="text-sm">Giá<input required min="0.01" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="mt-1 w-full rounded border bg-white px-3 py-2" /></label><label className="text-sm">Tồn kho<input required min="0" type="number" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })} className="mt-1 w-full rounded border bg-white px-3 py-2" /></label><label className="text-sm">Attributes JSON<input value={form.attributes} onChange={(event) => setForm({ ...form, attributes: event.target.value })} placeholder='{"color":"Red","size":"M"}' className="mt-1 w-full rounded border bg-white px-3 py-2" /></label><div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={reset} className="rounded border px-3 py-2 text-sm">Làm mới</button><button disabled={saving} className="rounded bg-gray-900 px-3 py-2 text-sm text-white disabled:opacity-50">{saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm variant"}</button></div></form></div></div>;
}

export default ProductPage;
