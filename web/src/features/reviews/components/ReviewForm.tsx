import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { reviewApi } from "@/features/reviews/api/reviewApi";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/apiError";

const schema = z.object({ rating: z.number().int().min(1).max(5), comment: z.string().min(10, "Đánh giá cần ít nhất 10 ký tự").max(2000) });
type Values = z.infer<typeof schema>;

export function ReviewForm({ productId, onSubmitted, onCancel }: { productId: string; onSubmitted: () => void; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { rating: 5, comment: "" } });
  return <form className="mt-5 rounded-2xl bg-black/5 p-5" onSubmit={handleSubmit(async (values) => { try { await reviewApi.create({ productId, ...values }); onSubmitted(); } catch (error: unknown) { toast.error(getApiErrorMessage(error, "Chỉ khách đã hoàn tất đơn hàng mới có thể đánh giá.")); } })}><div className="grid gap-4 sm:grid-cols-[160px_1fr]"><label><span className="mb-1.5 block text-sm font-medium">Số sao</span><select {...register("rating", { valueAsNumber: true })} className="min-h-11 w-full rounded-xl border border-black/15 bg-white px-3"><option value="5">5 sao</option><option value="4">4 sao</option><option value="3">3 sao</option><option value="2">2 sao</option><option value="1">1 sao</option></select></label><label><span className="mb-1.5 block text-sm font-medium">Nhận xét</span><textarea {...register("comment")} rows={4} className="w-full rounded-xl border border-black/15 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-black/10" /><span className="mt-1 block text-xs text-red-600">{errors.comment?.message}</span></label></div><div className="mt-4 flex gap-3"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}</Button><Button variant="outline" onClick={onCancel}>Hủy</Button></div></form>;
}
