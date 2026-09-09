import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addressApi } from "@/features/addresses/api/addressApi";
import { AddressForm } from "@/features/addresses/components/AddressForm";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/feedback/EmptyState";
import type { Address, AddressPayload } from "@/types/address";

export function AddressPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Address | "new" | null>(null);
  const { data: addresses = [], isLoading } = useQuery({ queryKey: ["addresses"], queryFn: addressApi.list });
  const save = useMutation({ mutationFn: ({ id, payload }: { id?: string; payload: AddressPayload }) => id ? addressApi.update(id, payload) : addressApi.create(payload), onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["addresses"] }); setEditing(null); toast.success("Đã lưu địa chỉ."); } });
  const remove = useMutation({ mutationFn: addressApi.remove, onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["addresses"] }); toast.success("Đã xóa địa chỉ."); } });
  const setDefault = useMutation({ mutationFn: addressApi.setDefault, onSuccess: async () => { await queryClient.invalidateQueries({ queryKey: ["addresses"] }); toast.success("Đã đặt địa chỉ mặc định."); } });
  return <div><div className="flex items-center justify-between gap-4"><div><h1 className="text-3xl font-black sm:text-4xl">Địa chỉ giao hàng</h1><p className="mt-2 text-sm text-black/60">Quản lý địa chỉ dùng khi thanh toán.</p></div><Button onClick={() => setEditing("new")}><Plus size={17} className="mr-2" />Thêm địa chỉ</Button></div>{editing && <section className="mt-6 rounded-2xl border border-black/10 bg-white p-5"><h2 className="mb-5 text-xl font-bold">{editing === "new" ? "Địa chỉ mới" : "Sửa địa chỉ"}</h2><AddressForm initialValue={editing === "new" ? undefined : editing} onCancel={() => setEditing(null)} onSubmit={async (payload) => { await save.mutateAsync({ id: editing === "new" ? undefined : editing.id, payload }); }} /></section>}<div className="mt-6 grid gap-4 md:grid-cols-2">{isLoading ? <p>Đang tải...</p> : addresses.length === 0 ? <div className="md:col-span-2"><EmptyState title="Chưa có địa chỉ" /></div> : addresses.map((address) => <article key={address.id} className="rounded-2xl border border-black/10 bg-white p-5"><div className="flex items-start justify-between gap-4"><div className="flex gap-3"><MapPin className="mt-0.5 shrink-0" size={20} /><div><h2 className="font-bold">{address.recipientName} {address.isDefault && <span className="ml-2 rounded-full bg-black px-2 py-1 text-[10px] text-white">Mặc định</span>}</h2><p className="mt-1 text-sm text-black/60">{address.phone}</p><p className="mt-2 text-sm leading-5">{address.detail}, {address.ward}, {address.district}, {address.province}</p></div></div><div className="flex flex-wrap justify-end"><button onClick={() => setEditing(address)} aria-label="Sửa địa chỉ" className="min-h-11 min-w-11"><Pencil size={17} /></button>{!address.isDefault && <button onClick={() => setDefault.mutate(address.id)} className="min-h-11 px-2 text-xs font-medium">Đặt mặc định</button>}<button onClick={() => remove.mutate(address.id)} aria-label="Xóa địa chỉ" className="min-h-11 min-w-11 text-red-600"><Trash2 size={17} /></button></div></div></article>)}</div></div>;
}
