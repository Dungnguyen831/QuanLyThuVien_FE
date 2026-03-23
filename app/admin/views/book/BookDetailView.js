class BookDetailView {
    constructor() {
        // Khởi tạo các phần tử DOM cần đổ dữ liệu
        this.bookTitle = document.getElementById('book-title');
        this.bookImg = document.getElementById('book-img');
        this.categoryLabel = document.getElementById('category-label');
        this.categoryPath = document.getElementById('category-path');
        this.titlePath = document.getElementById('title-path');
        this.authorYear = document.getElementById('book-author-year');
        this.description = document.getElementById('book-desc');
        this.isbn = document.getElementById('book-isbn');
        this.year = document.getElementById('book-year');
        this.totalQty = document.getElementById('book-qty');
        this.availabilityLabel = document.getElementById('availability-label');
        this.btnBorrow = document.getElementById('btn-borrow');
    }

    renderBookDetail(book) {
        if (!book) return;

        // 1. Cập nhật Text nội dung
        if (this.bookTitle) this.bookTitle.innerText = book.title;
        if (this.titlePath) this.titlePath.innerText = book.title;
        if (this.categoryPath) this.categoryPath.innerText = book.categoryName;
        if (this.categoryLabel) this.categoryLabel.innerText = book.categoryName;
        
        if (this.authorYear) {
            this.authorYear.innerText = `${book.authorName} • Xuất bản năm ${book.publishedYear}`;
        }

        if (this.description) this.description.innerText = book.description;
        if (this.isbn) this.isbn.innerText = book.isbn;
        if (this.year) this.year.innerText = book.publishedYear;
        if (this.totalQty) this.totalQty.innerText = book.totalQty;

        // 2. Cập nhật Ảnh bìa
        if (this.bookImg) {
            this.bookImg.src = book.imageUrl || 'https://via.placeholder.com/300x450';
            this.bookImg.alt = book.title;
        }

        // 3. Xử lý logic Trạng thái (Available / Out of Stock)
        if (this.availabilityLabel) {
            if (book.availableQty > 0) {
                this.availabilityLabel.innerText = `● AVAILABLE: ${book.availableQty} BOOKS`;
                this.availabilityLabel.className = 'lbl available';
                if (this.btnBorrow) this.btnBorrow.disabled = false;
            } else {
                this.availabilityLabel.innerText = `● OUT OF STOCK`;
                this.availabilityLabel.className = 'lbl text-danger bg-danger-subtle'; // Giả định có class này
                if (this.btnBorrow) this.btnBorrow.disabled = true;
            }
        }
    }

    showLoading() {
        if (this.bookTitle) this.bookTitle.innerText = "Đang tải thông tin...";
    }

    showError(message) {
        if (this.bookTitle) this.bookTitle.innerText = "Lỗi: " + message;
    }
}