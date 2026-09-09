import type { User } from "../types/user.types";
import { RowActionsMenu } from "@/components/RowActionsMenu";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => {
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [columnsOpen, setColumnsOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({ id: true, name: true, email: true, phone: true, logoUrl: true, gender: false, dateOfBirth: false, status: true, role: true, provider: false, emailVerified: false, lastLogin: false, createdAt: true, actions: true });
    const toggleColumn = (key: string) => setVisibleColumns((current) => ({ ...current, [key]: !current[key] }));
    const columnOptions = [{ key: "id", label: "ID" }, { key: "name", label: "Tên" }, { key: "email", label: "Email" }, { key: "phone", label: "Số điện thoại" }, { key: "logoUrl", label: "Ảnh đại diện" }, { key: "gender", label: "Giới tính" }, { key: "dateOfBirth", label: "Ngày sinh" }, { key: "status", label: "Trạng thái" }, { key: "role", label: "Vai trò" }, { key: "provider", label: "Provider" }, { key: "emailVerified", label: "Email xác minh" }, { key: "lastLogin", label: "Lần đăng nhập cuối" }, { key: "createdAt", label: "Ngày tạo" }, { key: "actions", label: "Tùy chọn" }];
    const columnCount = 1 + Object.values(visibleColumns).filter(Boolean).length;
    const toggleUser = (userId: string) => setSelectedUserIds((current) => current.includes(userId) ? current.filter((id) => id !== userId) : [...current, userId]);
    const toggleAllUsers = () => setSelectedUserIds((current) => current.length === users.length ? [] : users.map((user) => user.id));
    return (
        <div className="relative">
        <div className="flex justify-end border-b bg-gray-50 p-2"><div className="relative"><button type="button" onClick={() => setColumnsOpen((open) => !open)} aria-expanded={columnsOpen} aria-haspopup="menu" className="inline-flex min-h-10 items-center gap-2 rounded-md border bg-white px-3 text-sm hover:bg-gray-100"><SlidersHorizontal size={16} />Cột hiển thị</button>{columnsOpen && <div role="menu" className="absolute right-0 top-12 z-20 w-56 rounded-lg border bg-white p-2 shadow-lg">{columnOptions.map((column) => <label key={column.key} className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm hover:bg-gray-50"><input type="checkbox" checked={Boolean(visibleColumns[column.key])} onChange={() => toggleColumn(column.key)} />{column.label}</label>)}</div>}</div></div>
        <Table className="min-w-[900px]">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-12"><Checkbox aria-label="Chọn tất cả người dùng" checked={users.length > 0 && selectedUserIds.length === users.length} indeterminate={selectedUserIds.length > 0 && selectedUserIds.length < users.length} onChange={toggleAllUsers} /></TableHead>
                    {visibleColumns.logoUrl && <TableHead>Ảnh đại diện</TableHead>}
                    {visibleColumns.id && <TableHead>Id</TableHead>}
                    {visibleColumns.name && <TableHead>Name</TableHead>}
                    {visibleColumns.email && <TableHead>Email</TableHead>}
                    {visibleColumns.phone && <TableHead>Số điện thoại</TableHead>}
                    {visibleColumns.gender && <TableHead>Giới tính</TableHead>}
                    {visibleColumns.dateOfBirth && <TableHead>Ngày sinh</TableHead>}
                    {visibleColumns.status && <TableHead>Trạng thái</TableHead>}
                    {visibleColumns.role && <TableHead>Vai trò</TableHead>}
                    {visibleColumns.provider && <TableHead>Provider</TableHead>}
                    {visibleColumns.emailVerified && <TableHead>Email xác minh</TableHead>}
                    {visibleColumns.lastLogin && <TableHead>Lần đăng nhập cuối</TableHead>}
                    {visibleColumns.createdAt && <TableHead>Ngày tạo</TableHead>}
                    <TableHead className="text-right">Tùy chọn</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id} data-state={selectedUserIds.includes(user.id) ? "selected" : undefined}>
                        <TableCell><Checkbox aria-label={`Chọn ${user.name}`} checked={selectedUserIds.includes(user.id)} onChange={() => toggleUser(user.id)} /></TableCell>
                        {visibleColumns.logoUrl && <TableCell>{user.logoUrl ? <button type="button" onClick={() => setPreviewImage({ url: user.logoUrl ?? "", name: user.name })} className="block rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900" aria-label={`Xem ảnh đại diện của ${user.name}`}><img src={user.logoUrl} alt={`Ảnh đại diện của ${user.name}`} className="size-10 rounded-full border border-gray-200 object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /></button> : <span className="text-gray-400">—</span>}</TableCell>}
                        {visibleColumns.id && <TableCell className="font-mono text-xs text-gray-500">{user.id}</TableCell>}
                        {visibleColumns.name && <TableCell className="font-medium">{user.name}</TableCell>}
                        {visibleColumns.email && <TableCell>{user.email}</TableCell>}
                        {visibleColumns.phone && <TableCell>{user.phone || "—"}</TableCell>}
                        {visibleColumns.gender && <TableCell>{user.gender === "MALE" ? "Nam" : user.gender === "FEMALE" ? "Nữ" : user.gender === "OTHER" ? "Khác" : "—"}</TableCell>}
                        {visibleColumns.dateOfBirth && <TableCell>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN") : "—"}</TableCell>}
                        {visibleColumns.status && <TableCell>
                            <span className={`font-medium ${user.status === "ACTIVE" && user.isActive ? "text-emerald-600" : user.status === "BANNED" ? "text-red-600" : "text-amber-600"}`}>{user.status === "BANNED" ? "Banned" : user.status === "INACTIVE" || !user.isActive ? "Inactive" : "Active"}</span>
                        </TableCell>}
                        {visibleColumns.role && <TableCell>{user.role === "ADMIN" ? "Quản trị viên" : user.role === "STAFF" ? "Nhân viên" : "Khách hàng"}</TableCell>}
                        {visibleColumns.provider && <TableCell>{user.provider ?? "LOCAL"}</TableCell>}
                        {visibleColumns.emailVerified && <TableCell>{user.emailVerifiedAt ? <span className="text-emerald-600">Đã xác minh</span> : <span className="text-amber-600">Chưa xác minh</span>}</TableCell>}
                        {visibleColumns.lastLogin && <TableCell>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("vi-VN") : "Chưa đăng nhập"}</TableCell>}
                        {visibleColumns.createdAt && <TableCell>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</TableCell>}
                        {visibleColumns.actions && <TableCell className="text-right"><RowActionsMenu label={user.name} actions={[{ label: "Sửa", onSelect: () => onEdit(user) }, { label: "Xóa", tone: "danger", onSelect: () => onDelete(user) }]} /></TableCell>}
                    </TableRow>
                ))}
                {users.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={columnCount} className="text-center text-gray-400 py-8">
                            No users found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>{previewImage && <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="Xem ảnh đại diện"><div className="relative max-h-[90vh] max-w-[90vw] rounded-2xl bg-white p-3 shadow-2xl"><img src={previewImage.url} alt={`Ảnh đại diện của ${previewImage.name}`} className="max-h-[80vh] max-w-[80vw] rounded-xl object-contain" /><button type="button" onClick={() => setPreviewImage(null)} className="absolute -right-3 -top-3 flex size-10 items-center justify-center rounded-full bg-white text-xl shadow" aria-label="Đóng ảnh xem trước">×</button></div></div>}</div>
    );
};

export default UserTable;


