const DashboardController = {
    async init() {
        try {
            const stats = await DashboardModel.getStats();
            DashboardView.renderStats(stats);
        } catch (error) {
            DashboardView.showError(error.message);
        }
    }
};

// Khởi chạy khi trang Dashboard load xong
document.addEventListener('DOMContentLoaded', () => {
    DashboardController.init();
});