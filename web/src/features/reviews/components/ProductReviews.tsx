import { CheckCircle2, ChevronDown, SlidersHorizontal, Star, ThumbsUp } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import type { ReviewRecord } from "@/features/reviews/api/reviewApi";
import { reviewApi } from "@/features/reviews/api/reviewApi";

interface ProductReviewsProps {
  productId: string;
  reviews: ReviewRecord[];
  rating: number;
  reviewCount: number;
  authenticated: boolean;
  onSubmitted: () => void;
}

function Stars({ value, size = 17 }: { value: number; size?: number }) {
  return <span className="flex items-center gap-0.5 text-amber-400" aria-label={`${value} trên 5 sao`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={size} aria-hidden="true" className={star <= Math.round(value) ? "fill-current" : "text-black/15"} />)}</span>;
}

function RatingSummary({ reviews, rating, reviewCount }: Pick<ProductReviewsProps, "reviews" | "rating" | "reviewCount">) {
  const counts = [5, 4, 3, 2, 1].map((star) => ({ star, count: reviews.filter((review) => review.rating === star).length }));
  const denominator = reviews.length || reviewCount || 1;
  return <div className="grid gap-6 rounded-2xl border border-black/10 p-5 sm:grid-cols-[180px_1fr] sm:p-6"><div className="flex flex-col justify-center"><p className="text-4xl font-black">{rating.toFixed(1)}<span className="text-lg font-normal text-black/40">/5</span></p><Stars value={rating} size={19} /><p className="mt-2 text-sm text-black/50">{reviewCount} đánh giá</p></div><div className="space-y-2">{counts.map(({ star, count }) => { const percent = Math.round((count / denominator) * 100); return <div key={star} className="grid grid-cols-[34px_1fr_42px] items-center gap-3 text-xs"><span>{star} sao</span><span className="h-2 overflow-hidden rounded-full bg-black/10"><span className="block h-full rounded-full bg-amber-400" style={{ width: `${percent}%` }} /></span><span className="text-right text-black/50">{percent}%</span></div>; })}</div></div>;
}

function ReviewCard({ review, authenticated }: { review: ReviewRecord; authenticated: boolean }) {
  const [helpful, setHelpful] = useState(false);
  return <article className="rounded-2xl border border-black/10 p-5"><div className="flex items-start justify-between gap-3"><Stars value={review.rating} /><time className="text-xs text-black/45" dateTime={review.createdAt}>{new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(new Date(review.createdAt))}</time></div><div className="mt-3 flex items-center gap-2">{review.user.avatar ? <img src={review.user.avatar} alt="" className="size-8 rounded-full object-cover" /> : <span className="grid size-8 place-items-center rounded-full bg-black text-xs font-bold text-white">{review.user.name.charAt(0).toUpperCase()}</span>}<h3 className="font-semibold">{review.user.name}</h3>{review.verifiedPurchase !== false && <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><CheckCircle2 size={14} aria-hidden="true" />Đã mua hàng</span>}</div><p className="mt-3 text-sm leading-6 text-black/65">{review.comment || "Khách hàng đã đánh giá sản phẩm này."}</p>{review.images?.length ? <div className="mt-4 flex gap-2 overflow-x-auto">{review.images.map((image) => <img key={image} src={image} alt="Ảnh đánh giá của khách hàng" loading="lazy" className="size-20 rounded-xl object-cover" />)}</div> : null}<button type="button" onClick={() => { if (!authenticated) { toast.error("Vui lòng đăng nhập để đánh dấu hữu ích."); return; } void reviewApi.toggleHelpful(review.id).then((result) => setHelpful(result.helpful)).catch(() => toast.error("Không thể cập nhật đánh giá.")); }} className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs transition ${helpful ? "bg-black text-white" : "bg-black/5 hover:bg-black/10"}`} aria-pressed={helpful}><ThumbsUp size={15} aria-hidden="true" />Hữu ích ({(review.helpfulCount ?? 0) + (helpful ? 1 : 0)})</button></article>;
}

export function ProductReviews({ productId, reviews, rating, reviewCount, authenticated, onSubmitted }: ProductReviewsProps) {
  const [starFilter, setStarFilter] = useState(0);
  const [hasImagesOnly, setHasImagesOnly] = useState(false);
  const [sort, setSort] = useState<"latest" | "highest" | "lowest">("latest");
  const [formOpen, setFormOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const filtered = useMemo(() => reviews.filter((review) => (!starFilter || review.rating === starFilter) && (!hasImagesOnly || Boolean(review.images?.length))).sort((a, b) => sort === "highest" ? b.rating - a.rating : sort === "lowest" ? a.rating - b.rating : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [hasImagesOnly, reviews, sort, starFilter]);

  return <div className="pt-6"><RatingSummary reviews={reviews} rating={rating} reviewCount={reviewCount} /><div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-xl font-bold sm:text-2xl">Tất cả đánh giá <span className="text-sm font-normal text-black/45">({reviewCount})</span></h2><div className="flex flex-wrap gap-2"><label className="relative"><span className="sr-only">Lọc theo số sao</span><SlidersHorizontal className="pointer-events-none absolute left-4 top-3.5" size={16} /><select value={starFilter} onChange={(event) => setStarFilter(Number(event.target.value))} className="min-h-11 appearance-none rounded-full bg-[#f0f0f0] pl-10 pr-9 text-sm outline-none focus:ring-2 focus:ring-black"><option value="0">Tất cả sao</option>{[5, 4, 3, 2, 1].map((star) => <option key={star} value={star}>{star} sao</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3.5" size={16} /></label><button type="button" onClick={() => setHasImagesOnly((value) => !value)} className={`min-h-11 rounded-full px-4 text-sm ${hasImagesOnly ? "bg-black text-white" : "bg-[#f0f0f0]"}`} aria-pressed={hasImagesOnly}>Có hình ảnh</button><label className="relative"><span className="sr-only">Sắp xếp đánh giá</span><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="min-h-11 appearance-none rounded-full bg-[#f0f0f0] px-4 pr-9 text-sm outline-none focus:ring-2 focus:ring-black"><option value="latest">Mới nhất</option><option value="highest">Điểm cao</option><option value="lowest">Điểm thấp</option></select><ChevronDown className="pointer-events-none absolute right-3 top-3.5" size={16} /></label><button type="button" onClick={() => authenticated ? setFormOpen((value) => !value) : toast.error("Vui lòng đăng nhập để viết đánh giá.")} className="min-h-11 rounded-full bg-black px-5 text-sm font-medium text-white">Viết đánh giá</button></div></div>{formOpen && <><p className="mt-5 text-xs text-black/50">Chỉ khách hàng đã mua và hoàn tất đơn hàng mới có thể gửi đánh giá.</p><ReviewForm productId={productId} onCancel={() => setFormOpen(false)} onSubmitted={() => { setFormOpen(false); onSubmitted(); }} /></>}{filtered.length ? <div className="mt-5 grid gap-4 md:grid-cols-2">{filtered.slice(0, visibleCount).map((review) => <ReviewCard key={review.id} review={review} authenticated={authenticated} />)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-black/15 py-12 text-center text-sm text-black/50">Chưa có đánh giá phù hợp với bộ lọc.</div>}{visibleCount < filtered.length && <button type="button" onClick={() => setVisibleCount((value) => value + 4)} className="mx-auto mt-8 block min-h-11 rounded-full border border-black/15 px-6 text-sm transition hover:bg-black/5">Xem thêm đánh giá</button>}</div>;
}
