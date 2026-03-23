class BookDetailController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async init() {
        // 1. Gọi Model lấy danh sách từ API
        const bookdetails = await this.model.fetchBookDetails();
        
        // 2. Gọi View để in ra màn hình
        this.view.renderBookDetails(bookdetails);
    }
}