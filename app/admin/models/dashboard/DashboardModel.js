const DashboardModel = {
    async getStats() {
        const response = await fetch('/api/admin/dashboard/stats', {
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error("Không thể lấy dữ liệu thống kê");
        return await response.json();
    }
};