export const DashboardPage = () => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500">Welcome to your store overview</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 border rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold mt-1 text-gray-900">Active</p>
                </div>
                <div className="p-5 border rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">Total Products</p>
                    <p className="text-2xl font-bold mt-1 text-gray-900">Catalog</p>
                </div>
                <div className="p-5 border rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-500">System Status</p>
                    <p className="text-2xl font-bold mt-1 text-green-600">Online</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
