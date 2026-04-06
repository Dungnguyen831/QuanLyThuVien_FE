class BookDetailController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async init() {
        // 1. Lấy ID từ URL (Ví dụ: book_detail.html?id=7)
        const urlParams = new URLSearchParams(window.location.search);
        const bookId = urlParams.get('id') || 7; 

        // 2. Gọi Model lấy dữ liệu theo ID
        const book = await this.model.fetchBookDetail(bookId);
        
        // 3. Gọi View để in ra màn hình
        this.view.renderBookDetail(book);

        // 4. Gán sự kiện cho nút Borrow
        this.setupEventListeners(bookId);
    }

    setupEventListeners(bookId) {
        const btnBorrow = document.getElementById('btn-borrow');
        if (btnBorrow) {
            btnBorrow.onclick = () => {
                alert(`Gửi yêu cầu mượn sách ID: ${bookId}`);
            };
        }
    }
}