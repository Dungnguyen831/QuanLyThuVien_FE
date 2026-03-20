class BookController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async init() {
        // 1. Chỉnh lại giao diện Sidebar
        this.view.setupUIState();

        // 2. Load dữ liệu bảng
        await this.loadBooks();
    }

    async loadBooks() {
        try {
            this.view.showLoading();
            const books = await this.model.fetchBooks();
            this.view.renderBooks(books);
        } catch (error) {
            this.view.showError("Lỗi kết nối đến máy chủ. Không thể tải dữ liệu!");
        }
    }
}