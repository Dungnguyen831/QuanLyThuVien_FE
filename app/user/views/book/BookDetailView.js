class BookDetailView {
    constructor() {
        this.dom = {
            title: document.getElementById('book-title'),
            titlePath: document.getElementById('title-path'),
            categoryPath: document.getElementById('category-path'),
            categoryLabel: document.getElementById('category-label'),
            authorYear: document.getElementById('book-author-year'),
            img: document.getElementById('book-img'),
            isbn: document.getElementById('book-isbn'),
            year: document.getElementById('book-year'),
            qty: document.getElementById('book-qty'),
            available: document.getElementById('availability-label'),
            desc: document.getElementById('book-desc')
        };
    }

    renderBookDetail(book) {
        if (!book) {
            console.error("Dữ liệu sách bị trống!");
            return;
        }

        const { dom } = this;

        // 1. Thông tin văn bản
        dom.title.innerText = book.title || 'Không rõ tiêu đề';
        dom.titlePath.innerText = book.title || '';
        const catName = book.categoryName || `Category ID: ${book.category_id || 'N/A'}`;
        dom.categoryPath.innerText = catName;
        dom.categoryLabel.innerText = catName;
        const authorName = book.authorName || `Tên Tác giả: ${book.author_name || 'Unknown'}`;
        dom.authorYear.innerText = `${authorName} •Năm tái bản  ${book.publishedYear || 'N/A'}`;

        // 2. XỬ LÝ ẢNH - Sử dụng ImageService
        const fallbackUrl = "https://img.freepik.com/free-vector/book-cover-template-design_23-2148498251.jpg";
        ImageService.displayWithFallback('book-img', book.imageUrl, fallbackUrl);

        // 3. Thông số kỹ thuật
        dom.isbn.innerText = book.isbn || 'N/A';
        dom.year.innerText = book.publishedYear || 'N/A';
        dom.qty.innerText = book.totalQty || 0;
        dom.desc.innerText = book.description || "Mô tả đang được cập nhật...";

        // 4. Trạng thái mượn sách (AvailableQty - viết hoa Q nhé)
        const stock = book.availableQty !== undefined ? book.availableQty : 0;

        if (stock > 0) {
            dom.available.innerText = `● AVAILABLE: ${stock} BOOKS`;
            dom.available.className = 'lbl available';
            const btnBorrow = document.getElementById('btn-borrow');
            if (btnBorrow) btnBorrow.disabled = false;
        } else {
            dom.available.innerText = `● Hết hàng`;
            dom.available.className = 'lbl text-danger bg-danger-subtle';
            const btnBorrow = document.getElementById('btn-borrow');
            if (btnBorrow) {
                btnBorrow.disabled = true;
                btnBorrow.innerText = "✵ Hết hàng";
                btnBorrow.style.opacity = "0.6";
            }
        }
    }
}