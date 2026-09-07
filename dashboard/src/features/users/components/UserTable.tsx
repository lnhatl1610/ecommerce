import type { User } from "../types/user.types";
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
}

export const UserTable = ({ users }: UserTableProps) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-mono text-xs text-gray-500">{user.id}</TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                            <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {user.isActive ? "Yes" : "No"}
                            </span>
                        </TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell className="text-gray-400">—</TableCell>
                    </TableRow>
                ))}
                {users.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                            No users found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default UserTable;
