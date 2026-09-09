import { useEffect, useMemo, useState } from "react";
import { Check, Clock3, GitCompareArrows, Heart, Minus, PackageCheck, Plus, RotateCcw, Share2, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast as notify } from "sonner";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ErrorState } from "@/components/feedback/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { accountApi } from "@/features/account/api/accountApi";
import { cartApi } from "@/features/cart/api/cartApi";
import { ProductGallery } from "@/features/products/components/ProductGallery";
import { catalogExperienceApi, type ShippingQuote } from "@/features/products/api/catalogExperienceApi";
import { productApi } from "@/features/products/api/productApi";
import { ProductReviews } from "@/features/reviews/components/ProductReviews";
import { reviewApi } from "@/features/reviews/api/reviewApi";
import { getApiErrorMessage } from "@/lib/apiError";
import { formatMoney } from "@/lib/formatters";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import type { Product, Variant } from "@/types/product";

type ProductTab = "details" | "reviews" | "shipping" | "faq";
const RECENT_PRODUCTS_KEY = "shopco_recent_products";

const readStoredStringList = (key: string): string[] => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown;
    return Array.isArray(stored) ? stored.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
};

const colorValues: Record<string, string> = {
  black: "#111111", white: "#f8f8f8", red: "#dc2626", blue: "#2563eb", green: "#166534", navy: "#172554",
  gray: "#737373", grey: "#737373", brown: "#6b4f3b", beige: "#d6c5a3", yellow: "#eab308", orange: "#ea580c", pink: "#db2777", purple: "#7e22ce",
};

const variantAttributes = (variant: Variant): Record<string, string> => Object.fromEntries(
  Object.entries(variant.attributes).filter((entry): entry is [string, string | number | boolean] => entry[1] !== null).map(([key, value]) => [key, String(value)]),
);

function ProductLoading() {
  return <div className="space-y-8" aria-label="Đang tải sản phẩm"><Skeleton className="h-5 w-72" /><div className="grid gap-8 lg:grid-cols-2"><Skeleton className="aspect-square rounded-2xl" /><div className="space-y-5"><Skeleton className="h-10 w-4/5" /><Skeleton className="h-7 w-2/5" /><Skeleton className="h-24" /><Skeleton className="h-12" /><Skeleton className="h-12" /></div></div></div>;
}

function FlashSaleCountdown({ endsAt }: { endsAt: string }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, new Date(endsAt).getTime() - Date.now()));
  useEffect(() => { const timer = window.setInterval(() => setRemaining(Math.max(0, new Date(endsAt).getTime() - Date.now())), 1000); return () => window.clearInterval(timer); }, [endsAt]);
  if (!remaining) return null;
  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  return <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"><Clock3 size={17} aria-hidden="true" /><strong>Flash sale kết thúc sau</strong><span className="ml-auto tabular-nums">{String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span></div>;
}

function AssuranceStrip() {
  const assurances = [
    { icon: PackageCheck, title: "Chính hãng", text: "Nguồn gốc rõ ràng" }, { icon: RotateCcw, title: "Đổi trả 30 ngày", text: "Miễn phí đổi size" },
    { icon: ShieldCheck, title: "Thanh toán an toàn", text: "Bảo mật thông tin" }, { icon: Truck, title: "Giao hàng nhanh", text: "Dự kiến 3–5 ngày" },
  ];
  return <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Cam kết mua hàng">{assurances.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3 rounded-2xl bg-[#f4f4f4] p-4"><Icon className="mt-0.5 shrink-0" size={21} aria-hidden="true" /><span><strong className="block text-sm">{title}</strong><span className="mt-1 block text-xs leading-5 text-black/50">{text}</span></span></div>)}</section>;
}

export function ProductDetailPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const setCart = useCartStore((state) => state.setCart);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<ProductTab>("details");
  const [variantError, setVariantError] = useState("");
  const [adding, setAdding] = useState(false);
  const [shippingArea, setShippingArea] = useState("");
  const [shippingQuote, setShippingQuote] = useState<ShippingQuote | null>(null);
  const [questionContent, setQuestionContent] = useState("");
  const [wishlistSaved, setWishlistSaved] = useState(false);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  const productQuery = useQuery({ queryKey: ["product", slug], queryFn: () => productApi.getBySlug(slug), enabled: Boolean(slug) });
  const productListQuery = useQuery({ queryKey: ["products", "recommendations"], queryFn: () => productApi.list({ limit: 40 }) });
  const product = productQuery.data;
  const experienceQuery = useQuery({ queryKey: ["product-experience", product?.id], queryFn: () => catalogExperienceApi.product(product?.id ?? ""), enabled: Boolean(product?.id) });
  const questionsQuery = useQuery({ queryKey: ["product-questions", product?.id], queryFn: () => catalogExperienceApi.questions(product?.id ?? ""), enabled: Boolean(product?.id) });
  const reviewQuery = useQuery({ queryKey: ["reviews", product?.id], queryFn: () => reviewApi.list(product?.id ?? ""), enabled: Boolean(product?.id) });

  useEffect(() => {
    if (!product) return;
    const initialVariant = product.variants.find((variant) => variant.stockQuantity > 0) ?? product.variants[0];
    setSelectedAttributes(initialVariant ? variantAttributes(initialVariant) : {});
    setQuantity(1);
    setVariantError("");
    const current = readStoredStringList(RECENT_PRODUCTS_KEY);
    setRecentSlugs(current.filter((item) => item !== product.slug));
    window.localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify([product.slug, ...current.filter((item) => item !== product.slug)].slice(0, 8)));
    const sessionId = window.sessionStorage.getItem("shopco_session_id") ?? crypto.randomUUID();
    window.sessionStorage.setItem("shopco_session_id", sessionId);
    void catalogExperienceApi.recordView(product.id, sessionId).catch(() => undefined);
  }, [product]);

  const attributeGroups = useMemo(() => {
    if (!product) return [];
    const groups = new Map<string, string[]>();
    product.variants.forEach((variant) => Object.entries(variantAttributes(variant)).forEach(([key, value]) => groups.set(key, [...new Set([...(groups.get(key) ?? []), value])])));
    return [...groups.entries()];
  }, [product]);
  const selectedVariant = useMemo(() => product?.variants.find((variant) => { const attributes = variantAttributes(variant); return attributeGroups.every(([key]) => attributes[key] === selectedAttributes[key]); }), [attributeGroups, product, selectedAttributes]);
  const price = selectedVariant?.price ?? product?.basePrice ?? 0;
  const compareAtPrice = product?.compareAtPrice;
  const discountPercent = compareAtPrice && compareAtPrice > price ? Math.round((1 - price / compareAtPrice) * 100) : 0;
  const totalStock = product?.variants.reduce((sum, variant) => sum + variant.stockQuantity, 0) ?? 0;
  const reviews = reviewQuery.data ?? [];
  const experience = experienceQuery.data;
  const activePromotion = experience?.promotions[0];
  const mediaImages = experience?.media.filter((media) => media.type === "IMAGE").map((media) => media.url);
  const mediaVideos = experience?.media.filter((media) => media.type === "VIDEO").map((media) => media.url);
  const variantImage = experience?.media.find((media) => media.type === "IMAGE" && media.variantId === selectedVariant?.id)?.url;
  const calculatedRating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : product?.rating ?? 0;
  const allProducts = productListQuery.data?.items ?? [];
  const related = allProducts.filter((item) => item.id !== product?.id && item.category?.id === product?.category?.id).slice(0, 4);
  const bundleProducts = experience?.bundles.flatMap((bundle) => bundle.items.map((item) => item.componentProduct)) ?? [];
  const frequentlyBought = (bundleProducts.length ? bundleProducts : allProducts.filter((item) => item.id !== product?.id && !related.some((relatedItem) => relatedItem.id === item.id))).slice(0, 4);
  const recentlyViewed = allProducts.filter((item) => recentSlugs.includes(item.slug)).sort((a, b) => recentSlugs.indexOf(a.slug) - recentSlugs.indexOf(b.slug)).slice(0, 4);

  if (productQuery.isLoading) return <ProductLoading />;
  if (!product || productQuery.isError) return <ErrorState message={getApiErrorMessage(productQuery.error, "Không thể tải thông tin sản phẩm.")} onRetry={() => void productQuery.refetch()} />;

  const selectOption = (key: string, value: string) => {
    const preferred = product.variants.find((candidate) => { const attributes = variantAttributes(candidate); return candidate.stockQuantity > 0 && attributes[key] === value && attributeGroups.every(([otherKey]) => otherKey === key || !selectedAttributes[otherKey] || attributes[otherKey] === selectedAttributes[otherKey]); })
      ?? product.variants.find((candidate) => candidate.stockQuantity > 0 && variantAttributes(candidate)[key] === value);
    setSelectedAttributes(preferred ? variantAttributes(preferred) : { ...selectedAttributes, [key]: value });
    setQuantity(1); setVariantError("");
  };
  const addToCart = async (checkoutAfter = false) => {
    if (!selectedVariant) { setVariantError("Vui lòng chọn đầy đủ phiên bản sản phẩm."); return; }
    if (selectedVariant.stockQuantity < quantity) { setVariantError(`Phiên bản này chỉ còn ${selectedVariant.stockQuantity} sản phẩm.`); return; }
    setAdding(true);
    try { const cart = await cartApi.add(selectedVariant.id, quantity); setCart(cart); notify.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng.`); if (checkoutAfter) navigate("/checkout"); }
    catch (error: unknown) { notify.error(getApiErrorMessage(error, "Không thể thêm sản phẩm vào giỏ hàng.")); }
    finally { setAdding(false); }
  };
  const addSuggestedProduct = (item: Product) => { const availableVariant = item.variants.find((variant) => variant.stockQuantity > 0); if (!availableVariant) return; void cartApi.add(availableVariant.id).then(setCart).then(() => notify.success("Đã thêm vào giỏ hàng.")).catch((error: unknown) => notify.error(getApiErrorMessage(error, "Không thể thêm sản phẩm."))); };
  const shareProduct = async () => { const shareData = { title: product.name, text: product.shortDescription ?? product.description, url: window.location.href }; try { if (navigator.share) await navigator.share(shareData); else { await navigator.clipboard.writeText(window.location.href); notify.success("Đã sao chép liên kết sản phẩm."); } } catch (error: unknown) { if (error instanceof DOMException && error.name === "AbortError") return; notify.error("Không thể chia sẻ sản phẩm."); } };
  const toggleCompare = () => { const products = readStoredStringList("shopco_compare_products"); const next = products.includes(product.id) ? products.filter((id) => id !== product.id) : [...products, product.id].slice(-4); window.localStorage.setItem("shopco_compare_products", JSON.stringify(next)); notify.success(next.includes(product.id) ? "Đã thêm vào danh sách so sánh." : "Đã bỏ khỏi danh sách so sánh."); };

  const tabLabels: Array<[ProductTab, string]> = [["details", "Chi tiết sản phẩm"], ["reviews", `Đánh giá (${product.reviewCount ?? reviews.length})`], ["shipping", "Vận chuyển & đổi trả"], ["faq", "Hỏi đáp"]];
  const specifications = product.specifications ?? { "Mã sản phẩm": selectedVariant?.sku ?? "Đang cập nhật", "Danh mục": product.category?.name ?? "Đang cập nhật", "Chất liệu": "Đang cập nhật", "Xuất xứ": "Đang cập nhật" };

  return <>
    <Helmet><title>{product.name} — SHOP.CO</title><meta name="description" content={(product.shortDescription ?? product.description).slice(0, 155)} /><meta property="og:title" content={product.name} /><meta property="og:description" content={(product.shortDescription ?? product.description).slice(0, 155)} />{product.thumbnail && <meta property="og:image" content={product.thumbnail} />}<meta property="og:type" content="product" /></Helmet>
    <Breadcrumbs current={product.name} />
    <section className="grid gap-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-10">
      <ProductGallery name={product.name} thumbnail={product.thumbnail} images={mediaImages?.length ? mediaImages : product.images} videoUrls={mediaVideos?.length ? mediaVideos : product.videoUrls} variantImage={variantImage ?? selectedVariant?.image} discountPercent={discountPercent} outOfStock={!totalStock} />
      <div>
        <div className="flex items-start justify-between gap-4"><div className="min-w-0">{(experience?.brand?.name ?? product.brand) && <Link to={`/search?q=${encodeURIComponent(experience?.brand?.name ?? product.brand ?? "")}`} className="text-sm font-semibold text-black/55 hover:underline">{experience?.brand?.name ?? product.brand}</Link>}<h1 className="mt-1 text-3xl font-black uppercase leading-[1.05] tracking-[-0.035em] sm:text-4xl">{product.name}</h1><p className="mt-2 text-xs text-black/45">SKU: {selectedVariant?.sku ?? "—"}</p></div><div className="flex shrink-0 gap-1"><button type="button" aria-label={wishlistSaved ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"} aria-pressed={wishlistSaved} onClick={() => { if (wishlistSaved) { void accountApi.removeWishlist(product.id).then(() => setWishlistSaved(false)).then(() => notify.success("Đã bỏ khỏi wishlist.")).catch(() => notify.error("Không thể cập nhật wishlist.")); } else { void accountApi.addWishlist(product.id).then(() => setWishlistSaved(true)).then(() => notify.success("Đã thêm vào wishlist.")).catch(() => notify.error("Vui lòng đăng nhập để lưu sản phẩm.")); } }} className={`flex size-11 items-center justify-center rounded-full border transition ${wishlistSaved ? "border-black bg-black text-white" : "border-black/10 hover:bg-black/5"}`}><Heart size={19} className={wishlistSaved ? "fill-current" : ""} aria-hidden="true" /></button><button type="button" aria-label="Chia sẻ sản phẩm" onClick={() => void shareProduct()} className="flex size-11 items-center justify-center rounded-full border border-black/10 transition hover:bg-black/5"><Share2 size={19} aria-hidden="true" /></button></div></div>
        <a href="#product-reviews" onClick={() => setActiveTab("reviews")} className="mt-4 flex w-fit flex-wrap items-center gap-2 text-sm"><span className="text-amber-400" aria-hidden="true">★★★★★</span><strong>{calculatedRating.toFixed(1)}/5</strong><span className="text-black/45">({product.reviewCount ?? reviews.length} đánh giá)</span>{(experience?.soldCount ?? product.soldCount) !== undefined && <span className="border-l border-black/15 pl-2">Đã bán {new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(experience?.soldCount ?? product.soldCount ?? 0)}</span>}</a>
        <div className="mt-4 flex flex-wrap items-center gap-3"><p className="text-3xl font-bold tabular-nums">{formatMoney(price)}</p>{compareAtPrice && compareAtPrice > price ? <><del className="text-xl text-black/30 tabular-nums">{formatMoney(compareAtPrice)}</del><span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">-{discountPercent}%</span></> : null}</div>
        {(activePromotion?.endsAt ?? product.saleEndsAt) && <FlashSaleCountdown endsAt={activePromotion?.endsAt ?? product.saleEndsAt ?? ""} />}
        {activePromotion && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{activePromotion.name}: giảm {activePromotion.discountType === "PERCENTAGE" ? `${activePromotion.discountValue}%` : formatMoney(activePromotion.discountValue)} khi đủ điều kiện.</p>}
        <p className="mt-5 border-b border-black/10 pb-5 text-sm leading-6 text-black/60">{product.shortDescription ?? product.description}</p>
        <div className="my-5 rounded-xl border border-dashed border-black/20 bg-amber-50 p-4 text-sm"><strong>Ưu đãi dành cho bạn</strong><p className="mt-1 text-black/60">Nhập mã <button type="button" onClick={() => { void navigator.clipboard.writeText("WELCOME20"); notify.success("Đã sao chép mã WELCOME20."); }} className="font-semibold underline">WELCOME20</button> để nhận ưu đãi cho đơn hàng đầu tiên.</p></div>
        {attributeGroups.map(([key, options]) => <fieldset key={key} className="border-b border-black/10 py-5"><legend className="mb-3 text-sm capitalize text-black/60">Chọn {key}</legend><div className="flex flex-wrap gap-2">{options.map((option) => { const matchingVariants = product.variants.filter((variant) => variantAttributes(variant)[key] === option); const available = matchingVariants.some((variant) => variant.stockQuantity > 0); const selected = selectedAttributes[key] === option; const isColor = key.toLowerCase().includes("color") || key.toLowerCase().includes("màu"); return isColor ? <button type="button" key={option} disabled={!available} onClick={() => selectOption(key, option)} className={`relative size-11 rounded-full border-2 transition disabled:cursor-not-allowed disabled:opacity-30 ${selected ? "border-black ring-2 ring-white ring-offset-2" : "border-white"}`} style={{ backgroundColor: colorValues[option.toLowerCase()] ?? option }} aria-label={`${key}: ${option}${!available ? ", hết hàng" : ""}`} aria-pressed={selected}>{selected && <Check className="absolute inset-0 m-auto text-white drop-shadow" size={17} aria-hidden="true" />}</button> : <button type="button" key={option} disabled={!available} onClick={() => selectOption(key, option)} className={`min-h-11 rounded-full px-5 text-sm transition disabled:cursor-not-allowed disabled:text-black/25 disabled:line-through ${selected ? "bg-black text-white" : "bg-[#f0f0f0] text-black/60 hover:bg-black/10"}`} aria-pressed={selected}>{option}</button>; })}</div></fieldset>)}
        <div className="mt-5 flex items-center justify-between gap-3"><div><p className={`text-sm font-semibold ${selectedVariant?.stockQuantity && selectedVariant.stockQuantity <= 5 ? "text-orange-700" : selectedVariant?.stockQuantity ? "text-emerald-700" : "text-red-600"}`}>{selectedVariant?.stockQuantity ? selectedVariant.stockQuantity <= 5 ? `Chỉ còn ${selectedVariant.stockQuantity} sản phẩm` : "Còn hàng" : "Hết hàng"}</p><p className="mt-1 text-xs text-black/45"><Truck className="mr-1 inline" size={14} aria-hidden="true" />Nhận hàng dự kiến trong 3–5 ngày</p></div><button type="button" onClick={toggleCompare} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm hover:bg-black/5"><GitCompareArrows size={17} aria-hidden="true" />So sánh</button></div>
        {variantError && <p className="mt-3 text-sm font-medium text-red-600" role="alert">{variantError}</p>}
        <div className="mt-5 flex gap-3"><div className="flex h-12 w-[124px] shrink-0 items-center justify-between rounded-full bg-[#f0f0f0] px-2"><button type="button" aria-label="Giảm số lượng" className="flex size-10 items-center justify-center" onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={16} aria-hidden="true" /></button><span className="tabular-nums">{quantity}</span><button type="button" aria-label="Tăng số lượng" className="flex size-10 items-center justify-center" onClick={() => setQuantity((value) => Math.min(selectedVariant?.stockQuantity ?? 1, value + 1))}><Plus size={16} aria-hidden="true" /></button></div><button type="button" disabled={!selectedVariant?.stockQuantity || adding} onClick={() => void addToCart()} className="h-12 flex-1 rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-stone-300">{adding ? "Đang thêm..." : selectedVariant?.stockQuantity ? "Thêm vào giỏ hàng" : "Hết hàng"}</button></div>
        <button type="button" disabled={!selectedVariant?.stockQuantity || adding} onClick={() => void addToCart(true)} className="mt-3 h-12 w-full rounded-full border border-black text-sm font-semibold transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40">Mua ngay</button>
      </div>
    </section>
    <AssuranceStrip />
    <section id="product-reviews" className="mt-14 scroll-mt-24"><div className="grid grid-cols-2 border-b border-black/10 text-center text-sm text-black/50 sm:grid-cols-4">{tabLabels.map(([key, label]) => <button type="button" key={key} onClick={() => setActiveTab(key)} className={`min-h-12 border-b-2 px-2 transition ${activeTab === key ? "border-black font-semibold text-black" : "border-transparent hover:text-black"}`}>{label}</button>)}</div>
      {activeTab === "details" && <div className="grid gap-8 py-8 lg:grid-cols-[1fr_420px]"><div><h2 className="text-xl font-bold">Mô tả sản phẩm</h2><div className="mt-4 whitespace-pre-line text-sm leading-7 text-black/65">{product.description}</div>{product.careInstructions && <><h2 className="mt-8 text-xl font-bold">Hướng dẫn sử dụng &amp; bảo quản</h2><p className="mt-4 text-sm leading-7 text-black/65">{product.careInstructions}</p></>}</div><div><h2 className="text-xl font-bold">Thông số kỹ thuật</h2><dl className="mt-4 overflow-hidden rounded-2xl border border-black/10">{Object.entries(specifications).map(([key, value], index) => <div key={key} className={`grid grid-cols-2 gap-4 px-4 py-3 text-sm ${index % 2 === 0 ? "bg-black/[0.035]" : ""}`}><dt className="text-black/50">{key}</dt><dd className="font-medium">{value}</dd></div>)}</dl></div></div>}
      {activeTab === "reviews" && <ProductReviews productId={product.id} reviews={reviews} rating={calculatedRating} reviewCount={product.reviewCount ?? reviews.length} authenticated={authenticated} onSubmitted={() => { void reviewQuery.refetch(); notify.success("Đã gửi đánh giá."); }} />}
      {activeTab === "shipping" && <div className="grid gap-6 py-8 md:grid-cols-2"><div className="rounded-2xl border border-black/10 p-5"><h2 className="font-bold">Kiểm tra giao hàng</h2><p className="mt-2 text-sm leading-6 text-black/55">Nhập mã tỉnh/thành phố để xem phí và thời gian giao hàng.</p><form className="mt-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); void catalogExperienceApi.shippingQuote(shippingArea.trim(), price * quantity).then(setShippingQuote).catch(() => notify.error("Không thể kiểm tra vận chuyển.")); }}><label className="flex-1"><span className="sr-only">Mã tỉnh/thành phố</span><input value={shippingArea} onChange={(event) => { setShippingArea(event.target.value); setShippingQuote(null); }} className="min-h-11 w-full rounded-full border border-black/15 px-4 text-sm outline-none focus:ring-2 focus:ring-black" placeholder="Ví dụ: 01" required /></label><button className="min-h-11 rounded-full bg-black px-5 text-sm text-white">Kiểm tra</button></form>{shippingQuote && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{shippingQuote.available ? shippingQuote.rates.map((rate) => <p key={rate.id}>{rate.name}: {formatMoney(rate.fee)}, {rate.minDays}–{rate.maxDays} ngày</p>) : "Khu vực này chưa được hỗ trợ."}</div>}</div><div className="rounded-2xl border border-black/10 p-5"><h2 className="font-bold">Chính sách đổi trả</h2><p className="mt-2 text-sm leading-6 text-black/55">Đổi trả trong 30 ngày kể từ khi nhận hàng. Sản phẩm cần còn nguyên tem, chưa qua sử dụng và có chứng từ mua hàng.</p><Link to="/account/orders" className="mt-4 inline-block text-sm font-semibold underline">Yêu cầu đổi trả từ đơn hàng</Link></div></div>}
      {activeTab === "faq" && <div className="py-8"><h2 className="text-xl font-bold">Hỏi đáp về sản phẩm</h2>{authenticated && <form className="mt-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); void catalogExperienceApi.createQuestion(product.id, questionContent).then(() => { setQuestionContent(""); void questionsQuery.refetch(); notify.success("Đã gửi câu hỏi."); }).catch(() => notify.error("Không thể gửi câu hỏi.")); }}><label className="flex-1"><span className="sr-only">Câu hỏi của bạn</span><input value={questionContent} onChange={(event) => setQuestionContent(event.target.value)} minLength={5} required className="min-h-11 w-full rounded-full border border-black/15 px-4 text-sm outline-none focus:ring-2 focus:ring-black" placeholder="Nhập câu hỏi về sản phẩm" /></label><button className="min-h-11 rounded-full bg-black px-5 text-sm text-white">Gửi</button></form>}<div className="mt-5 space-y-3">{questionsQuery.data?.length ? questionsQuery.data.map((question) => <article key={question.id} className="rounded-2xl border border-black/10 p-5"><p className="font-semibold">{question.user.name}: {question.content}</p>{question.answers.map((answer) => <div key={answer.id} className="mt-3 rounded-xl bg-black/[0.04] p-4 text-sm"><strong>{answer.isOfficial ? "SHOP.CO" : answer.user.name}</strong><p className="mt-1 text-black/60">{answer.content}</p></div>)}</article>) : <p className="rounded-2xl border border-dashed border-black/15 py-10 text-center text-sm text-black/50">Chưa có câu hỏi nào cho sản phẩm này.</p>}</div></div>}
    </section>
    {related.length > 0 && <section className="mt-20"><h2 className="text-center text-3xl font-black uppercase tracking-[-0.035em] sm:text-4xl">Sản phẩm tương tự</h2><div className="mt-8"><ProductGrid products={related} onAdd={addSuggestedProduct} /></div></section>}
    {frequentlyBought.length > 0 && <section className="mt-20"><h2 className="text-center text-3xl font-black uppercase tracking-[-0.035em] sm:text-4xl">Thường mua cùng nhau</h2><div className="mt-8"><ProductGrid products={frequentlyBought} onAdd={addSuggestedProduct} /></div></section>}
    {recentlyViewed.length > 0 && <section className="mt-20"><h2 className="text-center text-3xl font-black uppercase tracking-[-0.035em] sm:text-4xl">Đã xem gần đây</h2><div className="mt-8"><ProductGrid products={recentlyViewed} onAdd={addSuggestedProduct} /></div></section>}
    <div className="h-24 lg:hidden" aria-hidden="true" />
    <div className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-black/10 bg-white/95 p-3 shadow-2xl backdrop-blur lg:hidden"><div className="flex items-center gap-3"><div className="min-w-0 flex-1"><p className="truncate text-xs text-black/50">{product.name}</p><strong className="tabular-nums">{formatMoney(price)}</strong></div><button type="button" aria-label="Thêm sản phẩm vào yêu thích" onClick={() => void accountApi.addWishlist(product.id).then(() => notify.success("Đã thêm vào wishlist.")).catch(() => notify.error("Vui lòng đăng nhập để lưu sản phẩm."))} className="flex size-11 shrink-0 items-center justify-center rounded-full border border-black/10"><Heart size={18} aria-hidden="true" /></button><button type="button" disabled={!selectedVariant?.stockQuantity || adding} onClick={() => void addToCart()} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-black px-5 text-sm font-medium text-white disabled:bg-stone-300"><ShoppingBag size={17} aria-hidden="true" />Thêm vào giỏ</button></div></div>
  </>;
}
