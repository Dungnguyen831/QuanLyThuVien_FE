class BookDetailController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async init() {
    try {
        // 1. Lấy chuỗi query từ URL (ví dụ: "?id=10")
        const queryString = window.location.search;
        
        // 2. Dùng URLSearchParams để tách lấy giá trị của 'id'
        const urlParams = new URLSearchParams(queryString);
        const bookId = urlParams.get('id'); 

        // 3. Kiểm tra xem có ID không
        if (!bookId) {
            console.error("Không tìm thấy ID nào trên thanh địa chỉ!");
            document.getElementById('book-title').innerText = "Vui lòng chọn sách từ danh sách!";
            return;
        }

        console.log("Đang nhận biết ID sách từ URL là:", bookId);

        // 4. Chạy API lấy dữ liệu theo ID vừa lấy được
        const book = await this.model.fetchBookDetail(bookId);
        
        if (book) {
            // Đổ dữ liệu vào View
            this.view.renderBookDetail(book);
            this.setupEventListeners(bookId);
        } else {
            document.getElementById('book-title').innerText = "Sách không tồn tại!";
        }
    } catch (e) {
        console.error("Lỗi khi load chi tiết sách:", e);
    }
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