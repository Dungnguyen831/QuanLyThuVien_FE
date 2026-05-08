class UserLoanController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    async init() {
        // 1. Kiểm tra xác thực (Auth)
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');

        if (!token || !userString) {
            alert("Bạn cần đăng nhập để xem lịch sử mượn sách!");
            window.location.href = '/app/auth/views/login.html'; 
            return;
        }

        const currentUser = JSON.parse(userString);
        const userId = currentUser.id;

        // 2. Điều phối lấy dữ liệu và hiển thị
        this.view.showLoading();

        try {
            // Bảo Model đi lấy dữ liệu
            const loans = await this.model.fetchUserLoans(userId, token);
            
            // Đưa dữ liệu cho View vẽ ra
            this.view.renderLoans(loans);

            this.view.bindViewDetails();

        } catch (error) {
            // Nếu Model lấy lỗi (token hết hạn, mất mạng...) thì báo View in ra lỗi
            this.view.showError(error.message);
        } finally {
            this.view.hideLoading();
        }
    }
}