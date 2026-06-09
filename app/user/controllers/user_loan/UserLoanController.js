class UserLoanController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    async init() {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');

        if (!token || !userString) {
            alert("Bạn cần đăng nhập để xem lịch sử mượn sách!");
            window.location.href = '/app/auth/views/login.html'; 
            return;
        }

        const currentUser = JSON.parse(userString);
        const userId = currentUser.id;

        this.view.showLoading();

        try {
            const loans = await this.model.fetchUserLoans(userId, token);
            
            this.view.renderLoans(loans);

            this.view.bindViewDetails();

        } catch (error) {
            this.view.showError(error.message);
        } finally {
            this.view.hideLoading();
        }
    }
}