const DashboardModel = {
    async getStats() {
        const response = await fetch('/api/admin/dashboard/stats', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!response.ok) throw new Error("Không thể lấy dữ liệu thống kê");
        return await response.json();
    }
};