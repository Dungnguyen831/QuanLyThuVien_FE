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
        const authorName = book.authorName || `Author ID: ${book.author_id || 'Unknown'}`;
        dom.authorYear.innerText = `${authorName} • Edition ${book.publishedYear || 'N/A'}`;

        // 2. XỬ LÝ ẢNH (Quan trọng nhất)
        // Reset lại onerror trước khi gán src mới để tránh bị rác sự kiện cũ
        dom.img.onerror = null; 

        if (book.imageUrl) {
            const fileName = book.imageUrl.includes('/') ? book.imageUrl.split('/').pop() : book.imageUrl;
            dom.img.src = `../../../../assets/images/${fileName}`;
        } else {
            dom.img.src = "../../../../assets/images/default-book.png"; 
        }

        // Hàm xử lý khi link ảnh trên bị chết (Ví dụ file không tồn tại trong assets)
        dom.img.onerror = function() {
            this.onerror = null; // NGẮT VÒNG LẶP NGAY LẬP TỨC
            this.src = "https://img.freepik.com/free-vector/book-cover-template-design_23-2148498251.jpg";
            console.warn("Đã dùng ảnh dự phòng.");
        };

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
            dom.available.innerText = `● OUT OF STOCK`;
            dom.available.className = 'lbl text-danger bg-danger-subtle';
            const btnBorrow = document.getElementById('btn-borrow');
            if (btnBorrow) {
                btnBorrow.disabled = true;
                btnBorrow.innerText = "❌ Out of Stock";
                btnBorrow.style.opacity = "0.6";
            }
        }
    }
}