import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Address, AddressPayload } from "@/types/address";

const schema = z.object({ recipientName: z.string().min(2, "Vui lòng nhập người nhận"), phone: z.string().min(8, "Số điện thoại không hợp lệ"), province: z.string().min(1, "Vui lòng nhập tỉnh/thành"), district: z.string().min(1, "Vui lòng nhập quận/huyện"), ward: z.string().min(1, "Vui lòng nhập phường/xã"), detail: z.string().min(3, "Vui lòng nhập địa chỉ chi tiết"), isDefault: z.boolean() });

export function AddressForm({ initialValue, onSubmit, onCancel }: { initialValue?: Address; onSubmit: (payload: AddressPayload) => Promise<void>; onCancel?: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AddressPayload>({ resolver: zodResolver(schema), defaultValues: initialValue ?? { recipientName: "", phone: "", province: "", district: "", ward: "", detail: "", isDefault: false } });
  const field = (name: keyof Omit<AddressPayload, "isDefault">, label: string) => <label><span className="mb-1.5 block text-sm font-medium">{label}</span><Input {...register(name)} /><span className="mt-1 block min-h-5 text-xs text-red-600">{errors[name]?.message}</span></label>;
  return <form onSubmit={handleSubmit(onSubmit)} className="grid gap-x-4 sm:grid-cols-2">{field("recipientName", "Người nhận")}{field("phone", "Số điện thoại")}{field("province", "Tỉnh/thành phố")}{field("district", "Quận/huyện")}{field("ward", "Phường/xã")}<div /> <div className="sm:col-span-2">{field("detail", "Địa chỉ chi tiết")}</div><label className="flex min-h-11 items-center gap-3 text-sm sm:col-span-2"><input {...register("isDefault")} type="checkbox" className="size-4 accent-black" /> Đặt làm địa chỉ mặc định</label><div className="mt-4 flex gap-3 sm:col-span-2"><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Đang lưu..." : "Lưu địa chỉ"}</Button>{onCancel && <Button variant="outline" onClick={onCancel}>Hủy</Button>}</div></form>;
}
