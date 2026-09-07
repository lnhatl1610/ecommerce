import { useEffect, useState } from "react";
import type { User } from "./types/user.types";
import { userService } from "./services/userService";
import { UserTable } from "./components/UserTable";

export const UserPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await userService.getUsers();
            setUsers(res.data.data);
        } catch (err: unknown) {
            console.error("Failed to fetch users:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Users</h1>
                    <p className="text-sm text-gray-500">Manage your system users</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12 text-sm text-gray-500">
                    Loading users...
                </div>
            ) : (
                <UserTable users={users} />
            )}
        </div>
    );
};

export default UserPage;
