import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { productApi, type ProductFilters } from "@/features/products/api/productApi";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { cartApi } from "@/features/cart/api/cartApi";
import { useCartStore } from "@/stores/cartStore";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Product } from "@/types/product";

const PAGE_SIZE = 12;
export function CategoryPage() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const setCart = useCartStore((state) => state.setCart);
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: productApi.categories });
  const category = categories.find((item) => item.slug === slug);
  const page = Math.max(1, Number(params.get("page")) || 1);
  const sort = params.get("sort") ?? "popular";
  const minPrice = params.get("minPrice") ?? "";
  const maxPrice = params.get("maxPrice") ?? "";
  const request: ProductFilters = { search: params.get("q") || undefined, categoryId: category?.id, page, limit: PAGE_SIZE, minPrice: minPrice ? Number(minPrice) : undefined, maxPrice: maxPrice ? Number(maxPrice) : undefined, ...(sort === "price-asc" ? { sortBy: "basePrice", sortOrder: "asc" } : sort === "price-desc" ? { sortBy: "basePrice", sortOrder: "desc" } : sort === "new" ? { sortBy: "createdAt", sortOrder: "desc" } : {}) };
  const products = useQuery({ queryKey: ["products", request], queryFn: () => productApi.list(request), placeholderData: keepPreviousData, enabled: !slug || categories.length > 0 });
  const update = (key: string, value: string) => { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); if (key !== "page") next.set("page", "1"); setParams(next); };
  const filterPanel = <><div className="flex items-center justify-between border-b border-black/10 pb-5"><h2 className="font-bold">Filters</h2><button className="lg:hidden" onClick={() => setFiltersOpen(false)} aria-label="Đóng bộ lọc"><X /></button><SlidersHorizontal size={18} className="hidden text-black/40 lg:block" /></div><div className="py-5"><h3 className="mb-3 text-sm font-semibold">Khoảng giá</h3><div className="flex gap-2"><Input value={minPrice} onChange={(event) => update("minPrice", event.target.value)} type="number" placeholder="Từ" /><Input value={maxPrice} onChange={(event) => update("maxPrice", event.target.value)} type="number" placeholder="Đến" /></div></div><div className="border-t border-black/10 py-5"><h3 className="mb-3 text-sm font-semibold">Danh mục</h3><div className="space-y-2">{categories.map((item) => <a key={item.id} href={`/shop/${item.slug}`} className={`block text-sm ${item.id === category?.id ? "font-semibold text-black" : "text-black/60"}`}>{item.name}</a>)}</div></div><Button className="w-full" onClick={() => setFiltersOpen(false)}>Áp dụng bộ lọc</Button></>;
  const add = async (product: Product) => { const variant = product.variants[0]; if (!variant) return; try { setCart(await cartApi.add(variant.id)); toast.success("Đã thêm vào giỏ hàng."); } catch { toast.error("Không thể thêm sản phẩm hoặc đã vượt tồn kho."); } };
  const title = params.get("q") ? `Kết quả cho “${params.get("q")}”` : category?.name ?? "Tất cả sản phẩm";
  return <><Breadcrumbs current={title} /><div className="mb-7 flex items-end justify-between gap-4"><div><h1 className="home-display text-3xl sm:text-4xl">{title}</h1><p className="mt-2 text-sm text-black/50">{products.data ? `Hiển thị ${products.data.items.length} trong ${products.data.total} sản phẩm` : "Đang tải sản phẩm..."}</p></div><label className="hidden items-center gap-2 text-sm sm:flex">Sắp xếp<select value={sort} onChange={(event) => update("sort", event.target.value)} className="min-h-11 rounded-full bg-black/5 px-4"><option value="popular">Phổ biến</option><option value="new">Mới nhất</option><option value="price-asc">Giá tăng dần</option><option value="price-desc">Giá giảm dần</option></select></label></div><div className="grid gap-8 lg:grid-cols-[250px_1fr]"><aside className="hidden h-fit rounded-2xl border border-black/10 p-5 lg:block">{filterPanel}</aside>{filtersOpen && <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setFiltersOpen(false)}><aside className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-auto rounded-t-3xl bg-white p-5" onClick={(event) => event.stopPropagation()}>{filterPanel}</aside></div>}<div><div className="mb-5 flex items-center justify-between sm:hidden"><Button variant="outline" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={17} className="mr-2" />Bộ lọc</Button><select value={sort} onChange={(event) => update("sort", event.target.value)} className="min-h-11 rounded-full bg-black/5 px-3 text-sm"><option value="popular">Phổ biến</option><option value="new">Mới nhất</option><option value="price-asc">Giá thấp</option><option value="price-desc">Giá cao</option></select></div>{products.isError ? <ErrorState message="Không thể tải sản phẩm." onRetry={() => void products.refetch()} /> : products.data?.items.length ? <ProductGrid products={products.data.items} onAdd={add} /> : products.isLoading ? <p className="py-20 text-center">Đang tải...</p> : <EmptyState title="Không tìm thấy sản phẩm" />} {products.data && products.data.totalPages > 1 && <nav className="mt-8 flex items-center justify-between border-t border-black/10 pt-5" aria-label="Phân trang"><Button variant="outline" disabled={page <= 1} onClick={() => update("page", String(page - 1))}><ChevronLeft size={17} className="mr-1" />Trước</Button><span className="text-sm text-black/60">Trang {page} / {products.data.totalPages}</span><Button variant="outline" disabled={page >= products.data.totalPages} onClick={() => update("page", String(page + 1))}>Sau<ChevronRight size={17} className="ml-1" /></Button></nav>}</div></div></>;
}
