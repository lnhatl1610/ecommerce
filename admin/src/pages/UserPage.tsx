import React, { useEffect, useState } from 'react'
import type { User } from '../interfaces/User';
import UserService from '../services/userService';
import { Table, type TableProps } from 'antd';

const UserPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    // const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        // setLoading(true);
        try {
            const res = await UserService.getUsers();
            console.log(res.data);
            setUsers(res.data);
        } catch (err: unknown) {
            console.log(err)
        } finally {
            // setLoading(false);
        }
    };

    // const handleDelete = async (id: number) => {
    //     try {
    //         await UserService.deleteUser(id);
    //         fetchUsers();
    //     } catch {
    //         console.log("loi");
    //     }
    // };

    const columns: TableProps<User>["columns"] = [
        {
            title: "Id",
            dataIndex: "_id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Active",
            dataIndex: "isActive",
            key: "isActive",
            render: (value: boolean) => value ? "Yes" : "No",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Action",
            key: "action",
        },
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <Table columns={columns} dataSource={users} rowKey="_id" />
        </div>
    )
}

export default UserPage